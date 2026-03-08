import { APIRequestContext } from "@playwright/test";
import { apiRequest } from "./base_function";
import { EntryPoint } from "./routes";
import config from "@env";

export const login = async (request: APIRequestContext) => {
  return apiRequest({
    request,
    method: "POST",
    urlSuffix: EntryPoint.Auth,
    body: { username: config.username, password: config.password },
  });
};

export const getBookings = async (request: APIRequestContext) => {
  return apiRequest({
    request,
    method: "GET",
    urlSuffix: EntryPoint.Booking,
  });
};

export const createBooking = async (request: APIRequestContext, body: object) => {
  return apiRequest({ request, method: "POST", urlSuffix: EntryPoint.Booking, body });
};
