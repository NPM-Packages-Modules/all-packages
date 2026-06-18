import pc from "picocolors";
import { deployTemplate } from "./index.js";

async function main() {
  const cmd = process.argv[2];
  if (cmd === "generate") {
    console.log(pc.green("deploy-template"), deployTemplate.generate().join(", "));
    return;
  }
  console.log(pc.cyan("deploy-template"), "generate");
  process.exit(cmd ? 1 : 0);
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
