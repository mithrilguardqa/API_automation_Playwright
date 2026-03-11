import type { Request, Response } from "express";
import { findUserByCredentials, createSession, destroySession, getUserIdBySession } from "../services/auth.js";
import { sendValidationError, validateRequired } from "../middleware/validation.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  sameSite: "lax" as const,
};

export function login(req: Request, res: Response): void {
  const errors = validateRequired(req.body, ["username", "password"]);
  if (errors.length > 0) {
    sendValidationError(res, errors);
    return;
  }
  const { username, password } = req.body as { username: string; password: string };
  const user = findUserByCredentials(username, password);
  if (!user) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid username or password" });
    return;
  }
  const sessionId = createSession(user.id);
  res.cookie("session", sessionId, COOKIE_OPTIONS);
  res.status(200).json({ message: "Login successful", userId: user.id });
}

export function logout(req: Request, res: Response): void {
  const sessionId = req.cookies?.session;
  if (!sessionId || !getUserIdBySession(sessionId)) {
    res.status(401).json({
      error: "Unauthorized",
      message: "User not logged in currently",
    });
    return;
  }
  destroySession(sessionId);
  res.clearCookie("session", { path: "/", httpOnly: true });
  res.status(200).json({ message: "Logged out successfully" });
}
