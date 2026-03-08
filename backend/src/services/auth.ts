import { v4 as uuidv4 } from "uuid";
import { store } from "../data/store.js";
import type { User } from "../models/types.js";

export function findUserByCredentials(username: string, password: string): User | undefined {
  for (const user of store.users.values()) {
    if (user.username === username && user.password === password) return user;
  }
  return undefined;
}

export function createSession(userId: string): string {
  const sessionId = uuidv4();
  store.sessions.set(sessionId, userId);
  return sessionId;
}

export function getUserIdBySession(sessionId: string): string | undefined {
  return store.sessions.get(sessionId);
}

export function destroySession(sessionId: string): void {
  store.sessions.delete(sessionId);
}
