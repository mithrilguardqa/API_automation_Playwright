import type { Request, Response } from "express";
import * as usersService from "../services/users.js";
import { sendValidationError, validateRequired, validateTypes } from "../middleware/validation.js";
import type { User } from "../models/types.js";

function toPublicUser(u: User): Omit<User, "password"> {
  // Always keep response field order: id, username, email
  return {
    id: u.id,
    username: u.username,
    email: u.email,
  };
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
  const { email } = req.body as { email: string };
  if (usersService.getUserByEmail(email)) {
    res.status(409).json({
      error: "Conflict",
      message: "A user with this email already exists",
    });
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
  if ((req.body as Record<string, unknown>).id !== undefined) {
    res.status(403).json({
      error: "Forbidden",
      message: "User id cannot be changed",
    });
    return;
  }
  const typeErrors = validateTypes(req.body as Record<string, unknown>, [
    { field: "username", type: "string", required: false },
    { field: "password", type: "string", required: false },
    { field: "email", type: "string", required: false },
  ]);
  if (typeErrors.length > 0) {
    sendValidationError(res, typeErrors);
    return;
  }
  const body = req.body as Partial<Omit<User, "id">>;
  if (body.email !== undefined) {
    const existingByEmail = usersService.getUserByEmail(body.email);
    if (existingByEmail && existingByEmail.id !== id) {
      res.status(409).json({
        error: "Conflict",
        message: "A user with this email already exists",
      });
      return;
    }
  }
  const user = usersService.updateUser(id, body);
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
