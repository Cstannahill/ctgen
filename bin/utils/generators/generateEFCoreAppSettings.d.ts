import type { ScaffoldDotnetOptions } from "../../types/options.js";
/**
 * Generates a comprehensive EF Core section for appsettings.json.
 * Includes example connection string, provider, and common EF Core options.
 */
export declare function generateEFCoreAppSettings(options: ScaffoldDotnetOptions): {
    ConnectionStrings: {
        DefaultConnection: string;
    };
    EFCore: {
        Provider: string;
        MigrationsAssembly: string;
        EnableSensitiveDataLogging: boolean;
        EnableDetailedErrors: boolean;
        CommandTimeout: number;
    };
};
