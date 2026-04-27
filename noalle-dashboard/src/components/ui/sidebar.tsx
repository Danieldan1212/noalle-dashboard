"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Share2,
  BarChart3,
  Settings,
  Gem,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "ראשי", icon: LayoutDashboard },
  { href: "/crm", label: "לקוחות", icon: Users },
  { href: "/social", label: "רשתות חברתיות", icon: Share2 },
  { href: "/analytics", label: "אנליטיקס", icon: BarChart3 },
  { href: "/settings", label: "הגדרות", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 right-0 h-screen w-64 bg-brand-charcoal text-white flex flex-col z-50">
      {/* Brand Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <Gem className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-gold-gradient">
              נועל&apos;ה תכשיטים
            </h1>
            <p className="text-[11px] text-white/50 -mt-0.5">
              Noalle Jewelry
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-gold/20 text-brand-gold-light shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-brand-gold-light" : "text-white/40"
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="mr-auto w-1.5 h-1.5 rounded-full bg-brand-gold-light" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="px-4 py-3 rounded-xl bg-white/5">
          <p className="text-xs text-white/40">גרסה 1.0.0</p>
          <p className="text-xs text-brand-gold-light/60 mt-0.5">
            נועל&apos;ה תכשיטים
          </p>
        </div>
      </div>
    </aside>
  );
}
