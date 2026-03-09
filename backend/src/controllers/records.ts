import type { Request, Response } from "express";
import * as recordsService from "../services/records.js";
import { store } from "../data/store.js";
import { sendValidationError, validateRequired, validateTypes } from "../middleware/validation.js";
import type { LapRecord } from "../models/types.js";

function toRecordResponse(record: LapRecord) {
  const user = store.users.get(record.userId);
  const car = store.cars.get(record.carId);
  const track = store.tracks.get(record.trackId);

  return {
    id: record.id,
    username: user?.username ?? record.userId,
    car: car ? `${car.name} ${car.model}` : record.carId,
    track: track?.name ?? record.trackId,
    lapTime: record.lapTime,
    date: record.date,
  };
}

export function list(_req: Request, res: Response): void {
  const records = recordsService.getAllRecords().map(toRecordResponse);
  res.status(200).json(records);
}

export function getById(req: Request, res: Response): void {
  const { id } = req.params;
  const record = recordsService.getRecordById(id);
  if (!record) {
    res.status(404).json({ error: "Not Found", message: `Record with id '${id}' not found` });
    return;
  }
  res.status(200).json(toRecordResponse(record));
}

export function create(req: Request, res: Response): void {
  const errors = validateRequired(req.body, ["userId", "carId", "trackId", "lapTime", "date"]);
  if (errors.length > 0) {
    sendValidationError(res, errors);
    return;
  }
  const typeErrors = validateTypes(req.body as Record<string, unknown>, [
    { field: "userId", type: "string" },
    { field: "carId", type: "string" },
    { field: "trackId", type: "string" },
    { field: "lapTime", type: "number" },
    { field: "date", type: "string" },
  ]);
  if (typeErrors.length > 0) {
    sendValidationError(res, typeErrors);
    return;
  }
  const { userId, carId, trackId } = req.body as { userId: string; carId: string; trackId: string };
  if (!store.users.has(userId)) {
    res.status(400).json({ error: "Bad Request", message: `User with id '${userId}' not found` });
    return;
  }
  if (!store.cars.has(carId)) {
    res.status(400).json({ error: "Bad Request", message: `Car with id '${carId}' not found` });
    return;
  }
  if (!store.tracks.has(trackId)) {
    res.status(400).json({ error: "Bad Request", message: `Track with id '${trackId}' not found` });
    return;
  }
  try {
    const record = recordsService.createRecord(req.body as Omit<LapRecord, "id">);
    res.status(201).json(toRecordResponse(record));
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: "Failed to create record" });
  }
}

export function update(req: Request, res: Response): void {
  const { id } = req.params;
  const typeErrors = validateTypes(req.body as Record<string, unknown>, [
    { field: "userId", type: "string", required: false },
    { field: "carId", type: "string", required: false },
    { field: "trackId", type: "string", required: false },
    { field: "lapTime", type: "number", required: false },
    { field: "date", type: "string", required: false },
  ]);
  if (typeErrors.length > 0) {
    sendValidationError(res, typeErrors);
    return;
  }
  const body = req.body as Partial<Omit<LapRecord, "id">>;
  if (body.userId !== undefined && !store.users.has(body.userId)) {
    res.status(400).json({ error: "Bad Request", message: `User with id '${body.userId}' not found` });
    return;
  }
  if (body.carId !== undefined && !store.cars.has(body.carId)) {
    res.status(400).json({ error: "Bad Request", message: `Car with id '${body.carId}' not found` });
    return;
  }
  if (body.trackId !== undefined && !store.tracks.has(body.trackId)) {
    res.status(400).json({ error: "Bad Request", message: `Track with id '${body.trackId}' not found` });
    return;
  }
  const record = recordsService.updateRecord(id, body);
  if (!record) {
    res.status(404).json({ error: "Not Found", message: `Record with id '${id}' not found` });
    return;
  }
  res.status(200).json(toRecordResponse(record));
}

export function remove(req: Request, res: Response): void {
  const { id } = req.params;
  const deleted = recordsService.deleteRecord(id);
  if (!deleted) {
    res.status(404).json({ error: "Not Found", message: `Record with id '${id}' not found` });
    return;
  }
  res.status(200).json({ message: "Record deleted successfully" });
}
