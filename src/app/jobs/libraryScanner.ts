import { Cron } from 'croner';
import { type File, getAllFilesInDir } from '@/infrastructure/filesService';
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
  const filesToCreate: File[] = [];

  for await (const file of getAllFilesInDir(library.path)) {
    console.log('Found File', file);
    foundPaths.push(file.filePath);
    const exists = library.files.find(({ filePath }) => file.filePath === filePath);
    if (!exists) filesToCreate.push(file);
  }

  await prisma.file.createMany({
    data: filesToCreate.map((file) => ({ ...file, libraryId: library.id })),
  });

  await prisma.file.deleteMany({
    where: { filePath: { notIn: foundPaths }, libraryId: library.id },
  });

  await libraryProber.run();

  console.log('Done scanning');
};
