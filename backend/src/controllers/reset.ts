import type { Request, Response } from "express";
import { seedStore } from "../data/seed.js";
import { setStore } from "../data/store.js";

export function reset(_req: Request, res: Response): void {
  const newStore = seedStore();
  setStore(newStore);
  res.status(200).json({
    message: "All data has been reset to default seed state",
    users: newStore.users.size,
    cars: newStore.cars.size,
    tracks: newStore.tracks.size,
    records: newStore.records.size,
  });
}
