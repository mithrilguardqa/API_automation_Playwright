import type { User, Car, Track, LapRecord } from "../models/types.js";
import { createStore } from "./store.js";

// Deterministic but realistic-looking UUIDs for seed data
const USER_IDS = {
  admin: "14282214-aa0b-45e5-9b11-80e60beaf2df",
  alice: "3c4f6e9b-0d21-4a3f-8215-9b2c7e4f1a01",
  bob: "8e2a5c7d-91f3-4c28-b4d7-3f9a1b2c5d02",
};

const CAR_IDS = [
  "5b8c3f21-7a64-4fd9-9e20-1c2d3e4f5a11",
  "9d0a2b3c-4e5f-4968-8a7b-2c3d4e5f6a22",
  "1f2e3d4c-5b6a-47c8-9d0e-3a4b5c6d7e33",
  "7a6b5c4d-3e2f-41d0-8c9b-4d5e6f7a8b44",
  "c1d2e3f4-a5b6-4c7d-9e0f-5a6b7c8d9e55",
];

const TRACK_IDS = [
  "0a1b2c3d-4e5f-4678-9a0b-6c7d8e9f0011",
  "1b2c3d4e-5f60-4718-9a2b-7c8d9e0f1122",
  "2c3d4e5f-6071-4828-9a3b-8c9d0e1f2233",
  "3d4e5f60-7182-4938-9a4b-9c0d1e2f3344",
  "4e5f6071-8293-4a48-9a5b-ad1e2f304455",
];

const RECORD_IDS = [
  "51a2b3c4-d5e6-4789-8a9b-0c1d2e3f4001",
  "51a2b3c4-d5e6-4789-8a9b-0c1d2e3f4002",
  "51a2b3c4-d5e6-4789-8a9b-0c1d2e3f4003",
  "51a2b3c4-d5e6-4789-8a9b-0c1d2e3f4004",
  "51a2b3c4-d5e6-4789-8a9b-0c1d2e3f4005",
  "51a2b3c4-d5e6-4789-8a9b-0c1d2e3f4006",
  "51a2b3c4-d5e6-4789-8a9b-0c1d2e3f4007",
  "51a2b3c4-d5e6-4789-8a9b-0c1d2e3f4008",
  "51a2b3c4-d5e6-4789-8a9b-0c1d2e3f4009",
  "51a2b3c4-d5e6-4789-8a9b-0c1d2e3f4010",
];

export function getSeedUsers(): User[] {
  return [
    { id: USER_IDS.admin, username: "admin", password: "password", email: "admin@racing.local" },
    { id: USER_IDS.alice, username: "alice", password: "alice123", email: "alice@racing.local" },
    { id: USER_IDS.bob, username: "bob", password: "bob123", email: "bob@racing.local" },
  ];
}

export function getSeedCars(): Car[] {
  return [
    { id: CAR_IDS[0], userId: USER_IDS.admin, name: "Thunder", model: "GT-X", year: 2024 },
    { id: CAR_IDS[1], userId: USER_IDS.admin, name: "Shadow", model: "Sport 2", year: 2023 },
    { id: CAR_IDS[2], userId: USER_IDS.alice, name: "Blaze", model: "Racer Pro", year: 2024 },
    { id: CAR_IDS[3], userId: USER_IDS.bob, name: "Storm", model: "Turbo", year: 2022 },
    { id: CAR_IDS[4], userId: USER_IDS.bob, name: "Flash", model: "Lightning", year: 2023 },
  ];
}

export function getSeedTracks(): Track[] {
  return [
    { id: TRACK_IDS[0], name: "Silverstone", country: "UK", lengthKm: 5.891 },
    { id: TRACK_IDS[1], name: "Monza", country: "Italy", lengthKm: 5.793 },
    { id: TRACK_IDS[2], name: "Spa-Francorchamps", country: "Belgium", lengthKm: 7.004 },
    { id: TRACK_IDS[3], name: "Nürburgring Nordschleife", country: "Germany", lengthKm: 20.832 },
    { id: TRACK_IDS[4], name: "Laguna Seca", country: "USA", lengthKm: 3.602 },
  ];
}

export function getSeedRecords(): LapRecord[] {
  return [
    { id: RECORD_IDS[0], userId: USER_IDS.admin, carId: CAR_IDS[0], trackId: TRACK_IDS[0], lapTime: 91.34, date: "2026-03-08" },
    { id: RECORD_IDS[1], userId: USER_IDS.admin, carId: CAR_IDS[0], trackId: TRACK_IDS[1], lapTime: 88.12, date: "2026-03-07" },
    { id: RECORD_IDS[2], userId: USER_IDS.admin, carId: CAR_IDS[1], trackId: TRACK_IDS[0], lapTime: 92.01, date: "2026-03-06" },
    { id: RECORD_IDS[3], userId: USER_IDS.alice, carId: CAR_IDS[2], trackId: TRACK_IDS[2], lapTime: 125.45, date: "2026-03-05" },
    { id: RECORD_IDS[4], userId: USER_IDS.alice, carId: CAR_IDS[2], trackId: TRACK_IDS[3], lapTime: 512.78, date: "2026-03-04" },
    { id: RECORD_IDS[5], userId: USER_IDS.bob, carId: CAR_IDS[3], trackId: TRACK_IDS[0], lapTime: 89.56, date: "2026-03-03" },
    { id: RECORD_IDS[6], userId: USER_IDS.bob, carId: CAR_IDS[3], trackId: TRACK_IDS[4], lapTime: 78.23, date: "2026-03-02" },
    { id: RECORD_IDS[7], userId: USER_IDS.bob, carId: CAR_IDS[4], trackId: TRACK_IDS[1], lapTime: 87.9, date: "2026-03-01" },
    { id: RECORD_IDS[8], userId: USER_IDS.admin, carId: CAR_IDS[0], trackId: TRACK_IDS[4], lapTime: 79.11, date: "2026-03-08" },
    { id: RECORD_IDS[9], userId: USER_IDS.alice, carId: CAR_IDS[2], trackId: TRACK_IDS[0], lapTime: 90.0, date: "2026-03-07" },
  ];
}

export function seedStore(): ReturnType<typeof createStore> {
  const newStore = createStore();
  for (const u of getSeedUsers()) newStore.users.set(u.id, u);
  for (const c of getSeedCars()) newStore.cars.set(c.id, c);
  for (const t of getSeedTracks()) newStore.tracks.set(t.id, t);
  for (const r of getSeedRecords()) newStore.records.set(r.id, r);
  return newStore;
}
