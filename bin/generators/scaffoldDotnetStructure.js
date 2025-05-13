// src/generators/scaffoldDotnetStructure.ts
import path from "path";
import { fileURLToPath } from "url";
import { createFolderSafely } from "../utils/fileHelpers.js";
import fs from "fs/promises";
import { generateProgramCs } from "../utils/generators/generateProgramCs.js";
import { generateAppSettings } from "../utils/generators/generateAppSettings.js";
import { generateDockerfile } from "../utils/generators/generateDockerfile.js";
import { generateServiceCollection } from "../utils/generators/generateServiceCollection.js";
import { generateIndexHtml } from "../utils/generators/generateIndexHtml.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function writeDotnetFile(filePath, content) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf-8");
}
// NEW: Helper to read template file content
async function readTemplate(relPath) {
    const absPath = path.join(__dirname, "templates", "Extensions", relPath);
    return fs.readFile(absPath, "utf-8");
}
// UPDATED: getExtensionFiles now reads from template files
async function getExtensionFiles(options) {
    const files = [];
    if (options.withSwagger) {
        files.push({
            relPath: "Extensions/SwaggerServiceExtensions.cs",
            content: await readTemplate("SwaggerServiceExtensions.cs"),
        });
    }
    if (options.withEFCore) {
        files.push({
            relPath: "Extensions/EFCoreServiceExtensions.cs",
            content: await readTemplate("EFCoreServiceExtensions.cs"),
        });
    }
    if (options.withAuth) {
        files.push({
            relPath: "Extensions/AuthServiceExtensions.cs",
            content: await readTemplate("AuthServiceExtensions.cs"),
        });
    }
    if (options.withSerilog) {
        files.push({
            relPath: "Extensions/SerilogServiceExtensions.cs",
            content: await readTemplate("SerilogServiceExtensions.cs"),
        });
    }
    if (options.withCors) {
        files.push({
            relPath: "Extensions/CorsServiceExtensions.cs",
            content: await readTemplate("CorsServiceExtensions.cs"),
        });
    }
    if (options.withHealthChecks) {
        files.push({
            relPath: "Extensions/HealthChecksServiceExtensions.cs",
            content: await readTemplate("HealthChecksServiceExtensions.cs"),
        });
    }
    if (options.withApiVersioning) {
        files.push({
            relPath: "Extensions/ApiVersioningServiceExtensions.cs",
            content: await readTemplate("ApiVersioningServiceExtensions.cs"),
        });
    }
    return files;
}
// --- Boilerplate for EFCore, Auth, and WebAPI ---
async function writeBoilerplateFiles(outputDir, options) {
    // EFCore: MyDbContext and WeatherForecast model
    if (options.withEFCore) {
        await writeDotnetFile(path.join(outputDir, "Data/Context/MyDbContext.cs"), `using Microsoft.EntityFrameworkCore;
using Models;

namespace Data.Context {
    public class MyDbContext : DbContext {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) {}
        public DbSet<AIModel> AIModels { get; set; }
    }
}`);
    }
    // WebAPI: Sample AIModelsController
    if (options.apiType === "WebAPI") {
        await writeDotnetFile(path.join(outputDir, "Controllers/AIModelsController.cs"), `using Microsoft.AspNetCore.Mvc;
using Models;
using Services.Interfaces;

namespace Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class AIModelsController : ControllerBase {
        private readonly IAIModelService _aiModelService;
        public AIModelsController(IAIModelService aiModelService) {
            _aiModelService = aiModelService;
        }
        [HttpGet]
        public IEnumerable<AIModel> Get() {
            return _aiModelService.GetAll();
        }
    }
}`);
    }
    // Auth/JWT: User model and AuthController
    if (options.withAuth) {
        await writeDotnetFile(path.join(outputDir, "Models/User.cs"), `namespace Models {
    public class User {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
    }
}`);
        await writeDotnetFile(path.join(outputDir, "Controllers/AuthController.cs"), `using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Models;

namespace Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase {
        [HttpPost("login")]
        public IActionResult Login([FromBody] User login) {
            // This is a placeholder. Replace with real user validation!
            if (login.Username == "test" && login.PasswordHash == "password") {
                var claims = new[] {
                    new Claim(ClaimTypes.Name, login.Username)
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSuperSecretKey"));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    issuer: "YourIssuer",
                    audience: "YourIssuer",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: creds
                );
                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
            }
            return Unauthorized();
        }
    }
}`);
    }
    // AIModel: Main model for the application
    await writeDotnetFile(path.join(outputDir, "Models/AIModel.cs"), `namespace Models {
    public class AIModel {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Version { get; set; }
    }
}`);
    // Copy service interface and implementation
    await writeDotnetFile(path.join(outputDir, "Services/Interfaces/IAIModelService.cs"), `namespace Services.Interfaces {
    public interface IAIModelService {
        IEnumerable<AIModel> GetAll();
        // Add more methods as needed
    }
}`);
    await writeDotnetFile(path.join(outputDir, "Services/Implementations/AIModelService.cs"), `using Models;
using Data.Context;
using Services.Interfaces;

namespace Services.Implementations {
    public class AIModelService : IAIModelService {
        private readonly MyDbContext _context;
        public AIModelService(MyDbContext context) {
            _context = context;
        }
        public IEnumerable<AIModel> GetAll() {
            return _context.AIModels.ToList();
        }
        // Add more methods as needed
    }
}`);
    // Copy DI extension
    await writeDotnetFile(path.join(outputDir, "Extensions/ServiceCollectionExtensions.cs"), generateServiceCollection(options));
    // Write wwwroot/index.html using utility
    await writeDotnetFile(path.join(outputDir, "wwwroot/index.html"), generateIndexHtml());
    // --- General-use Enums ---
    await writeDotnetFile(path.join(outputDir, "Models/Enums/StatusCode.cs"), `namespace Models.Enums {
    public enum StatusCode {
        Success = 0,
        Error = 1,
        NotFound = 2,
        Unauthorized = 3,
        Forbidden = 4,
        ValidationError = 5
    }
}`);
    await writeDotnetFile(path.join(outputDir, "Models/Enums/UserRole.cs"), `namespace Models.Enums {
    public enum UserRole {
        Guest = 0,
        User = 1,
        Admin = 2,
        SuperAdmin = 3
    }
}`);
    // --- Response Classes and Interface ---
    await writeDotnetFile(path.join(outputDir, "Services/Interfaces/IResponse.cs"), `namespace Services.Interfaces {
    public interface IResponse {
        bool Success { get; set; }
        string Message { get; set; }
        int StatusCode { get; set; }
    }
}`);
    await writeDotnetFile(path.join(outputDir, "Models/Responses/BaseResponse.cs"), `namespace Models.Responses {
    public class BaseResponse : IResponse {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int StatusCode { get; set; }
    }
}`);
    await writeDotnetFile(path.join(outputDir, "Models/Responses/ErrorResponse.cs"), `namespace Models.Responses {
    public class ErrorResponse : BaseResponse {
        public string Error { get; set; }
        public ErrorResponse(string error, string message = null, int statusCode = 1) {
            Success = false;
            Error = error;
            Message = message ?? error;
            StatusCode = statusCode;
        }
    }
}`);
    await writeDotnetFile(path.join(outputDir, "Models/Responses/SuccessResponse.cs"), `namespace Models.Responses {
    public class SuccessResponse : BaseResponse {
        public SuccessResponse(string message = null, int statusCode = 0) {
            Success = true;
            Message = message ?? "Success";
            StatusCode = statusCode;
        }
    }
}`);
    await writeDotnetFile(path.join(outputDir, "Models/Responses/ItemResponse.cs"), `namespace Models.Responses {
    public class ItemResponse<T> : BaseResponse {
        public T Item { get; set; }
        public ItemResponse(T item, string message = null, int statusCode = 0) {
            Success = true;
            Item = item;
            Message = message ?? "Success";
            StatusCode = statusCode;
        }
    }
}`);
    await writeDotnetFile(path.join(outputDir, "Models/Responses/ItemsResponse.cs"), `using System.Collections.Generic;
namespace Models.Responses {
    public class ItemsResponse<T> : BaseResponse {
        public IEnumerable<T> Items { get; set; }
        public ItemsResponse(IEnumerable<T> items, string message = null, int statusCode = 0) {
            Success = true;
            Items = items;
            Message = message ?? "Success";
            StatusCode = statusCode;
        }
    }
}`);
    // --- .editorconfig for C# code style ---
    await writeDotnetFile(path.join(outputDir, ".editorconfig"), `# EditorConfig for .NET/C#
root = true

[*.cs]
indent_style = space
indent_size = 4
insert_final_newline = true
charset = utf-8
end_of_line = crlf
trim_trailing_whitespace = true

# C# code style
csharp_new_line_before_open_brace = all
csharp_indent_case_contents = true
csharp_indent_switch_labels = true
csharp_space_after_cast = false
csharp_space_after_keywords_in_control_flow_statements = true
csharp_space_between_method_declaration_parameter_list_parentheses = false
csharp_space_between_method_call_parameter_list_parentheses = false
csharp_space_between_parentheses = false
csharp_preserve_single_line_statements = false
`);
    // --- .gitignore for .NET ---
    await writeDotnetFile(path.join(outputDir, ".gitignore"), `# .NET
bin/
obj/
*.user
*.suo
*.userosscache
*.sln.docstates
*.vs/
.vscode/
TestResults/
*.ncrunch*
*.localhistory/
*.DS_Store
*.swp
*.tmp
*.log
*.ide/
.env
appsettings.*.json
secrets.json
`);
    // --- Starter swagger.json ---
    await writeDotnetFile(path.join(outputDir, "Docs/Swagger/swagger.json"), `{
  "openapi": "3.0.1",
  "info": {
    "title": "My API",
    "version": "v1",
    "description": "Starter OpenAPI/Swagger spec. Customize as needed."
  },
  "paths": {
    "/api/aiModels": {
      "get": {
        "summary": "Get all AI models",
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    }
  }
}`);
    // --- Sample Unit Test classes ---
    await writeDotnetFile(path.join(outputDir, "Tests/ServiceTests/AIModelServiceTests.cs"), `using Xunit;
using Models;
using Services.Implementations;
using System.Collections.Generic;

namespace Tests.ServiceTests {
    public class AIModelServiceTests {
        [Fact]
        public void GetAll_ReturnsListOfAIModels() {
            // Arrange
            var context = new TestDbContext();
            var service = new AIModelService(context);
            // Act
            var result = service.GetAll();
            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<AIModel>>(result);
        }
    }
    // Minimal fake context for test
    public class TestDbContext : Data.Context.MyDbContext {
        public TestDbContext() : base(new Microsoft.EntityFrameworkCore.DbContextOptions<Data.Context.MyDbContext>()) {}
        public override System.Collections.Generic.List<AIModel> AIModels => new() {
            new AIModel { Id = 1, Name = "Test", Description = "Desc", Version = "1.0" }
        };
    }
}`);
    await writeDotnetFile(path.join(outputDir, "Tests/API/AuthControllerTests.cs"), `using Xunit;
using Controllers;
using Models;
using Microsoft.AspNetCore.Mvc;

namespace Tests.API {
    public class AuthControllerTests {
        [Fact]
        public void Login_ReturnsUnauthorized_ForInvalidUser() {
            // Arrange
            var controller = new AuthController();
            var user = new User { Username = "bad", PasswordHash = "bad" };
            // Act
            var result = controller.Login(user);
            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }
    }
}`);
    // --- Docker Compose (if Docker enabled) ---
    if (options.withDocker) {
        await writeDotnetFile(path.join(outputDir, "Docker/docker-compose.yml"), `version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    depends_on:
      - db
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: devUser
      POSTGRES_PASSWORD: devPass
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
`);
    }
    // --- Health Check Endpoint Sample ---
    if (options.withHealthChecks) {
        await writeDotnetFile(path.join(outputDir, "Controllers/HealthController.cs"), `using Microsoft.AspNetCore.Mvc;

namespace Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase {
        [HttpGet]
        public IActionResult Get() => Ok(new { status = "Healthy", time = DateTime.UtcNow });
    }
}`);
    }
    // --- API Versioning Sample ---
    if (options.withApiVersioning) {
        await writeDotnetFile(path.join(outputDir, "Controllers/VersionedController.cs"), `using Microsoft.AspNetCore.Mvc;

namespace Controllers {
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class VersionedController : ControllerBase {
        [HttpGet]
        public IActionResult GetV1() => Ok(new { version = "1.0", message = "Hello from v1!" });
    }
}`);
    }
    // --- GitHub Actions Workflow ---
    await writeDotnetFile(path.join(outputDir, ".github/workflows/dotnet.yml"), `name: .NET CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - name: Restore dependencies
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore --configuration Release
      - name: Test
        run: dotnet test --no-build --verbosity normal
`);
    // --- Prettier config (for C# use .editorconfig, but add Prettier for JS/TS if needed) ---
    await writeDotnetFile(path.join(outputDir, ".prettierrc"), `{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5"
}
`);
}
export async function scaffoldDotnetStructure(options) {
    const outputDir = options.outputDir
        ? path.resolve(options.outputDir)
        : process.cwd();
    let foldersToCreate = [];
    if (options.apiType === "WebAPI") {
        foldersToCreate = [
            "Controllers",
            "Models/Enums",
            "Models/Responses",
            "Services/Interfaces",
            "Services/Implementations",
            "Data/Context",
            "Data/Repositories",
            "Data/Migrations",
            "Views",
            "wwwroot",
        ];
    }
    else if (options.apiType === "MinimalAPI") {
        foldersToCreate = [
            "Models/Enums",
            "Models/Responses",
            "Services/Interfaces",
            "Services/Implementations",
            "Data/Context",
            "Data/Repositories",
            "Data/Migrations",
            "wwwroot",
        ];
    }
    if (options.withTests) {
        foldersToCreate.push("Tests/ServiceTests");
        foldersToCreate.push("Tests/API");
    }
    // Feature-based scaffolding
    if (options.withEFCore) {
        foldersToCreate.push("Data/EFMigrations");
    }
    if (options.withSwagger) {
        foldersToCreate.push("Docs/Swagger");
    }
    if (options.withAuth) {
        foldersToCreate.push("Auth");
    }
    if (options.withSerilog) {
        foldersToCreate.push("Logging");
    }
    if (options.withHealthChecks) {
        foldersToCreate.push("HealthChecks");
    }
    if (options.withDocker) {
        foldersToCreate.push("Docker");
    }
    if (options.withAppSettings) {
        foldersToCreate.push("Config");
    }
    if (options.withApiVersioning) {
        foldersToCreate.push("ApiVersioning");
    }
    if (options.withCors) {
        // CORS is a config, not a folder, but we could note it for future config file generation
    }
    try {
        for (const relativePath of foldersToCreate) {
            const absolutePath = path.join(outputDir, relativePath);
            await createFolderSafely(absolutePath);
        }
        // Write extension files (now async)
        const extensionFiles = await getExtensionFiles(options);
        for (const file of extensionFiles) {
            await writeDotnetFile(path.join(outputDir, file.relPath), file.content);
        }
        // Write program.cs
        await writeDotnetFile(path.join(outputDir, "program.cs"), generateProgramCs(options));
        // Write appsettings.json
        if (options.withAppSettings) {
            await writeDotnetFile(path.join(outputDir, "appsettings.json"), generateAppSettings(options));
        }
        // Write Dockerfile
        if (options.withDocker) {
            await writeDotnetFile(path.join(outputDir, "Dockerfile"), generateDockerfile(options));
        }
        // Write boilerplate files (DbContext, models, controllers, etc.)
        await writeBoilerplateFiles(outputDir, options);
        console.log(`✅ .NET ${options.apiType} structure scaffolded successfully in ${outputDir}.`);
    }
    catch (error) {
        console.error("❌ Failed to scaffold .NET structure:", error);
        throw error;
    }
}
