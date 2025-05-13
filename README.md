[![npm version](https://img.shields.io/npm/v/ctgen.svg)](https://www.npmjs.com/package/ctgen)
[![license](https://img.shields.io/npm/l/ctgen.svg)](LICENSE)
[![.NET Build](https://github.com/yourusername/ctgen/actions/workflows/dotnet.yml/badge.svg)](https://github.com/yourusername/ctgen/actions)

# ctgen

CLI tool to scaffold Next.js and .NET project structures.

## Installation

```
npm install -g ctgen
```

## Usage

### Basic Command Structure

```
ctgen <next|dotnet> [options]
```

### Options (for both next and dotnet)

- `-a, --all` &nbsp;&nbsp;&nbsp;&nbsp;Enable all features and use sensible defaults (no prompts)
- `-p, --path <path>` &nbsp;&nbsp;&nbsp;&nbsp;Path to create/find the project directory (default: current directory)
- `-n, --name <name>` &nbsp;&nbsp;&nbsp;&nbsp;Name of the project (used for folder creation or lookup)

#### Example: Scaffold a Next.js Project with All Features

```
ctgen next -a -p C:\Projects -n MyNextApp
```

#### Example: Scaffold a .NET Project with All Features

```
ctgen dotnet -a -p C:\Projects -n MyDotnetApp
```

#### Interactive Mode (Prompt for Each Option)

If you omit `-a`, ctgen will prompt you for each feature:

```
ctgen next -n MyNextApp
ctgen dotnet -n MyDotnetApp
```

#### Help

```
ctgen --help
ctgen <next|dotnet> --help
```

---

## Features & Generated Files

### Next.js

- App directory structure (app/, components/, lib/, etc.)
- Optional: MDX, NextAuth, Prisma, Tailwind CSS
- Database setup (Postgres, with sensible defaults if -a is used)
- .env, config, and utility files

### .NET

- Layered solution structure (Controllers, Models, Services, Data, etc.)
- General-use enums (StatusCode, UserRole)
- Response classes (BaseResponse, ErrorResponse, SuccessResponse, ItemResponse<T>, ItemsResponse<T>)
- IResponse interface
- Sample controllers (AIModelsController, AuthController, HealthController, VersionedController)
- Sample unit tests (Xunit)
- .editorconfig, .gitignore, Dockerfile, docker-compose.yml (if Docker enabled)
- Docs/Swagger/swagger.json (starter OpenAPI spec)
- .github/workflows/dotnet.yml (GitHub Actions CI)
- .prettierrc (for JS/TS formatting)

---

## Customizing Swagger UI (for .NET projects)

A starter `swagger.json` is generated in `Docs/Swagger/`. You can:

- Edit this file to document your API endpoints.
- Use the [Swagger Editor](https://editor.swagger.io/) for a visual interface.
- In your .NET project, ensure Swagger is enabled (see `Extensions/SwaggerServiceExtensions.cs`).
- To customize the UI, edit the `UseCustomSwagger` method or add options in `SwaggerServiceExtensions.cs`.

For more, see: [Swagger/OpenAPI docs](https://swagger.io/specification/).

---

## Docker & Docker Compose

If Docker is enabled, a `Dockerfile` and `docker-compose.yml` are generated for API + Postgres orchestration.

---

## GitHub Actions

A starter workflow is generated at `.github/workflows/dotnet.yml` for .NET CI/CD.

---

## Release Process

A helper script is provided at `scripts/release-helper.ps1` to:

- Show the current published NPM version and git tags
- Walk you through git add, commit, tag, push, and npm publish

Run in PowerShell:

```
pwsh scripts/release-helper.ps1
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT
