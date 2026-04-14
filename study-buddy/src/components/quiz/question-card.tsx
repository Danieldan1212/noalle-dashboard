"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: string[];
  onAnswer: (selectedOption: string) => void;
  disabled?: boolean;
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  options,
  onAnswer,
  disabled = false,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const optionLetters = ["א", "ב", "ג", "ד", "ה", "ו"];

  function handleSelect(option: string) {
    if (disabled) return;
    setSelected(option);
  }

  function handleSubmit() {
    if (selected) {
      onAnswer(selected);
      setSelected(null);
    }
  }

  return (
    <div className="card max-w-3xl mx-auto">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-gray-500">
          שאלה {questionNumber} מתוך {totalQuestions}
        </span>
        <div className="w-48 h-2 bg-cream-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="text-lg font-bold text-primary-700 mb-6 leading-relaxed">
        {question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            disabled={disabled}
            className={cn(
              "w-full text-right p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3",
              selected === option
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-cream-300 hover:border-primary-300 hover:bg-cream-100",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <span
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                selected === option
                  ? "bg-primary-500 text-white"
                  : "bg-cream-200 text-primary-600"
              )}
            >
              {optionLetters[index]}
            </span>
            <span className="text-right">{option}</span>
          </button>
        ))}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!selected || disabled}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg py-3"
      >
        {selected ? "שלח תשובה" : "בחר תשובה"}
      </button>
    </div>
  );
}
