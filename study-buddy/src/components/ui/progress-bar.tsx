"use client";

import { cn, getMasteryBgColor } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-1
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  colorByMastery?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  label,
  showPercentage = true,
  size = "md",
  colorByMastery = true,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 1);
  const percentage = Math.round(clampedValue * 100);

  const heightClass = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }[size];

  const barColor = colorByMastery
    ? getMasteryBgColor(clampedValue)
    : "bg-primary-500";

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-primary-700">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-500">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-cream-300 rounded-full overflow-hidden",
          heightClass
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            barColor
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
