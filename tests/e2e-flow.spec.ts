import { expect, test } from "@playwright/test";
import {
  getCurrentDate,
  randomString,
  softExpectToMatchSchema,
} from "helpers/helpers";
import { createUserRequest, deleteUserRequest } from "@apiLibrary/users_requests";
import { createCarRequest, deleteCarRequest } from "@apiLibrary/cars_requests";
import { createTrackRequest, deleteTrackRequest } from "@apiLibrary/tracks_requests";
import {
  createRecordRequest,
  deleteRecordRequest,
  getRecordByIdRequest,
} from "@apiLibrary/records_requests";
import { createUserSuccessSchema } from "schemas/users.schemas";
import { createCarSuccessSchema } from "schemas/cars.schemas";
import { createTrackSuccessSchema } from "schemas/tracks.schemas";
import {
  createRecordSuccessSchema,
  getRecordByIdSuccessSchema,
} from "schemas/records.schemas";

test.describe("End-to-end flow tests", () => {
  test("[P]Full flow: create user -> create car -> create track -> create record -> verify record", async ({
    request,
  }) => {
    const suffix: string = randomString(6);
    const today: string = getCurrentDate();
    let userId = "";
    let carId = "";
    let trackId = "";
    let recordId = "";

    await test.step("Create a new user", async () => {
      const response = await createUserRequest(request, {
        username: `e2e-user-${suffix}`,
        email: `e2e-user-${suffix}@example.com`,
        password: "e2e-test-pass",
      });
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createUserSuccessSchema);
      userId = responseBody.id;
    });

    await test.step("Create a car for the user", async () => {
      const response = await createCarRequest(request, {
        userId,
        name: "E2E Car",
        model: "E2E Model",
        year: 2025,
      });
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createCarSuccessSchema);
      carId = responseBody.id;
    });

    await test.step("Create a track", async () => {
      const response = await createTrackRequest(request, {
        name: `E2E Circuit ${suffix}`,
        country: "Monaco",
        lengthKm: 3.337,
      });
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createTrackSuccessSchema);
      trackId = responseBody.id;
    });

    await test.step("Create a lap record", async () => {
      const response = await createRecordRequest(request, {
        userId,
        carId,
        trackId,
        lapTime: 78.6,
        date: today,
      });
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createRecordSuccessSchema);
      recordId = responseBody.id;
    });

    await test.step("Verify the record can be retrieved", async () => {
      const response = await getRecordByIdRequest(request, recordId);
      expect.soft(response.status()).toBe(200);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, getRecordByIdSuccessSchema);
      expect.soft(responseBody.lapTime).toBe(78.6);
      expect.soft(responseBody.username).toBe(`e2e-user-${suffix}`);
      expect.soft(responseBody.car).toBe("E2E Car E2E Model");
      expect.soft(responseBody.track).toBe(`E2E Circuit ${suffix}`);
    });

    await test.step("Cleanup all created entities", async () => {
      if (recordId) await deleteRecordRequest(request, recordId);
      if (carId) await deleteCarRequest(request, carId);
      if (trackId) await deleteTrackRequest(request, trackId);
      if (userId) await deleteUserRequest(request, userId);
    });
  });
});
