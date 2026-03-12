import { loginRequest, logoutRequest } from "@apiLibrary/auth_requests";
import { getUsersRequest } from "@apiLibrary/users_requests";
import config from "@env";
import { expect, test } from "@playwright/test";
import { expectToMatchSchema } from "helpers/helpers";
import {
  authValidationErrorSchema,
  loginErrorSchema,
  loginSuccessSchema,
  logoutErrorSchema,
  logoutSuccessSchema,
} from "schemas/auth.schemas";

test.describe("Authentication tests suite", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("[P]Check user can login successfully with valid credentials", async ({ request }) => {
    const response = await loginRequest(request, config.username, config.password);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, loginSuccessSchema);
  });

  test("[N]Check user cannot login with invalid credentials", async ({ request }) => {
    const response = await loginRequest(request, config.username, `${config.password}1`);
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, loginErrorSchema);
  });

  test("[N]Check user cannot login with empty credentials", async ({ request }) => {
    const response = await loginRequest(request, "", "");
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, authValidationErrorSchema);
  });

  test("[P]Check logout works properly", async ({ request }) => {
    await test.step("Login", async () => {
      const response = await loginRequest(request, config.username, config.password);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, loginSuccessSchema);
    });
    await test.step("Logout", async () => {
      const response = await logoutRequest(request);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, logoutSuccessSchema);
    });
  });

  test("[N]Check logout fails if not logged in", async ({ request }) => {
    const response = await logoutRequest(request);
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, logoutErrorSchema);
  });

  test("[N]Check user cannot access protected endpoint after logout", async ({ request }) => {
    await test.step("Login", async () => {
      const response = await loginRequest(request, config.username, config.password);
      expect(response.status()).toBe(200);
    });
    await test.step("Logout", async () => {
      const response = await logoutRequest(request);
      expect(response.status()).toBe(200);
    });
    await test.step("Attempt to access users endpoint", async () => {
      const response = await getUsersRequest(request);
      expect(response.status()).toBe(401);
    });
  });
});
