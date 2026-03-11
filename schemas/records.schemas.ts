import { z } from "zod";

//Base record schema
const recordSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  carId: z.string().min(1),
  trackId: z.string().min(1),
  time: z.number().int(),
});

const errorSchema = z.object({
  error: z.string().min(1),
  message: z.string().min(1),
});

//Success schemas
export const getRecordsSuccessSchema = z.array(recordSchema);

export const getRecordByIdSuccessSchema = recordSchema;

export const createRecordSuccessSchema = recordSchema;

export const updateRecordSuccessSchema = recordSchema;

export const deleteRecordSuccessSchema = z.object({
  message: z.string().min(1),
});

//Error schemas
export const universalRecordErrorSchema = errorSchema;
