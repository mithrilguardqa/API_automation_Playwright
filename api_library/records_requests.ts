import { APIRequestContext, APIResponse } from "@playwright/test";
import config from "@env";
import { EntryPoint } from "./routes";
import { LapRecord } from "backend/src/models/types";

export const getRecordsRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Records}`;
  return await request.get(url);
};

export const getRecordByIdRequest = async (
  request: APIRequestContext,
  id: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Records}/${id}`;
  return await request.get(url);
};

export const createRecordRequest = async (
  request: APIRequestContext,
  requestBody: Omit<LapRecord, "id">,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Records}`;
  return await request.post(url, {
    data: requestBody,
  });
};

export const updateRecordRequest = async (
  request: APIRequestContext,
  id: string,
  requestBody: Partial<Omit<LapRecord, "id">>,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Records}/${id}`;
  return await request.put(url, {
    data: requestBody,
  });
};

export const deleteRecordRequest = async (
  request: APIRequestContext,
  id: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Records}/${id}`;
  return await request.delete(url);
};
