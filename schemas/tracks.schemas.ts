import { z } from "zod";

const trackSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  country: z.string().min(1),
  lengthKm: z.number(),
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
export const getTracksSuccessSchema = z.array(trackSchema);

export const getTrackByIdSuccessSchema = trackSchema;

export const createTrackSuccessSchema = trackSchema;

export const updateTrackSuccessSchema = trackSchema;

export const deleteTrackSuccessSchema = z.object({
  message: z.string().min(1),
  id: z.string().min(1),
});

//Error schemas
export const universalTrackErrorSchema = errorSchema;

export const trackValidationErrorSchema = validationErrorSchema;
