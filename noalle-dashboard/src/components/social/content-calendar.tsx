"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from "date-fns";
import { he } from "date-fns/locale";
import {
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Instagram,
  Facebook,
  Pin,
  Clock,
  CheckCircle2,
} from "lucide-react";
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

interface ContentCalendarProps {
  posts: CalendarPost[];
  onPostClick?: (post: CalendarPost) => void;
}

const WEEKDAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

const platformIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  facebook: Facebook,
  pinterest: Pin,
};

export function ContentCalendar({ posts, onPostClick }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("month");

  const days = useMemo(() => {
    if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    }

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate, view]);

  const getPostsForDay = (day: Date): CalendarPost[] => {
    return posts.filter((post) => {
      const postDate = post.scheduledFor || post.postedAt;
      if (!postDate) return false;
      return isSameDay(new Date(postDate), day);
    });
  };

  const navigate = (direction: "prev" | "next") => {
    if (view === "month") {
      setCurrentDate(
        direction === "next"
          ? addMonths(currentDate, 1)
          : subMonths(currentDate, 1)
      );
    } else {
      setCurrentDate(
        direction === "next"
          ? addWeeks(currentDate, 1)
          : subWeeks(currentDate, 1)
      );
    }
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-brand-gold" />
          <h3 className="font-bold text-brand-charcoal text-lg">לוח תוכן</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-brand-cream rounded-lg p-0.5">
            <button
              onClick={() => setView("week")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                view === "week"
                  ? "bg-white text-brand-charcoal shadow-sm"
                  : "text-brand-charcoal-light/60"
              )}
            >
              שבועי
            </button>
            <button
              onClick={() => setView("month")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                view === "month"
                  ? "bg-white text-brand-charcoal shadow-sm"
                  : "text-brand-charcoal-light/60"
              )}
            >
              חודשי
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("next")}
              className="p-1.5 rounded-lg hover:bg-brand-cream transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-brand-charcoal min-w-[120px] text-center">
              {format(currentDate, view === "month" ? "MMMM yyyy" : "'שבוע' w, yyyy", {
                locale: he,
              })}
            </span>
            <button
              onClick={() => navigate("prev")}
              className="p-1.5 rounded-lg hover:bg-brand-cream transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-brand-charcoal-light/60 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayPosts = getPostsForDay(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[80px] p-2 rounded-lg border transition-colors",
                view === "week" ? "min-h-[120px]" : "min-h-[80px]",
                isToday
                  ? "border-brand-gold/30 bg-brand-gold/5"
                  : "border-transparent hover:border-brand-cream-dark",
                !isCurrentMonth && "opacity-40"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    isToday
                      ? "text-brand-gold font-bold"
                      : "text-brand-charcoal-light/70"
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayPosts.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-bold flex items-center justify-center">
                    {dayPosts.length}
                  </span>
                )}
              </div>

              {/* Post indicators */}
              <div className="space-y-1">
                {dayPosts.slice(0, view === "week" ? 3 : 2).map((post) => {
                  const platforms = post.platforms.split(",");
                  return (
                    <button
                      key={post.id}
                      onClick={() => onPostClick?.(post)}
                      className={cn(
                        "w-full flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate transition-colors",
                        post.status === "posted"
                          ? "bg-green-50 text-green-700"
                          : post.status === "scheduled"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {post.status === "posted" ? (
                        <CheckCircle2 className="w-2.5 h-2.5 flex-shrink-0" />
                      ) : (
                        <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                      )}
                      <span className="flex gap-0.5">
                        {platforms.map((p) => {
                          const Icon = platformIcons[p.trim()];
                          return Icon ? (
                            <Icon key={p} className="w-2.5 h-2.5" />
                          ) : null;
                        })}
                      </span>
                    </button>
                  );
                })}
                {dayPosts.length > (view === "week" ? 3 : 2) && (
                  <span className="text-[10px] text-brand-charcoal-light/50">
                    +{dayPosts.length - (view === "week" ? 3 : 2)} עוד
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
