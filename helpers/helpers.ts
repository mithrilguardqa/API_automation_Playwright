import { ZodSchema } from "zod";

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
