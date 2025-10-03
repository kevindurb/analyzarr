import z from 'zod';
import { LibraryType } from '@/generated/prisma';

export const CreateLibraryBody = z.object({
  name: z.string(),
  type: z.enum([LibraryType.Movies, LibraryType.TvShows, LibraryType.Music, LibraryType.Other]),
  path: z.string(),
});
