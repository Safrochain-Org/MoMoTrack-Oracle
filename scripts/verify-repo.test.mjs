import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

test("package.json declares MIT license", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(pkg.license, "MIT");
  assert.match(pkg.repository.url, /MoMoTrack-Oracle/);
});

test("CI workflow exists", () => {
  assert.ok(existsSync(join(root, ".github/workflows/ci.yml")));
});

test(".env.example documents required variables", () => {
  const env = readFileSync(join(root, ".env.example"), "utf8");
  for (const key of [
    "MOMOTRACK_NETWORK",
    "MOMOTRACK_ORACLE_URL",
    "MOMOTRACK_PROVIDER",
    "PROVIDER_API_KEY",
  ]) {
    assert.match(env, new RegExp(key));
  }
});

test(".gitignore excludes secrets", () => {
  const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
  assert.match(gitignore, /\.env/);
  assert.match(gitignore, /node_modules/);
});
