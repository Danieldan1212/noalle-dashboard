"use client";

import { useState } from "react";
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";

interface FlashcardData {
  term: string;
  definition: string;
}

interface FlashcardProps {
  cards: FlashcardData[];
  title?: string;
}

export function Flashcard({ cards, title }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [cardOrder, setCardOrder] = useState<number[]>(
    cards.map((_, i) => i)
  );

  const currentCard = cards[cardOrder[currentIndex]];

  function handleFlip() {
    setFlipped(!flipped);
  }

  function handleNext() {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }

  function handlePrev() {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }

  function handleShuffle() {
    const newOrder = [...cardOrder];
    for (let i = newOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    }
    setCardOrder(newOrder);
    setCurrentIndex(0);
    setFlipped(false);
    setShuffled(!shuffled);
  }

  function handleReset() {
    setCardOrder(cards.map((_, i) => i));
    setCurrentIndex(0);
    setFlipped(false);
  }

  if (cards.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">אין כרטיסיות להצגה</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h3 className="font-bold text-primary-600 mb-4">{title}</h3>
      )}

      {/* Card */}
      <div className="flashcard-container mb-6">
        <div
          onClick={handleFlip}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleFlip();
          }}
        >
          <div
            className={`flashcard-inner relative ${
              flipped ? "flipped" : ""
            }`}
            style={{ minHeight: "280px" }}
          >
            {/* Front */}
            <div className="flashcard-front absolute inset-0 card bg-gradient-to-br from-primary-600 to-primary-500 text-white flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-xs text-primary-200 mb-3">
                  לחץ להפיכה
                </p>
                <h3 className="text-2xl font-bold leading-relaxed">
                  {currentCard.term}
                </h3>
              </div>
            </div>

            {/* Back */}
            <div className="flashcard-back absolute inset-0 card bg-white border-2 border-primary-200 flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-3">הגדרה</p>
                <p className="text-lg text-primary-700 leading-relaxed">
                  {currentCard.definition}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="btn-ghost flex items-center gap-1"
        >
          <ChevronRight className="w-5 h-5" />
          הקודם
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {cards.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-cream-200 rounded-lg transition-colors"
              title="ערבב"
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-cream-200 rounded-lg transition-colors"
              title="אפס"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="btn-ghost flex items-center gap-1"
        >
          הבא
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1 mt-4">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentIndex(i);
              setFlipped(false);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? "bg-primary-500" : "bg-cream-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
