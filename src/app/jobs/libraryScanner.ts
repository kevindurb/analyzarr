import { Cron } from 'croner';
import { type File, getAllFilesInDir } from '@/infrastructure/filesService';
import { prisma } from '@/infrastructure/prisma';
import * as libraryProber from './libraryProber';

export const run = async (libraryId: string) => {
  console.log('Starting Library Scanner');
  const library = await prisma.library.findUniqueOrThrow({
    where: { id: libraryId },
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
    data: filesToCreate.map((file) => ({
      ...file,
      fileSize: Math.floor(file.fileSize),
      libraryId: library.id,
    })),
  });

  await prisma.file.deleteMany({
    where: { filePath: { notIn: foundPaths }, libraryId: library.id },
  });
  console.log('Done scanning');

  libraryProber.run();
};

const scanAllLibraries = async () => {
  const libraries = await prisma.library.findMany();
  for (const library of libraries) {
    run(library.id);
  }
};

export const startSchedule = () => new Cron('0 * * * *', scanAllLibraries);
