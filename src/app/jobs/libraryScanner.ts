const worker = new Worker(new URL('../workers/libraryScanner.ts', import.meta.url).href);

export const scanLibrary = (libraryId: string) => {
  worker.postMessage({ libraryId });
};
