import type { Request, Response } from "express";
import * as carsService from "../services/cars.js";
import { store } from "../data/store.js";
import { sendValidationError, validateRequired, validateTypes } from "../middleware/validation.js";
import type { Car } from "../models/types.js";

function toCarResponse(car: Car) {
  return {
    id: car.id,
    userId: car.userId,
    name: car.name,
    model: car.model,
    year: car.year,
  };
}

export function list(_req: Request, res: Response): void {
  const cars = carsService.getAllCars().map(toCarResponse);
  res.status(200).json(cars);
}

export function getById(req: Request, res: Response): void {
  const { id } = req.params;
  const car = carsService.getCarById(id);
  if (!car) {
    res.status(404).json({ error: "Not Found", message: `Car with id '${id}' not found` });
    return;
  }
  res.status(200).json(toCarResponse(car));
}

export function create(req: Request, res: Response): void {
  const errors = validateRequired(req.body, ["userId", "name", "model", "year"]);
  if (errors.length > 0) {
    sendValidationError(res, errors);
    return;
  }
  const typeErrors = validateTypes(req.body as Record<string, unknown>, [
    { field: "userId", type: "string" },
    { field: "name", type: "string" },
    { field: "model", type: "string" },
    { field: "year", type: "number" },
  ]);
  if (typeErrors.length > 0) {
    sendValidationError(res, typeErrors);
    return;
  }
  const { userId } = req.body as { userId: string };
  if (!store.users.has(userId)) {
    res.status(400).json({ error: "Bad Request", message: `User with id '${userId}' not found` });
    return;
  }
  try {
    const car = carsService.createCar(req.body as Omit<Car, "id">);
    res.status(201).json(toCarResponse(car));
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: "Failed to create car" });
  }
}

export function update(req: Request, res: Response): void {
  const { id } = req.params;
  const typeErrors = validateTypes(req.body as Record<string, unknown>, [
    { field: "userId", type: "string", required: false },
    { field: "name", type: "string", required: false },
    { field: "model", type: "string", required: false },
    { field: "year", type: "number", required: false },
  ]);
  if (typeErrors.length > 0) {
    sendValidationError(res, typeErrors);
    return;
  }
  const body = req.body as Partial<Omit<Car, "id">>;
  if (body.userId !== undefined && !store.users.has(body.userId)) {
    res.status(400).json({ error: "Bad Request", message: `User with id '${body.userId}' not found` });
    return;
  }
  const car = carsService.updateCar(id, body);
  if (!car) {
    res.status(404).json({ error: "Not Found", message: `Car with id '${id}' not found` });
    return;
  }
  res.status(200).json(toCarResponse(car));
}

export function remove(req: Request, res: Response): void {
  const { id } = req.params;
  const deleted = carsService.deleteCar(id);
  if (!deleted) {
    res.status(404).json({ error: "Not Found", message: `Car with id '${id}' not found` });
    return;
  }
  res.status(200).json({ message: "Car deleted successfully" });
}

export function getByUserId(req: Request, res: Response): void {
  const { userId } = req.params;
  const cars = carsService.getAllCars().filter((c) => c.userId === userId).map(toCarResponse);
  res.status(200).json(cars);
}

export function getByName(req: Request, res: Response): void {
  const { name } = req.params;
  const cars = carsService.getAllCars().filter((c) => c.name === name).map(toCarResponse);
  res.status(200).json(cars);
}

export function getByModel(req: Request, res: Response): void {
  const { model } = req.params;
  const cars = carsService.getAllCars().filter((c) => c.model === model).map(toCarResponse);
  res.status(200).json(cars);
}
