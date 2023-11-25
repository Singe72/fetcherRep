-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notification_name" TEXT NOT NULL,
    "notification_message" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User_Notification" (
    "user_notification_user_id" INTEGER NOT NULL,
    "user_notification_notification_id" INTEGER NOT NULL,
    "user_notification_read" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("user_notification_user_id", "user_notification_notification_id"),
    CONSTRAINT "User_Notification_user_notification_user_id_fkey" FOREIGN KEY ("user_notification_user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_Notification_user_notification_notification_id_fkey" FOREIGN KEY ("user_notification_notification_id") REFERENCES "Notification" ("notification_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Synchronisation" (
    "synchrosation_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "is_synchronising" BOOLEAN NOT NULL DEFAULT false,
    "last_synchronisation" DATETIME NOT NULL
);
