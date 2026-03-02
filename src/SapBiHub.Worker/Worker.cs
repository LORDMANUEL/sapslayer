using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using SapBiHub.Core.Entities;
using SapBiHub.SapClient;
using SapBiHub.Storage;
using System.Text;

namespace SapBiHub.Worker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;

        public Worker(ILogger<Worker> logger, IServiceProvider serviceProvider, IConfiguration configuration)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _configuration = configuration;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

                using (var scope = _serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var sapClient = scope.ServiceProvider.GetRequiredService<SapServiceLayerClient>();

                    var datasetsDue = await context.Datasets
                        .Include(d => d.Query)
                        .Where(d => d.LastRunAt == null || d.LastRunAt.Value.AddMinutes(d.RefreshMinutes) < DateTime.UtcNow)
                        .ToListAsync(stoppingToken);

                    foreach (var dataset in datasetsDue)
                    {
                        await ProcessDataset(dataset, context, sapClient, stoppingToken);
                    }
                }

                await Task.Delay(60000, stoppingToken);
            }
        }

        private async Task ProcessDataset(Dataset dataset, ApplicationDbContext context, SapServiceLayerClient sapClient, CancellationToken stoppingToken)
        {
            var run = new QueryRun
            {
                DatasetId = dataset.Id,
                StartedAt = DateTime.UtcNow,
                Status = "RUNNING"
            };

            context.QueryRuns.Add(run);
            await context.SaveChangesAsync(stoppingToken);

            try
            {
                var sapConfig = _configuration.GetSection("SapSettings");
                bool loggedIn = await sapClient.LoginAsync(
                    sapConfig["BaseUrl"]!,
                    sapConfig["CompanyDb"]!,
                    sapConfig["Username"]!,
                    sapConfig["Password"]!);

                if (!loggedIn) throw new Exception("Failed to login to SAP Service Layer");

                string endpoint = dataset.Query!.Endpoint;

                if (dataset.Mode == "INCREMENTAL" && !string.IsNullOrEmpty(dataset.IncrementalKey) && !string.IsNullOrEmpty(dataset.WatermarkValue))
                {
                    string filter = $"{dataset.IncrementalKey} gt {dataset.WatermarkValue}";
                    endpoint += endpoint.Contains("?") ? $"&%24filter={filter}" : $"?%24filter={filter}";
                }

                var jsonResponse = await sapClient.GetAsync(sapConfig["BaseUrl"]!, endpoint);
                var doc = JsonDocument.Parse(jsonResponse);
                var valueArray = doc.RootElement.GetProperty("value");

                await MaterializeToPostgres(dataset.TargetTable, valueArray, dataset.Mode == "FULL");

                if (dataset.Mode == "INCREMENTAL" && valueArray.GetArrayLength() > 0)
                {
                    var lastElement = valueArray[valueArray.GetArrayLength() - 1];
                    if (lastElement.TryGetProperty(dataset.IncrementalKey!, out var prop))
                    {
                        dataset.WatermarkValue = prop.ToString();
                    }
                }

                run.Status = "OK";
                run.RowsWritten = valueArray.GetArrayLength();
                dataset.LastRunStatus = "OK";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing dataset {id}", dataset.Id);
                run.Status = "FAIL";
                run.ErrorMessage = ex.Message;
                dataset.LastRunStatus = "FAIL";
            }
            finally
            {
                run.FinishedAt = DateTime.UtcNow;
                run.DurationMs = (long)(run.FinishedAt - run.StartedAt).TotalMilliseconds;
                dataset.LastRunAt = DateTime.UtcNow;
                await context.SaveChangesAsync(stoppingToken);
            }
        }

        private async Task MaterializeToPostgres(string tableName, JsonElement data, bool fullRefresh)
        {
            if (data.ValueKind != JsonValueKind.Array || data.GetArrayLength() == 0) return;

            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();

            var firstRow = data[0];
            var columns = new List<string>();
            foreach (var prop in firstRow.EnumerateObject())
            {
                string type = "TEXT";
                if (prop.Value.ValueKind == JsonValueKind.Number)
                    type = "NUMERIC";
                else if (prop.Value.ValueKind == JsonValueKind.True || prop.Value.ValueKind == JsonValueKind.False)
                    type = "BOOLEAN";

                columns.Add($"\"{prop.Name}\" {type}");
            }

            if (fullRefresh)
            {
                using (var cmd = new NpgsqlCommand($"DROP TABLE IF EXISTS \"{tableName}\"; CREATE TABLE \"{tableName}\" ({string.Join(", ", columns)});", conn))
                {
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            else
            {
                using (var cmd = new NpgsqlCommand($"CREATE TABLE IF NOT EXISTS \"{tableName}\" ({string.Join(", ", columns)});", conn))
                {
                    await cmd.ExecuteNonQueryAsync();
                }
            }

            foreach (var row in data.EnumerateArray())
            {
                var colNames = new List<string>();
                var colValues = new List<object?>();
                var placeholders = new List<string>();
                int i = 0;
                foreach (var prop in row.EnumerateObject())
                {
                    colNames.Add($"\"{prop.Name}\"");
                    colValues.Add(prop.Value.ValueKind switch {
                        JsonValueKind.Null => null,
                        JsonValueKind.String => prop.Value.GetString(),
                        JsonValueKind.Number => prop.Value.GetDecimal(),
                        JsonValueKind.True => true,
                        JsonValueKind.False => false,
                        _ => prop.Value.ToString()
                    });
                    placeholders.Add($"@{i++}");
                }

                using (var cmd = new NpgsqlCommand($"INSERT INTO \"{tableName}\" ({string.Join(", ", colNames)}) VALUES ({string.Join(", ", placeholders)})", conn))
                {
                    for (int j = 0; j < colValues.Count; j++)
                    {
                        cmd.Parameters.AddWithValue(j.ToString(), colValues[j] ?? DBNull.Value);
                    }
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }
    }
}
