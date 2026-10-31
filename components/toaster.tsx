"use client";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  return <Sonner richColors closeButton position="top-center" theme={resolvedTheme === "dark" ? "dark" : "light"} />;
}
