export function generateProgramCs(options) {
    const usings = [
        "using Microsoft.AspNetCore.Builder;",
        "using Microsoft.Extensions.DependencyInjection;",
        "using Microsoft.Extensions.Hosting;",
    ];
    // Only add 'using Extensions;' once if any relevant feature is enabled
    if (options.withSwagger ||
        options.withEFCore ||
        options.withAuth ||
        options.withSerilog ||
        options.withCors ||
        options.withHealthChecks ||
        options.withApiVersioning) {
        usings.push("using Extensions;");
    }
    let builderSetup = "var builder = WebApplication.CreateBuilder(args);\n";
    if (options.withSerilog)
        builderSetup += "builder = builder.AddCustomSerilog();\n";
    builderSetup += "var services = builder.Services;\n";
    if (options.withEFCore)
        builderSetup += "services.AddCustomEFCore(builder.Configuration);\n";
    if (options.withSwagger)
        builderSetup += "services.AddCustomSwagger();\n";
    if (options.withAuth)
        builderSetup += "services.AddCustomAuth(builder.Configuration);\n";
    if (options.withCors)
        builderSetup += "services.AddCustomCors();\n";
    if (options.withHealthChecks)
        builderSetup += "services.AddCustomHealthChecks();\n";
    if (options.withApiVersioning)
        builderSetup += "services.AddCustomApiVersioning();\n";
    let appSetup = "var app = builder.Build();\n";
    if (options.withSerilog)
        appSetup += "// Serilog request logging is automatic\n";
    if (options.withSwagger)
        appSetup += "app.UseCustomSwagger();\n";
    if (options.withCors)
        appSetup += "app.UseCustomCors();\n";
    if (options.withAuth)
        appSetup += "app.UseCustomAuth();\n";
    if (options.withHealthChecks)
        appSetup += "app.UseCustomHealthChecks();\n";
    appSetup +=
        "\napp.MapControllers(); // Or MapMinimalEndpoints for MinimalAPI\napp.Run();\n";
    return `${usings.join("\n")}\n\n${builderSetup}\n${appSetup}`;
}
