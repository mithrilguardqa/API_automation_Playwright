import { z } from "zod";

//Success schemas
export const loginSuccessSchema = z.object({
  message: z.string().min(1),
  userId: z.string().min(1),
});

export const logoutSuccessSchema = z.object({
  message: z.string().min(1),
});

//Error schemas
export const loginErrorSchema = z.object({
  error: z.string().min(1),
  message: z.string().min(1),
});

export const logoutErrorSchema = z.object({
  error: z.string().min(1),
  message: z.string().min(1),
});

export const authValidationErrorSchema = z.object({
  error: z.string().min(1),
  message: z.string().min(1),
  details: z.array(
    z.object({
      field: z.string().min(1),
      message: z.string().min(1),
    }),
  ),
});
