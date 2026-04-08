-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_kanban_boards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "columns" TEXT NOT NULL DEFAULT '[{"id":"TODO","name":"A Fazer"},{"id":"IN_PROGRESS","name":"Em Progresso"},{"id":"DONE","name":"Concluído"}]',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "kanban_boards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_kanban_boards" ("createdAt", "description", "id", "name", "updatedAt", "userId") SELECT "createdAt", "description", "id", "name", "updatedAt", "userId" FROM "kanban_boards";
DROP TABLE "kanban_boards";
ALTER TABLE "new_kanban_boards" RENAME TO "kanban_boards";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
