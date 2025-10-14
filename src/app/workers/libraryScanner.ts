import { getAllFilesInDir } from '@/infrastructure/filesService';
import { prisma } from '@/infrastructure/prisma';

declare var self: Worker;

self.onmessage = async (event: MessageEvent<{ libraryId: string }>) => {
  console.log('Starting');
  const library = await prisma.library.findUniqueOrThrow({
    where: { id: event.data.libraryId },
    include: { files: true },
  });
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

  for (const file of library.files) {
    const matchingFile = files.find(({ filePath }) => filePath === file.filePath);
    if (!matchingFile) {
      console.log('Deleting missing file', file.filePath);
      await prisma.file.delete({ where: { filePath: file.filePath, libraryId: library.id } });
    }
  }
};
