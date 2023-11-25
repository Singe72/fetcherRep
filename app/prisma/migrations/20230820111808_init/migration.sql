-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_email" TEXT NOT NULL,
    "user_username" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "user_updatedAt" DATETIME
);
INSERT INTO "new_User" ("user_createdAt", "user_email", "user_id", "user_password", "user_updatedAt", "user_username") SELECT "user_createdAt", "user_email", "user_id", "user_password", "user_updatedAt", "user_username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
