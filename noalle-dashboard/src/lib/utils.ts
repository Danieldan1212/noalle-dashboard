import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "ILS"): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "עכשיו";
  if (diffMinutes < 60) return `לפני ${diffMinutes} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  return formatDate(d);
}

export function getHebrewGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "בוקר טוב";
  if (hour < 17) return "צהריים טובים";
  if (hour < 21) return "ערב טוב";
  return "לילה טוב";
}

export function getSourceIcon(source: string): string {
  const icons: Record<string, string> = {
    instagram: "📸",
    facebook: "📘",
    shopify: "🛍️",
    referral: "🤝",
    website: "🌐",
    phone: "📞",
    email: "📧",
    whatsapp: "💬",
    walkIn: "🚶",
  };
  return icons[source] || "📌";
}

export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    firstContact: "bg-blue-100 text-blue-700 border-blue-200",
    quoteSent: "bg-amber-100 text-amber-700 border-amber-200",
    confirmed: "bg-green-100 text-green-700 border-green-200",
    inProduction: "bg-purple-100 text-purple-700 border-purple-200",
    shipped: "bg-teal-100 text-teal-700 border-teal-200",
    followUp: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return colors[stage] || "bg-gray-100 text-gray-700 border-gray-200";
}

export const STAGES = [
  { id: "firstContact", label: "פנייה ראשונה" },
  { id: "quoteSent", label: "הצעת מחיר" },
  { id: "confirmed", label: "הזמנה מאושרת" },
  { id: "inProduction", label: "בייצור" },
  { id: "shipped", label: "נשלח" },
  { id: "followUp", label: "מעקב" },
] as const;

export const SOURCES = [
  { id: "instagram", label: "אינסטגרם" },
  { id: "facebook", label: "פייסבוק" },
  { id: "shopify", label: "שופיפיי" },
  { id: "referral", label: "המלצה" },
  { id: "website", label: "אתר" },
  { id: "phone", label: "טלפון" },
  { id: "email", label: "אימייל" },
  { id: "whatsapp", label: "ווטסאפ" },
  { id: "walkIn", label: "הגיע לחנות" },
] as const;
