import { v4 as uuidv4 } from "uuid";
import { store } from "../data/store.js";
import type { User } from "../models/types.js";

export function getAllUsers(): User[] {
  return Array.from(store.users.values());
}

export function getUserById(id: string): User | undefined {
  return store.users.get(id);
}

export function createUser(data: Omit<User, "id">): User {
  const id = uuidv4();
  const user: User = { ...data, id };
  store.users.set(id, user);
  return user;
}

export function updateUser(id: string, data: Partial<Omit<User, "id">>): User | undefined {
  const existing = store.users.get(id);
  if (!existing) return undefined;
  const updated: User = { ...existing, ...data, id };
  store.users.set(id, updated);
  return updated;
}

export function deleteUser(id: string): boolean {
  return store.users.delete(id);
}
