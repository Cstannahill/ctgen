using Serilog;

namespace Extensions {
    public static class SerilogServiceExtensions {
        /*
         * =====================================================================
         * Serilog Logging Extension for ASP.NET Core
         * =====================================================================
         *
         * What is Serilog?
         * ---------------
         * Serilog is a powerful, flexible, and popular structured logging library for .NET applications.
         * It enables you to log events to various outputs (called "sinks") such as the console, files, databases, Seq, Elasticsearch, and more.
         * Serilog supports structured logging, which means you can log rich, queryable data (not just text).
         *
         * Why use Serilog?
         * ----------------
         * - Structured logs: Easily search, filter, and analyze logs.
         * - Multiple sinks: Write logs to many destinations simultaneously.
         * - Enrichers: Add contextual information (e.g., user, request id) to every log entry.
         * - Flexible configuration: Configure via code or appsettings.json.
         *
         * How to use this extension:
         * --------------------------
         * 1. In Program.cs, call builder = builder.AddCustomSerilog() before building the app.
         * 2. Configure sinks, enrichers, and minimum log level in appsettings.json or in code.
         * 3. Use the static Log class or ILogger<T> in your services/controllers.
         *
         * =============================
         * Serilog Configuration & Examples
         * =============================
         *
         * 1. Basic Console Logging (Development)
         * --------------------------------------
         * builder.Host.UseSerilog((ctx, lc) => lc
         *     .ReadFrom.Configuration(ctx.Configuration)
         *     .WriteTo.Console()
         * );
         *
         * 2. File Logging
         * ---------------
         * .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day)
         * // Logs will be written to a new file each day.
         *
         * 3. Seq Sink (Centralized Log Server)
         * -----------------------------------
         * .WriteTo.Seq("http://localhost:5341")
         * // Download Seq from https://datalust.co/seq
         *
         * 4. Enrichers (Add Context)
         * -------------------------
         * .Enrich.FromLogContext()
         * .Enrich.WithProperty("AppName", "MyApp")
         * .Enrich.WithMachineName()
         * .Enrich.WithThreadId()
         *
         * 5. Minimum Log Level
         * -------------------
         * .MinimumLevel.Debug()
         * .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
         *
         * 6. Configuration via appsettings.json
         * ------------------------------------
         * "Serilog": {
         *   "MinimumLevel": {
         *     "Default": "Information",
         *     "Override": {
         *       "Microsoft": "Warning",
         *       "System": "Warning"
         *     }
         *   },
         *   "WriteTo": [
         *     { "Name": "Console" },
         *     { "Name": "File", "Args": { "path": "logs/log.txt", "rollingInterval": "Day" } }
         *   ],
         *   "Enrich": [ "FromLogContext", "WithMachineName" ]
         * }
         *
         * 7. Logging in Controllers/Services
         * ----------------------------------
         * // Inject ILogger<T>:
         * public class MyController : ControllerBase {
         *     private readonly ILogger<MyController> _logger;
         *     public MyController(ILogger<MyController> logger) {
         *         _logger = logger;
         *     }
         *     public IActionResult Get() {
         *         _logger.LogInformation("Fetching data at {Time}", DateTime.UtcNow);
         *         ...
         *     }
         * }
         *
         * // Or use static Log class:
         * Log.Information("Something happened: {@Data}", data);
         *
         * 8. Logging Exceptions
         * ---------------------
         * try {
         *     ...
         * } catch (Exception ex) {
         *     Log.Error(ex, "An error occurred while processing request");
         * }
         *
         * 9. Filtering Logs
         * -----------------
         * .Filter.ByExcluding(logEvent => logEvent.Level == LogEventLevel.Debug)
         *
         * 10. Advanced Sinks
         * ------------------
         * // Elasticsearch:
         * .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri("http://localhost:9200")))
         * // Azure Application Insights:
         * .WriteTo.ApplicationInsights(telemetryClient, TelemetryConverter.Traces)
         *
         * 11. Serilog Request Logging Middleware
         * -------------------------------------
         * // Add this in Program.cs for HTTP request logging:
         * app.UseSerilogRequestLogging();
         *
         * 12. Debugging Serilog Issues
         * ---------------------------
         * - If logs don't appear, check configuration and sink setup.
         * - Use Log.CloseAndFlush() on shutdown for file/remote sinks.
         * - Check for exceptions in sink configuration.
         *
         * 13. Best Practices
         * -----------------
         * - Use structured logging (named properties, not string concatenation).
         * - Avoid logging sensitive data.
         * - Use enrichment for correlation IDs, user info, etc.
         * - Use rolling files or centralized sinks in production.
         *
         * More Info:
         * ----------
         * - Serilog Docs: https://serilog.net/
         * - Sinks: https://github.com/serilog/serilog/wiki/Provided-Sinks
         * - Enrichers: https://github.com/serilog/serilog/wiki/Enrichment
         * - Appsettings config: https://github.com/serilog/serilog-settings-configuration
         * - Troubleshooting: https://github.com/serilog/serilog/wiki/Debugging-and-Diagnostics
         */
        // Configures Serilog as the logging provider
        public static WebApplicationBuilder AddCustomSerilog(this WebApplicationBuilder builder) {
            // Configure Serilog from appsettings.json or code
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Configuration)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                // .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day)
                // .WriteTo.Seq("http://localhost:5341")
                // .Enrich.WithProperty("AppName", "YourApp")
                .CreateLogger();
            builder.Host.UseSerilog();
            return builder;
        }
    }
}