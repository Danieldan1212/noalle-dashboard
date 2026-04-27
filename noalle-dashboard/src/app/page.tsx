"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  DollarSign,
  Heart,
  PlusCircle,
  Users,
  FileText,
  Sparkles,
  Clock,
  Package,
  MessageCircle,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { getHebrewGreeting, formatCurrency, formatRelativeDate } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "order" | "interaction" | "post" | "customer";
  title: string;
  description: string;
  timestamp: string;
  icon: typeof ShoppingBag;
  color: string;
}

const DEMO_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "order",
    title: "הזמנה חדשה",
    description: "שרשרת זהב עדינה - רונית כהן",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    icon: Package,
    color: "text-green-600 bg-green-50",
  },
  {
    id: "2",
    type: "interaction",
    title: "שיחה עם לקוחה",
    description: "מיכל לוי - דיון על טבעת מותאמת אישית",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    icon: MessageCircle,
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: "3",
    type: "post",
    title: "פוסט פורסם באינסטגרם",
    description: "קולקציית האביב החדשה - 234 לייקים",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    icon: Share2,
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: "4",
    type: "customer",
    title: "לקוחה חדשה",
    description: "שירה דוד - הגיעה מאינסטגרם",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    icon: Users,
    color: "text-brand-gold bg-brand-gold/10",
  },
  {
    id: "5",
    type: "order",
    title: "הזמנה נשלחה",
    description: "עגילי פנינה - נורית אברהם",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    icon: Package,
    color: "text-teal-600 bg-teal-50",
  },
  {
    id: "6",
    type: "interaction",
    title: "הודעת ווטסאפ",
    description: "ענת פרידמן - שאלה על צמיד",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    icon: MessageCircle,
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: "7",
    type: "post",
    title: "פוסט תוזמן לפייסבוק",
    description: "מבצע סוף שבוע - מחר ב-10:00",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    icon: Share2,
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: "8",
    type: "order",
    title: "תשלום התקבל",
    description: "טבעת יהלום - דנה שלום",
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    icon: DollarSign,
    color: "text-green-600 bg-green-50",
  },
  {
    id: "9",
    type: "customer",
    title: "לקוחת VIP",
    description: "רחל גולדברג - רכישה שלישית השנה",
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    icon: Sparkles,
    color: "text-brand-gold bg-brand-gold/10",
  },
  {
    id: "10",
    type: "interaction",
    title: "מעקב טלפוני",
    description: "יעל כץ - אישור קבלת הזמנה",
    timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    icon: MessageCircle,
    color: "text-blue-600 bg-blue-50",
  },
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getHebrewGreeting());
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-charcoal">
          {greeting} <span className="text-gold-gradient">רועי</span>
        </h1>
        <p className="text-brand-charcoal-light/60 mt-1">
          הנה סיכום היום שלך
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="הזמנות היום"
          value="8"
          subtitle="3 ממתינות לאישור"
          icon={ShoppingBag}
          trend={{ value: 12, label: "מאתמול" }}
          color="gold"
        />
        <StatCard
          title="הכנסות היום"
          value={formatCurrency(14250)}
          subtitle="ממוצע הזמנה: 1,781 ILS"
          icon={DollarSign}
          trend={{ value: 8, label: "מאתמול" }}
          color="green"
        />
        <StatCard
          title="מעורבות חברתית"
          value="1,247"
          subtitle="לייקים, תגובות ושיתופים"
          icon={Heart}
          trend={{ value: 23, label: "מהשבוע שעבר" }}
          color="rose"
        />
        <StatCard
          title="לקוחות חדשים"
          value="5"
          subtitle="3 מאינסטגרם, 2 מהאתר"
          icon={Users}
          trend={{ value: 15, label: "מהשבוע שעבר" }}
          color="blue"
        />
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-brand-charcoal mb-4">פעולות מהירות</h2>
          <div className="space-y-3">
            <Link
              href="/social"
              className="flex items-center gap-3 p-4 rounded-xl bg-brand-gold/5 border border-brand-gold/10 hover:bg-brand-gold/10 hover:border-brand-gold/20 transition-all group"
            >
              <div className="p-2.5 rounded-xl gold-gradient text-white group-hover:shadow-md transition-shadow">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-brand-charcoal">
                  פוסט חדש
                </p>
                <p className="text-xs text-brand-charcoal-light/50">
                  צור ופרסם תוכן ברשתות
                </p>
              </div>
            </Link>

            <Link
              href="/crm"
              className="flex items-center gap-3 p-4 rounded-xl bg-brand-rose/5 border border-brand-rose/10 hover:bg-brand-rose/10 hover:border-brand-rose/20 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-brand-rose text-white group-hover:shadow-md transition-shadow">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-brand-charcoal">
                  הוסף ליד
                </p>
                <p className="text-xs text-brand-charcoal-light/50">
                  הוסף לקוח חדש למערכת
                </p>
              </div>
            </Link>

            <Link
              href="/analytics"
              className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-blue-500 text-white group-hover:shadow-md transition-shadow">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-brand-charcoal">
                  צפה בדוח
                </p>
                <p className="text-xs text-brand-charcoal-light/50">
                  דוחות מכירות ואנליטיקס
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-charcoal">פעילות אחרונה</h2>
            <span className="text-xs text-brand-charcoal-light/50">
              10 פריטים אחרונים
            </span>
          </div>
          <div className="space-y-1">
            {DEMO_ACTIVITIES.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-brand-cream/50 transition-colors group"
                >
                  <div
                    className={`p-2 rounded-xl ${activity.color} flex-shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-charcoal">
                      {activity.title}
                    </p>
                    <p className="text-xs text-brand-charcoal-light/60 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-charcoal-light/40 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeDate(activity.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Follow-up Alerts */}
      <div className="glass-card p-6 border-r-4 border-r-amber-400">
        <h2 className="font-bold text-brand-charcoal mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          תזכורות מעקב
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "מיכל לוי",
              days: 8,
              lastAction: "הצעת מחיר לטבעת",
            },
            {
              name: "שרה כהן",
              days: 10,
              lastAction: "שאלה על שרשרת",
            },
            {
              name: "רונית אברהם",
              days: 7,
              lastAction: "התעניינות בעגילים",
            },
          ].map((alert) => (
            <div
              key={alert.name}
              className="p-4 rounded-xl bg-amber-50 border border-amber-100"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm text-brand-charcoal">
                  {alert.name}
                </p>
                <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                  {alert.days} ימים
                </span>
              </div>
              <p className="text-xs text-brand-charcoal-light/60">
                {alert.lastAction}
              </p>
              <p className="text-xs text-red-500 mt-1">
                לקוחה לא שמעה ממך {alert.days} ימים
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
