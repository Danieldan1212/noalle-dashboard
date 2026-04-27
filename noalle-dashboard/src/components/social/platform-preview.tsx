"use client";

import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformPreviewProps {
  platform: "instagram" | "facebook" | "pinterest";
  imageUrl: string | null;
  caption: string;
  hashtags: string[];
}

function InstagramPreview({
  imageUrl,
  caption,
  hashtags,
}: Omit<PlatformPreviewProps, "platform">) {
  return (
    <div className="w-[320px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-white text-xs font-bold">
          N
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold">noallejewelry</p>
          <p className="text-[10px] text-gray-400">Israel</p>
        </div>
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </div>

      {/* Image (1:1) */}
      <div className="w-full aspect-square bg-brand-cream flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-brand-charcoal-light/30 text-sm">תמונה</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <Heart className="w-5 h-5 text-gray-700" />
          <MessageCircle className="w-5 h-5 text-gray-700" />
          <Send className="w-5 h-5 text-gray-700" />
        </div>
        <Bookmark className="w-5 h-5 text-gray-700" />
      </div>

      {/* Caption */}
      <div className="px-3 pb-3">
        <p className="text-xs">
          <span className="font-semibold">noallejewelry</span>{" "}
          <span className="text-gray-700">{caption.slice(0, 100)}</span>
          {caption.length > 100 && (
            <span className="text-gray-400"> ...עוד</span>
          )}
        </p>
        {hashtags.length > 0 && (
          <p className="text-xs text-blue-900/60 mt-1">
            {hashtags.slice(0, 5).join(" ")}
          </p>
        )}
      </div>
    </div>
  );
}

function FacebookPreview({
  imageUrl,
  caption,
}: Omit<PlatformPreviewProps, "platform" | "hashtags">) {
  return (
    <div className="w-[360px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-white text-sm font-bold">
          N
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">נועל'ה תכשיטים</p>
          <p className="text-xs text-gray-400">Just now</p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-400" />
      </div>

      {/* Caption */}
      <div className="px-3 pb-2">
        <p className="text-sm text-gray-700 leading-relaxed">
          {caption.slice(0, 200)}
          {caption.length > 200 && (
            <span className="text-blue-600 cursor-pointer"> ...ראה עוד</span>
          )}
        </p>
      </div>

      {/* Image (16:9) */}
      <div className="w-full aspect-video bg-brand-cream flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-brand-charcoal-light/30 text-sm">תמונה</div>
        )}
      </div>

      {/* Engagement */}
      <div className="px-3 py-2 border-t border-gray-100">
        <div className="flex items-center justify-around text-gray-500">
          <button className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span>אהבתי</span>
          </button>
          <button className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>תגובה</span>
          </button>
          <button className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>שתף</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PinterestPreview({
  imageUrl,
  caption,
}: Omit<PlatformPreviewProps, "platform" | "hashtags">) {
  return (
    <div className="w-[240px] bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
      {/* Image (2:3) */}
      <div className="w-full" style={{ aspectRatio: "2/3" }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-brand-cream flex items-center justify-center text-brand-charcoal-light/30 text-sm">
            תמונה
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
          {caption.slice(0, 60)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center text-white text-[8px] font-bold">
            N
          </div>
          <p className="text-xs text-gray-500">נועל'ה תכשיטים</p>
        </div>
      </div>
    </div>
  );
}

export function PlatformPreview({
  platform,
  imageUrl,
  caption,
  hashtags,
}: PlatformPreviewProps) {
  return (
    <div className={cn("flex justify-center")}>
      {platform === "instagram" && (
        <InstagramPreview
          imageUrl={imageUrl}
          caption={caption}
          hashtags={hashtags}
        />
      )}
      {platform === "facebook" && (
        <FacebookPreview imageUrl={imageUrl} caption={caption} />
      )}
      {platform === "pinterest" && (
        <PinterestPreview imageUrl={imageUrl} caption={caption} />
      )}
    </div>
  );
}
