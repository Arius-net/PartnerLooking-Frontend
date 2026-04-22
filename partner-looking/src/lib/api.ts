import { clearSession, getStoredToken } from "@/lib/session";

const DEFAULT_API_URL = "https://partnerlooking-backend.onrender.com";
const DEFAULT_API_PREFIX = "/api/v1";

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function trimSlashes(path: string): string {
  return path.replace(/^\/+/, "").replace(/\/+$/, "");
}

export const API_BASE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL,
);

export const API_PREFIX = `/${trimSlashes(process.env.NEXT_PUBLIC_API_PREFIX || DEFAULT_API_PREFIX)}`;

export const AUTH_LOGIN_PATH = process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH || `${API_PREFIX}/auth/login`;
export const AUTH_REGISTER_PATH = process.env.NEXT_PUBLIC_AUTH_REGISTER_PATH || `${API_PREFIX}/auth/register`;

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function buildApiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const withPrefix = normalizedPath.startsWith(API_PREFIX)
    ? normalizedPath
    : `${API_PREFIX}${normalizedPath}`;

  return `${API_BASE_URL}${withPrefix}`;
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const maybeMessage = (payload as { message?: unknown }).message;
    const maybeError = (payload as { error?: unknown }).error;
    const maybeDetails = (payload as { details?: unknown }).details;

    if (typeof maybeMessage === "string" && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }
    if (typeof maybeError === "string" && maybeError.trim().length > 0) {
      return maybeError;
    }
    if (typeof maybeDetails === "string" && maybeDetails.trim().length > 0) {
      return maybeDetails;
    }
  }
  return fallback;
}

function mapStatusToMessage(status: number): string {
  if (status === 400) return "Solicitud inválida. Revisa los campos e intenta de nuevo.";
  if (status === 401) return "Tu sesión expiró. Vuelve a iniciar sesión.";
  if (status === 403) return "No tienes permisos para realizar esta acción.";
  if (status === 404) return "No se encontró el recurso solicitado.";
  if (status >= 500) return "El servidor no respondió correctamente. Intenta más tarde.";
  return "No se pudo completar la solicitud.";
}

async function request<TResponse>(
  method: RequestMethod,
  path: string,
  options?: {
    body?: unknown;
    useFormData?: boolean;
    auth?: boolean;
  },
): Promise<TResponse> {
  const token = getStoredToken() || null;
  const useFormData = options?.useFormData === true;

  const headers = new Headers();
  if (!useFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (options?.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildApiUrl(path), {
    method,
    headers,
    body: method === "GET" ? undefined : useFormData ? (options?.body as FormData) : options?.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }

    const fallbackMessage = mapStatusToMessage(response.status);
    const finalMessage = extractErrorMessage(payload, fallbackMessage);
    console.error("[API Error]", {
      method,
      path,
      status: response.status,
      payload,
    });
    throw new ApiError(finalMessage, response.status, payload);
  }

  return (payload ?? {}) as TResponse;
}

export function getJson<TResponse>(path: string, auth = true): Promise<TResponse> {
  return request<TResponse>("GET", path, { auth });
}

export function postJson<TResponse>(path: string, body: unknown, auth = true): Promise<TResponse> {
  return request<TResponse>("POST", path, { body, auth });
}

export function putJson<TResponse>(path: string, body: unknown, auth = true): Promise<TResponse> {
  return request<TResponse>("PUT", path, { body, auth });
}

export function patchJson<TResponse>(path: string, body: unknown, auth = true): Promise<TResponse> {
  return request<TResponse>("PATCH", path, { body, auth });
}

export function deleteJson<TResponse>(path: string, auth = true): Promise<TResponse> {
  return request<TResponse>("DELETE", path, { auth });
}

export function postFormData<TResponse>(path: string, formData: FormData, auth = true): Promise<TResponse> {
  return request<TResponse>("POST", path, { body: formData, useFormData: true, auth });
}
