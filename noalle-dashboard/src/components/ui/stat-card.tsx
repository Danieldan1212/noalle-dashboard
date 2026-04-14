"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: "gold" | "rose" | "charcoal" | "green" | "blue";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "gold",
  className,
}: StatCardProps) {
  const colorMap = {
    gold: {
      iconBg: "bg-brand-gold/10",
      iconColor: "text-brand-gold",
      trendUp: "text-green-600",
      trendDown: "text-red-500",
    },
    rose: {
      iconBg: "bg-brand-rose/20",
      iconColor: "text-brand-rose-dark",
      trendUp: "text-green-600",
      trendDown: "text-red-500",
    },
    charcoal: {
      iconBg: "bg-brand-charcoal/10",
      iconColor: "text-brand-charcoal",
      trendUp: "text-green-600",
      trendDown: "text-red-500",
    },
    green: {
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      trendUp: "text-green-600",
      trendDown: "text-red-500",
    },
    blue: {
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trendUp: "text-green-600",
      trendDown: "text-red-500",
    },
  };

  const colors = colorMap[color];

  const TrendIcon =
    trend && trend.value > 0
      ? TrendingUp
      : trend && trend.value < 0
        ? TrendingDown
        : Minus;

  const trendColor =
    trend && trend.value > 0
      ? colors.trendUp
      : trend && trend.value < 0
        ? colors.trendDown
        : "text-gray-400";

  return (
    <div
      className={cn(
        "glass-card p-6 hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-brand-charcoal-light/70 font-medium">
            {title}
          </p>
          <p className="text-3xl font-bold text-brand-charcoal mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-brand-charcoal-light/50 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", colors.iconBg)}>
          <Icon className={cn("w-6 h-6", colors.iconColor)} />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-brand-cream-dark/50">
          <TrendIcon className={cn("w-4 h-4", trendColor)} />
          <span className={cn("text-sm font-medium", trendColor)}>
            {trend.value > 0 ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-xs text-brand-charcoal-light/50">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
