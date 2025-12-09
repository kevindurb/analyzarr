import fs from 'node:fs/promises';
import path from 'node:path';

export type File = {
  filePath: string;
  fileSize: number;
  fileType: string;
};

export async function* getAllFilesInDir(dir: string): AsyncGenerator<File> {
  console.log('Indexing directory', dir);
  const files: File[] = [];

  try {
    for (const file of await fs.readdir(dir)) {
      if (path.basename(file).startsWith('.')) continue;
      try {
        const fullPath = path.resolve(dir, file);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          for await (const file of getAllFilesInDir(fullPath)) {
            yield file;
          }
        } else {
          console.log('Found file', file);
          yield {
            filePath: fullPath,
            fileSize: stat.size,
            fileType: path.extname(fullPath).substring(1),
          };
        }
      } catch (err) {
        console.warn('Error reading file', file, err);
      }
    }
  } catch (err) {
    console.warn('Error reading directory', dir, err);
  }

  return files;
}
