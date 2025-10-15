export const scanLibrary = (libraryId: string) => {
  const worker = new Worker(new URL('../workers/libraryScanner.ts', import.meta.url).href);
  worker.postMessage({ libraryId });
};
