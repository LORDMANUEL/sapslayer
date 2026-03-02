using SapBiHub.AI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SapBiHub.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly QueryBuilderAgent _aiAgent;

        public AiController(QueryBuilderAgent aiAgent)
        {
            _aiAgent = aiAgent;
        }

        [HttpPost("propose")]
        public async Task<IActionResult> ProposeQuery([FromBody] AiRequest request)
        {
            var proposal = await _aiAgent.ProposeQueryAsync(request.Prompt);
            return Ok(new { proposal });
        }
    }

    public class AiRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}
