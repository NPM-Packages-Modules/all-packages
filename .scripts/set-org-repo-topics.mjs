/**
 * Set GitHub topics on the 4 main org repos (including mern-packages).
 */
import { execFileSync } from "node:child_process";

const ORG = "NPM-Packages-Modules";

const REPOS = {
  "mern-packages": [
    "nodejs",
    "typescript",
    "observability",
    "merndev",
    "npm-pm",
    "mern-packages",
    "mern",
    "monorepo",
    "express",
    "mongodb",
    "cli",
    "schema",
    "migration",
  ],
  mern: ["nodejs", "typescript", "observability", "merndev", "npm-pm", "mern-packages", "mern", "express", "mongodb"],
  "react-native": [
    "react-native",
    "react",
    "mobile",
    "typescript",
    "observability",
    "merndev",
    "npm-pm",
    "mern-packages",
    "nodejs",
  ],
  flutter: ["flutter", "dart", "mobile", "pub", "mern-packages"],
};

for (const [repo, names] of Object.entries(REPOS)) {
  execFileSync("gh", ["api", "--method", "PUT", `repos/${ORG}/${repo}/topics`, "--input", "-"], {
    input: JSON.stringify({ names }),
    encoding: "utf8",
    stdio: ["pipe", "inherit", "inherit"],
  });
  console.log("OK", repo, "->", names.join(", "));
}
