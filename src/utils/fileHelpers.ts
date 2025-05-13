// src/utils/fileHelpers.ts
import fs from "fs/promises";
import path from "path";

export async function createFolderSafely(folderPath: string): Promise<void> {
  try {
    await fs.mkdir(folderPath, { recursive: true });
    console.log(`📁 Created folder: ${folderPath}`);
  } catch (error: unknown) {
    console.error(`❌ Failed to create folder '${folderPath}':`, error);
    throw error;
  }
}

export async function writeFileSafely(
  filePath: string,
  content: string
): Promise<boolean> {
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.access(filePath);
      // File exists, skip writing
      return false;
    } catch {
      // File does not exist, write it
      await fs.writeFile(filePath, content, "utf-8");
      console.log(`📝 Created file: ${filePath}`);
      return true;
    }
  } catch (error: unknown) {
    console.error(`❌ Failed to write file '${filePath}':`, error);
    throw error;
  }
}
