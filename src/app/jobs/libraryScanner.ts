const worker = new Worker('../workers/libraryScanner.ts');

export const scanLibrary = (libraryId: string) => {
  worker.postMessage({ libraryId });
};
