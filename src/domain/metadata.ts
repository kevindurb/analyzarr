import path from 'node:path';
import {
  filenameParse,
  type ParsedFilename,
  type ParsedMovie,
  type ParsedShow,
} from '@ctrl/video-filename-parser';
import type { SourceFile } from '@/generated/prisma';
import { getRelativePath } from '@/util/file';

export type { ParsedFilename, ParsedShow, ParsedMovie };

export type MediaType = 'tv' | 'movie' | 'unknown';

/**
 * Guess media type (tv/movie) based on filename conventions.
 * @param filename - e.g. "Eureka.S01E02.1080p.mkv" or "Inception.2010.mkv"
 */
const guessMediaType = (filename: string): MediaType => {
  const lower = filename.toLowerCase();

  // Common TV patterns
  const tvPatterns = [
    /\bS\d{1,2}E\d{1,2}\b/i, // S01E02, s1e2
    /\b\d{1,2}x\d{1,2}\b/, // 1x02
    /\bseason[ ._-]?\d{1,2}\b/i, // Season 1
    /\bepisode[ ._-]?\d{1,3}\b/i, // Episode 12
  ];

  if (tvPatterns.some((re) => re.test(lower))) {
    return 'tv';
  }

  // Movie heuristic: often has a year
  if (/\b(19|20)\d{2}\b/.test(lower)) {
    return 'movie';
  }

  return 'unknown';
};

const getCleanFileName = (sourceFile: SourceFile): string => {
  const filePath = getRelativePath(sourceFile);
  const dir = path.basename(path.dirname(filePath));
  const base = path.basename(filePath, path.extname(filePath));

  if (dir === '.') return base;

  let combined = base;

  if (base.toLowerCase().startsWith(dir.toLowerCase())) {
    combined = base.slice(dir.length).trim();
  }

  return `${dir} ${combined}`.trim();
};

export const getMetadataForSourceFile = (sourceFile: SourceFile) => {
  const cleanName = getCleanFileName(sourceFile);

  return filenameParse(cleanName, guessMediaType(cleanName) === 'tv');
};

export const isTv = (metadata: ParsedFilename): metadata is ParsedShow =>
  'isTv' in metadata && metadata.isTv;
