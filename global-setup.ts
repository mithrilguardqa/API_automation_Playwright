import { request } from "@playwright/test";
import config from "./env.config";
import fs from "fs";
import path from "path";

async function globalSetup() {
  const context = await request.newContext();
  const response = await context.post(`${config.baseUrl}/auth`, {
    data: { username: config.username, password: config.password },
  });
  const { token } = await response.json();

  const authDir = path.resolve(__dirname, ".auth");
  fs.mkdirSync(authDir, { recursive: true });
  fs.writeFileSync(path.resolve(authDir, "auth-token.json"), JSON.stringify({ token }));

  await context.dispose();
}

export default globalSetup;
