"use client";

import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

interface AnswerFeedbackProps {
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  onNext: () => void;
  isLast: boolean;
}

export function AnswerFeedback({
  isCorrect,
  selectedAnswer,
  correctAnswer,
  explanation,
  onNext,
  isLast,
}: AnswerFeedbackProps) {
  return (
    <div className="card max-w-3xl mx-auto">
      {/* Result Icon */}
      <div className="text-center mb-6">
        {isCorrect ? (
          <div className="inline-flex items-center gap-3 text-green-600">
            <CheckCircle className="w-12 h-12" />
            <span className="text-2xl font-bold">תשובה נכונה!</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-3 text-red-600">
            <XCircle className="w-12 h-12" />
            <span className="text-2xl font-bold">תשובה שגויה</span>
          </div>
        )}
      </div>

      {/* Answer details */}
      {!isCorrect && (
        <div className="space-y-3 mb-6">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-600 mb-1">
              התשובה שלך:
            </p>
            <p className="text-red-800">{selectedAnswer}</p>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-600 mb-1">
              התשובה הנכונה:
            </p>
            <p className="text-green-800">{correctAnswer}</p>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="p-4 bg-cream-100 border border-cream-300 rounded-lg mb-6">
        <h4 className="font-bold text-primary-600 mb-2">הסבר:</h4>
        <p className="text-primary-700 leading-relaxed whitespace-pre-wrap">
          {explanation}
        </p>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="btn-primary w-full text-lg py-3 flex items-center justify-center gap-2"
      >
        {isLast ? "סיום תרגול" : "שאלה הבאה"}
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
