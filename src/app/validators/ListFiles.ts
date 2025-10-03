import z from 'zod';

export const ListFilesQuery = z.object({
  fileType: z.string().optional(),
  libraryId: z.string().optional(),
});
