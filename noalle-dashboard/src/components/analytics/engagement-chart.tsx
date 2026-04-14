"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { Instagram, Facebook, Pin, Eye, Heart, MessageCircle } from "lucide-react";

interface EngagementChartProps {
  className?: string;
}

// Demo data
const ENGAGEMENT_BY_PLATFORM = [
  { platform: "אינסטגרם", likes: 2840, comments: 342, saves: 567, shares: 128 },
  { platform: "פייסבוק", likes: 1250, comments: 198, saves: 89, shares: 345 },
  { platform: "פינטרסט", likes: 890, comments: 45, saves: 1230, shares: 67 },
];

const FOLLOWER_GROWTH = [
  { month: "ינואר", instagram: 5200, facebook: 3100, pinterest: 1800 },
  { month: "פברואר", instagram: 5450, facebook: 3200, pinterest: 1950 },
  { month: "מרץ", instagram: 5800, facebook: 3350, pinterest: 2100 },
  { month: "אפריל", instagram: 6200, facebook: 3450, pinterest: 2350 },
  { month: "מאי", instagram: 6700, facebook: 3600, pinterest: 2600 },
  { month: "יוני", instagram: 7100, facebook: 3750, pinterest: 2800 },
  { month: "יולי", instagram: 7600, facebook: 3900, pinterest: 3050 },
  { month: "אוגוסט", instagram: 8200, facebook: 4050, pinterest: 3300 },
  { month: "ספטמבר", instagram: 8800, facebook: 4200, pinterest: 3500 },
  { month: "אוקטובר", instagram: 9400, facebook: 4400, pinterest: 3750 },
  { month: "נובמבר", instagram: 10100, facebook: 4600, pinterest: 4000 },
  { month: "דצמבר", instagram: 10800, facebook: 4800, pinterest: 4250 },
];

const TOP_POSTS = [
  {
    id: "1",
    thumbnail: "/placeholder-ring.jpg",
    caption: "טבעת זהב עדינה בעיצוב ייחודי",
    likes: 456,
    comments: 89,
    platform: "instagram",
  },
  {
    id: "2",
    thumbnail: "/placeholder-necklace.jpg",
    caption: "שרשרת פנינים קלאסית",
    likes: 398,
    comments: 67,
    platform: "instagram",
  },
  {
    id: "3",
    thumbnail: "/placeholder-earrings.jpg",
    caption: "עגילי טיפה מזהב",
    likes: 345,
    comments: 52,
    platform: "facebook",
  },
  {
    id: "4",
    thumbnail: "/placeholder-bracelet.jpg",
    caption: "צמיד זהב עם יהלומים",
    likes: 312,
    comments: 48,
    platform: "pinterest",
  },
  {
    id: "5",
    thumbnail: "/placeholder-set.jpg",
    caption: "סט תכשיטים מושלם",
    likes: 289,
    comments: 41,
    platform: "instagram",
  },
];

const BEST_POSTING_TIMES = [
  { hour: "08:00", sun: 3, mon: 5, tue: 4, wed: 6, thu: 5, fri: 8, sat: 2 },
  { hour: "10:00", sun: 5, mon: 7, tue: 6, wed: 8, thu: 7, fri: 4, sat: 3 },
  { hour: "12:00", sun: 7, mon: 8, tue: 9, wed: 7, thu: 8, fri: 3, sat: 4 },
  { hour: "14:00", sun: 4, mon: 6, tue: 7, wed: 5, thu: 6, fri: 2, sat: 5 },
  { hour: "16:00", sun: 6, mon: 5, tue: 5, wed: 6, thu: 4, fri: 1, sat: 6 },
  { hour: "18:00", sun: 8, mon: 7, tue: 8, wed: 9, thu: 7, fri: 1, sat: 7 },
  { hour: "20:00", sun: 9, mon: 9, tue: 10, wed: 8, thu: 9, fri: 2, sat: 9 },
  { hour: "22:00", sun: 6, mon: 7, tue: 6, wed: 5, thu: 6, fri: 3, sat: 8 },
];

const CONTENT_TYPE_DATA = [
  { type: "מוצר", engagement: 4.2, reach: 8500 },
  { type: "לייפסטייל", engagement: 5.8, reach: 12000 },
  { type: "מאחורי הקלעים", engagement: 6.5, reach: 9800 },
  { type: "לקוחות", engagement: 7.1, reach: 11200 },
  { type: "טיפים", engagement: 3.9, reach: 7200 },
];

function HeatmapCell({ value, max }: { value: number; max: number }) {
  const intensity = value / max;
  const bgColor =
    intensity > 0.8
      ? "bg-brand-gold"
      : intensity > 0.6
        ? "bg-brand-gold/70"
        : intensity > 0.4
          ? "bg-brand-gold/40"
          : intensity > 0.2
            ? "bg-brand-gold/20"
            : "bg-brand-gold/5";

  return (
    <div
      className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium", bgColor)}
      title={`${value} אינטראקציות`}
    >
      {value > 0 ? value : ""}
    </div>
  );
}

export function EngagementChart({ className }: EngagementChartProps) {
  const heatmapMax = Math.max(
    ...BEST_POSTING_TIMES.flatMap((t) => [t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat])
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Engagement by Platform */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-brand-charcoal mb-6">
          מעורבות לפי פלטפורמה
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ENGAGEMENT_BY_PLATFORM}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5edd8" />
            <XAxis dataKey="platform" tick={{ fontSize: 12 }} stroke="#4a4a4a" />
            <YAxis tick={{ fontSize: 12 }} stroke="#4a4a4a" />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #f5edd8",
                borderRadius: "12px",
                direction: "rtl",
              }}
            />
            <Legend
              formatter={(value) => {
                const labels: Record<string, string> = {
                  likes: "לייקים",
                  comments: "תגובות",
                  saves: "שמירות",
                  shares: "שיתופים",
                };
                return (
                  <span className="text-xs text-brand-charcoal">
                    {labels[value] || value}
                  </span>
                );
              }}
            />
            <Bar dataKey="likes" fill="#b8860b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="comments" fill="#e8b4b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="saves" fill="#d4a634" radius={[4, 4, 0, 0]} />
            <Bar dataKey="shares" fill="#c9888e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Follower Growth */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-brand-charcoal mb-6">
          צמיחת עוקבים
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={FOLLOWER_GROWTH}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5edd8" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#4a4a4a" />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="#4a4a4a"
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #f5edd8",
                borderRadius: "12px",
                direction: "rtl",
              }}
            />
            <Legend
              formatter={(value) => {
                const labels: Record<string, string> = {
                  instagram: "אינסטגרם",
                  facebook: "פייסבוק",
                  pinterest: "פינטרסט",
                };
                return (
                  <span className="text-xs text-brand-charcoal">
                    {labels[value] || value}
                  </span>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="instagram"
              stroke="#b8860b"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="facebook"
              stroke="#4267B2"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="pinterest"
              stroke="#BD081C"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Posts */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-brand-charcoal mb-4">
            פוסטים מובילים
          </h3>
          <div className="space-y-3">
            {TOP_POSTS.map((post, index) => {
              const PlatformIcon =
                post.platform === "instagram"
                  ? Instagram
                  : post.platform === "facebook"
                    ? Facebook
                    : Pin;
              return (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-brand-cream/50"
                >
                  <span className="text-sm font-bold text-brand-gold/60 w-5">
                    {index + 1}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-brand-cream-dark flex items-center justify-center">
                    <PlatformIcon className="w-4 h-4 text-brand-charcoal-light/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-brand-charcoal truncate">
                      {post.caption}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[10px] text-brand-charcoal-light/60">
                        <Heart className="w-3 h-3" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-brand-charcoal-light/60">
                        <MessageCircle className="w-3 h-3" /> {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Posting Times Heatmap */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-brand-charcoal mb-4">
            זמני פרסום מומלצים
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-xs text-brand-charcoal-light/60 pb-2">שעה</th>
                  <th className="text-xs text-brand-charcoal-light/60 pb-2">א</th>
                  <th className="text-xs text-brand-charcoal-light/60 pb-2">ב</th>
                  <th className="text-xs text-brand-charcoal-light/60 pb-2">ג</th>
                  <th className="text-xs text-brand-charcoal-light/60 pb-2">ד</th>
                  <th className="text-xs text-brand-charcoal-light/60 pb-2">ה</th>
                  <th className="text-xs text-brand-charcoal-light/60 pb-2">ו</th>
                  <th className="text-xs text-brand-charcoal-light/60 pb-2">ש</th>
                </tr>
              </thead>
              <tbody>
                {BEST_POSTING_TIMES.map((row) => (
                  <tr key={row.hour}>
                    <td className="text-xs text-brand-charcoal-light/60 pr-2 py-0.5">
                      {row.hour}
                    </td>
                    <td className="p-0.5">
                      <HeatmapCell value={row.sun} max={heatmapMax} />
                    </td>
                    <td className="p-0.5">
                      <HeatmapCell value={row.mon} max={heatmapMax} />
                    </td>
                    <td className="p-0.5">
                      <HeatmapCell value={row.tue} max={heatmapMax} />
                    </td>
                    <td className="p-0.5">
                      <HeatmapCell value={row.wed} max={heatmapMax} />
                    </td>
                    <td className="p-0.5">
                      <HeatmapCell value={row.thu} max={heatmapMax} />
                    </td>
                    <td className="p-0.5">
                      <HeatmapCell value={row.fri} max={heatmapMax} />
                    </td>
                    <td className="p-0.5">
                      <HeatmapCell value={row.sat} max={heatmapMax} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Content Type Performance */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-brand-charcoal mb-6">
          ביצועים לפי סוג תוכן
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={CONTENT_TYPE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5edd8" />
            <XAxis dataKey="type" tick={{ fontSize: 12 }} stroke="#4a4a4a" />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#4a4a4a" />
            <YAxis
              yAxisId="right"
              orientation="left"
              tick={{ fontSize: 11 }}
              stroke="#4a4a4a"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #f5edd8",
                borderRadius: "12px",
                direction: "rtl",
              }}
            />
            <Legend
              formatter={(value) => {
                const labels: Record<string, string> = {
                  engagement: "מעורבות (%)",
                  reach: "חשיפה",
                };
                return (
                  <span className="text-xs text-brand-charcoal">
                    {labels[value] || value}
                  </span>
                );
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="engagement"
              fill="#b8860b"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="reach"
              fill="#e8b4b8"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
