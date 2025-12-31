/*
  Warnings:

  - You are about to alter the column `fileSize` on the `File` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "videoCodec" TEXT,
    "videoWidth" INTEGER,
    "videoHeight" INTEGER,
    "audioCodec" TEXT,
    "disableProbe" BOOLEAN NOT NULL DEFAULT false,
    "libraryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "File_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_File" ("audioCodec", "createdAt", "disableProbe", "filePath", "fileSize", "fileType", "id", "libraryId", "updatedAt", "videoCodec", "videoHeight", "videoWidth") SELECT "audioCodec", "createdAt", "disableProbe", "filePath", "fileSize", "fileType", "id", "libraryId", "updatedAt", "videoCodec", "videoHeight", "videoWidth" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_filePath_key" ON "File"("filePath");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
