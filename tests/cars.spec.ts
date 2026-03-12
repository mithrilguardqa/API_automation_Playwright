import { getUsersRequest } from "@apiLibrary/users_requests";
import { expect, test } from "@playwright/test";
import { expectToMatchSchema } from "helpers/helpers";
import {
  getCarByIdSuccessSchema,
  getCarByUserIdSuccessSchema,
  getCarsSuccessSchema,
} from "schemas/cars.schemas";
import { getUsersSuccessSchema } from "schemas/users.schemas";
import {
  getCarByIdRequest,
  getCarByUserIdRequest,
  getCarsRequest,
} from "@apiLibrary/cars_requests";

test.describe("Cars tests suite", () => {
  test("[P]Check user can get all cars", async ({ request }) => {
    const response = await getCarsRequest(request);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody);
    await expectToMatchSchema(responseBody, getCarsSuccessSchema);
  });

  test("[P]Check user can get car by id", async ({ request }) => {
    let userId = "";
    let carId = "";

    await test.step("Get user list", async () => {
      const response = await getUsersRequest(request);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      console.log(responseBody);
      await expectToMatchSchema(responseBody, getUsersSuccessSchema);
      userId = responseBody[0].id;
      console.log(userId);
    });
    await test.step("Get user cars list", async () => {
      const response = await getCarByUserIdRequest(request, userId);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      console.log(responseBody);
      await expectToMatchSchema(responseBody, getCarByUserIdSuccessSchema);
      carId = responseBody[0].id;
      console.log(carId);
    });

    await test.step("Get car by id", async () => {
      const response = await getCarByIdRequest(request, carId);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      console.log(responseBody);
      await expectToMatchSchema(responseBody, getCarByIdSuccessSchema);
    });
  });
});
