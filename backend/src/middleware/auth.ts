import type { Request, Response, NextFunction } from "express";
import { getUserIdBySession } from "../services/auth.js";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const sessionId = req.cookies?.session;
  if (!sessionId) {
    res.status(401).json({ error: "Unauthorized", message: "Session cookie is missing" });
    return;
  }
  const userId = getUserIdBySession(sessionId);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid or expired session" });
    return;
  }
  (req as Request & { userId?: string }).userId = userId;
  next();
}
