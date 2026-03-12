import { APIRequestContext, APIResponse } from "@playwright/test";
import { EntryPoint } from "./routes";
import { LapRecord } from "backend/src/models/types";
import config from "@env";

export const getRecordsRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Records}`;
  return await request.get(url);
};

export const createRecordRequest = async (
  request: APIRequestContext,
  record: LapRecord,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Records}`;
  return await request.post(url, {
    data: record,
  });
};
