type FetchOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function apiRequest<T>(url: string, options?: FetchOptions): Promise<T> {
  const config: RequestInit = {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  };

  if (options?.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `요청에 실패했습니다 (${response.status})`,
      response.status
    );
  }

  return response.json();
}

// Upload (multipart form)
async function apiUpload(url: string, formData: FormData) {
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || "업로드에 실패했습니다",
      response.status
    );
  }

  return response.json();
}

export const api = {
  get: <T>(url: string) => apiRequest<T>(url),
  post: <T>(url: string, body?: unknown) =>
    apiRequest<T>(url, { method: "POST", body }),
  put: <T>(url: string, body?: unknown) =>
    apiRequest<T>(url, { method: "PUT", body }),
  patch: <T>(url: string, body?: unknown) =>
    apiRequest<T>(url, { method: "PATCH", body }),
  delete: <T>(url: string, body?: unknown) =>
    apiRequest<T>(url, { method: "DELETE", body }),
  upload: apiUpload,
};

export { ApiError };
