"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  BookOpen,
  Target,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  formatPercentage,
  getMasteryColor,
  getMasteryLabel,
  getMasteryBgColor,
  daysUntil,
  formatDate,
} from "@/lib/utils";

interface CourseProgress {
  id: string;
  nameHe: string;
  examDate: string | null;
  averageMastery: number;
  topics: {
    id: string;
    nameHe: string;
    mastery: number;
  }[];
  quizHistory: {
    date: string;
    score: number;
    totalQs: number;
    correctQs: number;
  }[];
}

interface StudyRecommendation {
  courseNameHe: string;
  topicNameHe: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export default function ProgressPage() {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    null
  );

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
        if (data.courses?.length > 0 && !selectedCourseId) {
          setSelectedCourseId(data.courses[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  // Generate study recommendations
  function getRecommendations(): StudyRecommendation[] {
    const recs: StudyRecommendation[] = [];

    for (const course of courses) {
      // Exam coming soon with low mastery
      if (course.examDate) {
        const days = daysUntil(course.examDate);
        if (days > 0 && days <= 14 && course.averageMastery < 0.7) {
          for (const topic of course.topics) {
            if (topic.mastery < 0.5) {
              recs.push({
                courseNameHe: course.nameHe,
                topicNameHe: topic.nameHe,
                reason: `מבחן בעוד ${days} ימים, שליטה נמוכה`,
                priority: "high",
              });
            }
          }
        }
      }

      // Generally weak topics
      for (const topic of course.topics) {
        if (topic.mastery < 0.3) {
          recs.push({
            courseNameHe: course.nameHe,
            topicNameHe: topic.nameHe,
            reason: "שליטה נמוכה מאוד, צריך תרגול נוסף",
            priority: topic.mastery < 0.15 ? "high" : "medium",
          });
        }
      }
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return recs.slice(0, 8);
  }

  const recommendations = getRecommendations();

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
          <BarChart3 className="w-8 h-8" />
          התקדמות
        </h1>
        <p className="text-gray-500">עקוב אחרי ההתקדמות שלך בלימודים</p>
      </div>

      {courses.length === 0 ? (
        <div className="card text-center py-16">
          <BarChart3 className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-primary-700 mb-2">
            אין נתוני התקדמות
          </h2>
          <p className="text-gray-500">
            התחל ללמוד ולהתרגל כדי לראות את ההתקדמות שלך
          </p>
        </div>
      ) : (
        <>
          {/* Course Readiness Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {courses.map((course) => {
              const days = course.examDate
                ? daysUntil(course.examDate)
                : null;
              const readiness = course.averageMastery;

              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`card text-right transition-all ${
                    selectedCourseId === course.id
                      ? "ring-2 ring-primary-500 shadow-md"
                      : "hover:shadow-md"
                  }`}
                >
                  <h3 className="font-bold text-primary-700 text-sm mb-2">
                    {course.nameHe}
                  </h3>
                  <div className="flex items-end justify-between mb-2">
                    <span
                      className={`text-2xl font-bold ${getMasteryColor(
                        readiness
                      )}`}
                    >
                      {formatPercentage(readiness)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {getMasteryLabel(readiness)}
                    </span>
                  </div>
                  <ProgressBar
                    value={readiness}
                    showPercentage={false}
                    size="sm"
                  />
                  {days !== null && days > 0 && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      מבחן בעוד {days} ימים
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left: Charts */}
            <div className="col-span-2 space-y-6">
              {/* Quiz History Chart */}
              {selectedCourse && selectedCourse.quizHistory.length > 0 && (
                <div className="card">
                  <h3 className="font-bold text-primary-600 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    היסטוריית ציונים - {selectedCourse.nameHe}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedCourse.quizHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(value: number) => [
                            `${Math.round(value)}%`,
                            "ציון",
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="score"
                          name="ציון"
                          stroke="#1e3a5f"
                          strokeWidth={2}
                          dot={{ fill: "#1e3a5f", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Topic Mastery Heatmap */}
              {selectedCourse && selectedCourse.topics.length > 0 && (
                <div className="card">
                  <h3 className="font-bold text-primary-600 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    שליטה בנושאים - {selectedCourse.nameHe}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={selectedCourse.topics.map((t) => ({
                          name: t.nameHe,
                          mastery: Math.round(t.mastery * 100),
                        }))}
                        layout="vertical"
                        margin={{ right: 100, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={100}
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            `${value}%`,
                            "שליטה",
                          ]}
                        />
                        <Bar dataKey="mastery" radius={[0, 4, 4, 0]}>
                          {selectedCourse.topics.map((topic, index) => {
                            const color = getMasteryBgColor(topic.mastery)
                              .replace("bg-green-500", "#22c55e")
                              .replace("bg-blue-500", "#3b82f6")
                              .replace("bg-amber-500", "#f59e0b")
                              .replace("bg-orange-500", "#f97316")
                              .replace("bg-red-500", "#ef4444");
                            return (
                              <rect
                                key={index}
                                fill={color}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Heatmap Grid */}
                  <div className="mt-4 pt-4 border-t border-cream-300">
                    <p className="text-sm text-gray-500 mb-3">
                      מפת חום - שליטה בנושאים:
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedCourse.topics.map((topic) => {
                        const bgColor =
                          topic.mastery >= 0.8
                            ? "bg-green-500"
                            : topic.mastery >= 0.6
                            ? "bg-green-300"
                            : topic.mastery >= 0.4
                            ? "bg-amber-400"
                            : topic.mastery >= 0.2
                            ? "bg-orange-400"
                            : "bg-red-400";

                        return (
                          <div
                            key={topic.id}
                            className={`${bgColor} rounded-lg p-3 text-center`}
                          >
                            <p className="text-xs font-medium text-white truncate">
                              {topic.nameHe}
                            </p>
                            <p className="text-lg font-bold text-white">
                              {Math.round(topic.mastery * 100)}%
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {selectedCourse &&
                selectedCourse.topics.length === 0 &&
                selectedCourse.quizHistory.length === 0 && (
                  <div className="card text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      עדיין אין נתונים לקורס זה. התחל להתרגל!
                    </p>
                  </div>
                )}
            </div>

            {/* Right: Recommendations & Exam Readiness */}
            <div className="space-y-6">
              {/* What to study today */}
              <div className="card">
                <h3 className="font-bold text-primary-600 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  מה ללמוד היום
                </h3>
                {recommendations.length === 0 ? (
                  <div className="text-center py-6">
                    <Target className="w-10 h-10 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      {courses.length > 0
                        ? "הכל נראה טוב! המשך כך"
                        : "הוסף קורסים ונושאים כדי לקבל המלצות"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          rec.priority === "high"
                            ? "bg-red-50 border-red-200"
                            : rec.priority === "medium"
                            ? "bg-amber-50 border-amber-200"
                            : "bg-cream-100 border-cream-300"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              rec.priority === "high"
                                ? "bg-red-500"
                                : rec.priority === "medium"
                                ? "bg-amber-500"
                                : "bg-gray-400"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-medium text-primary-700">
                              {rec.topicNameHe}
                            </p>
                            <p className="text-xs text-gray-500">
                              {rec.courseNameHe}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {rec.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Exam Readiness per Course */}
              <div className="card">
                <h3 className="font-bold text-primary-600 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  מוכנות למבחנים
                </h3>
                <div className="space-y-4">
                  {courses
                    .filter(
                      (c) => c.examDate && daysUntil(c.examDate) > 0
                    )
                    .sort(
                      (a, b) =>
                        daysUntil(a.examDate!) - daysUntil(b.examDate!)
                    )
                    .map((course) => {
                      const days = daysUntil(course.examDate!);
                      const readiness = course.averageMastery;
                      const status =
                        readiness >= 0.8
                          ? "מוכן"
                          : readiness >= 0.6
                          ? "בדרך"
                          : "לא מוכן";
                      const statusColor =
                        readiness >= 0.8
                          ? "text-green-600"
                          : readiness >= 0.6
                          ? "text-amber-600"
                          : "text-red-600";

                      return (
                        <div key={course.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-primary-700">
                              {course.nameHe}
                            </span>
                            <span className={`text-xs font-medium ${statusColor}`}>
                              {status}
                            </span>
                          </div>
                          <ProgressBar
                            value={readiness}
                            showPercentage
                            size="sm"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(course.examDate!)} ({days} ימים)
                          </p>
                        </div>
                      );
                    })}

                  {courses.filter(
                    (c) => c.examDate && daysUntil(c.examDate) > 0
                  ).length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      אין מבחנים קרובים
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
