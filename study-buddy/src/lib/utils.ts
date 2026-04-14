import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("he-IL", {
    month: "short",
    day: "numeric",
  });
}

export function daysUntil(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getMasteryLabel(mastery: number): string {
  if (mastery >= 0.8) return "מצוין";
  if (mastery >= 0.6) return "טוב";
  if (mastery >= 0.4) return "בינוני";
  if (mastery >= 0.2) return "צריך שיפור";
  return "חדש";
}

export function getMasteryColor(mastery: number): string {
  if (mastery >= 0.8) return "text-green-600";
  if (mastery >= 0.6) return "text-blue-600";
  if (mastery >= 0.4) return "text-amber-600";
  if (mastery >= 0.2) return "text-orange-600";
  return "text-red-600";
}

export function getMasteryBgColor(mastery: number): string {
  if (mastery >= 0.8) return "bg-green-500";
  if (mastery >= 0.6) return "bg-blue-500";
  if (mastery >= 0.4) return "bg-amber-500";
  if (mastery >= 0.2) return "bg-orange-500";
  return "bg-red-500";
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds} שניות`;
  if (remainingSeconds === 0) return `${minutes} דקות`;
  return `${minutes} דקות ו-${remainingSeconds} שניות`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}
