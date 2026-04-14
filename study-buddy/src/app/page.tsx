"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  formatDate,
  daysUntil,
  getMasteryLabel,
  getMasteryColor,
  formatPercentage,
} from "@/lib/utils";

interface CourseWithStats {
  id: string;
  name: string;
  nameHe: string;
  examDate: string | null;
  averageMastery: number;
  topicCount: number;
  quizCount: number;
}

interface WeakTopic {
  id: string;
  nameHe: string;
  mastery: number;
  courseNameHe: string;
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
          setWeakTopics(data.weakTopics || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const overallReadiness =
    courses.length > 0
      ? courses.reduce((sum, c) => sum + c.averageMastery, 0) / courses.length
      : 0;

  const upcomingExams = courses
    .filter((c) => c.examDate && daysUntil(c.examDate) > 0)
    .sort(
      (a, b) => daysUntil(a.examDate!) - daysUntil(b.examDate!)
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary-500">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">
          שלום! ברוך הבא ל-Study Buddy
        </h1>
        <p className="text-gray-500">מה נלמד היום?</p>
      </div>

      {/* Readiness Score */}
      <div className="card mb-8 bg-gradient-to-l from-primary-600 to-primary-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium mb-1 text-primary-100">
              ציון מוכנות כללי
            </h2>
            <p className="text-5xl font-bold">
              {formatPercentage(overallReadiness)}
            </p>
            <p className="text-primary-200 mt-2">
              {overallReadiness >= 0.8
                ? "מצוין! אתה מוכן למבחנים"
                : overallReadiness >= 0.6
                ? "בדרך הנכונה, המשך להתרגל"
                : overallReadiness >= 0.4
                ? "צריך עוד תרגול, אל תוותר!"
                : courses.length > 0
                ? "בוא נתחיל ללמוד ביחד!"
                : "הוסף קורסים כדי להתחיל"}
            </p>
          </div>
          <div className="w-32 h-32 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeDasharray={`${overallReadiness * 100}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-accent-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-700">
              {courses.length}
            </p>
            <p className="text-sm text-gray-500">קורסים פעילים</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-700">
              {courses.reduce((sum, c) => sum + c.quizCount, 0)}
            </p>
            <p className="text-sm text-gray-500">תרגולים שהושלמו</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-700">
              {upcomingExams.length}
            </p>
            <p className="text-sm text-gray-500">מבחנים קרובים</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Course Cards */}
        <div>
          <h2 className="section-title flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            הקורסים שלי
          </h2>
          {courses.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">עדיין לא הוספת קורסים</p>
              <Link href="/courses" className="btn-primary inline-block">
                הוסף קורס ראשון
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-primary-700">
                        {course.nameHe}
                      </h3>
                      <p className="text-sm text-gray-400">{course.name}</p>
                    </div>
                    <span
                      className={`text-sm font-medium ${getMasteryColor(
                        course.averageMastery
                      )}`}
                    >
                      {getMasteryLabel(course.averageMastery)}
                    </span>
                  </div>

                  <ProgressBar
                    value={course.averageMastery}
                    showPercentage
                    size="sm"
                  />

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{course.topicCount} נושאים</span>
                      <span>{course.quizCount} תרגולים</span>
                    </div>
                    <Link
                      href={`/quiz?courseId=${course.id}`}
                      className="btn-accent text-sm px-4 py-1.5 flex items-center gap-1"
                    >
                      <Zap className="w-4 h-4" />
                      תרגול מהיר
                    </Link>
                  </div>

                  {course.examDate && daysUntil(course.examDate) > 0 && (
                    <div className="mt-3 pt-3 border-t border-cream-300 flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>
                        מבחן בעוד {daysUntil(course.examDate)} ימים (
                        {formatDate(course.examDate)})
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              מבחנים קרובים
            </h2>
            {upcomingExams.length === 0 ? (
              <div className="card text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">אין מבחנים קרובים</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingExams.map((course) => {
                  const days = daysUntil(course.examDate!);
                  const urgent = days <= 7;
                  return (
                    <div
                      key={course.id}
                      className={`card flex items-center justify-between ${
                        urgent ? "border-red-300 bg-red-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {urgent && (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-primary-700">
                            {course.nameHe}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(course.examDate!)}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          urgent ? "text-red-600" : "text-primary-600"
                        }`}
                      >
                        {days} ימים
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weak Topics */}
          <div>
            <h2 className="section-title flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              נושאים לחיזוק
            </h2>
            {weakTopics.length === 0 ? (
              <div className="card text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {courses.length === 0
                    ? "הוסף קורסים ונושאים כדי לראות המלצות"
                    : "כל הנושאים ברמה טובה!"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {weakTopics.slice(0, 5).map((topic) => (
                  <div
                    key={topic.id}
                    className="card flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-primary-700">
                        {topic.nameHe}
                      </p>
                      <p className="text-xs text-gray-400">
                        {topic.courseNameHe}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <ProgressBar
                        value={topic.mastery}
                        showPercentage={false}
                        size="sm"
                        className="w-24"
                      />
                      <span
                        className={`text-sm font-medium ${getMasteryColor(
                          topic.mastery
                        )}`}
                      >
                        {Math.round(topic.mastery * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
