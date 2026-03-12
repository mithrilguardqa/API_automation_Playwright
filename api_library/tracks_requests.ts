import { APIRequestContext, APIResponse } from "@playwright/test";
import config from "@env";
import { EntryPoint } from "./routes";
import { Track } from "backend/src/models/types";

export const getTracksRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Tracks}`;
  return await request.get(url);
};

export const getTrackByIdRequest = async (
  request: APIRequestContext,
  id: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Tracks}/${id}`;
  return await request.get(url);
};

export const createTrackRequest = async (
  request: APIRequestContext,
  requestBody: Omit<Track, "id">,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Tracks}`;
  return await request.post(url, {
    data: requestBody,
  });
};

export const updateTrackRequest = async (
  request: APIRequestContext,
  id: string,
  requestBody: Partial<Omit<Track, "id">>,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Tracks}/${id}`;
  return await request.put(url, {
    data: requestBody,
  });
};

export const deleteTrackRequest = async (
  request: APIRequestContext,
  id: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Tracks}/${id}`;
  return await request.delete(url);
};
