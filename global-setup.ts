import { request } from "@playwright/test";
import config from "./env.config";
import { loginRequest } from "@apiLibrary/auth_requests";

async function globalSetup() {
  const context = await request.newContext();
  await loginRequest(context, config.username, config.password);
  await context.storageState({ path: "auth/auth.json" });

  await context.dispose();
}

export default globalSetup;
