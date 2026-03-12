import { expect } from "@playwright/test";
import { ZodSchema } from "zod";

export const randomString = (
  length?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13,
): string => {
  let timestampString: number = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);

  const validLength: number = length ? length : 13;

  return timestampString.toString().slice(-validLength);
};

/**
 * Expects the response body to match the schema
 * @param responseBody - The response body to validate
 * @param schema - The schema to validate the response body against
 * @returns void
 */
export const expectToMatchSchema = async (responseBody: any, schema: ZodSchema): Promise<void> => {
  let responseData;

  if (typeof responseBody.json === "function") {
    responseData = await responseBody.json();
  } else {
    responseData = responseBody;
  }

  const result = schema.safeParse(responseData);

  if (!result.success) {
    const errorMessages = result.error.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
        return `${path}${issue.message}`;
      })
      .join(", ");

    throw new Error(`Schema validation failed: ${errorMessages}`);
  }
};

/**
 * Soft version of expectToMatchSchema - does not stop test execution on failure
 * @param responseBody - The response body to validate
 * @param schema - The schema to validate the response body against
 */
export const softExpectToMatchSchema = async (responseBody: any, schema: ZodSchema): Promise<void> => {
  let responseData;

  if (typeof responseBody.json === "function") {
    responseData = await responseBody.json();
  } else {
    responseData = responseBody;
  }

  const result = schema.safeParse(responseData);

  if (!result.success) {
    const errorMessages = result.error.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
        return `${path}${issue.message}`;
      })
      .join(", ");

    expect.soft(false, `Schema validation failed: ${errorMessages}`).toBe(true);
  }
};

/**
 * Returns the current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};
