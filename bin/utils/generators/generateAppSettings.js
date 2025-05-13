import { generateEFCoreAppSettings } from "./generateEFCoreAppSettings.js";
export function generateAppSettings(options) {
    const config = {
        Logging: {
            LogLevel: {
                Default: "Information",
                "Microsoft.AspNetCore": "Warning",
            },
        },
        AllowedHosts: "*",
    };
    if (options.withEFCore) {
        Object.assign(config, generateEFCoreAppSettings(options));
    }
    if (options.withAuth) {
        config["Jwt"] = {
            Key: "YourSuperSecretKey",
            Issuer: "YourIssuer",
        };
    }
    if (options.withSerilog) {
        config["Serilog"] = {
            MinimumLevel: {
                Default: "Information",
                Override: {
                    Microsoft: "Warning",
                    System: "Warning",
                },
            },
            WriteTo: [
                { Name: "Console" },
                {
                    Name: "File",
                    Args: { path: "logs/log.txt", rollingInterval: "Day" },
                },
            ],
            Enrich: ["FromLogContext", "WithMachineName"],
        };
    }
    return JSON.stringify(config, null, 2);
}
