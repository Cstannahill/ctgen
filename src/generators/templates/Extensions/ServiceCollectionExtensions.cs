using Microsoft.Extensions.DependencyInjection;
using Services.Interfaces;
using Services.Implementations;

namespace Extensions {
    public static class ServiceCollectionExtensions {
        public static IServiceCollection AddCustomServices(this IServiceCollection services) {
            services.AddScoped<IAIModelService, AIModelService>();
            // Register other services as needed
            return services;
        }
    }
}