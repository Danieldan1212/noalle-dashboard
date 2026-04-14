"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn, formatCurrency } from "@/lib/utils";

interface SalesChartProps {
  className?: string;
}

// Demo data
const REVENUE_DATA = [
  { date: "01/01", revenue: 12500, orders: 8 },
  { date: "02/01", revenue: 18200, orders: 12 },
  { date: "03/01", revenue: 8700, orders: 5 },
  { date: "04/01", revenue: 22100, orders: 14 },
  { date: "05/01", revenue: 19500, orders: 11 },
  { date: "06/01", revenue: 31200, orders: 18 },
  { date: "07/01", revenue: 28400, orders: 16 },
  { date: "08/01", revenue: 15600, orders: 9 },
  { date: "09/01", revenue: 35800, orders: 22 },
  { date: "10/01", revenue: 42100, orders: 25 },
  { date: "11/01", revenue: 38900, orders: 21 },
  { date: "12/01", revenue: 47500, orders: 28 },
];

const TOP_PRODUCTS = [
  { name: "שרשרת זהב עדינה", sales: 45 },
  { name: "עגילי פנינה", sales: 38 },
  { name: "טבעת יהלום", sales: 32 },
  { name: "צמיד זהב", sales: 28 },
  { name: "תליון לב", sales: 22 },
];

const GEO_DATA = [
  { name: "ישראל", value: 72, color: "#b8860b" },
  { name: "ארה\"ב", value: 15, color: "#e8b4b8" },
  { name: "אירופה", value: 8, color: "#d4a634" },
  { name: "אחר", value: 5, color: "#f5edd8" },
];

const AOV_DATA = [
  { month: "ינואר", aov: 1560 },
  { month: "פברואר", aov: 1520 },
  { month: "מרץ", aov: 1740 },
  { month: "אפריל", aov: 1580 },
  { month: "מאי", aov: 1770 },
  { month: "יוני", aov: 1730 },
  { month: "יולי", aov: 1775 },
  { month: "אוגוסט", aov: 1733 },
  { month: "ספטמבר", aov: 1627 },
  { month: "אוקטובר", aov: 1684 },
  { month: "נובמבר", aov: 1852 },
  { month: "דצמבר", aov: 1696 },
];

type Period = "daily" | "weekly" | "monthly";

export function SalesChart({ className }: SalesChartProps) {
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <div className={cn("space-y-6", className)}>
      {/* Revenue Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-brand-charcoal">הכנסות</h3>
          <div className="flex bg-brand-cream rounded-lg p-0.5">
            {(
              [
                { id: "daily" as Period, label: "יומי" },
                { id: "weekly" as Period, label: "שבועי" },
                { id: "monthly" as Period, label: "חודשי" },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  period === p.id
                    ? "bg-white text-brand-charcoal shadow-sm"
                    : "text-brand-charcoal-light/60"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={REVENUE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5edd8" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#4a4a4a" />
            <YAxis
              tick={{ fontSize: 12 }}
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
              formatter={(value: number) => [formatCurrency(value), "הכנסות"]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#b8860b"
              strokeWidth={2.5}
              dot={{ fill: "#b8860b", r: 4 }}
              activeDot={{ r: 6, fill: "#d4a634" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-brand-charcoal mb-6">
            מוצרים מובילים
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={TOP_PRODUCTS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f5edd8" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#4a4a4a" />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11 }}
                stroke="#4a4a4a"
                width={120}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #f5edd8",
                  borderRadius: "12px",
                  direction: "rtl",
                }}
                formatter={(value: number) => [`${value} מכירות`, ""]}
              />
              <Bar dataKey="sales" fill="#b8860b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Breakdown */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-brand-charcoal mb-6">
            התפלגות גיאוגרפית
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={GEO_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {GEO_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #f5edd8",
                  borderRadius: "12px",
                  direction: "rtl",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-brand-charcoal">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average Order Value */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-brand-charcoal mb-6">
          ערך הזמנה ממוצע
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={AOV_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5edd8" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#4a4a4a" />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="#4a4a4a"
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #f5edd8",
                borderRadius: "12px",
                direction: "rtl",
              }}
              formatter={(value: number) => [
                formatCurrency(value),
                "ממוצע הזמנה",
              ]}
            />
            <Line
              type="monotone"
              dataKey="aov"
              stroke="#e8b4b8"
              strokeWidth={2.5}
              dot={{ fill: "#e8b4b8", r: 4 }}
              activeDot={{ r: 6, fill: "#c9888e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
