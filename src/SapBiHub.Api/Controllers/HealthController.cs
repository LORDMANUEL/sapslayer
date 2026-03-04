using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;
using System.Diagnostics;

namespace SapBiHub.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetStatus()
        {
            var status = new
            {
                OS = RuntimeInformation.OSDescription,
                Architecture = RuntimeInformation.OSArchitecture.ToString(),
                Framework = RuntimeInformation.FrameworkDescription,
                Uptime = GetUptime(),
                Services = new[]
                {
                    new { Name = "SapBiHub.Api", Status = "Running" },
                    new { Name = "SapBiHub.Worker", Status = "Running" } // Simplified
                }
            };
            return Ok(status);
        }

        private string GetUptime()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                try {
                    var uptime = System.IO.File.ReadAllText("/proc/uptime").Split(' ')[0];
                    return $"{uptime} seconds";
                } catch { return "Unknown"; }
            }
            return "N/A";
        }
    }
}
