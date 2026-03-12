import { expect, test } from "@playwright/test";
import { expectToMatchSchema } from "helpers/helpers";
import {
    createUserSuccessSchema,
  getUserByIdSuccessSchema,
  getUsersSuccessSchema,
  universalUserErrorSchema,
} from "schemas/users.schemas";
import { createUserRequest, getUserByIdRequest, getUsersRequest } from "@apiLibrary/users_requests";

test.describe("Users tests suite", () => {
  test("[P]Check user can get all users list", async ({ request }) => {
    const response = await getUsersRequest(request);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    await expectToMatchSchema(responseBody, getUsersSuccessSchema);
  });

  test("[P]Check user can get user details by id", async ({ request }) => {
    let userId = "";
    await test.step("Get user list", async () => {
      const response = await getUsersRequest(request);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      console.log(responseBody);
      await expectToMatchSchema(responseBody, getUsersSuccessSchema);
      userId = responseBody[0].id;
      console.log(userId);
    });

    await test.step("Get user details by id", async () => {
      const response = await getUserByIdRequest(request, userId);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      console.log(responseBody);
      await expectToMatchSchema(responseBody, getUserByIdSuccessSchema);
    });
  });

  test("[N]Check user receive proper error message when trying to get user details by invalid id", async ({
    request,
  }) => {
    const invalidUserId = "invalid-id";

    const response = await getUserByIdRequest(request, invalidUserId);
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    console.log(responseBody);
    await expectToMatchSchema(responseBody, universalUserErrorSchema);
    expect(responseBody.message).toBe(`User with id '${invalidUserId}' not found`);
  });

  test("[P]Check user can create new user", async ({ request }) => {
    const newUser = {
      username: "test-user",
      email: "test-user@example.com",
      password: "test123",
    };
    const response = await createUserRequest(request, newUser);
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    console.log(responseBody);
    await expectToMatchSchema(responseBody, createUserSuccessSchema);
  });
});
