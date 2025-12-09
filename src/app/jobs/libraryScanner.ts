import { Cron } from 'croner';
import { getAllFilesInDir } from '@/infrastructure/filesService';
import { prisma } from '@/infrastructure/prisma';
import * as libraryProber from './libraryProber';

declare var self: Worker;

export const run = (libraryId: string) => {
  const worker = new Worker(import.meta.url);
  worker.postMessage({ libraryId });
};

const scanAllLibraries = async () => {
  const libraries = await prisma.library.findMany();
  for (const library of libraries) {
    run(library.id);
  }
};

export const startSchedule = () => new Cron('0 * * * *', scanAllLibraries);

self.onmessage = async (event: MessageEvent<{ libraryId: string }>) => {
  console.log('Starting');
  const library = await prisma.library.findUniqueOrThrow({
    where: { id: event.data.libraryId },
    include: { files: true },
  });

  const foundPaths: string[] = [];

  for await (const file of getAllFilesInDir(library.path)) {
    console.log('Found File', file);
    foundPaths.push(file.filePath);
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
    const matchingFile = foundPaths.includes(file.filePath);
    if (!matchingFile) {
      console.log('Deleting missing file', file.filePath);
      await prisma.file.delete({ where: { filePath: file.filePath, libraryId: library.id } });
    }
  }

  await libraryProber.run();

  console.log('Done scanning');

  self.terminate();
};
