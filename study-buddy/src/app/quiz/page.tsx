"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Brain, Settings, Play } from "lucide-react";
import { QuestionCard } from "@/components/quiz/question-card";
import { AnswerFeedback } from "@/components/quiz/answer-feedback";
import { SessionSummary } from "@/components/quiz/session-summary";

interface Course {
  id: string;
  nameHe: string;
  topics: { id: string; nameHe: string }[];
}

interface QuizQuestion {
  id: string;
  questionHe: string;
  optionsHe: string[];
  answerHe: string;
  explanationHe: string;
  difficulty: number;
  topicName: string;
}

interface AnswerResult {
  questionHe: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  topicName: string;
}

type QuizState = "setup" | "playing" | "feedback" | "summary";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get("courseId");

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Setup state
  const [selectedCourseId, setSelectedCourseId] = useState(
    preselectedCourseId || ""
  );
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState(2);
  const [questionCount, setQuestionCount] = useState(10);

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [lastAnswer, setLastAnswer] = useState<{
    selected: string;
    isCorrect: boolean;
  } | null>(null);
  const startTimeRef = useRef<number>(0);
  const [duration, setDuration] = useState(0);

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

  function toggleTopic(topicId: string) {
    setSelectedTopicIds((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  }

  async function startQuiz() {
    if (!selectedCourseId) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseId,
          topicIds: selectedTopicIds.length > 0 ? selectedTopicIds : undefined,
          difficulty,
          count: questionCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
        setCurrentIndex(0);
        setAnswers([]);
        setLastAnswer(null);
        startTimeRef.current = Date.now();
        setQuizState("playing");
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
    } finally {
      setGenerating(false);
    }
  }

  function handleAnswer(selectedOption: string) {
    const current = questions[currentIndex];
    const isCorrect = selectedOption === current.answerHe;

    const result: AnswerResult = {
      questionHe: current.questionHe,
      selectedAnswer: selectedOption,
      correctAnswer: current.answerHe,
      isCorrect,
      topicName: current.topicName,
    };

    setAnswers((prev) => [...prev, result]);
    setLastAnswer({ selected: selectedOption, isCorrect });
    setQuizState("feedback");
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      // Quiz complete
      const totalDuration = Math.round(
        (Date.now() - startTimeRef.current) / 1000
      );
      setDuration(totalDuration);
      setQuizState("summary");

      // Save session
      const correctCount = [...answers, lastAnswer].filter(
        (a) => a && "isCorrect" in a && a.isCorrect
      ).length;
      const score = (correctCount / questions.length) * 100;

      fetch("/api/quiz", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseId,
          topicFilter: selectedTopicIds.join(",") || null,
          score,
          totalQs: questions.length,
          correctQs: correctCount,
          duration: totalDuration,
          answers: JSON.stringify(answers),
        }),
      }).catch(console.error);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setLastAnswer(null);
      setQuizState("playing");
    }
  }

  function handleRetry() {
    setQuizState("setup");
    setQuestions([]);
    setAnswers([]);
    setLastAnswer(null);
    setCurrentIndex(0);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Setup Screen
  if (quizState === "setup") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="page-title flex items-center gap-3">
            <Brain className="w-8 h-8" />
            תרגול
          </h1>
          <p className="text-gray-500">בחר קורס ונושאים להתרגל</p>
        </div>

        <div className="card space-y-6">
          {/* Course Selection */}
          <div>
            <label className="label-text">קורס</label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedTopicIds([]);
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

          {/* Topic Selection */}
          {selectedCourse && selectedCourse.topics.length > 0 && (
            <div>
              <label className="label-text">
                נושאים (השאר ריק לכל הנושאים)
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedCourse.topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedTopicIds.includes(topic.id)
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-cream-300 text-gray-600 hover:border-primary-300"
                    }`}
                  >
                    {topic.nameHe}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty */}
          <div>
            <label className="label-text">
              רמת קושי: {difficulty === 1 ? "קל" : difficulty === 2 ? "בינוני" : "קשה"}
            </label>
            <input
              type="range"
              min={1}
              max={3}
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              className="w-full h-2 bg-cream-300 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>קל</span>
              <span>בינוני</span>
              <span>קשה</span>
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="label-text">מספר שאלות</label>
            <div className="flex gap-2">
              {[5, 10, 15, 20, 30].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                    questionCount === count
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-cream-300 text-gray-600 hover:border-primary-300"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startQuiz}
            disabled={!selectedCourseId || generating}
            className="btn-accent w-full text-lg py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                מכין שאלות...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                התחל תרגול
              </>
            )}
          </button>
        </div>

        {/* Tips */}
        <div className="card mt-6 bg-cream-100">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-primary-500 mt-0.5" />
            <div>
              <h3 className="font-bold text-primary-600 mb-1">טיפ</h3>
              <p className="text-sm text-gray-600">
                המערכת מתאימה את רמת הקושי בהתבסס על הביצועים שלך. ככל שתתרגל
                יותר, השאלות יהפכו ליותר מאתגרות בנושאים שאתה שולט בהם, ויחזקו
                נושאים שעדיין צריך לשפר.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (quizState === "playing" && questions[currentIndex]) {
    const current = questions[currentIndex];
    return (
      <div className="max-w-3xl mx-auto">
        <QuestionCard
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          question={current.questionHe}
          options={current.optionsHe}
          onAnswer={handleAnswer}
        />
      </div>
    );
  }

  // Feedback Screen
  if (quizState === "feedback" && lastAnswer && questions[currentIndex]) {
    const current = questions[currentIndex];
    return (
      <div className="max-w-3xl mx-auto">
        <AnswerFeedback
          isCorrect={lastAnswer.isCorrect}
          selectedAnswer={lastAnswer.selected}
          correctAnswer={current.answerHe}
          explanation={current.explanationHe}
          onNext={handleNext}
          isLast={currentIndex + 1 >= questions.length}
        />
      </div>
    );
  }

  // Summary Screen
  if (quizState === "summary") {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const score = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

    return (
      <SessionSummary
        score={score}
        totalQuestions={questions.length}
        correctAnswers={correctCount}
        duration={duration}
        answers={answers}
        courseNameHe={selectedCourse?.nameHe || ""}
        onRetry={handleRetry}
      />
    );
  }

  return null;
}
