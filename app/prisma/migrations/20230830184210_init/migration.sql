-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "notification_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notification_name" TEXT NOT NULL,
    "notification_message" TEXT NOT NULL,
    "notification_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Notification" ("notification_id", "notification_message", "notification_name") SELECT "notification_id", "notification_message", "notification_name" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
