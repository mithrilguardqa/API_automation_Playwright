import { v4 as uuidv4 } from "uuid";
import { store } from "../data/store.js";
import type { Track } from "../models/types.js";

export function getAllTracks(): Track[] {
  return Array.from(store.tracks.values());
}

export function getTrackById(id: string): Track | undefined {
  return store.tracks.get(id);
}

export function createTrack(data: Omit<Track, "id">): Track {
  const id = uuidv4();
  const track: Track = { ...data, id };
  store.tracks.set(id, track);
  return track;
}

export function updateTrack(id: string, data: Partial<Omit<Track, "id">>): Track | undefined {
  const existing = store.tracks.get(id);
  if (!existing) return undefined;
  const updated: Track = { ...existing, ...data, id };
  store.tracks.set(id, updated);
  return updated;
}

export function deleteTrack(id: string): boolean {
  return store.tracks.delete(id);
}
