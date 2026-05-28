/**
 * Enable pub.dev publishing for all packages under flutter/.
 * Removes publish_to: none and points repository/homepage at the monorepo.
 *
 *   node .scripts/patch-flutter-pubspecs.mjs
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("..", import.meta.url)), "flutter");
const MONO = "https://github.com/NPM-Packages-Modules/flutter";
const MAX_TOPICS = 5; // pub.dev limit

function capTopics(y) {
  const match = y.match(/^topics:\n((?:  - .+\n)+)/m);
  if (!match) return y;
  const lines = match[1].split("\n").filter((l) => l.trim());
  if (lines.length <= MAX_TOPICS) return y;
  const kept = lines.slice(0, MAX_TOPICS).join("\n") + "\n";
  return y.replace(match[0], `topics:\n${kept}`);
}

let n = 0;
for (const dir of readdirSync(ROOT)) {
  const pubspec = join(ROOT, dir, "pubspec.yaml");
  if (!existsSync(pubspec)) continue;

  let y = readFileSync(pubspec, "utf8");
  y = y.replace(/\r?\npublish_to:\s*none\s*\n/g, "\n");

  const repoBlock = `repository: ${MONO}
homepage: ${MONO}/tree/main/${dir}
issue_tracker: ${MONO}/issues
`;

  if (/^repository:/m.test(y)) {
    y = y.replace(/^repository:.*$/m, `repository: ${MONO}`);
    if (!/^homepage:/m.test(y)) y = y.trimEnd() + `\nhomepage: ${MONO}/tree/main/${dir}\n`;
    if (!/^issue_tracker:/m.test(y)) y = y.trimEnd() + `\nissue_tracker: ${MONO}/issues\n`;
  } else {
    y = y.trimEnd() + `\n\n${repoBlock}`;
  }

  y = capTopics(y);

  writeFileSync(pubspec, y.endsWith("\n") ? y : `${y}\n`);
  n++;
  console.log(`  patched ${dir}`);
}
console.log(`\n${n} pubspec.yaml file(s) ready for pub.dev.`);
