import { expect, test } from "@playwright/test";
import {
  expectToMatchSchema,
  softExpectToMatchSchema,
} from "helpers/helpers";
import {
  createCarSuccessSchema,
  carValidationErrorSchema,
  getCarByIdSuccessSchema,
  getCarByUserIdSuccessSchema,
  getCarsByModelSuccessSchema,
  getCarsByNameSuccessSchema,
  getCarsSuccessSchema,
  universalCarErrorSchema,
  updateCarSuccessSchema,
} from "schemas/cars.schemas";
import { getUsersSuccessSchema } from "schemas/users.schemas";
import {
  createCarRequest,
  deleteCarRequest,
  getCarByIdRequest,
  getCarByUserIdRequest,
  getCarsByModelRequest,
  getCarsByNameRequest,
  getCarsRequest,
  updateCarRequest,
} from "@apiLibrary/cars_requests";
import { getUsersRequest } from "@apiLibrary/users_requests";

test.describe("Cars tests suite", () => {
  test("[P]Check user can get all cars", async ({ request }) => {
    const response = await getCarsRequest(request);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, getCarsSuccessSchema);
  });

  test("[P]Check user can get car by id", async ({ request }) => {
    let userId = "";
    let carId = "";

    await test.step("Get user list", async () => {
      const response = await getUsersRequest(request);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getUsersSuccessSchema);
      userId = responseBody[0].id;
    });

    await test.step("Get user cars list", async () => {
      const response = await getCarByUserIdRequest(request, userId);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getCarByUserIdSuccessSchema);
      carId = responseBody[0].id;
    });

    await test.step("Get car by id", async () => {
      const response = await getCarByIdRequest(request, carId);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getCarByIdSuccessSchema);
    });
  });

  test("[N]Check user receives proper error when getting car by invalid id", async ({
    request,
  }) => {
    const invalidCarId = "invalid-car-id";
    const response = await getCarByIdRequest(request, invalidCarId);
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, universalCarErrorSchema);
    expect(responseBody.message).toBe(`Car with id '${invalidCarId}' not found`);
  });

  test("[P]Check user can get cars by name", async ({ request }) => {
    let carName = "";

    await test.step("Get all cars to find a name", async () => {
      const response = await getCarsRequest(request);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getCarsSuccessSchema);
      carName = responseBody[0].name;
    });

    await test.step("Get cars by name", async () => {
      const response = await getCarsByNameRequest(request, carName);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getCarsByNameSuccessSchema);
    });
  });

  test("[P]Check user can get cars by model", async ({ request }) => {
    let carModel = "";

    await test.step("Get all cars to find a model", async () => {
      const response = await getCarsRequest(request);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getCarsSuccessSchema);
      carModel = responseBody[0].model;
    });

    await test.step("Get cars by model", async () => {
      const response = await getCarsByModelRequest(request, carModel);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getCarsByModelSuccessSchema);
    });
  });

  test("[P]Check user can create a new car", async ({ request }) => {
    let userId = "";
    let carId = "";

    await test.step("Get a valid user id", async () => {
      const response = await getUsersRequest(request);
      expect.soft(response.status()).toBe(200);
      const responseBody = await response.json();
      userId = responseBody[0].id;
    });

    await test.step("Create car", async () => {
      const newCar = {
        userId,
        name: "TestCar",
        model: "TestModel",
        year: 2024,
      };
      const response = await createCarRequest(request, newCar);
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createCarSuccessSchema);
      carId = responseBody.id;
    });

    await test.step("Cleanup - delete created car", async () => {
      if (carId) await deleteCarRequest(request, carId);
    });
  });

  test("[N]Check user cannot create car with missing required fields", async ({ request }) => {
    const response = await createCarRequest(request, { name: "TestCar" } as any);
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, carValidationErrorSchema);
  });

  test("[P]Check user can update an existing car", async ({ request }) => {
    let userId = "";
    let carId = "";

    await test.step("Get a valid user id", async () => {
      const response = await getUsersRequest(request);
      expect.soft(response.status()).toBe(200);
      const responseBody = await response.json();
      userId = responseBody[0].id;
    });

    await test.step("Create car", async () => {
      const newCar = {
        userId,
        name: "UpdateTestCar",
        model: "UpdateTestModel",
        year: 2024,
      };
      const response = await createCarRequest(request, newCar);
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createCarSuccessSchema);
      carId = responseBody.id;
    });

    await test.step("Update car", async () => {
      const response = await updateCarRequest(request, carId, {
        name: "UpdatedCarName",
      });
      expect.soft(response.status()).toBe(200);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, updateCarSuccessSchema);
      expect.soft(responseBody.name).toBe("UpdatedCarName");
    });

    await test.step("Cleanup - delete created car", async () => {
      if (carId) await deleteCarRequest(request, carId);
    });
  });

  test("[P]Check user can delete a car", async ({ request }) => {
    let userId = "";
    let carId = "";

    await test.step("Get a valid user id", async () => {
      const response = await getUsersRequest(request);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      userId = responseBody[0].id;
    });

    await test.step("Create car", async () => {
      const newCar = {
        userId,
        name: "DeleteTestCar",
        model: "DeleteTestModel",
        year: 2024,
      };
      const response = await createCarRequest(request, newCar);
      expect(response.status()).toBe(201);
      const responseBody = await response.json();
      carId = responseBody.id;
    });

    await test.step("Delete car", async () => {
      const response = await deleteCarRequest(request, carId);
      expect(response.status()).toBe(204);
    });

    await test.step("Verify car is deleted", async () => {
      const response = await getCarByIdRequest(request, carId);
      expect(response.status()).toBe(404);
    });
  });
});
