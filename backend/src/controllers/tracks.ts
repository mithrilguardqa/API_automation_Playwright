import type { Request, Response } from "express";
import * as tracksService from "../services/tracks.js";
import { sendValidationError, validateRequired, validateTypes } from "../middleware/validation.js";
import type { Track } from "../models/types.js";

function toTrackResponse(track: Track) {
  return {
    id: track.id,
    name: track.name,
    country: track.country,
    lengthKm: track.lengthKm,
  };
}

export function list(_req: Request, res: Response): void {
  const tracks = tracksService.getAllTracks().map(toTrackResponse);
  res.status(200).json(tracks);
}

export function getById(req: Request, res: Response): void {
  const { id } = req.params;
  const track = tracksService.getTrackById(id);
  if (!track) {
    res.status(404).json({ error: "Not Found", message: `Track with id '${id}' not found` });
    return;
  }
  res.status(200).json(toTrackResponse(track));
}

export function create(req: Request, res: Response): void {
  const errors = validateRequired(req.body, ["name", "country", "lengthKm"]);
  if (errors.length > 0) {
    sendValidationError(res, errors);
    return;
  }
  const typeErrors = validateTypes(req.body as Record<string, unknown>, [
    { field: "name", type: "string" },
    { field: "country", type: "string" },
    { field: "lengthKm", type: "number" },
  ]);
  if (typeErrors.length > 0) {
    sendValidationError(res, typeErrors);
    return;
  }
  try {
    const track = tracksService.createTrack(req.body as Omit<Track, "id">);
    res.status(201).json(toTrackResponse(track));
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: "Failed to create track" });
  }
}

export function update(req: Request, res: Response): void {
  const { id } = req.params;
  const typeErrors = validateTypes(req.body as Record<string, unknown>, [
    { field: "name", type: "string", required: false },
    { field: "country", type: "string", required: false },
    { field: "lengthKm", type: "number", required: false },
  ]);
  if (typeErrors.length > 0) {
    sendValidationError(res, typeErrors);
    return;
  }
  const track = tracksService.updateTrack(id, req.body as Partial<Omit<Track, "id">>);
  if (!track) {
    res.status(404).json({ error: "Not Found", message: `Track with id '${id}' not found` });
    return;
  }
  res.status(200).json(toTrackResponse(track));
}

export function remove(req: Request, res: Response): void {
  const { id } = req.params;
  const deleted = tracksService.deleteTrack(id);
  if (!deleted) {
    res.status(404).json({ error: "Not Found", message: `Track with id '${id}' not found` });
    return;
  }
  res.status(204).json({ message: "Track deleted successfully", id });
}
