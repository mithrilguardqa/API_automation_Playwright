import { createUserRequest, getUsersRequest } from "@apiLibrary/api_library";
import { test } from "@playwright/test";

test("Example - get records after login", async ({ request }) => {
  const users = await getUsersRequest(request);
  console.log(users);

  const newUser = {
    username: "mithril",
    password: "test123",
    email: "mithril@mithrilguard.com",
  };

  const createdUser = await createUserRequest(request, newUser);
  console.log(createdUser);
});
