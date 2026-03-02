using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace SapBiHub.SapClient
{
    public class SapServiceLayerClient
    {
        private readonly HttpClient _httpClient;
        private string? _sessionId;
        private string? _routeId;

        public SapServiceLayerClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> LoginAsync(string baseUrl, string companyDb, string username, string password)
        {
            var loginUrl = $"{baseUrl.TrimEnd('/')}/Login";
            var payload = new
            {
                CompanyDB = companyDb,
                UserName = username,
                Password = password
            };

            var response = await _httpClient.PostAsJsonAsync(loginUrl, payload);
            if (response.IsSuccessStatusCode)
            {
                var cookies = response.Headers.GetValues("Set-Cookie");
                foreach (var cookie in cookies)
                {
                    if (cookie.Contains("B1SESSION"))
                        _sessionId = cookie.Split(';')[0];
                    if (cookie.Contains("ROUTEID"))
                        _routeId = cookie.Split(';')[0];
                }
                return true;
            }
            return false;
        }

        public async Task<string> GetAsync(string baseUrl, string relativeUrl)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{baseUrl.TrimEnd('/')}/{relativeUrl.TrimStart('/')}");
            if (!string.IsNullOrEmpty(_sessionId))
            {
                request.Headers.Add("Cookie", $"{_sessionId}; {_routeId}");
            }

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetMetadataAsync(string baseUrl)
        {
            return await GetAsync(baseUrl, "$metadata");
        }
    }
}
