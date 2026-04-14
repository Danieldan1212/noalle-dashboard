import type { Metadata } from "next";
import { Sidebar } from "@/components/ui/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Study Buddy - חבר ללימודים",
  description:
    "כלי לימוד חכם לסטודנטים - כלכלה, מנהל עסקים, חשבונאות וניהול",
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
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-heebo antialiased min-h-screen bg-cream-100">
        <Sidebar />
        <main className="mr-64 min-h-screen p-8">{children}</main>
      </body>
    </html>
  );
}
