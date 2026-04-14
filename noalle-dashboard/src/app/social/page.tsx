"use client";

import { useState } from "react";
import { ImagePlus, Calendar } from "lucide-react";
import { PostCreator, type PostData } from "@/components/social/post-creator";
import { ContentCalendar } from "@/components/social/content-calendar";
import { cn } from "@/lib/utils";

interface CalendarPost {
  id: string;
  imageUrl: string;
  captionHe: string;
  platforms: string;
  status: string;
  scheduledFor?: string | null;
  postedAt?: string | null;
}

// Demo calendar data
const DEMO_CALENDAR_POSTS: CalendarPost[] = [
  {
    id: "p1",
    imageUrl: "/placeholder.jpg",
    captionHe: "שרשרת זהב עדינה - חדש בקולקציה",
    platforms: "instagram,facebook",
    status: "posted",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p2",
    imageUrl: "/placeholder.jpg",
    captionHe: "עגילי פנינה קלאסיים",
    platforms: "instagram",
    status: "posted",
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p3",
    imageUrl: "/placeholder.jpg",
    captionHe: "מבצע סוף שבוע - 20% הנחה",
    platforms: "instagram,facebook,pinterest",
    status: "scheduled",
    scheduledFor: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p4",
    imageUrl: "/placeholder.jpg",
    captionHe: "טבעת אירוסין מותאמת אישית",
    platforms: "instagram,pinterest",
    status: "scheduled",
    scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p5",
    imageUrl: "/placeholder.jpg",
    captionHe: "צמיד זהב עם יהלומים",
    platforms: "facebook",
    status: "draft",
    scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p6",
    imageUrl: "/placeholder.jpg",
    captionHe: "סט תכשיטים מושלם למתנה",
    platforms: "instagram,facebook",
    status: "posted",
    postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "p7",
    imageUrl: "/placeholder.jpg",
    captionHe: "תליון לב זהב - האהבה שלנו",
    platforms: "instagram,pinterest",
    status: "posted",
    postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function SocialPage() {
  const [activeView, setActiveView] = useState<"create" | "calendar">("create");
  const [calendarPosts, setCalendarPosts] = useState<CalendarPost[]>(DEMO_CALENDAR_POSTS);

  const handlePublish = async (data: PostData) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          hashtags: data.hashtags.join(","),
          hashtagsEn: data.hashtagsEn.join(","),
          platforms: data.platforms.join(","),
          status: "posted",
          postedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const newPost: CalendarPost = {
          id: `p${Date.now()}`,
          imageUrl: data.enhancedUrl || data.imageUrl,
          captionHe: data.captionHe,
          platforms: data.platforms.join(","),
          status: "posted",
          postedAt: new Date().toISOString(),
        };
        setCalendarPosts((prev) => [...prev, newPost]);
      }
    } catch (error) {
      console.error("Failed to publish:", error);
    }
  };

  const handleSchedule = async (data: PostData & { scheduledFor: string }) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          hashtags: data.hashtags.join(","),
          hashtagsEn: data.hashtagsEn.join(","),
          platforms: data.platforms.join(","),
          status: "scheduled",
        }),
      });

      if (response.ok) {
        const newPost: CalendarPost = {
          id: `p${Date.now()}`,
          imageUrl: data.enhancedUrl || data.imageUrl,
          captionHe: data.captionHe,
          platforms: data.platforms.join(","),
          status: "scheduled",
          scheduledFor: data.scheduledFor,
        };
        setCalendarPosts((prev) => [...prev, newPost]);
      }
    } catch (error) {
      console.error("Failed to schedule:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">
            רשתות חברתיות
          </h1>
          <p className="text-brand-charcoal-light/60 text-sm mt-1">
            צור, שפר ופרסם תוכן בכל הפלטפורמות
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-brand-cream rounded-xl p-1">
          <button
            onClick={() => setActiveView("create")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeView === "create"
                ? "bg-white text-brand-charcoal shadow-sm"
                : "text-brand-charcoal-light/60 hover:text-brand-charcoal"
            )}
          >
            <ImagePlus className="w-4 h-4" />
            יצירת פוסט
          </button>
          <button
            onClick={() => setActiveView("calendar")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeView === "calendar"
                ? "bg-white text-brand-charcoal shadow-sm"
                : "text-brand-charcoal-light/60 hover:text-brand-charcoal"
            )}
          >
            <Calendar className="w-4 h-4" />
            לוח תוכן
          </button>
        </div>
      </div>

      {/* Content */}
      {activeView === "create" && (
        <PostCreator onPublish={handlePublish} onSchedule={handleSchedule} />
      )}

      {activeView === "calendar" && (
        <ContentCalendar posts={calendarPosts} />
      )}
    </div>
  );
}
