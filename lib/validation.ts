import { EVENT_TYPES } from "./constants";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string) {
  if (!email.trim()) return "Enter your email address.";
  if (!EMAIL.test(email.trim())) return "Enter a valid email address, like name@example.com.";
  return null;
}

export function validatePassword(pw: string) {
  if (pw.length < 6) return "Password must be at least 6 characters long.";
  if (!/[A-Z]/.test(pw)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must include a lowercase letter.";
  return null;
}

export function validateUrl(url: string, label = "image URL") {
  if (!url.trim()) return `Enter a ${label}.`;
  try {
    const u = new URL(url.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
  } catch {
    return `Enter a valid ${label} starting with http:// or https://.`;
  }
  return null;
}

export function validateName(name: string) {
  return name.trim().length < 2 ? "Enter your name (at least 2 characters)." : null;
}

export interface EventFormValues {
  title: string;
  description: string;
  type: string;
  thumbnail: string;
  location: string;
  date: string; 
}
export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>;

export function validateEvent(v: EventFormValues): EventFormErrors {
  const e: EventFormErrors = {};
  if (v.title.trim().length < 5) e.title = "Title must be at least 5 characters.";
  if (v.description.trim().length < 20) e.description = "Description must be at least 20 characters.";
  if (!(EVENT_TYPES as readonly string[]).includes(v.type)) e.type = "Choose an event type.";
  const thumb = validateUrl(v.thumbnail);
  if (thumb) e.thumbnail = thumb;
  if (v.location.trim().length < 3) e.location = "Enter where the event will take place.";
  if (!v.date) e.date = "Pick the event date and time.";
  else if (new Date(v.date).getTime() <= Date.now()) e.date = "Pick a date and time in the future.";
  return e;
}
