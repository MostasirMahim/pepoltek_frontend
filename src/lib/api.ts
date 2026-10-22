/**
 * Backend API Client for Pepoltek Next.js Platform
 * Interacts with Django 5 DRF modular monolith at /api/v1/
 * 
 * Strict House Style Rule: Zero em dashes or en dashes throughout.
 */

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface ApiResponse<T = any> {
  data?: T;
  meta?: {
    page?: number;
    page_size?: number;
    total?: number;
    ruleset_version?: string;
  };
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

export interface RequestOptions extends RequestInit {
  cookieHeader?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Builds a full URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const baseUrl = BACKEND_API_URL.endsWith("/") ? BACKEND_API_URL : `${BACKEND_API_URL}/`;
  const url = new URL(cleanEndpoint, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Core API request handler
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { cookieHeader, params, headers, ...restOptions } = options;
  const url = buildUrl(endpoint, params);

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    ...(headers as Record<string, string>),
  };

  if (!requestHeaders["Authorization"] && cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)access_token=([^;]+)/);
    if (match && match[1]) {
      requestHeaders["Authorization"] = `Bearer ${match[1]}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    const text = await response.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { raw: text };
    }

    if (!response.ok) {
      const errorMessage =
        json?.error?.message ||
        json?.detail ||
        json?.message ||
        `Backend request failed with status ${response.status}`;

      return {
        error: {
          code: json?.error?.code || `HTTP_${response.status}`,
          message: errorMessage,
          fields: json?.error?.fields || json?.fields,
        },
      };
    }

    // DRF responses return either { data: ... } or a raw object/array
    if (json && typeof json === "object" && "data" in json) {
      return json as ApiResponse<T>;
    }

    return { data: json as T };
  } catch (error: any) {
    return {
      error: {
        code: "NETWORK_EXCEPTION",
        message: error.message || "Failed to communicate with Pepoltek backend service.",
      },
    };
  }
}

/**
 * Convenience HTTP methods
 */
export async function apiGet<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
}

export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T = any>(
  endpoint: string,
  body?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
}
