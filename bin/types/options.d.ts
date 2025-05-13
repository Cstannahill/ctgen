export interface ScaffoldNextOptions {
    withMdx?: boolean;
    outputDir?: string;
    withNextAuth?: boolean;
    withPrisma?: boolean;
    withTailwind?: boolean;
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
    withEFCore?: boolean;
    withSwagger?: boolean;
    withAuth?: boolean;
    withSerilog?: boolean;
    withCors?: boolean;
    withHealthChecks?: boolean;
    withDocker?: boolean;
    withAppSettings?: boolean;
    withApiVersioning?: boolean;
}
