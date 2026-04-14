"use client";

import { useState } from "react";
import { BarChart3, Share2, Lightbulb, TrendingUp, DollarSign, Users, ShoppingBag } from "lucide-react";
import { SalesChart } from "@/components/analytics/sales-chart";
import { EngagementChart } from "@/components/analytics/engagement-chart";
import { InsightsPanel } from "@/components/analytics/insights-panel";
import { StatCard } from "@/components/ui/stat-card";
import { cn, formatCurrency } from "@/lib/utils";

type Tab = "sales" | "social" | "insights";

const TABS: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "sales", label: "מכירות", icon: BarChart3 },
  { id: "social", label: "רשתות חברתיות", icon: Share2 },
  { id: "insights", label: "תובנות", icon: Lightbulb },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("sales");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">אנליטיקס</h1>
          <p className="text-brand-charcoal-light/60 text-sm mt-1">
            נתוני מכירות, מעורבות ותובנות עסקיות
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-brand-cream rounded-xl p-1 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white text-brand-charcoal shadow-sm"
                  : "text-brand-charcoal-light/60 hover:text-brand-charcoal"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="הכנסות החודש"
              value={formatCurrency(142500)}
              icon={DollarSign}
              trend={{ value: 18, label: "מהחודש שעבר" }}
              color="gold"
            />
            <StatCard
              title="הזמנות החודש"
              value="87"
              icon={ShoppingBag}
              trend={{ value: 12, label: "מהחודש שעבר" }}
              color="green"
            />
            <StatCard
              title="ערך הזמנה ממוצע"
              value={formatCurrency(1638)}
              icon={TrendingUp}
              trend={{ value: 5, label: "מהחודש שעבר" }}
              color="blue"
            />
            <StatCard
              title="לקוחות חוזרים"
              value="32%"
              subtitle="28 מתוך 87"
              icon={Users}
              trend={{ value: 8, label: "מהחודש שעבר" }}
              color="rose"
            />
          </div>

          <SalesChart />
        </div>
      )}

      {/* Social Tab */}
      {activeTab === "social" && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="סך עוקבים"
              value="19,850"
              subtitle="כל הפלטפורמות"
              icon={Users}
              trend={{ value: 4.2, label: "מהחודש שעבר" }}
              color="gold"
            />
            <StatCard
              title="מעורבות ממוצעת"
              value="5.2%"
              subtitle="לייקים + תגובות / עוקבים"
              icon={TrendingUp}
              trend={{ value: 0.8, label: "מהחודש שעבר" }}
              color="green"
            />
            <StatCard
              title="פוסטים החודש"
              value="24"
              subtitle="8 IG, 10 FB, 6 PIN"
              icon={Share2}
              trend={{ value: -5, label: "מהחודש שעבר" }}
              color="blue"
            />
            <StatCard
              title="חשיפה כוללת"
              value="45.2K"
              subtitle="30 ימים אחרונים"
              icon={BarChart3}
              trend={{ value: 15, label: "מהחודש שעבר" }}
              color="rose"
            />
          </div>

          <EngagementChart />
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <InsightsPanel />
      )}
    </div>
  );
}
