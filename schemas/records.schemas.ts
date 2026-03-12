import { z } from "zod";

const recordSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  car: z.string().min(1),
  track: z.string().min(1),
  lapTime: z.number(),
  date: z.string().min(1),
});

const errorSchema = z.object({
  error: z.string().min(1),
  message: z.string().min(1),
});

const validationErrorSchema = z.object({
  error: z.string().min(1),
  message: z.string().min(1),
  details: z.array(
    z.object({
      field: z.string().min(1),
      message: z.string().min(1),
    }),
  ),
});

//Success schemas
export const getRecordsSuccessSchema = z.array(recordSchema);

export const getRecordByIdSuccessSchema = recordSchema;

export const createRecordSuccessSchema = recordSchema;

export const updateRecordSuccessSchema = recordSchema;

export const deleteRecordSuccessSchema = z.object({
  message: z.string().min(1),
  id: z.string().min(1),
});

//Error schemas
export const universalRecordErrorSchema = errorSchema;

export const recordValidationErrorSchema = validationErrorSchema;
