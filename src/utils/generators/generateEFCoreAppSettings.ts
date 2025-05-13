import type { ScaffoldDotnetOptions } from "../../types/options.js";

/**
 * Generates a comprehensive EF Core section for appsettings.json.
 * Includes example connection string, provider, and common EF Core options.
 */
export function generateEFCoreAppSettings(options: ScaffoldDotnetOptions) {
  return {
    ConnectionStrings: {
      DefaultConnection:
        "Server=localhost;Database=MyAppDb;User Id=sa;Password=Your_password123;TrustServerCertificate=True;",
    },
    EFCore: {
      Provider: "SqlServer", // Example: SqlServer, PostgreSQL, etc.
      MigrationsAssembly: "MyApp.Data",
      EnableSensitiveDataLogging: false,
      EnableDetailedErrors: true,
      CommandTimeout: 30,
      // Add more EF Core-specific settings as needed
    },
  };
}
