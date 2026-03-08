import { getBookings, login } from "@apiLibrary/requests";
import { test } from "@playwright/test";

test("has title", async ({ request }) => {
  const response = await login(request);
  const responseBody = await response.json();
  console.log(responseBody);

  const bookingsResponse = await getBookings(request);
  const bookingsResponseBody = await bookingsResponse.json();
  console.log(bookingsResponseBody);
});
