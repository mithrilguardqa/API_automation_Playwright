import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import config from "@env";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  globalSetup: require.resolve("./global-setup"),
  testDir: "./tests",
  globalTimeout: 300000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL: config.baseUrl,
    trace: "on-first-retry",
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    storageState: "./auth/auth.json",
    launchOptions: {
      args: ["--disable-web-security"],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
});
