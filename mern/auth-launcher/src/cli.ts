import pc from "picocolors";
import { authLauncher } from "./index.js";

async function main() {
  const cmd = process.argv[2];
  if (cmd === "install") {
    const k = authLauncher.install();
    console.log(pc.green("auth-launcher"), k.features.join(", "));
    return;
  }
  console.log(pc.cyan("auth-launcher"), "install");
  process.exit(cmd ? 1 : 0);
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
