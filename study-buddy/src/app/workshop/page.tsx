"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  BarChart3,
  Sparkles,
  Timer,
} from "lucide-react";
import { ExamUploader } from "@/components/workshop/exam-uploader";
import { GeneratedExam } from "@/components/workshop/generated-exam";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Course {
  id: string;
  nameHe: string;
  materials: { id: string; type: string; title: string }[];
}

interface AnalysisResult {
  topics: { name: string; frequency: number; difficulty: number }[];
  patterns: string[];
  recommendations: string[];
}

interface GeneratedQuestion {
  questionHe: string;
  optionsHe: string[];
  answerHe: string;
  explanationHe: string;
  difficulty: number;
}

type ViewState = "upload" | "analysis" | "generated" | "mock";

export default function WorkshopPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("upload");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestion[]
  >([]);
  const [mockMode, setMockMode] = useState(false);
  const [timeLimit, setTimeLimit] = useState(90);

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
  const examCount =
    selectedCourse?.materials.filter((m) => m.type === "exam").length || 0;

  async function analyzeExams() {
    if (!selectedCourseId) return;
    setAnalyzing(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze",
          courseId: selectedCourseId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis);
        setViewState("analysis");
      }
    } catch (error) {
      console.error("Error analyzing exams:", error);
    } finally {
      setAnalyzing(false);
    }
  }

  async function generateExam() {
    if (!selectedCourseId) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          courseId: selectedCourseId,
          questionCount: 20,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedQuestions(data.questions);
        setViewState(mockMode ? "mock" : "generated");
      }
    } catch (error) {
      console.error("Error generating exam:", error);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Generated Exam View
  if (
    (viewState === "generated" || viewState === "mock") &&
    generatedQuestions.length > 0
  ) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 no-print">
          <button
            onClick={() => setViewState("upload")}
            className="btn-ghost text-sm"
          >
            &larr; חזור לסדנה
          </button>
        </div>
        <GeneratedExam
          questions={generatedQuestions}
          courseNameHe={selectedCourse?.nameHe || ""}
          mockMode={viewState === "mock"}
          timeLimit={timeLimit}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-3">
          <FileText className="w-8 h-8" />
          סדנת מבחנים
        </h1>
        <p className="text-gray-500">
          העלה מבחנים קודמים, נתח דפוסים וצור מבחני תרגול חדשים
        </p>
      </div>

      {/* Course Selector */}
      <div className="card mb-6">
        <label className="label-text">בחר קורס</label>
        <select
          value={selectedCourseId}
          onChange={(e) => {
            setSelectedCourseId(e.target.value);
            setAnalysis(null);
            setViewState("upload");
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

      {selectedCourseId && (
        <div className="grid grid-cols-2 gap-6">
          {/* Upload Section */}
          <div>
            <ExamUploader
              courseId={selectedCourseId}
              onUploadComplete={fetchCourses}
            />

            {examCount > 0 && (
              <div className="card mt-4">
                <p className="text-sm text-gray-600 mb-3">
                  {examCount} מבחנים הועלו לקורס זה
                </p>
                <button
                  onClick={analyzeExams}
                  disabled={analyzing}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                      מנתח מבחנים...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5" />
                      נתח מבחנים קודמים
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Analysis or Generate */}
          <div className="space-y-6">
            {/* Analysis Results */}
            {analysis && viewState === "analysis" && (
              <div className="space-y-4">
                {/* Topic Frequency Chart */}
                <div className="card">
                  <h3 className="font-bold text-primary-600 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    תדירות נושאים במבחנים
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analysis.topics}
                        layout="vertical"
                        margin={{ right: 100, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={90}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value: number) => [value, "תדירות"]}
                        />
                        <Bar dataKey="frequency" radius={[0, 4, 4, 0]}>
                          {analysis.topics.map((_, index) => (
                            <Cell
                              key={index}
                              fill={
                                index % 3 === 0
                                  ? "#1e3a5f"
                                  : index % 3 === 1
                                  ? "#3e73b2"
                                  : "#f59e0b"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Patterns */}
                <div className="card">
                  <h3 className="font-bold text-primary-600 mb-3">
                    דפוסים חוזרים
                  </h3>
                  <ul className="space-y-2">
                    {analysis.patterns.map((pattern, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-primary-700"
                      >
                        <span className="w-1.5 h-1.5 bg-accent-400 rounded-full mt-2 flex-shrink-0" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="card bg-cream-100">
                  <h3 className="font-bold text-primary-600 mb-3">
                    המלצות ללימוד
                  </h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-primary-700"
                      >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Generate Exam Section */}
            <div className="card">
              <h3 className="font-bold text-primary-600 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                יצירת מבחן תרגול
              </h3>

              <div className="space-y-4">
                {/* Mock mode toggle */}
                <div className="flex items-center justify-between p-3 bg-cream-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-primary-700">
                        מצב סימולציה
                      </p>
                      <p className="text-xs text-gray-400">
                        עם טיימר כמו במבחן אמיתי
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMockMode(!mockMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      mockMode ? "bg-primary-500" : "bg-cream-400"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        mockMode ? "-translate-x-6" : "-translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {mockMode && (
                  <div>
                    <label className="label-text">זמן מבחן (דקות)</label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) =>
                        setTimeLimit(parseInt(e.target.value) || 90)
                      }
                      className="input-field"
                      min={10}
                      max={240}
                    />
                  </div>
                )}

                <button
                  onClick={generateExam}
                  disabled={generating || examCount === 0}
                  className="btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                      מייצר מבחן...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      צור מבחן תרגול חדש
                    </>
                  )}
                </button>

                {examCount === 0 && (
                  <p className="text-xs text-gray-400 text-center">
                    העלה לפחות מבחן אחד כדי ליצור מבחן תרגול
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedCourseId && (
        <div className="card text-center py-16">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-primary-700 mb-2">
            בחר קורס כדי להתחיל
          </h2>
          <p className="text-gray-500">
            העלה מבחנים קודמים, נתח דפוסים וצור מבחנים חדשים
          </p>
        </div>
      )}
    </div>
  );
}
