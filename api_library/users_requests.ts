import { APIRequestContext, APIResponse } from "@playwright/test";
import config from "@env";
import { EntryPoint } from "./routes";
import { User } from "backend/src/models/types";

export const getUsersRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Users}`;
  return await request.get(url);
};

export const getUserByIdRequest = async (
  request: APIRequestContext,
  id: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Users}/${id}`;
  return await request.get(url);
};

export const createUserRequest = async (
  request: APIRequestContext,
  requestBody: Omit<User, "id">,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Users}`;
  return await request.post(url, {
    data: requestBody,
  });
};

export const updateUserRequest = async (
  request: APIRequestContext,
  id: string,
  requestBody: Partial<Omit<User, "id">>,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Users}/${id}`;
  return await request.put(url, {
    data: requestBody,
  });
};

export const deleteUserRequest = async (
  request: APIRequestContext,
  id: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Users}/${id}`;
  return await request.delete(url);
};
