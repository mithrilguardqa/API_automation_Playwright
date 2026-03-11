import { z } from "zod";

//Base track schema
const trackSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  location: z.string().min(1),
  length: z.number().int(),
});

const errorSchema = z.object({
  error: z.string().min(1),
  message: z.string().min(1),
});

//Success schemas
export const getTracksSuccessSchema = z.array(trackSchema);

export const getTrackByIdSuccessSchema = trackSchema;

export const createTrackSuccessSchema = trackSchema;

export const updateTrackSuccessSchema = trackSchema;

export const deleteTrackSuccessSchema = z.object({
  message: z.string().min(1),
});

//Error schemas
export const universalTrackErrorSchema = errorSchema;
