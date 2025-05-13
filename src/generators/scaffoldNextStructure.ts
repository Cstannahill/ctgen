import path from "path";
import fs from "fs/promises";
import { mkdir } from "fs/promises";
import { ScaffoldNextOptions } from "../types/options.js";
import { writeFileSafely, createFolderSafely } from "../utils/fileHelpers.js";
import { createDatabase } from "../utils/dbHelper.js";

export async function scaffoldNextStructure(
  options: ScaffoldNextOptions
): Promise<void> {
  const outputDir = options.outputDir
    ? path.resolve(options.outputDir)
    : process.cwd();
  const foldersToCreate = [
    "app",
    "components",
    "lib",
    "data",
    "hooks",
    "utils",
    "types",
    "styles",
    "public",
    "services",
    "config",
    "app/api",
  ];

  try {
    for (const relativePath of foldersToCreate) {
      const absolutePath = path.join(outputDir, relativePath);
      await createFolderSafely(absolutePath);
    }

    // Track skipped files
    const skippedFiles: string[] = [];

    // NextAuth.js scaffolding
    if (options.withNextAuth) {
      // Folders
      const nextAuthFolders = [
        "app/api/auth",
        "app/api/auth/[...nextauth]",
        "lib/auth",
      ];
      for (const rel of nextAuthFolders) {
        await createFolderSafely(path.join(outputDir, rel));
      }
      // middleware.ts at root
      const middlewarePath = path.join(outputDir, "middleware.ts");
      const middlewareContent = `export { default } from "next-auth/middleware";\nexport const config = { matcher: ["/path1/:path*", "/paht2/:path*"] };\n`;
      const writtenMiddleware = await writeFileSafely(
        middlewarePath,
        middlewareContent
      );
      if (!writtenMiddleware) skippedFiles.push(middlewarePath);
      // lib/auth/auth.ts
      const authTsPath = path.join(outputDir, "lib/auth/auth.ts");
      const authTsContent = `import { PrismaAdapter } from "@next-auth/prisma-adapter";\nimport GoogleProvider from "next-auth/providers/google";\nimport GitHubProvider from "next-auth/providers/github";\nimport CredentialsProvider from "next-auth/providers/credentials";\nimport bcrypt from "bcrypt";\nimport { NextAuthOptions } from "next-auth";\nimport prisma from "@/lib/prisma";\n\nexport const authOptions: NextAuthOptions = {\n  adapter: PrismaAdapter(prisma),\n  providers: [\n    GoogleProvider({\n      clientId: process.env.GOOGLE_CLIENT_ID!,\n      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,\n    }),\n    GitHubProvider({\n      clientId: process.env.GITHUB_ID!,\n      clientSecret: process.env.GITHUB_SECRET!,\n    }),\n    CredentialsProvider({\n      name: "Credentials",\n      credentials: {\n        email: { type: "email" },\n        password: { type: "password" },\n      },\n      async authorize(credentials) {\n        if (!credentials) return null;\n\n        const user = await prisma.user.findUnique({\n          where: { email: credentials.email },\n        });\n\n        if (!user || !user.password) {\n          throw new Error("Invalid email or password");\n        }\n\n        const validPassword = await bcrypt.compare(\n          credentials.password,\n          user.password\n        );\n        if (!validPassword) {\n          throw new Error("Invalid password");\n        }\n\n        return { id: user.id, email: user.email, name: user.name };\n      },\n    }),\n  ],\n  secret: process.env.NEXTAUTH_SECRET,\n  session: {\n    strategy: "jwt",\n  },\n  pages: {\n    signIn: "/login",\n  },\n  callbacks: {\n    async jwt({ token, user }) {\n      // on first login, user is the DB user object\n      if (user) {\n        token.id = user.id;\n      }\n      return token;\n    },\n    async session({ session, token }) {\n      // now make session.user.id available\n      if (token.id && session?.user) {\n        session.user.id = token.id as string;\n      }\n      return session;\n    },\n  },\n};\n`;
      const writtenAuthTs = await writeFileSafely(authTsPath, authTsContent);
      if (!writtenAuthTs) skippedFiles.push(authTsPath);
      // app/api/auth/[...nextauth]/route.ts
      const routeTsPath = path.join(
        outputDir,
        "app/api/auth/[...nextauth]/route.ts"
      );
      const routeTsContent = `import NextAuth from "next-auth";\nimport { authOptions } from "@/lib/auth/auth";\n\nconst handler = NextAuth(authOptions);\nexport { handler as GET, handler as POST };\n`;
      const writtenRouteTs = await writeFileSafely(routeTsPath, routeTsContent);
      if (!writtenRouteTs) skippedFiles.push(routeTsPath);
    }

    // Prisma scaffolding
    if (options.withPrisma) {
      const prismaPath = path.join(outputDir, "lib/prisma.ts");
      const prismaContent = `import { PrismaClient } from "@prisma/client/default.js";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
export default prisma;
`;
      const writtenPrisma = await writeFileSafely(prismaPath, prismaContent);
      if (!writtenPrisma) skippedFiles.push(prismaPath);

      // Create prisma folder and schema.prisma
      const prismaDir = path.join(outputDir, "prisma");
      await createFolderSafely(prismaDir);
      const schemaPath = path.join(prismaDir, "schema.prisma");
      let schemaContent = "";
      if (options.withNextAuth) {
        schemaContent = `generator client {
  provider = \"prisma-client-js\"
}

datasource db {
  provider = \"postgresql\" // Or \"mysql\", \"sqlite\", \"sqlserver\", \"mongodb\"
  url      = env(\"DATABASE_URL\")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  password      String?   // Keep your password field if using CredentialsProvider
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
`;
      } else {
        schemaContent = `generator client {
  provider = \"prisma-client-js\"
}

datasource db {
  provider = \"postgresql\" // Or \"mysql\", \"sqlite\", \"sqlserver\", \"mongodb\"
  url      = env(\"DATABASE_URL\")
}
`;
      }
      const writtenSchema = await writeFileSafely(schemaPath, schemaContent);
      if (!writtenSchema) skippedFiles.push(schemaPath);

      // Handle database creation and .env
      let databaseUrl = "";
      if (options.dbMode === "new" && options.dbType === "postgres") {
        const { dbName, dbUser, dbPassword, dbHost, dbPort } = options as any;
        try {
          await createDatabase({
            dbName,
            dbUser,
            dbPassword,
            dbHost,
            dbPort,
          });
        } catch (e) {
          console.warn(
            `⚠️ Could not create database automatically. Please ensure Postgres is running and you have permissions, or create the database manually.`
          );
        }
        databaseUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;
      } else if (options.dbMode === "existing" && options.databaseUrl) {
        databaseUrl = options.databaseUrl;
      }
      // Write or update .env
      if (databaseUrl) {
        const envPath = path.join(outputDir, ".env");
        let envContent = "";
        try {
          envContent = await fs.readFile(envPath, "utf-8");
        } catch {}
        // Replace or append DATABASE_URL
        if (/^DATABASE_URL=.*/m.test(envContent)) {
          envContent = envContent.replace(
            /^DATABASE_URL=.*/m,
            `DATABASE_URL="${databaseUrl}"`
          );
        } else {
          envContent +=
            (envContent.endsWith("\n") ? "" : "\n") +
            `DATABASE_URL="${databaseUrl}"\n`;
        }
        await fs.writeFile(envPath, envContent, "utf-8");
        console.log(`📝 .env updated with DATABASE_URL.`);
      }
    }

    // Write boilerplate MDX file if flag is passed
    if (options.withMdx) {
      const mdxPath = path.join(outputDir, "content/profile.mdx");
      const mdxTemplate = `# 👋 Welcome to My Profile\n\nThis MDX file was generated by ctgen.\nFeel free to edit this content.`;
      const written = await writeFileSafely(mdxPath, mdxTemplate);
      if (!written) {
        skippedFiles.push(mdxPath);
      }
    }

    // Tailwind CSS scaffolding
    if (options.withTailwind) {
      const tailwindCssPath = path.join(outputDir, "styles/tailwind.css");
      const tailwindCssContent = `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
`;
      const tailwindConfigPath = path.join(outputDir, "tailwind.config.ts");
      const tailwindConfigContent = `// tailwind.config.js
import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import containerQ from "@tailwindcss/container-queries";
import ripple from "tailwindcss-ripple";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./**/*.{ts,tsx,js,jsx,md,mdx}"],
  theme: {
    extend: {
      accents: {
        brand: "var(--brand-accent)",
      },
      colors: {
        brand: {
          background: "var(--brand-background)",
          surface: "var(--brand-surface)",
          accent: "var(--brand-accent)",
          tertiary: "var(--brand-tertiary)",
          vsdark: "var(--brand-vsdarker)",
          vsdarker: "var(--brand-vsdarker)",
          sage: "var(--brand-sage)",

          text: {
            default: "var(--text-brand)",
            secondary: "var(--text-brand-secondary)",
            muted: "var(--text-muted)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
        electro: "var(--font-electro)",
        lora: "var(--font-lora)",
        exo: "var(--font-exo)",
        mont: "var(--font-mont)",
      },

      backgroundImage: {
        "gradient-gold":
          "linear-gradient(135deg, var(--accent), var(--accent-dark))",
        "gradient-glow": "linear-gradient(145deg, var(--glow), var(--faint))",
        "gradient-surface":
          "linear-gradient(to bottom, var(--surface), var(--background))",
      },
    },
  },
  plugins: [typography, containerQ, ripple(), animate],
} satisfies Config;

`;
      const writtenTailwindCss = await writeFileSafely(
        tailwindCssPath,
        tailwindCssContent
      );
      if (!writtenTailwindCss) skippedFiles.push(tailwindCssPath);
      const writtenTailwindConfig = await writeFileSafely(
        tailwindConfigPath,
        tailwindConfigContent
      );
      if (!writtenTailwindConfig) skippedFiles.push(tailwindConfigPath);
    }

    // Always create common types, config, lib, utility, and hooks files
    const alwaysFiles = [
      {
        relPath: "types/index.ts",
        content: `// Common app types go here\n`,
      },
      {
        relPath: "config/index.ts",
        content: `// App configuration and constants go here\n`,
      },
      {
        relPath: "lib/theme.ts",
        content: `// lib/theme.ts\nexport function toggleTheme() {\n  if (typeof window === 'undefined') return;\n  const current = document.documentElement.classList.contains('dark');\n  document.documentElement.classList.toggle('dark', !current);\n}\n\nexport function setTheme(theme: 'light' | 'dark') {\n  if (typeof window === 'undefined') return;\n  document.documentElement.classList.toggle('dark', theme === 'dark');\n}\n\nexport function getTheme(): 'light' | 'dark' {\n  if (typeof window === 'undefined') return 'light';\n  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';\n}\n`,
      },
      {
        relPath: "lib/validation.ts",
        content: `// lib/validation.ts\nexport function isValidEmail(email: string): boolean {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}\n\nexport function isValidPassword(password: string, minLength = 8): boolean {\n  return typeof password === 'string' && password.length >= minLength;\n}\n`,
      },
      {
        relPath: "utility/formatDate.ts",
        content: `// utility/formatDate.ts\nexport function formatDate(date: Date | string, locale = 'en-US', options?: Intl.DateTimeFormatOptions): string {\n  const d = typeof date === 'string' ? new Date(date) : date;\n  return d.toLocaleDateString(locale, options);\n}\n`,
      },
      {
        relPath: "utility/copyToClipboard.ts",
        content: `// utility/copyToClipboard.ts\nexport async function copyToClipboard(text: string): Promise<void> {\n  if (typeof navigator !== 'undefined' && navigator.clipboard) {\n    await navigator.clipboard.writeText(text);\n  } else {\n    // fallback for older browsers\n    const textarea = document.createElement('textarea');\n    textarea.value = text;\n    document.body.appendChild(textarea);\n    textarea.select();\n    document.execCommand('copy');\n    document.body.removeChild(textarea);\n  }\n}\n`,
      },
      {
        relPath: "utility/sleep.ts",
        content: `// utility/sleep.ts\nexport function sleep(ms: number): Promise<void> {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n`,
      },
      {
        relPath: "hooks/useLocalStorage.ts",
        content: `// hooks/useLocalStorage.ts\nimport { useState, useEffect } from 'react';\n\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    if (typeof window === 'undefined') return initialValue;\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? (JSON.parse(item) as T) : initialValue;\n    } catch {\n      return initialValue;\n    }\n  });\n\n  useEffect(() => {\n    if (typeof window === 'undefined') return;\n    try {\n      window.localStorage.setItem(key, JSON.stringify(storedValue));\n    } catch {}\n  }, [key, storedValue]);\n\n  return [storedValue, setStoredValue] as const;\n}\n`,
      },
    ];
    for (const file of alwaysFiles) {
      const absPath = path.join(outputDir, file.relPath);
      const written = await writeFileSafely(absPath, file.content);
      if (!written) skippedFiles.push(absPath);
    }

    console.log(
      `✅ Next.js structure scaffolded successfully in ${outputDir}.`
    );
    if (skippedFiles.length > 0) {
      // Print skipped files in yellow
      const yellow = "\x1b[33m";
      const reset = "\x1b[0m";
      console.log(
        `${yellow}The following files already existed and were not created:${reset}`
      );
      for (const file of skippedFiles) {
        console.log(`${yellow}- ${file}${reset}`);
      }
    }
  } catch (error) {
    console.error("❌ Failed to scaffold Next.js structure:", error);
    throw error;
  }
}
