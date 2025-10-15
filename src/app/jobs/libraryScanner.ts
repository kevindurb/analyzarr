import { Cron } from 'croner';
import { prisma } from '@/infrastructure/prisma';

export const scanLibrary = (libraryId: string) => {
  const worker = new Worker(new URL('../workers/libraryScanner.ts', import.meta.url).href);
  worker.postMessage({ libraryId });
};

export const scanAllLibraries = async () => {
  const libraries = await prisma.library.findMany();
  for (const library of libraries) {
    scanLibrary(library.id);
  }
};

export const startSchedule = () => new Cron('0 * * * *', scanAllLibraries);
