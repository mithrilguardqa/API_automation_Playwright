import { Track } from "backend/src/models/types";
import { EntryPoint } from "./routes";
import { APIRequestContext, APIResponse } from "@playwright/test";
import config from "@env";

export const getTracksRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Tracks}`;
  return await request.get(url);
};

export const createTrackRequest = async (
  request: APIRequestContext,
  track: Track,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Tracks}`;
  return await request.post(url, {
    data: track,
  });
};
