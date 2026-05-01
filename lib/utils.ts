import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    inactive: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    suspended: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    rejected: "text-red-400 bg-red-400/10 border-red-400/20",
    verified: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    completed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
    "in-progress": "text-purple-400 bg-purple-400/10 border-purple-400/20",
    scheduled: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    paid: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    refunded: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    processing: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    failed: "text-red-400 bg-red-400/10 border-red-400/20",
    published: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    flagged: "text-red-400 bg-red-400/10 border-red-400/20",
    resolved: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    hidden: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    queued: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    scheduled_notif: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    open: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    escalated: "text-red-400 bg-red-400/10 border-red-400/20",
    blocked: "text-red-400 bg-red-400/10 border-red-400/20",
    paused: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    closed: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    critical: "text-red-400 bg-red-400/10 border-red-400/20",
    high: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    low: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  };
  return colorMap[status.toLowerCase()] || "text-gray-400 bg-gray-400/10 border-gray-400/20";
}

export function getPriorityColor(priority: string): string {
  return getStatusColor(priority.toLowerCase());
}

export function renderStars(rating: number): string {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}
