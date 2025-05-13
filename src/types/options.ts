// src/types/options.ts

export interface ScaffoldNextOptions {
  withMdx?: boolean;
  outputDir?: string; // Optional output directory
  withNextAuth?: boolean; // Optional NextAuth flag
  withPrisma?: boolean; // Optional Prisma flag
  withTailwind?: boolean; // Optional Tailwind CSS flag
  // Prisma DB options
  dbType?: string;
  dbMode?: "new" | "existing";
  dbName?: string;
  dbUser?: string;
  dbPassword?: string;
  dbHost?: string;
  dbPort?: string;
  databaseUrl?: string;
}

export interface ScaffoldDotnetOptions {
  withTests?: boolean;
  outputDir?: string;
  apiType?: "WebAPI" | "MinimalAPI";
  withEFCore?: boolean; // 1. Entity Framework Core
  withSwagger?: boolean; // 2. Swagger/OpenAPI
  withAuth?: boolean; // 3. Authentication (JWT/Identity)
  withSerilog?: boolean; // 4. Serilog logging
  withCors?: boolean; // 5. CORS policy
  withHealthChecks?: boolean; // 6. Health checks
  withDocker?: boolean; // 7. Docker support
  withAppSettings?: boolean; // 8. AppSettings/config
  withApiVersioning?: boolean; // 9. API Versioning
}
