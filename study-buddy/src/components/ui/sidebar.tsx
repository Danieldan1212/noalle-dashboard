"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  FileText,
  Library,
  BarChart3,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "ראשי", href: "/", icon: LayoutDashboard },
  { label: "קורסים", href: "/courses", icon: BookOpen },
  { label: "תרגול", href: "/quiz", icon: Brain },
  { label: "סדנת מבחנים", href: "/workshop", icon: FileText },
  { label: "חומרי לימוד", href: "/materials", icon: Library },
  { label: "התקדמות", href: "/progress", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed top-0 right-0 h-full bg-primary-600 text-white transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo / Brand */}
      <div className="p-6 border-b border-primary-500 flex items-center gap-3">
        <div className="w-10 h-10 bg-accent-400 rounded-lg flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-6 h-6 text-primary-900" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold">Study Buddy</h1>
            <p className="text-xs text-primary-200">חבר ללימודים</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-white/20 text-white font-medium"
                      : "text-primary-100 hover:bg-white/10 hover:text-white"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-primary-500">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={collapsed ? "הרחב תפריט" : "כווץ תפריט"}
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
