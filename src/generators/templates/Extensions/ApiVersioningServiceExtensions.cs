using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Extensions {
    public static class ApiVersioningServiceExtensions {
        /*
         * =============================
         * API Versioning Extension
         * =============================
         *
         * What is API Versioning?
         * ----------------------
         * API versioning allows you to manage breaking changes in your API by exposing multiple versions (e.g., v1, v2) to clients.
         *
         * How to use this extension:
         * --------------------------
         * 1. In Program.cs, call services.AddCustomApiVersioning() to enable versioning.
         * 2. Use [ApiVersion("1.0")] and [Route("api/v{version:apiVersion}/[controller]")] on controllers.
         *
         * How to customize:
         * -----------------
         * - Change the default version in DefaultApiVersion.
         * - Set AssumeDefaultVersionWhenUnspecified to false to require explicit versioning.
         * - Use conventions or attributes for versioning style.
         *
         * Debugging Versioning Issues:
         * ---------------------------
         * - If requests fail, check your route templates and version attributes.
         * - Use /api/v1/yourcontroller to test versioned endpoints.
         *
         * More info:
         *   - Docs: https://learn.microsoft.com/en-us/aspnet/core/web-api/advanced/versions
         *   - NuGet: https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.Versioning
         */
        // Registers API versioning
        public static IServiceCollection AddCustomApiVersioning(this IServiceCollection services) {
            services.AddApiVersioning(options => {
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.DefaultApiVersion = new Microsoft.AspNetCore.Mvc.ApiVersion(1, 0);
                options.ReportApiVersions = true;
            });
            return services;
        }
    }
}