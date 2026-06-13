// Central API client for the Replit backend.
// All requests send cookies (credentials: "include") so the
// session set by the backend on login is automatically attached.

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://8a3a5133-6ac0-4a27-b15c-3869167998f6-00-w03z7vsxsnhh.pike.replit.dev"

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const res = await fetch(`${API_BASE_URL}${path}`, {
    // Send/receive the session cookie across origins.
    credentials: "include",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...rest,
  })

  // Try to parse JSON, but tolerate empty responses (204, etc.)
  const text = await res.text()
  const data = text ? safeJsonParse(text) : null

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    if (data && typeof data === "object" && "message" in data) {
      message = String((data as { message: unknown }).message)
    }
    throw new ApiError(message, res.status, data)
  }

  return data as T
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
}

// SWR fetcher helper: useSWR("/api/shops", fetcher)
export const fetcher = <T>(path: string) => api.get<T>(path)
