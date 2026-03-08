import type { Request, Response } from "express";
import * as usersService from "../services/users.js";
import { sendValidationError, validateRequired, validateTypes } from "../middleware/validation.js";
import type { User } from "../models/types.js";

function toPublicUser(u: User): Omit<User, "password"> {
  const { password: _, ...rest } = u;
  return rest;
}

export function list(_req: Request, res: Response): void {
  const users = usersService.getAllUsers().map(toPublicUser);
  res.status(200).json(users);
}

export function getById(req: Request, res: Response): void {
  const { id } = req.params;
  const user = usersService.getUserById(id);
  if (!user) {
    res.status(404).json({ error: "Not Found", message: `User with id '${id}' not found` });
    return;
  }
  res.status(200).json(toPublicUser(user));
}

export function create(req: Request, res: Response): void {
  const errors = validateRequired(req.body, ["username", "password", "email"]);
  if (errors.length > 0) {
    sendValidationError(res, errors);
    return;
  }
  const typeErrors = validateTypes(req.body as Record<string, unknown>, [
    { field: "username", type: "string" },
    { field: "password", type: "string" },
    { field: "email", type: "string" },
  ]);
  if (typeErrors.length > 0) {
    sendValidationError(res, typeErrors);
    return;
  }
  try {
    const user = usersService.createUser(req.body as Omit<User, "id">);
    res.status(201).json(toPublicUser(user));
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: "Failed to create user" });
  }
}

export function update(req: Request, res: Response): void {
  const { id } = req.params;
  const typeErrors = validateTypes(req.body as Record<string, unknown>, [
    { field: "username", type: "string", required: false },
    { field: "password", type: "string", required: false },
    { field: "email", type: "string", required: false },
  ]);
  if (typeErrors.length > 0) {
    sendValidationError(res, typeErrors);
    return;
  }
  const user = usersService.updateUser(id, req.body as Partial<Omit<User, "id">>);
  if (!user) {
    res.status(404).json({ error: "Not Found", message: `User with id '${id}' not found` });
    return;
  }
  res.status(200).json(toPublicUser(user));
}

export function remove(req: Request, res: Response): void {
  const { id } = req.params;
  const deleted = usersService.deleteUser(id);
  if (!deleted) {
    res.status(404).json({ error: "Not Found", message: `User with id '${id}' not found` });
    return;
  }
  res.status(200).json({ message: "User deleted successfully" });
}
