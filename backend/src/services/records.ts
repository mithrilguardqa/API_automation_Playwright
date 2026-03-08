import { v4 as uuidv4 } from "uuid";
import { store } from "../data/store.js";
import type { LapRecord } from "../models/types.js";

export function getAllRecords(): LapRecord[] {
  return Array.from(store.records.values());
}

export function getRecordById(id: string): LapRecord | undefined {
  return store.records.get(id);
}

export function createRecord(data: Omit<LapRecord, "id">): LapRecord {
  const id = uuidv4();
  const record: LapRecord = { ...data, id };
  store.records.set(id, record);
  return record;
}

export function updateRecord(id: string, data: Partial<Omit<LapRecord, "id">>): LapRecord | undefined {
  const existing = store.records.get(id);
  if (!existing) return undefined;
  const updated: LapRecord = { ...existing, ...data, id };
  store.records.set(id, updated);
  return updated;
}

export function deleteRecord(id: string): boolean {
  return store.records.delete(id);
}
