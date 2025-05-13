using Microsoft.EntityFrameworkCore;

namespace Extensions {
    public static class EFCoreServiceExtensions {
        /*
         * =============================
         * Entity Framework Core (EF Core) Extension
         * =============================
         *
         * What is EF Core?
         * ---------------
         * EF Core is Microsoft's ORM for .NET, allowing you to interact with your database using strongly-typed C# classes (DbContext, models).
         *
         * How to use this extension:
         * --------------------------
         * 1. In Program.cs, call services.AddCustomEFCore(builder.Configuration) to register your DbContext.
         * 2. Make sure you have a DbContext class (e.g., MyDbContext) in your Data folder.
         * 3. Update the connection string in appsettings.json as needed.
         *
         * How to customize:
         * -----------------
         * - Change UseSqlServer to UseNpgsql, UseSqlite, etc. for other DBs.
         * - Add migrations with `dotnet ef migrations add InitialCreate`.
         * - Update the connection string for your environment.
         *
         * Debugging EF Core Issues:
         * ------------------------
         * - If you get connection errors, check your connection string and DB server.
         * - If migrations fail, check your model and migration history.
         *
         * More info:
         *   - Docs: https://learn.microsoft.com/en-us/ef/core/
         *   - Connection strings: https://www.connectionstrings.com/
         */
        // Registers EF Core DbContext
        public static IServiceCollection AddCustomEFCore(this IServiceCollection services, IConfiguration config) {
            // Replace "MyDbContext" and connection string as needed
            services.AddDbContext<MyDbContext>(options =>
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"))
            );
            return services;
        }
    }
}
// NOTE: You must create a MyDbContext class in your Data folder.