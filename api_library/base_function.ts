import type { APIRequestContext, APIResponse } from "@playwright/test";
import config from "../env.config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestParams {
  request: APIRequestContext;
  method: HttpMethod;
  urlSuffix: string;
  body?: object;
}

export async function apiRequest({
  request,
  method,
  urlSuffix,
  body,
}: RequestParams): Promise<APIResponse> {
  const options: { data?: object } = {};
  if (body) options.data = body;

  const methodMap = { GET: "get", POST: "post", PUT: "put", PATCH: "patch", DELETE: "delete" } as const;
  const response = await request[methodMap[method]](`${config.baseUrl}${urlSuffix}`, options);

  return response;
}
