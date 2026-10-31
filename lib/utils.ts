import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export function isPast(iso: string) {
  return new Date(iso).getTime() < Date.now();
}


export function toLocalInput(date: string | Date) {
  const d = new Date(date);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

export function safeRedirect(path: string | null) {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : "/";
}
