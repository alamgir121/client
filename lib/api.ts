import { authClient } from "./auth-client";

/** Same-origin proxy defined in next.config.ts (rewrites -> the Express API). */
const PROXY_BASE = process.env.NEXT_PUBLIC_API_URL || "https://helping-hands-server-tau.vercel.app";

//export const API_BASE = () => PROXY_BASE;

async function attempt(path: string, options: RequestInit, headers: Record<string, string>) {
  return fetch(`${PROXY_BASE}${path}`, { ...options, headers, cache: "no-store" });
}

export async function api<T = unknown>(path: string, options: RequestInit = {}, authed = false): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authed) {
    const { data } = await authClient.token();
    if (!data?.token) throw new Error("Please log in to continue.");
    headers.Authorization = `Bearer ${data.token}`;
  }

  const method = (options.method || "GET").toUpperCase();
  let res: Response;
  try {
    res = await attempt(path, options, headers);
  } catch (first) {
    // Retry once on a network blip, but only for idempotent reads.
    if (method !== "GET") {
      console.error(`[api] ${method} ${path} failed:`, first);
      throw new Error("We couldn't reach the server. Check your connection and try again.");
    }
    try {
      res = await attempt(path, options, headers);
    } catch (second) {
      console.error(`[api] GET ${path} failed:`, second);
      throw new Error("We couldn't reach the server. Check your connection and try again.");
    }
  }

  const body = await res.json().catch(() => ({} as { message?: string }));
  if (!res.ok) {
    if (body.message) throw new Error(body.message);
    // Non-JSON error (e.g. Vercel 504/500 page): the API is up but failing.
    throw new Error(
      res.status >= 500
        ? `The server had a problem (HTTP ${res.status}). Please try again in a moment.`
        : "Something went wrong. Please try again."
    );
  }
  return body as T;
}