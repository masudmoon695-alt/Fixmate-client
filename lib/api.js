export const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let cachedToken = null;
let tokenPromise = null;

async function getToken() {
  if (cachedToken) return cachedToken;
  if (!tokenPromise) {
    tokenPromise = (async () => {
      try {
        // Call our own token route (app/api/token) which reads the session
        // and signs the JWT. Do NOT use authClient.getToken(): the better-auth
        // dynamic path proxy turns camelCase method names into kebab-case
        // paths (getToken -> /get-token), which hits a non-existent endpoint.
        const res = await fetch('/api/token');
        const json = await res.json().catch(() => null);
        cachedToken = json?.token || null;
        return cachedToken;
      } catch {
        cachedToken = null;
        return null;
      } finally {
        tokenPromise = null;
      }
    })();
  }
  return tokenPromise;
}

export function clearToken() {
  cachedToken = null;
}

async function handleUnauthorized(path) {
  clearToken();
  if (typeof window !== 'undefined') {
    window.location.href = `/sign-in?redirect=${encodeURIComponent(path)}`;
  }
}

export async function apiFetch(path, options = {}) {
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const json = await res.json().catch(() => null);

  if (res.status === 401) {
    await handleUnauthorized(path);
  }

  if (!res.ok) {
    throw new ApiError(json?.message || 'Request failed', res.status, json);
  }

  return json;
}

export function toApiError(error, fallbackMessage = 'Something went wrong') {
  if (error instanceof ApiError) return error;
  return new ApiError(error?.message || fallbackMessage, error?.status || 500, error?.data);
}
