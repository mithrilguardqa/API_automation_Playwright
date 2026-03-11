import { z } from "zod";

// Base user schema
const userSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
});

const errorSchema = z.object({
  error: z.string().min(1),
  message: z.string().min(1),
});

// Success schemas
export const getUsersSuccessSchema = z.array(userSchema);

export const getUserByIdSuccessSchema = userSchema;

export const createUserSuccessSchema = userSchema;

export const updateUserSuccessSchema = userSchema;

export const deleteUserSuccessSchema = z.object({
  message: z.string().min(1),
});

//Error schemas
export const universalUserErrorSchema = errorSchema;
