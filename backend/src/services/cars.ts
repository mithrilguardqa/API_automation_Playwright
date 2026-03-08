import { v4 as uuidv4 } from "uuid";
import { store } from "../data/store.js";
import type { Car } from "../models/types.js";

export function getAllCars(): Car[] {
  return Array.from(store.cars.values());
}

export function getCarById(id: string): Car | undefined {
  return store.cars.get(id);
}

export function createCar(data: Omit<Car, "id">): Car {
  const id = uuidv4();
  const car: Car = { ...data, id };
  store.cars.set(id, car);
  return car;
}

export function updateCar(id: string, data: Partial<Omit<Car, "id">>): Car | undefined {
  const existing = store.cars.get(id);
  if (!existing) return undefined;
  const updated: Car = { ...existing, ...data, id };
  store.cars.set(id, updated);
  return updated;
}

export function deleteCar(id: string): boolean {
  return store.cars.delete(id);
}
