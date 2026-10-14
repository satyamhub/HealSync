const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const root = path.resolve(__dirname, "..");
const databasePath = path.join(root, "healsync.db");
const migrationName = "20261014000000_init_sqlite";
const migrationPath = path.join(
  root,
  "prisma",
  "migrations-sqlite",
  migrationName,
  "migration.sql",
);
const migrationSql = fs.readFileSync(migrationPath, "utf8");
const db = new Database(databasePath);

try {
  db.pragma("foreign_keys = ON");
  const userTable = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'User'")
    .get();

  if (!userTable) {
    db.exec(migrationSql);
    console.log("Created SQLite tables.");
  } else {
    console.log("SQLite tables already exist.");
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "checksum" TEXT NOT NULL,
      "finished_at" DATETIME,
      "migration_name" TEXT NOT NULL,
      "logs" TEXT,
      "rolled_back_at" DATETIME,
      "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    )
  `);

  const applied = db
    .prepare('SELECT id FROM "_prisma_migrations" WHERE migration_name = ?')
    .get(migrationName);

  if (!applied) {
    db.prepare(`
      INSERT INTO "_prisma_migrations"
        (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
      VALUES (?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP, 1)
    `).run(
      crypto.randomUUID(),
      crypto.createHash("sha256").update(migrationSql).digest("hex"),
      migrationName,
    );
  }
} finally {
  db.close();
}
