import type { User, Car, Track, LapRecord } from "../models/types.js";
import type { SessionStore } from "../models/types.js";

export interface AppStore {
  users: Map<string, User>;
  cars: Map<string, Car>;
  tracks: Map<string, Track>;
  records: Map<string, LapRecord>;
  sessions: SessionStore;
}

export function createStore(): AppStore {
  return {
    users: new Map(),
    cars: new Map(),
    tracks: new Map(),
    records: new Map(),
    sessions: new Map(),
  };
}

export let store: AppStore = createStore();

export function setStore(newStore: AppStore): void {
  store = newStore;
}
