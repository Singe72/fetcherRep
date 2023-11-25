-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "report_id" TEXT NOT NULL PRIMARY KEY,
    "report_title" TEXT NOT NULL,
    "report_h1_id" INTEGER,
    "report_program" TEXT,
    "report_severity" TEXT,
    "report_reward" REAL,
    "report_disclosure" BOOLEAN NOT NULL DEFAULT false,
    "report_weakness" TEXT,
    "report_top_report" BOOLEAN NOT NULL DEFAULT false,
    "report_comment" TEXT NOT NULL DEFAULT '',
    "report_state" TEXT NOT NULL DEFAULT 'new'
);
INSERT INTO "new_Report" ("report_comment", "report_disclosure", "report_h1_id", "report_id", "report_program", "report_reward", "report_severity", "report_state", "report_title", "report_top_report", "report_weakness") SELECT "report_comment", "report_disclosure", "report_h1_id", "report_id", "report_program", "report_reward", "report_severity", "report_state", "report_title", "report_top_report", "report_weakness" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
