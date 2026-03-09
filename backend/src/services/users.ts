import { v4 as uuidv4 } from "uuid";
import { store } from "../data/store.js";
import type { User } from "../models/types.js";

export function getAllUsers(): User[] {
  return Array.from(store.users.values());
}

export function getUserById(id: string): User | undefined {
  return store.users.get(id);
}

export function getUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  for (const user of store.users.values()) {
    if (user.email.trim().toLowerCase() === normalized) return user;
  }
  return undefined;
}

export function createUser(data: Omit<User, "id">): User {
  const id = uuidv4();
  const user: User = {
    id,
    username: data.username,
    password: data.password,
    email: data.email,
  };
  store.users.set(id, user);
  return user;
}

export function updateUser(id: string, data: Partial<Omit<User, "id">>): User | undefined {
  const existing = store.users.get(id);
  if (!existing) return undefined;
  const updated: User = {
    id,
    username: data.username ?? existing.username,
    password: data.password ?? existing.password,
    email: data.email ?? existing.email,
  };
  store.users.set(id, updated);
  return updated;
}

export function deleteUser(id: string): boolean {
  return store.users.delete(id);
}
