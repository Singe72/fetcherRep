/*
  Warnings:

  - The primary key for the `Synchronisation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `synchrosation_id` on the `Synchronisation` table. All the data in the column will be lost.
  - Added the required column `synchronisation_id` to the `Synchronisation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Synchronisation" (
    "synchronisation_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_synchronising" BOOLEAN NOT NULL DEFAULT false,
    "last_synchronisation" DATETIME NOT NULL
);
INSERT INTO "new_Synchronisation" ("is_synchronising", "last_synchronisation") SELECT "is_synchronising", "last_synchronisation" FROM "Synchronisation";
DROP TABLE "Synchronisation";
ALTER TABLE "new_Synchronisation" RENAME TO "Synchronisation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
