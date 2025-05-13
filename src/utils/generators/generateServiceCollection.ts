import type { ScaffoldDotnetOptions } from "../../types/options.js";

export function generateServiceCollection(options: ScaffoldDotnetOptions) {
  const usings = [
    "using Microsoft.Extensions.DependencyInjection;",
    "using Services.Interfaces;",
    "using Services.Implementations;",
    options.withEFCore ? "using Extensions;" : null,
    options.withSwagger ? "using Extensions;" : null,
    options.withAuth ? "using Extensions;" : null,
    options.withSerilog ? "using Extensions;" : null,
    options.withCors ? "using Extensions;" : null,
    options.withHealthChecks ? "using Extensions;" : null,
    options.withApiVersioning ? "using Extensions;" : null,
  ]
    .filter(Boolean)
    .join("\n");

  const registrations = [
    "services.AddScoped<IAIModelService, AIModelService>();",
    options.withEFCore
      ? "services.AddCustomEFCore(builder.Configuration);"
      : null,
    options.withSwagger ? "services.AddCustomSwagger();" : null,
    options.withAuth ? "services.AddCustomAuth(builder.Configuration);" : null,
    options.withSerilog
      ? "// Serilog is usually configured on builder, not here"
      : null,
    options.withCors ? "services.AddCustomCors();" : null,
    options.withHealthChecks ? "services.AddCustomHealthChecks();" : null,
    options.withApiVersioning ? "services.AddCustomApiVersioning();" : null,
  ]
    .filter(Boolean)
    .join("\n        ");

  return `${usings}

namespace Extensions {
    public static class ServiceCollectionExtensions {
        public static IServiceCollection AddCustomServices(this IServiceCollection services) {
        ${registrations}
            return services;
        }
    }
}`;
}
