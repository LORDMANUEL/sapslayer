using SapBiHub.SapClient;
using System.Net;
using System.Net.Http.Json;
using Moq;
using Moq.Protected;

namespace SapBiHub.Tests
{
    public class SapClientTests
    {
        [Fact]
        public async Task LoginAsync_ReturnsTrue_OnSuccess()
        {
            // Arrange
            var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            handlerMock
               .Protected()
               .Setup<Task<HttpResponseMessage>>(
                  "SendAsync",
                  ItExpr.IsAny<HttpRequestMessage>(),
                  ItExpr.IsAny<CancellationToken>()
               )
               .ReturnsAsync(new HttpResponseMessage()
               {
                   StatusCode = HttpStatusCode.OK,
                   Content = JsonContent.Create(new { SessionId = "test-session" }),
               })
               .Verifiable();

            var httpClient = new HttpClient(handlerMock.Object);
            var client = new SapServiceLayerClient(httpClient);

            // Act
            var result = await client.LoginAsync("http://localhost", "DB", "user", "pass");

            // Assert
            Assert.True(result);
        }
    }
}
