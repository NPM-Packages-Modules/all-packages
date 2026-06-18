import pc from "picocolors";
import { stackSync } from "./index.js";

async function main() {
  const cmd = process.argv[2];
  if (cmd === "check") {
    const r = stackSync.check({ client: ["/users/delete"], server: [] });
    console.log(pc.yellow(String(r.brokenEndpoints.length)), "broken endpoints found");
    r.brokenEndpoints.forEach((e) => console.log(" ", e));
    return;
  }
  console.log(pc.cyan("stack-sync"), "check");
  process.exit(cmd ? 1 : 0);
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
