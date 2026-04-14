"use client";

import { useState } from "react";
import { Printer, Clock, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

interface ExamQuestion {
  questionHe: string;
  optionsHe: string[];
  answerHe: string;
  explanationHe: string;
  difficulty: number;
}

interface GeneratedExamProps {
  questions: ExamQuestion[];
  courseNameHe: string;
  mockMode?: boolean;
  timeLimit?: number; // minutes
}

export function GeneratedExam({
  questions,
  courseNameHe,
  mockMode = false,
  timeLimit = 90,
}: GeneratedExamProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [timerActive, setTimerActive] = useState(false);

  const optionLetters = ["א", "ב", "ג", "ד", "ה", "ו"];

  function startTimer() {
    setTimerActive(true);
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setTimerActive(false);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleSelectAnswer(questionIndex: number, option: string) {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  }

  function handleSubmit() {
    setSubmitted(true);
    setTimerActive(false);
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = submitted
    ? questions.filter(
        (q, i) => selectedAnswers[i] === q.answerHe
      ).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card no-print">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary-600">
              מבחן תרגול - {courseNameHe}
            </h2>
            <p className="text-sm text-gray-500">
              {questions.length} שאלות | {answeredCount} נענו
            </p>
          </div>

          <div className="flex items-center gap-4">
            {mockMode && (
              <div
                className={`text-lg font-mono font-bold ${
                  timeRemaining < 300
                    ? "text-red-600"
                    : "text-primary-600"
                }`}
              >
                <Clock className="w-5 h-5 inline ml-1" />
                {formatTime(timeRemaining)}
              </div>
            )}

            {mockMode && !timerActive && !submitted && (
              <button onClick={startTimer} className="btn-accent">
                התחל ספירה
              </button>
            )}

            {!submitted && answeredCount > 0 && (
              <button onClick={handleSubmit} className="btn-primary">
                הגש מבחן
              </button>
            )}

            {submitted && (
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="btn-secondary flex items-center gap-2"
              >
                {showAnswers ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    הסתר תשובות
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    הצג תשובות
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="btn-ghost flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              הדפס
            </button>
          </div>
        </div>

        {/* Score */}
        {submitted && (
          <div className="mt-4 pt-4 border-t border-cream-300">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-primary-700">
                ציון: {Math.round((correctCount / questions.length) * 100)}%
              </div>
              <div className="text-sm text-gray-500">
                {correctCount} נכונות מתוך {questions.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, qIndex) => {
          const selected = selectedAnswers[qIndex];
          const isCorrect = submitted && selected === question.answerHe;
          const isWrong = submitted && selected && selected !== question.answerHe;

          return (
            <div
              key={qIndex}
              className={`card ${
                submitted
                  ? isCorrect
                    ? "border-green-300"
                    : isWrong
                    ? "border-red-300"
                    : "border-amber-300"
                  : ""
              }`}
            >
              {/* Question header */}
              <div className="flex items-start gap-3 mb-4">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {qIndex + 1}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-primary-700 leading-relaxed">
                    {question.questionHe}
                  </p>
                  <span className="text-xs text-gray-400">
                    רמת קושי:{" "}
                    {question.difficulty === 1
                      ? "קל"
                      : question.difficulty === 2
                      ? "בינוני"
                      : "קשה"}
                  </span>
                </div>
                {submitted && (
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : isWrong ? (
                      <XCircle className="w-6 h-6 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 mr-11">
                {question.optionsHe.map((option, oIndex) => {
                  const isSelected = selected === option;
                  const isCorrectOption =
                    submitted && option === question.answerHe;

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleSelectAnswer(qIndex, option)}
                      disabled={submitted}
                      className={`w-full text-right p-3 rounded-lg border transition-colors flex items-center gap-2 text-sm ${
                        isCorrectOption && submitted
                          ? "border-green-400 bg-green-50 text-green-800"
                          : isSelected && submitted && !isCorrectOption
                          ? "border-red-400 bg-red-50 text-red-800"
                          : isSelected
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-cream-300 hover:border-primary-300"
                      } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-cream-200 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {optionLetters[oIndex]}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (shown when submitted and answers toggled) */}
              {submitted && showAnswers && (
                <div className="mt-4 mr-11 p-3 bg-cream-100 border border-cream-300 rounded-lg">
                  <p className="text-sm font-medium text-primary-600 mb-1">
                    הסבר:
                  </p>
                  <p className="text-sm text-primary-700">
                    {question.explanationHe}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
