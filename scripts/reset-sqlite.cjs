const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
for (const suffix of ["", "-journal", "-shm", "-wal"]) {
  const file = path.join(root, `healsync.db${suffix}`);
  if (fs.existsSync(file)) fs.rmSync(file);
}

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npm, ["run", "db:setup"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
