import { APIRequestContext, APIResponse } from "@playwright/test";
import config from "@env";
import { EntryPoint } from "./routes";
import { Car } from "backend/src/models/types";

export const getCarsRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Cars}`;
  return await request.get(url);
};

export const getCarByIdRequest = async (
  request: APIRequestContext,
  id: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Cars}/${id}`;
  return await request.get(url);
};

export const getCarByUserIdRequest = async (
  request: APIRequestContext,
  userId: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Cars}/by-user/${userId}`;
  return await request.get(url);
};

export const getCarsByNameRequest = async (
  request: APIRequestContext,
  name: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Cars}/${name}`;
  return await request.get(url);
};

export const getCarByModelRequest = async (
  request: APIRequestContext,
  model: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Cars}/${model}`;
  return await request.get(url);
};

// POST requests
export const createCarRequest = async (
  request: APIRequestContext,
  car: Car,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Cars}`;
  return await request.post(url, {
    data: car,
  });
};
