"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Library,
  FileText,
  Lightbulb,
  Layers,
  Upload,
} from "lucide-react";
import { StudySheet } from "@/components/materials/study-sheet";
import { ConceptExplainer } from "@/components/materials/concept-explainer";
import { Flashcard } from "@/components/materials/flashcard";

interface Course {
  id: string;
  nameHe: string;
  materials: { id: string; type: string; title: string }[];
}

type TabType = "summary" | "explain" | "flashcards";

const SAMPLE_FLASHCARDS = [
  { term: "תמ\"ג", definition: "תוצר מקומי גולמי - סך ערך כל המוצרים והשירותים הסופיים שיוצרו במדינה בתקופה מסוימת" },
  { term: "אינפלציה", definition: "עליה מתמשכת ברמת המחירים הכללית במשק, הגורמת לירידה בכוח הקנייה של המטבע" },
  { term: "גמישות ביקוש", definition: "מדד לשינוי היחסי בכמות המבוקשת כתגובה לשינוי יחסי במחיר המוצר" },
  { term: "עלות הזדמנות", definition: "הערך של החלופה הטובה ביותר שוויתרנו עליה כאשר ביצענו בחירה כלכלית" },
  { term: "יתרון יחסי", definition: "היכולת לייצר מוצר בעלות הזדמנות נמוכה יותר בהשוואה ליצרנים אחרים" },
  { term: "ריבית דריבית", definition: "ריבית המחושבת על הקרן המקורית וגם על הריבית שנצברה בתקופות קודמות" },
  { term: "נזילות", definition: "היכולת להמיר נכס למזומן במהירות וללא אובדן ערך משמעותי" },
  { term: "מינוף פיננסי", definition: "שימוש בהון זר (חוב) למימון פעילות עסקית כדי להגדיל את התשואה על ההון העצמי" },
  { term: "הון חוזר", definition: "ההפרש בין נכסים שוטפים להתחייבויות שוטפות - מודד את יכולת החברה לעמוד בהתחייבויות קצרות טווח" },
  { term: "פחת", definition: "חלוקת עלות הנכס הקבוע על פני אורך חייו הכלכליים, ביטוי חשבונאי לבלאי ושחיקה" },
];

export default function MaterialsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [summaryContent, setSummaryContent] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  async function generateSummary() {
    if (!selectedCourseId) return;
    setGeneratingSummary(true);

    try {
      const formData = new FormData();
      formData.append("courseId", selectedCourseId);
      if (uploadFile) {
        formData.append("file", uploadFile);
      }

      const res = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setSummaryContent(data.summary);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setGeneratingSummary(false);
    }
  }

  const tabs = [
    { id: "summary" as TabType, label: "דף סיכום", icon: FileText },
    { id: "explain" as TabType, label: "הסבר מושגים", icon: Lightbulb },
    { id: "flashcards" as TabType, label: "כרטיסיות", icon: Layers },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-3">
          <Library className="w-8 h-8" />
          חומרי לימוד
        </h1>
        <p className="text-gray-500">
          סיכומים, הסברי מושגים וכרטיסיות לימוד
        </p>
      </div>

      {/* Course Selector + Tabs */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-64">
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSummaryContent(null);
            }}
            className="input-field"
          >
            <option value="">בחר קורס</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.nameHe}
              </option>
            ))}
          </select>
        </div>

        <div className="flex bg-cream-200 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-500 hover:text-primary-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Tab */}
      {activeTab === "summary" && (
        <div>
          {!summaryContent ? (
            <div className="card">
              <h3 className="font-bold text-primary-600 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                יצירת דף סיכום
              </h3>
              <p className="text-gray-500 mb-4">
                העלה חומר לימוד (PDF, מצגת, הרצאה) ותקבל דף סיכום תמציתי
                וממוקד
              </p>

              {/* Upload area */}
              <div className="border-2 border-dashed border-cream-400 rounded-xl p-8 text-center mb-4">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-3">
                  העלה קובץ ליצירת סיכום
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="summary-upload"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  onChange={(e) =>
                    setUploadFile(e.target.files?.[0] || null)
                  }
                />
                <label
                  htmlFor="summary-upload"
                  className="btn-secondary text-sm inline-block cursor-pointer"
                >
                  בחר קובץ
                </label>
                {uploadFile && (
                  <p className="text-sm text-primary-600 mt-2">
                    {uploadFile.name}
                  </p>
                )}
              </div>

              {selectedCourse &&
                selectedCourse.materials.length > 0 && (
                  <p className="text-sm text-gray-400 mb-4">
                    או השתמש ב-{selectedCourse.materials.length} חומרים שכבר
                    הועלו לקורס
                  </p>
                )}

              <button
                onClick={generateSummary}
                disabled={
                  generatingSummary ||
                  (!selectedCourseId && !uploadFile)
                }
                className="btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generatingSummary ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    מייצר סיכום...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    צור דף סיכום
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSummaryContent(null)}
                className="btn-ghost text-sm mb-4"
              >
                &larr; צור סיכום חדש
              </button>
              <StudySheet
                content={summaryContent}
                courseNameHe={selectedCourse?.nameHe || ""}
              />
            </div>
          )}
        </div>
      )}

      {/* Explain Tab */}
      {activeTab === "explain" && (
        <ConceptExplainer
          courseContext={selectedCourse?.nameHe}
        />
      )}

      {/* Flashcards Tab */}
      {activeTab === "flashcards" && (
        <div className="card">
          <Flashcard
            cards={SAMPLE_FLASHCARDS}
            title="מושגי יסוד בכלכלה ועסקים"
          />
        </div>
      )}
    </div>
  );
}
