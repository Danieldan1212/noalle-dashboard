"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaptionGeneratorProps {
  captionHe: string;
  captionEn: string;
  hashtags: string[];
  hashtagsEn: string[];
  isGenerating: boolean;
  onCaptionHeChange: (value: string) => void;
  onCaptionEnChange: (value: string) => void;
  onHashtagsChange: (value: string[]) => void;
  onHashtagsEnChange: (value: string[]) => void;
  onRegenerate: () => void;
}

export function CaptionGenerator({
  captionHe,
  captionEn,
  hashtags,
  hashtagsEn,
  isGenerating,
  onCaptionHeChange,
  onCaptionEnChange,
  onHashtagsChange,
  onHashtagsEnChange,
  onRegenerate,
}: CaptionGeneratorProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({
    text,
    field,
  }: {
    text: string;
    field: string;
  }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="p-1.5 rounded-lg hover:bg-brand-cream transition-colors"
      title="העתק"
    >
      {copiedField === field ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-brand-charcoal-light/50" />
      )}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-charcoal flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-gold" />
          טקסטים לפרסום
        </h3>
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className={cn(
            "btn-secondary text-sm flex items-center gap-2",
            isGenerating && "opacity-50 cursor-not-allowed"
          )}
        >
          <RefreshCw
            className={cn("w-4 h-4", isGenerating && "animate-spin")}
          />
          צור מחדש
        </button>
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-8 gap-3">
          <div className="w-8 h-8 rounded-full gold-gradient animate-spin flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm text-brand-charcoal-light">יוצר טקסטים...</p>
        </div>
      )}

      {!isGenerating && (
        <>
          {/* Hebrew Caption */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-brand-charcoal">
                קפשן בעברית
              </label>
              <CopyButton text={captionHe} field="captionHe" />
            </div>
            <textarea
              value={captionHe}
              onChange={(e) => onCaptionHeChange(e.target.value)}
              className="input-field min-h-[120px] resize-none text-sm leading-relaxed"
              placeholder="הקפשן בעברית יופיע כאן..."
            />
            <p className="text-xs text-brand-charcoal-light/50 mt-1">
              {captionHe.length} תווים
            </p>
          </div>

          {/* English Caption */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-brand-charcoal">
                קפשן באנגלית
              </label>
              <CopyButton text={captionEn} field="captionEn" />
            </div>
            <textarea
              value={captionEn}
              onChange={(e) => onCaptionEnChange(e.target.value)}
              className="input-field min-h-[100px] resize-none text-sm leading-relaxed"
              dir="ltr"
              placeholder="English caption will appear here..."
            />
            <p className="text-xs text-brand-charcoal-light/50 mt-1">
              {captionEn.length} characters
            </p>
          </div>

          {/* Hebrew Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-brand-charcoal">
                האשטגים בעברית
              </label>
              <CopyButton text={hashtags.join(" ")} field="hashtagsHe" />
            </div>
            <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-brand-cream-dark bg-white min-h-[44px]">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-medium"
                >
                  {tag}
                  <button
                    onClick={() =>
                      onHashtagsChange(hashtags.filter((_, i) => i !== index))
                    }
                    className="hover:text-red-500 transition-colors"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="flex-1 min-w-[100px] border-none outline-none text-xs bg-transparent"
                placeholder="הוסף האשטג..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    const tag = e.currentTarget.value.trim();
                    const formattedTag = tag.startsWith("#") ? tag : `#${tag}`;
                    onHashtagsChange([...hashtags, formattedTag]);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>

          {/* English Hashtags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-brand-charcoal">
                האשטגים באנגלית
              </label>
              <CopyButton text={hashtagsEn.join(" ")} field="hashtagsEn" />
            </div>
            <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-brand-cream-dark bg-white min-h-[44px]">
              {hashtagsEn.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-rose/20 text-brand-rose-dark text-xs font-medium"
                >
                  {tag}
                  <button
                    onClick={() =>
                      onHashtagsEnChange(hashtagsEn.filter((_, i) => i !== index))
                    }
                    className="hover:text-red-500 transition-colors"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="flex-1 min-w-[100px] border-none outline-none text-xs bg-transparent"
                dir="ltr"
                placeholder="Add hashtag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    const tag = e.currentTarget.value.trim();
                    const formattedTag = tag.startsWith("#") ? tag : `#${tag}`;
                    onHashtagsEnChange([...hashtagsEn, formattedTag]);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
