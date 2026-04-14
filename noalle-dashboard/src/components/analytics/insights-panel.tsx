"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  Zap,
  DollarSign,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightsPanelProps {
  className?: string;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: "trend" | "opportunity" | "action";
  priority: "high" | "medium" | "low";
  metric?: string;
  metricChange?: number;
}

const DEMO_INSIGHTS: Insight[] = [
  {
    id: "1",
    title: "עלייה בביקוש לשרשראות",
    description:
      "שרשראות זהב הראו עלייה של 35% במכירות ו-48% בחיפושים באינסטגרם. מומלץ להגדיל את מלאי השרשראות ולהכין קמפיין ממוקד.",
    type: "trend",
    priority: "high",
    metric: "+35%",
    metricChange: 35,
  },
  {
    id: "2",
    title: "פוסטים עם לקוחות מניבים יותר",
    description:
      "תמונות של לקוחות עם תכשיטים מקבלות מעורבות גבוהה ב-67% מפוסטים רגילים. מומלץ ליצור סדרת 'הלקוחות שלנו'.",
    type: "opportunity",
    priority: "high",
    metric: "+67%",
    metricChange: 67,
  },
  {
    id: "3",
    title: "הזמן האופטימלי לפרסום: 20:00",
    description:
      "ניתוח 90 ימים מראה שפרסום בין 19:00-21:00 בימים ב-ד מניב את המעורבות הגבוהה ביותר. שישי-שבת מראים ירידה משמעותית.",
    type: "action",
    priority: "medium",
  },
  {
    id: "4",
    title: "פינטרסט - הזדמנות לא מנוצלת",
    description:
      "למרות שרק 15% מהפוסטים מפורסמים בפינטרסט, הפלטפורמה מייצרת 22% מהתנועה לאתר. הגדלת הנוכחות בפינטרסט יכולה להכפיל תנועה.",
    type: "opportunity",
    priority: "high",
    metric: "+22%",
    metricChange: 22,
  },
  {
    id: "5",
    title: "שיעור חזרה של לקוחות עולה",
    description:
      "32% מהלקוחות חזרו לרכישה שנייה תוך 90 יום, עלייה מ-24% ברבעון הקודם. תוכנית VIP יכולה להגדיל את השיעור הזה עוד.",
    type: "trend",
    priority: "medium",
    metric: "32%",
    metricChange: 8,
  },
  {
    id: "6",
    title: "ROI הגבוה ביותר: אינסטגרם",
    description:
      "עלות לרכישה באינסטגרם עומדת על 45 שקלים לעומת 78 בפייסבוק. מומלץ להעביר 20% מתקציב הפייסבוק לאינסטגרם.",
    type: "action",
    priority: "high",
    metric: "45 ILS",
    metricChange: -42,
  },
];

const ROI_DATA = [
  { platform: "אינסטגרם", spend: 2500, revenue: 18500, roi: 640, color: "bg-brand-gold" },
  { platform: "פייסבוק", spend: 1800, revenue: 8200, roi: 356, color: "bg-blue-500" },
  { platform: "פינטרסט", spend: 800, revenue: 5400, roi: 575, color: "bg-red-500" },
];

const POST_SALES_CONNECTION = [
  { post: "שרשרת זהב - קולקציה חדשה", views: 12400, clicks: 890, sales: 23, revenue: 34500 },
  { post: "מבצע חג - 20% הנחה", views: 8900, clicks: 1240, sales: 45, revenue: 52000 },
  { post: "עגילי פנינה - סיפור יצירה", views: 15600, clicks: 670, sales: 18, revenue: 21600 },
  { post: "צמיד זהב - מתנה מושלמת", views: 9800, clicks: 540, sales: 12, revenue: 16800 },
];

export function InsightsPanel({ className }: InsightsPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const typeIcons: Record<string, typeof TrendingUp> = {
    trend: TrendingUp,
    opportunity: Lightbulb,
    action: Target,
  };

  const typeLabels: Record<string, string> = {
    trend: "מגמה",
    opportunity: "הזדמנות",
    action: "המלצה",
  };

  const typeColors: Record<string, string> = {
    trend: "bg-blue-50 text-blue-700 border-blue-100",
    opportunity: "bg-green-50 text-green-700 border-green-100",
    action: "bg-amber-50 text-amber-700 border-amber-100",
  };

  const priorityColors: Record<string, string> = {
    high: "bg-red-50 text-red-600",
    medium: "bg-amber-50 text-amber-600",
    low: "bg-green-50 text-green-600",
  };

  const priorityLabels: Record<string, string> = {
    high: "גבוה",
    medium: "בינוני",
    low: "נמוך",
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* AI Insights Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-gold" />
          <h3 className="font-bold text-brand-charcoal text-lg">
            תובנות חכמות
          </h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <RefreshCw
            className={cn("w-4 h-4", isRefreshing && "animate-spin")}
          />
          {isRefreshing ? "מנתח..." : "עדכן תובנות"}
        </button>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {DEMO_INSIGHTS.map((insight) => {
          const TypeIcon = typeIcons[insight.type];
          return (
            <div
              key={insight.id}
              className="glass-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "p-2 rounded-xl border",
                      typeColors[insight.type]
                    )}
                  >
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full",
                        typeColors[insight.type]
                      )}
                    >
                      {typeLabels[insight.type]}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full",
                    priorityColors[insight.priority]
                  )}
                >
                  {priorityLabels[insight.priority]}
                </span>
              </div>
              <h4 className="font-bold text-sm text-brand-charcoal mb-2">
                {insight.title}
              </h4>
              <p className="text-xs text-brand-charcoal-light/70 leading-relaxed">
                {insight.description}
              </p>
              {insight.metric && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-brand-cream-dark/50">
                  {insight.metricChange && insight.metricChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm font-bold text-brand-gold">
                    {insight.metric}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Post-to-Sales Connection */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-brand-charcoal mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-gold" />
          קשר בין פוסטים למכירות
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-cream-dark">
                <th className="text-right text-xs font-medium text-brand-charcoal-light/60 pb-3 pr-2">
                  פוסט
                </th>
                <th className="text-right text-xs font-medium text-brand-charcoal-light/60 pb-3">
                  צפיות
                </th>
                <th className="text-right text-xs font-medium text-brand-charcoal-light/60 pb-3">
                  קליקים
                </th>
                <th className="text-right text-xs font-medium text-brand-charcoal-light/60 pb-3">
                  מכירות
                </th>
                <th className="text-right text-xs font-medium text-brand-charcoal-light/60 pb-3">
                  הכנסה
                </th>
              </tr>
            </thead>
            <tbody>
              {POST_SALES_CONNECTION.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-brand-cream-dark/50 last:border-0"
                >
                  <td className="py-3 pr-2 text-sm text-brand-charcoal font-medium">
                    {item.post}
                  </td>
                  <td className="py-3 text-sm text-brand-charcoal-light">
                    {item.views.toLocaleString("he-IL")}
                  </td>
                  <td className="py-3 text-sm text-brand-charcoal-light">
                    {item.clicks.toLocaleString("he-IL")}
                  </td>
                  <td className="py-3 text-sm font-medium text-brand-charcoal">
                    {item.sales}
                  </td>
                  <td className="py-3 text-sm font-bold text-brand-gold">
                    {new Intl.NumberFormat("he-IL", {
                      style: "currency",
                      currency: "ILS",
                      minimumFractionDigits: 0,
                    }).format(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI per Platform */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-brand-charcoal mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-brand-gold" />
          ROI לפי פלטפורמה
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {ROI_DATA.map((item) => (
            <div
              key={item.platform}
              className="p-4 rounded-xl bg-brand-cream/50 border border-brand-cream-dark/50"
            >
              <h4 className="font-medium text-sm text-brand-charcoal mb-3">
                {item.platform}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-charcoal-light/60">הוצאה</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("he-IL", {
                      style: "currency",
                      currency: "ILS",
                      minimumFractionDigits: 0,
                    }).format(item.spend)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-brand-charcoal-light/60">הכנסה</span>
                  <span className="font-medium text-green-600">
                    {new Intl.NumberFormat("he-IL", {
                      style: "currency",
                      currency: "ILS",
                      minimumFractionDigits: 0,
                    }).format(item.revenue)}
                  </span>
                </div>
                <div className="pt-2 border-t border-brand-cream-dark/50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-brand-charcoal-light/60">
                      ROI
                    </span>
                    <span className="text-lg font-bold text-brand-gold">
                      {item.roi}%
                    </span>
                  </div>
                  <div className="w-full bg-brand-cream-dark rounded-full h-2 mt-2">
                    <div
                      className={cn("h-2 rounded-full", item.color)}
                      style={{ width: `${Math.min(item.roi / 8, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
