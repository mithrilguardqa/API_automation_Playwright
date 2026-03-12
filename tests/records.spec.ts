import { expect, test } from "@playwright/test";
import {
  expectToMatchSchema,
  getCurrentDate,
  softExpectToMatchSchema,
} from "helpers/helpers";
import {
  createRecordSuccessSchema,
  getRecordByIdSuccessSchema,
  getRecordsSuccessSchema,
  recordValidationErrorSchema,
  universalRecordErrorSchema,
  updateRecordSuccessSchema,
} from "schemas/records.schemas";
import {
  createRecordRequest,
  deleteRecordRequest,
  getRecordByIdRequest,
  getRecordsRequest,
  updateRecordRequest,
} from "@apiLibrary/records_requests";
import { createUserRequest, deleteUserRequest } from "@apiLibrary/users_requests";
import { createCarRequest, deleteCarRequest } from "@apiLibrary/cars_requests";
import { createTrackRequest, deleteTrackRequest } from "@apiLibrary/tracks_requests";

test.describe("Records tests suite", () => {
  test("[P]Check user can get all records", async ({ request }) => {
    const response = await getRecordsRequest(request);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, getRecordsSuccessSchema);
  });

  test("[P]Check user can get record by id", async ({ request }) => {
    let recordId = "";

    await test.step("Get all records", async () => {
      const response = await getRecordsRequest(request);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getRecordsSuccessSchema);
      recordId = responseBody[0].id;
    });

    await test.step("Get record by id", async () => {
      const response = await getRecordByIdRequest(request, recordId);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getRecordByIdSuccessSchema);
    });
  });

  test("[N]Check user receives proper error when getting record by invalid id", async ({
    request,
  }) => {
    const invalidRecordId = "invalid-record-id";
    const response = await getRecordByIdRequest(request, invalidRecordId);
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, universalRecordErrorSchema);
    expect(responseBody.message).toBe(`Record with id '${invalidRecordId}' not found`);
  });

  test("[P]Check user can create a new record", async ({ request }) => {
    let userId = "";
    let carId = "";
    let trackId = "";
    let recordId = "";

    await test.step("Create user", async () => {
      const response = await createUserRequest(request, {
        username: "record-test-user",
        email: "record-test-user@example.com",
        password: "test123",
      });
      expect.soft(response.status()).toBe(201);
      userId = (await response.json()).id;
    });

    await test.step("Create car", async () => {
      const response = await createCarRequest(request, {
        userId,
        name: "RecordTestCar",
        model: "RecordTestModel",
        year: 2024,
      });
      expect.soft(response.status()).toBe(201);
      carId = (await response.json()).id;
    });

    await test.step("Create track", async () => {
      const response = await createTrackRequest(request, {
        name: "Record Test Circuit",
        country: "Italy",
        lengthKm: 4.8,
      });
      expect.soft(response.status()).toBe(201);
      trackId = (await response.json()).id;
    });

    await test.step("Create record", async () => {
      const response = await createRecordRequest(request, {
        userId,
        carId,
        trackId,
        lapTime: 92.5,
        date: getCurrentDate(),
      });
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createRecordSuccessSchema);
      recordId = responseBody.id;
    });

    await test.step("Cleanup", async () => {
      if (recordId) await deleteRecordRequest(request, recordId);
      if (carId) await deleteCarRequest(request, carId);
      if (trackId) await deleteTrackRequest(request, trackId);
      if (userId) await deleteUserRequest(request, userId);
    });
  });

  test("[N]Check user cannot create record with missing required fields", async ({ request }) => {
    const response = await createRecordRequest(request, { lapTime: 90 } as any);
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, recordValidationErrorSchema);
  });

  test("[N]Check user cannot create record with non-existent userId", async ({ request }) => {
    const response = await createRecordRequest(request, {
      userId: "non-existent-user",
      carId: "non-existent-car",
      trackId: "non-existent-track",
      lapTime: 90,
      date: getCurrentDate(),
    });
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, universalRecordErrorSchema);
    expect(responseBody.message).toBe("User with id 'non-existent-user' not found");
  });

  test("[P]Check user can update an existing record", async ({ request }) => {
    let userId = "";
    let carId = "";
    let trackId = "";
    let recordId = "";

    await test.step("Create user", async () => {
      const response = await createUserRequest(request, {
        username: "record-update-user",
        email: "record-update-user@example.com",
        password: "test123",
      });
      expect.soft(response.status()).toBe(201);
      userId = (await response.json()).id;
    });

    await test.step("Create car", async () => {
      const response = await createCarRequest(request, {
        userId,
        name: "UpdateRecordCar",
        model: "UpdateRecordModel",
        year: 2024,
      });
      expect.soft(response.status()).toBe(201);
      carId = (await response.json()).id;
    });

    await test.step("Create track", async () => {
      const response = await createTrackRequest(request, {
        name: "Update Record Circuit",
        country: "Spain",
        lengthKm: 4.6,
      });
      expect.soft(response.status()).toBe(201);
      trackId = (await response.json()).id;
    });

    await test.step("Create record", async () => {
      const response = await createRecordRequest(request, {
        userId,
        carId,
        trackId,
        lapTime: 95.0,
        date: getCurrentDate(),
      });
      expect.soft(response.status()).toBe(201);
      recordId = (await response.json()).id;
    });

    await test.step("Update record", async () => {
      const response = await updateRecordRequest(request, recordId, {
        lapTime: 88.3,
      });
      expect.soft(response.status()).toBe(200);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, updateRecordSuccessSchema);
      expect.soft(responseBody.lapTime).toBe(88.3);
    });

    await test.step("Cleanup", async () => {
      if (recordId) await deleteRecordRequest(request, recordId);
      if (carId) await deleteCarRequest(request, carId);
      if (trackId) await deleteTrackRequest(request, trackId);
      if (userId) await deleteUserRequest(request, userId);
    });
  });
});
