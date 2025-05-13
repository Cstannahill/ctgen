using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Extensions {
    public static class HealthChecksServiceExtensions {
        /*
         * =============================
         * Health Checks Extension
         * =============================
         *
         * What are Health Checks?
         * ----------------------
         * Health checks allow you to expose endpoints (e.g., /health) that external systems can use to monitor the health and readiness of your API.
         *
         * How to use this extension:
         * --------------------------
         * 1. In Program.cs, call services.AddCustomHealthChecks() to register health check services.
         * 2. In Program.cs, call app.UseCustomHealthChecks() to expose the /health endpoint.
         *
         * How to customize:
         * -----------------
         * - Add checks for databases, external services, etc. using services.AddHealthChecks().AddSqlServer(...), etc.
         * - Change the endpoint path in UseCustomHealthChecks.
         *
         * Debugging Health Check Issues:
         * -----------------------------
         * - If /health returns unhealthy, check the status of your dependencies.
         * - Use the UI package (AspNetCore.HealthChecks.UI) for a dashboard.
         *
         * More info:
         *   - Docs: https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks
         *   - UI: https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks
         */
        // Registers health check services
        public static IServiceCollection AddCustomHealthChecks(this IServiceCollection services) {
            services.AddHealthChecks();
            // Add more checks here, e.g.:
            // .AddSqlServer(connectionString)
            return services;
        }
        // Adds health check endpoints
        public static IApplicationBuilder UseCustomHealthChecks(this IApplicationBuilder app) {
            app.UseHealthChecks("/health");
            // Change the path above as needed
            return app;
        }
    }
}