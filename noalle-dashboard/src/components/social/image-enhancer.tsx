"use client";

import { useState } from "react";
import { Sparkles, RotateCcw, Wand2, Eraser, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageEnhancerProps {
  originalUrl: string | null;
  enhancedUrl: string | null;
  isEnhancing: boolean;
  onEnhance: (type: "enhance" | "removeBackground" | "lighting") => void;
}

export function ImageEnhancer({
  originalUrl,
  enhancedUrl,
  isEnhancing,
  onEnhance,
}: ImageEnhancerProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  if (!originalUrl) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !enhancedUrl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const displayUrl = showOriginal ? originalUrl : (enhancedUrl || originalUrl);

  return (
    <div className="space-y-4">
      {/* Image Display */}
      <div className="relative rounded-2xl overflow-hidden bg-brand-charcoal/5 border border-brand-cream-dark">
        {enhancedUrl && !showOriginal ? (
          // Side-by-side slider comparison
          <div
            className="relative h-[400px] cursor-col-resize select-none"
            onMouseMove={handleMouseMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            {/* Original (left/right in RTL) */}
            <div className="absolute inset-0">
              <img
                src={originalUrl}
                alt="תמונה מקורית"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 text-white text-xs">
                מקורית
              </div>
            </div>

            {/* Enhanced (clipped) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={enhancedUrl}
                alt="תמונה משופרת"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-brand-gold text-white text-xs">
                משופרת
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-3 bg-brand-charcoal/30 rounded-full" />
                  <div className="w-0.5 h-3 bg-brand-charcoal/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Single image display
          <div className="h-[400px] flex items-center justify-center">
            <img
              src={displayUrl}
              alt="תמונה"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        {/* Loading Overlay */}
        {isEnhancing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full gold-gradient animate-spin flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-brand-charcoal">משפר את התמונה...</p>
          </div>
        )}
      </div>

      {/* Enhancement Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onEnhance("enhance")}
          disabled={isEnhancing}
          className={cn(
            "btn-primary flex items-center gap-2 text-sm",
            isEnhancing && "opacity-50 cursor-not-allowed"
          )}
        >
          <Wand2 className="w-4 h-4" />
          שפר תמונה
        </button>
        <button
          onClick={() => onEnhance("removeBackground")}
          disabled={isEnhancing}
          className={cn(
            "btn-secondary flex items-center gap-2 text-sm",
            isEnhancing && "opacity-50 cursor-not-allowed"
          )}
        >
          <Eraser className="w-4 h-4" />
          הסר רקע
        </button>
        <button
          onClick={() => onEnhance("lighting")}
          disabled={isEnhancing}
          className={cn(
            "btn-secondary flex items-center gap-2 text-sm",
            isEnhancing && "opacity-50 cursor-not-allowed"
          )}
        >
          <Sun className="w-4 h-4" />
          שפר תאורה
        </button>

        {enhancedUrl && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="btn-secondary flex items-center gap-2 text-sm mr-auto"
          >
            <RotateCcw className="w-4 h-4" />
            {showOriginal ? "הצג משופרת" : "הצג מקורית"}
          </button>
        )}
      </div>
    </div>
  );
}
