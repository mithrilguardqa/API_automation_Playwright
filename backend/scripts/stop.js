const fs = require("node:fs");
const path = require("node:path");

const pidFile = path.join(process.cwd(), ".server.pid");

try {
  const pid = parseInt(fs.readFileSync(pidFile, "utf8").trim(), 10);
  process.kill(pid, "SIGTERM");
  fs.unlinkSync(pidFile);
  console.log(`Stopped server (PID ${pid})`);
} catch (err) {
  if (err.code === "ENOENT") {
    console.log("No server PID file found (server may not be running).");
  } else if (err.code === "ESRCH") {
    try {
      fs.unlinkSync(pidFile);
    } catch (_) {}
    console.log("Server process was not running.");
  } else {
    console.error("Failed to stop server:", err.message);
    process.exit(1);
  }
}
