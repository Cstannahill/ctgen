using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Extensions {
    public static class AuthServiceExtensions {
        /*
         * =============================
         * Authentication (JWT/Identity) Extension
         * =============================
         *
         * What is this?
         * ---------------
         * This extension sets up JWT Bearer authentication for your API. You can also add ASP.NET Identity or custom user services here.
         *
         * How to use this extension:
         * --------------------------
         * 1. In Program.cs, call services.AddCustomAuth(builder.Configuration) to register authentication.
         * 2. In Program.cs, call app.UseCustomAuth() to enable authentication/authorization middleware.
         * 3. Update Jwt:Key and Jwt:Issuer in appsettings.json.
         *
         * How to customize:
         * -----------------
         * - Add Identity with services.AddIdentity<>() if you want full user management.
         * - Change token validation parameters as needed for your security requirements.
         * - Add policies/roles for more granular authorization.
         *
         * Debugging Auth Issues:
         * ---------------------
         * - If you get 401 errors, check your JWT token, secret, and issuer.
         * - Make sure UseAuthentication() and UseAuthorization() are called before endpoints.
         * - Use JWT.io to debug tokens: https://jwt.io/
         *
         * More info:
         *   - Docs: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/jwt
         *   - Identity: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity
         */
        // Registers JWT authentication
        public static IServiceCollection AddCustomAuth(this IServiceCollection services, IConfiguration config) {
            var jwtKey = config["Jwt:Key"] ?? "YourSuperSecretKey";
            var jwtIssuer = config["Jwt:Issuer"] ?? "YourIssuer";
            services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtIssuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });
            // Add Identity or custom user services here
            return services;
        }
        // Adds authentication/authorization middleware
        public static IApplicationBuilder UseCustomAuth(this IApplicationBuilder app) {
            app.UseAuthentication();
            app.UseAuthorization();
            return app;
        }
    }
}