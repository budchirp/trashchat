-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "plus" BOOLEAN NOT NULL DEFAULT false,
    "credits" INTEGER NOT NULL DEFAULT 50,
    "premiumCredits" INTEGER NOT NULL DEFAULT 0,
    "systemPrompt" TEXT NOT NULL DEFAULT '',
    "shareInfoWithAI" BOOLEAN NOT NULL DEFAULT true,
    "firstUsage" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("created_at", "credits", "email", "firstUsage", "id", "name", "password", "plus", "premiumCredits", "profilePicture", "shareInfoWithAI", "systemPrompt", "updated_at", "username", "verificationToken", "verified") SELECT "created_at", "credits", "email", "firstUsage", "id", "name", "password", "plus", "premiumCredits", "profilePicture", "shareInfoWithAI", "systemPrompt", "updated_at", "username", "verificationToken", "verified" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
