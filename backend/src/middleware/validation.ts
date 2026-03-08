import type { Request, Response, NextFunction } from "express";

export interface ValidationError {
  field: string;
  message: string;
}

export function sendValidationError(res: Response, errors: ValidationError[], status = 400): void {
  res.status(status).json({
    error: "Validation failed",
    message: errors.length === 1 ? errors[0].message : "Invalid request body",
    details: errors,
  });
}

export function validateRequired(body: unknown, fields: string[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const obj = body as Record<string, unknown>;
  if (!body || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be a JSON object" }];
  }
  for (const field of fields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
      errors.push({ field, message: `Field '${field}' is required` });
    }
  }
  return errors;
}

export function validateTypes(
  body: Record<string, unknown>,
  schema: { field: string; type: "string" | "number" | "boolean"; required?: boolean }[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const { field, type, required = true } of schema) {
    const value = body[field];
    if (value === undefined || value === null) {
      if (required) errors.push({ field, message: `Field '${field}' is required` });
      continue;
    }
    const actual = typeof value;
    if (actual !== type) {
      errors.push({ field, message: `Field '${field}' must be of type ${type}, got ${actual}` });
    }
  }
  return errors;
}
