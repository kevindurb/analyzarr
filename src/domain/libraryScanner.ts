import type { Library } from '@/generated/prisma';
import { getAllFilesInDir } from '@/infrastructure/filesService';
import { prisma } from '@/infrastructure/prisma';

export const scanLibrary = async (library: Library) => {
  console.log('Scanning', library.path);
  const files = await getAllFilesInDir(library.path);

  for (const file of files) {
    console.log('Found File', file);
    await prisma.file.upsert({
      where: {
        filePath: file.filePath,
      },
      update: {
        ...file,
        libraryId: library.id,
      },
      create: {
        ...file,
        libraryId: library.id,
      },
    });
  }
};
