import { z } from "zod";

// Base car schema
const carSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  name: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int(),
});

const errorSchema = z.object({
  error: z.string().min(1),
  message: z.string().min(1),
});

// Success schemas
export const getCarsSuccessSchema = z.array(carSchema);

export const getCarByIdSuccessSchema = carSchema;

export const getCarByUserIdSuccessSchema = z.array(carSchema);

export const getCarsByModelSuccessSchema = z.array(carSchema);

export const createCarSuccessSchema = carSchema;

export const updateCarSuccessSchema = carSchema;

export const deleteCarSuccessSchema = z.object({
  message: z.string().min(1),
});

//Error schemas
export const universalCarErrorSchema = errorSchema;
