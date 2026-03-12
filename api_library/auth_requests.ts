import { APIRequestContext, APIResponse } from "@playwright/test";
import config from "@env";
import { EntryPoint } from "./routes";

export const loginRequest = async (
  request: APIRequestContext,
  username: string,
  password: string,
): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Login}`;
  return await request.post(url, {
    data: {
      username,
      password,
    },
  });
};

export const logoutRequest = async (request: APIRequestContext): Promise<APIResponse> => {
  const url = `${config.baseUrl}${EntryPoint.Logout}`;
  return await request.post(url);
};
