import { Tmdb } from '@/generated/tmdb';
import { getTmdbApiKey } from '@/util/env';

export const tmdb = new Tmdb({ TOKEN: getTmdbApiKey() }).default;
