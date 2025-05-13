using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Extensions {
    public static class CorsServiceExtensions {
        /*
         * =====================================================================
         * CORS (Cross-Origin Resource Sharing) Extension for ASP.NET Core
         * =====================================================================
         *
         * What is CORS?
         * -------------
         * CORS is a security feature implemented by browsers to restrict web pages from making requests to a different domain than the one that served the web page.
         * In APIs, CORS must be configured to allow or restrict which origins (domains), HTTP methods, and headers are permitted to access your endpoints.
         *
         * Why do you need CORS?
         * ---------------------
         * - To allow your frontend (e.g., React, Angular, Vue, etc.) hosted on a different domain/port to call your API.
         * - To restrict access to your API to only trusted domains.
         * - To enable or restrict credentials (cookies, authorization headers) in cross-origin requests.
         *
         * How to use this extension:
         * --------------------------
         * 1. In Program.cs, call services.AddCustomCors() to register CORS policies.
         * 2. In Program.cs, call app.UseCustomCors() to enable CORS middleware.
         *
         * =============================
         * CORS Policy Options & Examples
         * =============================
         *
         * 1. Allow All Origins (Development Only!)
         * ----------------------------------------
         * services.AddCors(options => {
         *     options.AddPolicy("AllowAll", builder => {
         *         builder.AllowAnyOrigin()
         *                .AllowAnyMethod()
         *                .AllowAnyHeader();
         *     });
         * });
         * // Use: app.UseCors("AllowAll");
         *
         * 2. Allow Specific Origins
         * ------------------------
         * services.AddCors(options => {
         *     options.AddPolicy("AllowFrontend", builder => {
         *         builder.WithOrigins("https://myfrontend.com", "http://localhost:3000")
         *                .AllowAnyMethod()
         *                .AllowAnyHeader();
         *     });
         * });
         * // Use: app.UseCors("AllowFrontend");
         *
         * 3. Allow Credentials (Cookies, Auth Headers)
         * -------------------------------------------
         * services.AddCors(options => {
         *     options.AddPolicy("AllowWithCredentials", builder => {
         *         builder.WithOrigins("https://myfrontend.com")
         *                .AllowAnyMethod()
         *                .AllowAnyHeader()
         *                .AllowCredentials();
         *     });
         * });
         * // Note: AllowCredentials() cannot be used with AllowAnyOrigin().
         * // Use: app.UseCors("AllowWithCredentials");
         *
         * 4. Restrict HTTP Methods
         * ------------------------
         * services.AddCors(options => {
         *     options.AddPolicy("AllowGetPost", builder => {
         *         builder.WithOrigins("https://myfrontend.com")
         *                .WithMethods("GET", "POST")
         *                .AllowAnyHeader();
         *     });
         * });
         *
         * 5. Restrict Headers
         * -------------------
         * services.AddCors(options => {
         *     options.AddPolicy("AllowCustomHeaders", builder => {
         *         builder.WithOrigins("https://myfrontend.com")
         *                .AllowAnyMethod()
         *                .WithHeaders("content-type", "authorization");
         *     });
         * });
         *
         * 6. Expose Custom Headers to the Client
         * --------------------------------------
         * services.AddCors(options => {
         *     options.AddPolicy("ExposeHeaders", builder => {
         *         builder.WithOrigins("https://myfrontend.com")
         *                .AllowAnyMethod()
         *                .AllowAnyHeader()
         *                .WithExposedHeaders("X-Total-Count", "X-Custom-Header");
         *     });
         * });
         *
         * 7. Using CORS with SignalR
         * --------------------------
         * services.AddCors(options => {
         *     options.AddPolicy("SignalR", builder => {
         *         builder.WithOrigins("https://myfrontend.com")
         *                .AllowAnyHeader()
         *                .AllowAnyMethod()
         *                .AllowCredentials();
         *     });
         * });
         * // In Program.cs: app.UseCors("SignalR");
         *
         * 8. Environment-based CORS
         * -------------------------
         * // Example: Allow all in development, restrict in production
         * if (env.IsDevelopment()) {
         *     services.AddCors(options => {
         *         options.AddPolicy("DevCors", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
         *     });
         * } else {
         *     services.AddCors(options => {
         *         options.AddPolicy("ProdCors", builder => builder.WithOrigins("https://myfrontend.com").AllowAnyMethod().AllowAnyHeader());
         *     });
         * }
         *
         * 9. CORS Preflight Requests
         * -------------------------
         * // Browsers send an OPTIONS request before certain cross-origin requests.
         * // Make sure your API does not block OPTIONS requests and CORS middleware is registered early.
         *
         * 10. Debugging CORS Issues
         * ------------------------
         * - CORS errors are enforced by browsers, not the server. Use browser dev tools (Network tab) to inspect failed requests.
         * - Common issues: wrong origin, missing headers, credentials misconfiguration, CORS middleware not registered before endpoints.
         * - Always register app.UseCors() before app.UseAuthorization() and app.UseEndpoints().
         *
         * 11. Using CORS with Minimal APIs
         * -------------------------------
         * var builder = WebApplication.CreateBuilder(args);
         * builder.Services.AddCors(options => {
         *     options.AddPolicy("MyPolicy", b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
         * });
         * var app = builder.Build();
         * app.UseCors("MyPolicy");
         *
         * 12. Using CORS with Controllers
         * ------------------------------
         * // You can also use [EnableCors] attribute on controllers/actions:
         * [EnableCors("MyPolicy")]
         * [ApiController]
         * [Route("api/[controller]")]
         * public class MyController : ControllerBase { ... }
         *
         * 13. Disabling CORS for Specific Endpoints
         * ----------------------------------------
         * // Use [DisableCors] attribute on a controller or action to opt-out.
         *
         * 14. Multiple CORS Policies
         * -------------------------
         * // You can define and use multiple named policies for different endpoints.
         *
         * 15. CORS and API Gateways/Proxies
         * ---------------------------------
         * // If using a reverse proxy (e.g., Nginx, Azure API Management), ensure CORS headers are not stripped or duplicated.
         *
         * 16. CORS and WebSockets
         * ----------------------
         * // CORS does not apply to WebSocket connections, but you may need to allow the handshake endpoint.
         *
         * 17. CORS and OpenAPI/Swagger
         * ---------------------------
         * // If Swagger UI is not loading due to CORS, ensure the Swagger endpoint is included in allowed origins.
         *
         * 18. CORS Security Best Practices
         * ------------------------------
         * - Never use AllowAnyOrigin() in production unless your API is truly public.
         * - Always restrict origins, methods, and headers as much as possible.
         * - Use HTTPS for all cross-origin requests.
         *
         * More Info:
         * ----------
         * - Official Docs: https://learn.microsoft.com/en-us/aspnet/core/security/cors
         * - MDN CORS Guide: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
         * - Troubleshooting: https://enable-cors.org/
         */

        // Registers CORS policy (default: AllowAll for development)
        public static IServiceCollection AddCustomCors(this IServiceCollection services) {
            // Change this policy as needed for your environment!
            services.AddCors(options => {
                options.AddPolicy("AllowAll", builder => {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });
            return services;
        }

        // Adds CORS middleware
        public static IApplicationBuilder UseCustomCors(this IApplicationBuilder app) {
            // Use the policy name you registered above
            app.UseCors("AllowAll");
            return app;
        }
    }
}
