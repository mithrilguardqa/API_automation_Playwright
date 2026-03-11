import { loginRequest } from "@apiLibrary/api_library";
import config from "@env";
import { expect, test } from "@playwright/test";

test.describe("Authentication tests suite", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("[P]Check user can login successfully with valid credentials", async ({ request }) => {
    const response = await loginRequest(request, config.username, config.password);
    expect(response.status()).toBe(200);
    expect(response.body()).toBe(true);
  });
});
