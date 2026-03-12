import { expect, test } from "@playwright/test";
import {
  expectToMatchSchema,
  randomString,
  softExpectToMatchSchema,
} from "helpers/helpers";
import {
  createUserSuccessSchema,
  getUserByIdSuccessSchema,
  getUsersSuccessSchema,
  universalUserErrorSchema,
  updateUserSuccessSchema,
  userValidationErrorSchema,
} from "schemas/users.schemas";
import {
  createUserRequest,
  deleteUserRequest,
  getUserByIdRequest,
  getUsersRequest,
  updateUserRequest,
} from "@apiLibrary/users_requests";

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
      await expectToMatchSchema(responseBody, getUsersSuccessSchema);
      userId = responseBody[0].id;
    });

    await test.step("Get user details by id", async () => {
      const response = await getUserByIdRequest(request, userId);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getUserByIdSuccessSchema);
    });
  });

  test("[N]Check user receives proper error when getting user by invalid id", async ({
    request,
  }) => {
    const invalidUserId = "invalid-id";
    const response = await getUserByIdRequest(request, invalidUserId);
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, universalUserErrorSchema);
    expect(responseBody.message).toBe(`User with id '${invalidUserId}' not found`);
  });

  test("[P]Check user can create new user", async ({ request }) => {
    const suffix = randomString(6);
    const newUser = {
      username: `test-user-${suffix}`,
      email: `test-user-${suffix}@example.com`,
      password: "test123",
    };

    let userId = "";
    await test.step("Create user", async () => {
      const response = await createUserRequest(request, newUser);
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createUserSuccessSchema);
      userId = responseBody.id;
    });

    await test.step("Cleanup - delete created user", async () => {
      if (userId) await deleteUserRequest(request, userId);
    });
  });

  test("[N]Check user cannot create user with missing required fields", async ({ request }) => {
    const response = await createUserRequest(request, { password: "test123" } as any);
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, userValidationErrorSchema);
  });

  test("[P]Check user can update an existing user", async ({ request }) => {
    const suffix = randomString(6);
    let userId = "";

    await test.step("Create user", async () => {
      const newUser = {
        username: `update-test-${suffix}`,
        email: `update-test-${suffix}@example.com`,
        password: "test123",
      };
      const response = await createUserRequest(request, newUser);
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createUserSuccessSchema);
      userId = responseBody.id;
    });

    await test.step("Update user", async () => {
      const response = await updateUserRequest(request, userId, {
        username: `updated-user-${suffix}`,
      });
      expect.soft(response.status()).toBe(200);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, updateUserSuccessSchema);
      expect.soft(responseBody.username).toBe(`updated-user-${suffix}`);
    });

    await test.step("Cleanup - delete created user", async () => {
      if (userId) await deleteUserRequest(request, userId);
    });
  });

  test("[N]Check user cannot update a non-existent user", async ({ request }) => {
    const response = await updateUserRequest(request, "non-existent-id", {
      username: "updated",
    });
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, universalUserErrorSchema);
    expect(responseBody.message).toBe("User with id 'non-existent-id' not found");
  });

  test("[P]Check user can delete a user", async ({ request }) => {
    const suffix = randomString(6);
    let userId = "";

    await test.step("Create user", async () => {
      const newUser = {
        username: `delete-test-${suffix}`,
        email: `delete-test-${suffix}@example.com`,
        password: "test123",
      };
      const response = await createUserRequest(request, newUser);
      expect(response.status()).toBe(201);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, createUserSuccessSchema);
      userId = responseBody.id;
    });

    await test.step("Delete user", async () => {
      const response = await deleteUserRequest(request, userId);
      expect(response.status()).toBe(204);
    });

    await test.step("Verify user is deleted", async () => {
      const response = await getUserByIdRequest(request, userId);
      expect(response.status()).toBe(404);
    });
  });
});
