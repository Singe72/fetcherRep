-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_email" TEXT NOT NULL,
    "user_username" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_createdAt" DATETIME NOT NULL,
    "user_updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Report" (
    "report_id" TEXT NOT NULL PRIMARY KEY,
    "report_title" TEXT NOT NULL,
    "report_h1_id" INTEGER,
    "report_program" TEXT,
    "report_severity" TEXT,
    "report_reward" REAL,
    "report_disclosure" BOOLEAN NOT NULL DEFAULT false,
    "report_weakness" TEXT NOT NULL DEFAULT '',
    "report_top_report" BOOLEAN NOT NULL DEFAULT false,
    "report_comment" TEXT NOT NULL DEFAULT '',
    "report_state" TEXT NOT NULL DEFAULT 'new'
);

-- CreateTable
CREATE TABLE "Vulnerability" (
    "vulnerability_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vulnerability_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Report_Vulnerability" (
    "report_vulnerability_report_id" TEXT NOT NULL,
    "report_vulnerability_vulnerability_id" INTEGER NOT NULL,

    PRIMARY KEY ("report_vulnerability_report_id", "report_vulnerability_vulnerability_id"),
    CONSTRAINT "Report_Vulnerability_report_vulnerability_report_id_fkey" FOREIGN KEY ("report_vulnerability_report_id") REFERENCES "Report" ("report_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_Vulnerability_report_vulnerability_vulnerability_id_fkey" FOREIGN KEY ("report_vulnerability_vulnerability_id") REFERENCES "Vulnerability" ("vulnerability_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");
