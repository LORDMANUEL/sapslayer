namespace SapBiHub.AI
{
    public interface ILLMProvider
    {
        Task<string> GenerateCompletionAsync(string prompt);
    }

    public class LocalLLMProvider : ILLMProvider
    {
        public async Task<string> GenerateCompletionAsync(string prompt)
        {
            // Simple logic for AI Query Builder
            if (prompt.Contains("invoices", StringComparison.OrdinalIgnoreCase))
            {
                return @"{
                    ""endpoint"": ""/Invoices"",
                    ""odata"": {
                        ""select"": ""DocEntry,CardCode,DocTotal,DocDate"",
                        ""filter"": ""DocTotal gt 1000"",
                        ""top"": 50
                    }
                }";
            }
            return await Task.FromResult("AI Response Placeholder");
        }
    }

    public interface IRagService
    {
        Task<IEnumerable<string>> SearchAsync(string query);
    }

    public class QueryBuilderAgent
    {
        private readonly ILLMProvider _llm;
        public QueryBuilderAgent(ILLMProvider llm) => _llm = llm;

        public async Task<string> ProposeQueryAsync(string userRequest)
        {
            string prompt = $"Translate this request into an OData query for SAP B1: {userRequest}";
            return await _llm.GenerateCompletionAsync(prompt);
        }
    }
}
