export const getSourcePath = () => {
  const sourcePath = process.env.SOURCE_PATH;
  if (!sourcePath) throw new Error('SOURCE_PATH env var missing');
  return sourcePath;
};

export const getTmdbApiKey = () => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error('TMDB_API_KEY env var missing');
  return apiKey;
};

export const getLibraryMoviesPath = () => {
  const libraryMoviesPath = process.env.LIBRARY_MOVIES_PATH;
  if (!libraryMoviesPath) throw new Error('LIBRARY_MOVIES_PATH env var missing');
  return libraryMoviesPath;
};

export const getLibraryTVShowsPath = () => {
  const libraryTvShowsPath = process.env.LIBRARY_TV_SHOWS_PATH;
  if (!libraryTvShowsPath) throw new Error('LIBRARY_TV_SHOWS_PATH env var missing');
  return libraryTvShowsPath;
};

export const getAppSecret = () => {
  const secret = process.env.APP_SECRET;
  if (!secret) throw new Error('APP_SECRET env var missing');
  return secret;
};
