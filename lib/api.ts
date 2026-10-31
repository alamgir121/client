import { authClient } from "./auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


export async function api<T = unknown>(path: string, options: RequestInit = {}, authed = false): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authed) {
    const { data } = await authClient.token();
    if (!data?.token) throw new Error("Please log in to continue.");
    headers.Authorization = `Bearer ${data.token}`;
  }
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, { ...options, headers, cache: "no-store" });
  } catch {
    throw new Error("We couldn't reach the server. Check your connection and try again.");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Something went wrong. Please try again.");
  return body as T;
}
