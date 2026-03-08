import type { User, Car, Track, LapRecord } from "../models/types.js";
import { createStore } from "./store.js";

const USER_IDS = {
  admin: "a0000001-0000-4000-8000-000000000001",
  alice: "a0000002-0000-4000-8000-000000000002",
  bob: "a0000003-0000-4000-8000-000000000003",
};

const CAR_IDS = [
  "b0000001-0000-4000-8000-000000000001",
  "b0000002-0000-4000-8000-000000000002",
  "b0000003-0000-4000-8000-000000000003",
  "b0000004-0000-4000-8000-000000000004",
  "b0000005-0000-4000-8000-000000000005",
];

const TRACK_IDS = [
  "c0000001-0000-4000-8000-000000000001",
  "c0000002-0000-4000-8000-000000000002",
  "c0000003-0000-4000-8000-000000000003",
  "c0000004-0000-4000-8000-000000000004",
  "c0000005-0000-4000-8000-000000000005",
];

const RECORD_IDS = [
  "d0000001-0000-4000-8000-000000000001",
  "d0000002-0000-4000-8000-000000000002",
  "d0000003-0000-4000-8000-000000000003",
  "d0000004-0000-4000-8000-000000000004",
  "d0000005-0000-4000-8000-000000000005",
  "d0000006-0000-4000-8000-000000000006",
  "d0000007-0000-4000-8000-000000000007",
  "d0000008-0000-4000-8000-000000000008",
  "d0000009-0000-4000-8000-000000000009",
  "d0000010-0000-4000-8000-000000000010",
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
