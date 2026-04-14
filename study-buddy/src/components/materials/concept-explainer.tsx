"use client";

import { useState } from "react";
import { Search, Lightbulb, BookOpen, Link, Brain } from "lucide-react";

interface ConceptExplainerProps {
  courseContext?: string;
}

export function ConceptExplainer({ courseContext }: ConceptExplainerProps) {
  const [query, setQuery] = useState("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { term: string; explanation: string }[]
  >([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept: query.trim(),
          courseContext,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExplanation(data.explanation);
        setHistory((prev) => [
          { term: query.trim(), explanation: data.explanation },
          ...prev.filter((h) => h.term !== query.trim()),
        ]);
      }
    } catch (error) {
      console.error("Error explaining concept:", error);
    } finally {
      setLoading(false);
    }
  }

  function selectFromHistory(item: { term: string; explanation: string }) {
    setQuery(item.term);
    setExplanation(item.explanation);
  }

  // Render explanation with basic formatting
  function renderExplanation(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === "") return <br key={i} />;

      if (trimmed.startsWith("# ") || trimmed.startsWith("## ")) {
        const level = trimmed.startsWith("## ") ? 3 : 2;
        const content = trimmed.replace(/^#{1,3}\s/, "");
        if (level === 2) {
          return (
            <h3
              key={i}
              className="text-lg font-bold text-primary-600 mt-4 mb-2"
            >
              {content}
            </h3>
          );
        }
        return (
          <h4 key={i} className="font-bold text-primary-600 mt-3 mb-1">
            {content}
          </h4>
        );
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <li key={i} className="text-primary-700 mr-4 mb-1">
            {trimmed.slice(2)}
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={i} className="text-primary-700 mr-4 mb-1 list-decimal">
            {trimmed.replace(/^\d+\.\s/, "")}
          </li>
        );
      }

      return (
        <p key={i} className="text-primary-700 leading-relaxed mb-2">
          {trimmed}
        </p>
      );
    });
  }

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="card">
        <h3 className="font-bold text-primary-600 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          הסבר מושגים
        </h3>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pr-10"
              placeholder='הקלד מושג, לדוגמה: "גמישות ביקוש", "ROI", "מאזן בוחן"...'
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="btn-primary whitespace-nowrap disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "הסבר"
            )}
          </button>
        </form>

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            "עלות שולית",
            "יתרון יחסי",
            "NPV",
            "חשבון רווח והפסד",
            "אינפלציה",
            "ריבית דריבית",
          ].map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term);
                // Auto-submit
                setTimeout(() => {
                  const form = document.querySelector("form");
                  form?.requestSubmit();
                }, 0);
              }}
              className="px-3 py-1 bg-cream-200 rounded-full text-xs text-primary-600 hover:bg-cream-300 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Explanation Result */}
        <div className="col-span-2">
          {loading && (
            <div className="card text-center py-12">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">מחפש הסבר...</p>
            </div>
          )}

          {!loading && explanation && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cream-300">
                <Brain className="w-5 h-5 text-primary-500" />
                <h3 className="font-bold text-primary-600 text-lg">{query}</h3>
              </div>
              <div>{renderExplanation(explanation)}</div>
            </div>
          )}

          {!loading && !explanation && (
            <div className="card text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-primary-700 mb-2">
                חפש מושג ללמוד
              </h3>
              <p className="text-gray-500">
                הקלד כל מושג מהלימודים ותקבל הסבר בעברית
                <br />
                עם דוגמאות מהשוק הישראלי
              </p>
            </div>
          )}
        </div>

        {/* Search History */}
        <div>
          <div className="card">
            <h4 className="font-bold text-primary-600 mb-3 flex items-center gap-2">
              <Link className="w-4 h-4" />
              חיפושים אחרונים
            </h4>
            {history.length === 0 ? (
              <p className="text-sm text-gray-400">עדיין אין חיפושים</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => selectFromHistory(item)}
                    className="w-full text-right p-2 rounded-lg hover:bg-cream-100 transition-colors text-sm text-primary-600"
                  >
                    {item.term}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
