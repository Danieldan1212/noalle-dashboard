import type { Metadata } from "next";
import { Sidebar } from "@/components/ui/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "נועל'ה תכשיטים | Noalle Jewelry",
  description: "לוח בקרה עסקי לנועל'ה תכשיטים - ניהול לקוחות, רשתות חברתיות ואנליטיקס",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-heebo bg-brand-cream min-h-screen">
        <Sidebar />
        <main className="mr-64 min-h-screen">
          <div className="p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
