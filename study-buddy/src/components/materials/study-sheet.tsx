"use client";

import { Printer, Copy, Check } from "lucide-react";
import { useState } from "react";

interface StudySheetProps {
  content: string;
  courseNameHe: string;
}

export function StudySheet({ content, courseNameHe }: StudySheetProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy to clipboard");
    }
  }

  // Parse content into sections (simple markdown-like parsing)
  function renderContent(text: string) {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    function flushList() {
      if (currentList.length > 0) {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="list-disc list-inside space-y-1 mb-4 mr-4"
          >
            {currentList.map((item, i) => (
              <li key={i} className="text-primary-700 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    }

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed === "") {
        flushList();
        continue;
      }

      if (trimmed.startsWith("# ")) {
        flushList();
        elements.push(
          <h2
            key={`h2-${elements.length}`}
            className="text-xl font-bold text-primary-600 mt-6 mb-3 pb-2 border-b border-cream-300"
          >
            {trimmed.slice(2)}
          </h2>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h3
            key={`h3-${elements.length}`}
            className="text-lg font-bold text-primary-600 mt-4 mb-2"
          >
            {trimmed.slice(3)}
          </h3>
        );
      } else if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h4
            key={`h4-${elements.length}`}
            className="font-bold text-primary-600 mt-3 mb-1"
          >
            {trimmed.slice(4)}
          </h4>
        );
      } else if (
        trimmed.startsWith("- ") ||
        trimmed.startsWith("* ") ||
        trimmed.startsWith("+ ")
      ) {
        currentList.push(trimmed.slice(2));
      } else if (/^\d+\.\s/.test(trimmed)) {
        currentList.push(trimmed.replace(/^\d+\.\s/, ""));
      } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        flushList();
        elements.push(
          <p
            key={`bold-${elements.length}`}
            className="font-bold text-primary-700 mb-2"
          >
            {trimmed.slice(2, -2)}
          </p>
        );
      } else {
        flushList();
        elements.push(
          <p
            key={`p-${elements.length}`}
            className="text-primary-700 leading-relaxed mb-2"
          >
            {trimmed}
          </p>
        );
      }
    }

    flushList();
    return elements;
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-cream-300 no-print">
        <div>
          <h2 className="text-lg font-bold text-primary-600">
            דף סיכום - {courseNameHe}
          </h2>
          <p className="text-xs text-gray-400">נוצר אוטומטית מחומרי הלימוד</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                הועתק!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                העתק טקסט
              </>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <Printer className="w-4 h-4" />
            הדפס
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="prose-hebrew">{renderContent(content)}</div>
    </div>
  );
}
