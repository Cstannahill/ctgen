using Microsoft.OpenApi.Models;

/*
 * To use a custom OpenAPI spec, place your swagger.json in Docs/Swagger/.
 * You can edit this file or use Swagger Editor (https://editor.swagger.io/).
 * To customize the Swagger UI, edit UseCustomSwagger below.
 */

namespace Extensions {
    public static class SwaggerServiceExtensions {
        /*
         * =============================
         * Swagger/OpenAPI Extension
         * =============================
         *
         * What is Swagger?
         * ---------------
         * Swagger (OpenAPI) is a tool for documenting and testing your Web APIs. It generates interactive docs and a UI for trying endpoints.
         *
         * How to use this extension:
         * --------------------------
         * 1. In Program.cs, call services.AddCustomSwagger() to register Swagger services.
         * 2. In Program.cs, call app.UseCustomSwagger() to enable the Swagger UI and JSON endpoint.
         *
         * How to customize:
         * -----------------
         * - Change the title/version in SwaggerDoc.
         * - Add security definitions for JWT or API keys.
         * - Add XML comments for richer docs (see AddSwaggerGen options).
         *
         * Debugging Swagger Issues:
         * ------------------------
         * - If the UI doesn't load, check the /swagger endpoint in your browser.
         * - Make sure UseCustomSwagger() is called before app.MapControllers().
         *
         * More info:
         *   - Docs: https://learn.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle
         *   - OpenAPI: https://swagger.io/specification/
         */
        // Registers Swagger services
        public static IServiceCollection AddCustomSwagger(this IServiceCollection services) {
            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
                // Add more Swagger config here
            });
            return services;
        }
        // Adds Swagger middleware to the app
        public static IApplicationBuilder UseCustomSwagger(this IApplicationBuilder app) {
            app.UseSwagger();
            app.UseSwaggerUI(c => {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                // Customize UI here
            });
            return app;
        }
    }
}