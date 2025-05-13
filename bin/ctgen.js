#!/usr/bin/env node
import { Command } from "commander";
import { scaffoldNextStructure } from "../src/generators/scaffoldNextStructure.js";
import { scaffoldDotnetStructure } from "../src/generators/scaffoldDotnetStructure.js";
import inquirer from "inquirer";
import path from "path";
const program = new Command();
program
    .name("ctgen")
    .description("CLI for generating structured project scaffolds (Next.js, .NET)")
    .version("1.0.0");
program
    .command("next")
    .description("Scaffold a Next.js App Router project structure")
    .option("-a, --all", "Enable all features and use default DB values")
    .option("-p, --path <path>", "Path to create/find the project directory (default: current directory)")
    .option("-n, --name <name>", "Name of the project (used for folder creation or lookup)")
    .action(async (options) => {
    try {
        let projectName = options.name;
        let projectPath = options.path || process.cwd();
        // Prompt for name if not provided
        if (!projectName) {
            const nameAnswer = await inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "Project name:",
                    validate: (input) => !!input || "Project name is required",
                },
            ]);
            projectName = nameAnswer.name;
        }
        if (!projectName) {
            throw new Error("Project name is required.");
        }
        // Final target directory
        const outputDir = path.join(projectPath, projectName);
        let opts = { outputDir, ...options };
        if (options.all) {
            opts = {
                ...opts,
                withMdx: true,
                withNextAuth: true,
                withPrisma: true,
                withTailwind: true,
                dbType: "postgres",
                dbMode: "new",
                dbName: projectName,
                dbUser: "devUser",
                dbPassword: "devPass",
                dbHost: "localhost",
                dbPort: "5432",
            };
        }
        else {
            // Prompt for missing options as before
            const prompts = [];
            if (typeof opts.withMdx === "undefined") {
                prompts.push({
                    type: "confirm",
                    name: "withMdx",
                    message: "Include MDX profile scaffolding?",
                    default: false,
                });
            }
            if (typeof opts.withNextAuth === "undefined") {
                prompts.push({
                    type: "confirm",
                    name: "withNextAuth",
                    message: "Include NextAuth.js authentication?",
                    default: false,
                });
            }
            if (typeof opts.withPrisma === "undefined") {
                prompts.push({
                    type: "confirm",
                    name: "withPrisma",
                    message: "Include Prisma setup?",
                    default: false,
                });
            }
            if (typeof opts.withTailwind === "undefined") {
                prompts.push({
                    type: "confirm",
                    name: "withTailwind",
                    message: "Use Tailwind CSS for styling?",
                    default: false,
                });
            }
            let answers = {};
            if (prompts.length > 0) {
                answers = await inquirer.prompt(prompts);
                opts = { ...opts, ...answers };
            }
            // Prisma DB prompts if needed
            if (opts.withPrisma) {
                const dbPrompts = [
                    {
                        type: "list",
                        name: "dbType",
                        message: "Which database type?",
                        choices: ["postgres"],
                        default: "postgres",
                    },
                    {
                        type: "list",
                        name: "dbMode",
                        message: "Are you connecting to a new or existing database?",
                        choices: [
                            { name: "New database (create it for me)", value: "new" },
                            {
                                name: "Existing database (I will provide the URL)",
                                value: "existing",
                            },
                        ],
                        default: "new",
                    },
                ];
                const dbAnswers = await inquirer.prompt(dbPrompts);
                opts = { ...opts, ...dbAnswers };
                if (dbAnswers.dbMode === "new") {
                    const newDbPrompts = [
                        {
                            type: "input",
                            name: "dbName",
                            message: "Database name:",
                            default: projectName,
                        },
                        {
                            type: "input",
                            name: "dbUser",
                            message: "Database username:",
                            default: "devUser",
                        },
                        {
                            type: "password",
                            name: "dbPassword",
                            message: "Database password:",
                            default: "devPass",
                            mask: "*",
                        },
                        {
                            type: "input",
                            name: "dbHost",
                            message: "Database host:",
                            default: "localhost",
                        },
                        {
                            type: "input",
                            name: "dbPort",
                            message: "Database port:",
                            default: "5432",
                        },
                    ];
                    const newDbAnswers = await inquirer.prompt(newDbPrompts);
                    opts = { ...opts, ...newDbAnswers };
                }
                else {
                    const existingDbPrompt = [
                        {
                            type: "input",
                            name: "databaseUrl",
                            message: "Enter your DATABASE_URL:",
                        },
                    ];
                    const existingDbAnswers = await inquirer.prompt(existingDbPrompt);
                    opts = { ...opts, ...existingDbAnswers };
                }
            }
        }
        await scaffoldNextStructure(opts);
    }
    catch (error) {
        console.error("❌ Error creating Next.js structure:", error);
        process.exit(1);
    }
});
program
    .command("dotnet")
    .description("Scaffold a .NET layered solution structure")
    .option("-a, --all", "Enable all features")
    .option("-p, --path <path>", "Path to create/find the project directory (default: current directory)")
    .option("-n, --name <name>", "Name of the project (used for folder creation or lookup)")
    .action(async (options) => {
    try {
        let projectName = options.name;
        let projectPath = options.path || process.cwd();
        if (!projectName) {
            const nameAnswer = await inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "Project name:",
                    validate: (input) => !!input || "Project name is required",
                },
            ]);
            projectName = nameAnswer.name;
        }
        if (!projectName) {
            throw new Error("Project name is required.");
        }
        const outputDir = path.join(projectPath, projectName);
        let opts = { outputDir, ...options };
        if (options.all) {
            opts = {
                ...opts,
                apiType: "WebAPI",
                withTests: true,
                withEFCore: true,
                withSwagger: true,
                withAuth: true,
                withSerilog: true,
                withCors: true,
                withHealthChecks: true,
                withDocker: true,
                withAppSettings: true,
                withApiVersioning: true,
            };
        }
        else {
            const prompts = [];
            if (!opts.apiType) {
                prompts.push({
                    type: "list",
                    name: "apiType",
                    message: "Type of program:",
                    choices: [
                        {
                            name: "WebAPI (Controllers, Models, Services, etc)",
                            value: "WebAPI",
                        },
                        {
                            name: "MinimalAPI (No Controllers folder)",
                            value: "MinimalAPI",
                        },
                    ],
                    default: "WebAPI",
                });
            }
            if (typeof opts.withTests === "undefined") {
                prompts.push({
                    type: "confirm",
                    name: "withTests",
                    message: "Include unit/integration test folders?",
                    default: true,
                });
            }
            const featurePrompts = [
                {
                    type: "confirm",
                    name: "withEFCore",
                    message: "Include Entity Framework Core setup?",
                    default: true,
                },
                {
                    type: "confirm",
                    name: "withSwagger",
                    message: "Include Swagger/OpenAPI support?",
                    default: true,
                },
                {
                    type: "confirm",
                    name: "withAuth",
                    message: "Include authentication (JWT/Identity)?",
                    default: false,
                },
                {
                    type: "confirm",
                    name: "withSerilog",
                    message: "Include Serilog logging setup?",
                    default: true,
                },
                {
                    type: "confirm",
                    name: "withCors",
                    message: "Configure CORS policy?",
                    default: true,
                },
                {
                    type: "confirm",
                    name: "withHealthChecks",
                    message: "Add health check endpoints?",
                    default: true,
                },
                {
                    type: "confirm",
                    name: "withDocker",
                    message: "Add Dockerfile and docker-compose setup?",
                    default: false,
                },
                {
                    type: "confirm",
                    name: "withAppSettings",
                    message: "Add appsettings.json with environment support?",
                    default: true,
                },
                {
                    type: "confirm",
                    name: "withApiVersioning",
                    message: "Enable API versioning?",
                    default: false,
                },
            ];
            for (const prompt of featurePrompts) {
                if (typeof opts[prompt.name] === "undefined") {
                    prompts.push(prompt);
                }
            }
            let answers = {};
            if (prompts.length > 0) {
                answers = await inquirer.prompt(prompts);
                opts = { ...opts, ...answers };
            }
        }
        await scaffoldDotnetStructure(opts);
    }
    catch (error) {
        console.error("❌ Error creating .NET structure:", error);
        process.exit(1);
    }
});
program.parse();
