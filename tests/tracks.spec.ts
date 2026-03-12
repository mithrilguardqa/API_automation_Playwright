import { expect, test } from "@playwright/test";
import {
  expectToMatchSchema,
  softExpectToMatchSchema,
} from "helpers/helpers";
import {
  createTrackSuccessSchema,
  getTrackByIdSuccessSchema,
  getTracksSuccessSchema,
  trackValidationErrorSchema,
  universalTrackErrorSchema,
  updateTrackSuccessSchema,
} from "schemas/tracks.schemas";
import {
  createTrackRequest,
  deleteTrackRequest,
  getTrackByIdRequest,
  getTracksRequest,
  updateTrackRequest,
} from "@apiLibrary/tracks_requests";

test.describe("Tracks tests suite", () => {
  test("[P]Check user can get all tracks", async ({ request }) => {
    const response = await getTracksRequest(request);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, getTracksSuccessSchema);
  });

  test("[P]Check user can get track by id", async ({ request }) => {
    let trackId = "";

    await test.step("Get all tracks", async () => {
      const response = await getTracksRequest(request);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getTracksSuccessSchema);
      trackId = responseBody[0].id;
    });

    await test.step("Get track by id", async () => {
      const response = await getTrackByIdRequest(request, trackId);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expectToMatchSchema(responseBody, getTrackByIdSuccessSchema);
    });
  });

  test("[N]Check user receives proper error when getting track by invalid id", async ({
    request,
  }) => {
    const invalidTrackId = "invalid-track-id";
    const response = await getTrackByIdRequest(request, invalidTrackId);
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, universalTrackErrorSchema);
    expect(responseBody.message).toBe(`Track with id '${invalidTrackId}' not found`);
  });

  test("[P]Check user can create a new track", async ({ request }) => {
    let trackId = "";

    await test.step("Create track", async () => {
      const newTrack = {
        name: "Test Circuit",
        country: "Bulgaria",
        lengthKm: 5.4,
      };
      const response = await createTrackRequest(request, newTrack);
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createTrackSuccessSchema);
      trackId = responseBody.id;
    });

    await test.step("Cleanup - delete created track", async () => {
      if (trackId) await deleteTrackRequest(request, trackId);
    });
  });

  test("[N]Check user cannot create track with missing required fields", async ({ request }) => {
    const response = await createTrackRequest(request, { name: "Test" } as any);
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    await expectToMatchSchema(responseBody, trackValidationErrorSchema);
  });

  test("[P]Check user can update an existing track", async ({ request }) => {
    let trackId = "";

    await test.step("Create track", async () => {
      const newTrack = {
        name: "Update Test Circuit",
        country: "Germany",
        lengthKm: 3.2,
      };
      const response = await createTrackRequest(request, newTrack);
      expect.soft(response.status()).toBe(201);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, createTrackSuccessSchema);
      trackId = responseBody.id;
    });

    await test.step("Update track", async () => {
      const response = await updateTrackRequest(request, trackId, {
        name: "Updated Circuit Name",
      });
      expect.soft(response.status()).toBe(200);
      const responseBody = await response.json();
      await softExpectToMatchSchema(responseBody, updateTrackSuccessSchema);
      expect.soft(responseBody.name).toBe("Updated Circuit Name");
    });

    await test.step("Cleanup - delete created track", async () => {
      if (trackId) await deleteTrackRequest(request, trackId);
    });
  });
});
