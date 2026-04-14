"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  ImageIcon,
  Send,
  Clock,
  Instagram,
  Facebook,
  Pin,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageEnhancer } from "./image-enhancer";
import { CaptionGenerator } from "./caption-generator";
import { PlatformPreview } from "./platform-preview";

interface PostCreatorProps {
  onPublish?: (data: PostData) => void;
  onSchedule?: (data: PostData & { scheduledFor: string }) => void;
}

export interface PostData {
  imageUrl: string;
  enhancedUrl?: string;
  captionHe: string;
  captionEn: string;
  hashtags: string[];
  hashtagsEn: string[];
  platforms: string[];
}

const PLATFORMS = [
  { id: "instagram", label: "אינסטגרם", icon: Instagram },
  { id: "facebook", label: "פייסבוק", icon: Facebook },
  { id: "pinterest", label: "פינטרסט", icon: Pin },
];

export function PostCreator({ onPublish, onSchedule }: PostCreatorProps) {
  const [step, setStep] = useState<"upload" | "enhance" | "caption" | "preview">("upload");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [captionHe, setCaptionHe] = useState("");
  const [captionEn, setCaptionEn] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagsEn, setHashtagsEn] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<"instagram" | "facebook" | "pinterest">("instagram");

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setStep("enhance");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleEnhance = async (type: "enhance" | "removeBackground" | "lighting") => {
    if (!imageUrl) return;
    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, type }),
      });
      const data = await response.json();
      if (data.enhancedUrl) {
        setEnhancedUrl(data.enhancedUrl);
      }
    } catch (error) {
      console.error("Enhancement failed:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateCaptions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatforms[0] || "all",
          productType: "תכשיט",
        }),
      });
      const data = await response.json();
      if (data.captionHe) setCaptionHe(data.captionHe);
      if (data.captionEn) setCaptionEn(data.captionEn);
      if (data.hashtags) setHashtags(data.hashtags);
      if (data.hashtagsEn) setHashtagsEn(data.hashtagsEn);
    } catch (error) {
      console.error("Caption generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    if (!imageUrl) return;
    onPublish?.({
      imageUrl,
      enhancedUrl: enhancedUrl || undefined,
      captionHe,
      captionEn,
      hashtags,
      hashtagsEn,
      platforms: selectedPlatforms,
    });
  };

  const handleSchedule = () => {
    if (!imageUrl || !scheduleDate || !scheduleTime) return;
    onSchedule?.({
      imageUrl,
      enhancedUrl: enhancedUrl || undefined,
      captionHe,
      captionEn,
      hashtags,
      hashtagsEn,
      platforms: selectedPlatforms,
      scheduledFor: `${scheduleDate}T${scheduleTime}:00`,
    });
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const steps = [
    { id: "upload", label: "העלאת תמונה" },
    { id: "enhance", label: "שיפור תמונה" },
    { id: "caption", label: "יצירת טקסט" },
    { id: "preview", label: "תצוגה מקדימה" },
  ];

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (s.id === "upload" || (s.id === "enhance" && imageUrl) || (s.id === "caption" && imageUrl) || (s.id === "preview" && captionHe)) {
                  setStep(s.id as typeof step);
                }
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                step === s.id
                  ? "bg-brand-gold text-white shadow-sm"
                  : "bg-brand-cream text-brand-charcoal-light/60 hover:text-brand-charcoal"
              )}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {i + 1}
              </span>
              {s.label}
            </button>
            {i < steps.length - 1 && (
              <div className="w-8 h-px bg-brand-cream-dark" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Upload Area */}
          {step === "upload" && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer",
                isDragOver
                  ? "border-brand-gold bg-brand-gold/5"
                  : "border-brand-cream-dark hover:border-brand-gold/50"
              )}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-brand-charcoal">
                      גרור תמונה לכאן
                    </p>
                    <p className="text-sm text-brand-charcoal-light/60 mt-1">
                      או לחץ לבחירת קובץ
                    </p>
                    <p className="text-xs text-brand-charcoal-light/40 mt-2">
                      PNG, JPG, WEBP עד 10MB
                    </p>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Image Enhancement */}
          {step === "enhance" && imageUrl && (
            <ImageEnhancer
              originalUrl={imageUrl}
              enhancedUrl={enhancedUrl}
              isEnhancing={isEnhancing}
              onEnhance={handleEnhance}
            />
          )}

          {/* Image thumbnail on caption/preview steps */}
          {(step === "caption" || step === "preview") && imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-brand-cream-dark">
              <img
                src={enhancedUrl || imageUrl}
                alt="תמונה נבחרת"
                className="w-full h-[300px] object-contain bg-brand-cream/50"
              />
            </div>
          )}

          {/* Caption Generator */}
          {step === "caption" && (
            <div className="space-y-4">
              <button
                onClick={handleGenerateCaptions}
                disabled={isGenerating}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                צור טקסטים אוטומטית
              </button>
              <CaptionGenerator
                captionHe={captionHe}
                captionEn={captionEn}
                hashtags={hashtags}
                hashtagsEn={hashtagsEn}
                isGenerating={isGenerating}
                onCaptionHeChange={setCaptionHe}
                onCaptionEnChange={setCaptionEn}
                onHashtagsChange={setHashtags}
                onHashtagsEnChange={setHashtagsEn}
                onRegenerate={handleGenerateCaptions}
              />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Platform Selection */}
          {(step === "caption" || step === "preview") && (
            <div className="glass-card p-5 space-y-4">
              <h4 className="font-bold text-sm text-brand-charcoal">פלטפורמות</h4>
              <div className="flex gap-2">
                {PLATFORMS.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                        isSelected
                          ? "bg-brand-gold/10 border-brand-gold/30 text-brand-gold"
                          : "bg-white border-brand-cream-dark text-brand-charcoal-light/60 hover:border-brand-gold/20"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {platform.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Platform Previews */}
          {step === "preview" && (
            <div className="glass-card p-5 space-y-4">
              <h4 className="font-bold text-sm text-brand-charcoal">תצוגה מקדימה</h4>
              <div className="flex gap-1 bg-brand-cream rounded-lg p-0.5 mb-4">
                {selectedPlatforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreviewPlatform(p as typeof previewPlatform)}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all",
                      previewPlatform === p
                        ? "bg-white text-brand-charcoal shadow-sm"
                        : "text-brand-charcoal-light/60"
                    )}
                  >
                    {PLATFORMS.find((pl) => pl.id === p)?.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-center">
                <PlatformPreview
                  platform={previewPlatform}
                  imageUrl={enhancedUrl || imageUrl}
                  caption={captionHe}
                  hashtags={hashtags}
                />
              </div>
            </div>
          )}

          {/* Copy & Use Actions */}
          {step === "preview" && (
            <div className="glass-card p-5 space-y-4">
              <h4 className="font-bold text-sm text-brand-charcoal">העתק ופרסם</h4>
              <p className="text-xs text-brand-charcoal-light/60">
                העתק את הטקסט והתמונה, ואז פרסם דרך Meta Business Suite או Pinterest
              </p>

              <button
                onClick={() => {
                  const fullCaption = `${captionHe}\n\n${hashtags.join(" ")}`;
                  navigator.clipboard.writeText(fullCaption);
                }}
                disabled={!captionHe}
                className={cn(
                  "btn-primary w-full flex items-center justify-center gap-2",
                  !captionHe && "opacity-50 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
                העתק כיתוב בעברית + האשטגים
              </button>

              <button
                onClick={() => {
                  const fullCaption = `${captionEn}\n\n${hashtagsEn.join(" ")}`;
                  navigator.clipboard.writeText(fullCaption);
                }}
                disabled={!captionEn}
                className={cn(
                  "btn-secondary w-full flex items-center justify-center gap-2",
                  !captionEn && "opacity-50 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
                Copy English Caption + Hashtags
              </button>

              {(enhancedUrl || imageUrl) && (
                <a
                  href={enhancedUrl || imageUrl || "#"}
                  download="noalle-post.jpg"
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  הורד תמונה משופרת
                </a>
              )}

              <div className="border-t border-brand-cream-dark pt-4 space-y-2">
                <p className="text-xs font-semibold text-brand-charcoal">השלב הבא:</p>
                <div className="space-y-1.5 text-xs text-brand-charcoal-light/70">
                  <p>1. פתח את <strong>Meta Business Suite</strong> לאינסטגרם + פייסבוק</p>
                  <p>2. העלה את התמונה ← הדבק את הכיתוב</p>
                  <p>3. תזמן או פרסם</p>
                  <p>4. לפינטרסט: פתח את <strong>Pinterest Business</strong></p>
                </div>
              </div>

              <button
                onClick={() => {
                  handlePublish();
                }}
                disabled={!captionHe}
                className={cn(
                  "w-full text-xs text-brand-gold hover:text-brand-gold/80 transition-colors py-2",
                  !captionHe && "opacity-50 cursor-not-allowed"
                )}
              >
                💾 שמור כטיוטה בדשבורד
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {step !== "upload" && (
              <button
                onClick={() => {
                  const stepOrder = ["upload", "enhance", "caption", "preview"] as const;
                  const currentIndex = stepOrder.indexOf(step);
                  if (currentIndex > 0) setStep(stepOrder[currentIndex - 1]);
                }}
                className="btn-secondary flex-1"
              >
                חזור
              </button>
            )}
            {step !== "preview" && step !== "upload" && (
              <button
                onClick={() => {
                  const stepOrder = ["upload", "enhance", "caption", "preview"] as const;
                  const currentIndex = stepOrder.indexOf(step);
                  if (currentIndex < stepOrder.length - 1) {
                    setStep(stepOrder[currentIndex + 1]);
                    if (stepOrder[currentIndex + 1] === "caption" && !captionHe) {
                      handleGenerateCaptions();
                    }
                  }
                }}
                className="btn-primary flex-1"
              >
                המשך
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
