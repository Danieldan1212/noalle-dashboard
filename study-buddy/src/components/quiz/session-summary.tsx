"use client";

import Link from "next/link";
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatDuration } from "@/lib/utils";

interface AnswerResult {
  questionHe: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  topicName: string;
}

interface SessionSummaryProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  duration: number; // seconds
  answers: AnswerResult[];
  courseNameHe: string;
  onRetry: () => void;
}

export function SessionSummary({
  score,
  totalQuestions,
  correctAnswers,
  duration,
  answers,
  courseNameHe,
  onRetry,
}: SessionSummaryProps) {
  const incorrectAnswers = answers.filter((a) => !a.isCorrect);
  const weakTopics = Array.from(
    new Set(incorrectAnswers.map((a) => a.topicName))
  );

  const scoreLabel =
    score >= 90
      ? "מצוין!"
      : score >= 75
      ? "כל הכבוד!"
      : score >= 60
      ? "לא רע, אפשר לשפר"
      : score >= 40
      ? "צריך עוד תרגול"
      : "בוא נתרגל עוד";

  const scoreEmoji =
    score >= 90
      ? "trophy"
      : score >= 75
      ? "target"
      : score >= 60
      ? "trending"
      : "alert";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score Card */}
      <div className="card bg-gradient-to-l from-primary-600 to-primary-500 text-white text-center py-10">
        <div className="mb-4">
          {scoreEmoji === "trophy" && (
            <Trophy className="w-16 h-16 text-accent-400 mx-auto" />
          )}
          {scoreEmoji === "target" && (
            <Target className="w-16 h-16 text-accent-400 mx-auto" />
          )}
          {scoreEmoji === "trending" && (
            <TrendingUp className="w-16 h-16 text-accent-400 mx-auto" />
          )}
          {scoreEmoji === "alert" && (
            <AlertTriangle className="w-16 h-16 text-accent-400 mx-auto" />
          )}
        </div>
        <h2 className="text-4xl font-bold mb-2">{Math.round(score)}%</h2>
        <p className="text-xl text-primary-100">{scoreLabel}</p>
        <p className="text-primary-200 mt-2">{courseNameHe}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-primary-700">
            {correctAnswers}/{totalQuestions}
          </p>
          <p className="text-sm text-gray-500">תשובות נכונות</p>
        </div>

        <div className="card text-center">
          <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-primary-700">
            {formatDuration(duration)}
          </p>
          <p className="text-sm text-gray-500">זמן תרגול</p>
        </div>

        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-primary-700">
            {totalQuestions > 0
              ? Math.round(duration / totalQuestions)
              : 0}{" "}
            שנ&apos;
          </p>
          <p className="text-sm text-gray-500">ממוצע לשאלה</p>
        </div>
      </div>

      {/* Score Bar */}
      <div className="card">
        <h3 className="font-bold text-primary-600 mb-3">ציון כולל</h3>
        <ProgressBar value={score / 100} size="lg" />
      </div>

      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-primary-600 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            נושאים לחיזוק
          </h3>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Answer Review */}
      <div className="card">
        <h3 className="font-bold text-primary-600 mb-4">סקירת תשובות</h3>
        <div className="space-y-3">
          {answers.map((answer, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                answer.isCorrect
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                    answer.isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-700 mb-1">
                    {answer.questionHe}
                  </p>
                  {!answer.isCorrect && (
                    <div className="text-xs space-y-0.5">
                      <p className="text-red-600">
                        תשובתך: {answer.selectedAnswer}
                      </p>
                      <p className="text-green-600">
                        נכון: {answer.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button onClick={onRetry} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5" />
          תרגל שוב
        </button>
        <Link href="/" className="btn-secondary flex-1 text-center">
          חזור לראשי
        </Link>
      </div>
    </div>
  );
}
