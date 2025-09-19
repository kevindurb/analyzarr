import path from 'node:path';

import type { SourceFile } from '@/generated/prisma';
import { getSourcePath } from './env';

export const getRelativePath = (sourceFile: SourceFile) => {
  const sourcePath = getSourcePath();
  return path.relative(sourcePath, sourceFile.filePath);
};
