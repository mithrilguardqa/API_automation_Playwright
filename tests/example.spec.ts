import { test } from "@playwright/test";

test("Example - get records after login", async ({ request }) => {
  await request.post("/login", {
    data: { username: "admin", password: "password" },
  });

  const response = await request.get("/records");
  const responseBody = await response.json();
  console.log(responseBody);
});
