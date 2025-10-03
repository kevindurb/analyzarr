import { getAllFilesInDir } from '@/infrastructure/filesService';
import { prisma } from '@/infrastructure/prisma';

declare var self: Worker;

self.onmessage = async (event: MessageEvent<{ libraryId: string }>) => {
  console.log('Starting');
  const library = await prisma.library.findUniqueOrThrow({ where: { id: event.data.libraryId } });
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
