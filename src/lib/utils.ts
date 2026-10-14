import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function languageListText(value: string | string[] | null | undefined, fallback = "") {
  const languages = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return languages.map((language) => language.trim()).filter(Boolean).join(", ") || fallback;
}

export function toDateOnly(value: string | Date) {
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function dateInputValue(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
