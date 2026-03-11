import { APIRequestContext, APIResponse } from "@playwright/test";
import { EntryPoint } from "@apiLibrary/routes";
import config from "@env";
import { Car, LapRecord, Track, User } from "backend/src/models/types";

interface LoginCredentials {
  username: string;
  password: string;
}

type RequestBody = LoginCredentials | User | Car | Track | LapRecord;

export const baseRequest = async (
  request: APIRequestContext,
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: EntryPoint,
  params: Record<string, string> = {},
  data?: RequestBody,
  parse: boolean = true,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${endpoint}`;
  let response: APIResponse;

  switch (method) {
    case "GET":
      response = await request.get(url, { params });
      break;
    case "POST":
      response = await request.post(url, { data });
      break;
    case "PUT":
      response = await request.put(url, { data });
      break;
    case "DELETE":
      response = await request.delete(url, { data });
      break;
  }

  if (parse) {
    return await response.json();
  } else {
    return response;
  }
};

// Login & Logout requests
export const loginRequest = async (
  request: APIRequestContext,
  username: string,
  password: string,
): Promise<APIResponse> => {
  return baseRequest(request, "POST", EntryPoint.Login, {}, { username, password }, false);
};

export const logoutRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  return await baseRequest(request, "POST", EntryPoint.Logout, {}, undefined, false);
};

// GET requests
export const getUsersRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  return await baseRequest(request, "GET", EntryPoint.Users);
};

export const getUserByIdRequest = async (
  request: APIRequestContext,
  id: string,
): Promise<APIResponse> => {
  return await baseRequest(request, "GET", EntryPoint.Users, { id });
};

export const getCarsRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  return await baseRequest(request, "GET", EntryPoint.Cars);
};

export const getCarByIdRequest = async (
  request: APIRequestContext,
  id: string,
): Promise<APIResponse> => {
  return await baseRequest(request, "GET", EntryPoint.Cars, { id });
};

export const getCarByUserIdRequest = async (
  request: APIRequestContext,
  userId: string,
): Promise<APIResponse> => {
  return await baseRequest(request, "GET", EntryPoint.Cars, { userId });
};

export const getCarsByNameRequest = async (
  request: APIRequestContext,
  name: string,
): Promise<APIResponse> => {
  return await baseRequest(request, "GET", EntryPoint.Cars, { name });
};

export const getCarByModelRequest = async (
  request: APIRequestContext,
  model: string,
): Promise<APIResponse> => {
  return await baseRequest(request, "GET", EntryPoint.Cars, { model });
};

export const getTracksRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  return await baseRequest(request, "GET", EntryPoint.Tracks);
};

export const getRecordsRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  return await baseRequest(request, "GET", EntryPoint.Records);
};

// POST requests
export const createUserRequest = async (
  request: APIRequestContext,
  user: Omit<User, "id">,
): Promise<APIResponse> => {
  return await baseRequest(request, "POST", EntryPoint.Users, {}, user);
};

export const createCarRequest = async (
  request: APIRequestContext,
  car: Car,
): Promise<APIResponse> => {
  return await baseRequest(request, "POST", EntryPoint.Cars, {}, car);
};

export const createTrackRequest = async (
  request: APIRequestContext,
  track: Track,
): Promise<APIResponse> => {
  return await baseRequest(request, "POST", EntryPoint.Tracks, {}, track);
};

export const createRecordRequest = async (
  request: APIRequestContext,
  record: LapRecord,
): Promise<APIResponse> => {
  return await baseRequest(request, "POST", EntryPoint.Records, {}, record);
};
