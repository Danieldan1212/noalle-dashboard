import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateQuestionsFromContent } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, topicIds, difficulty = 2, count = 10 } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "מזהה קורס חסר" },
        { status: 400 }
      );
    }

    // Fetch existing questions from the database
    const whereClause: Record<string, unknown> = {
      topic: {
        courseId,
      },
    };

    if (topicIds && topicIds.length > 0) {
      whereClause.topicId = { in: topicIds };
    }

    const existingQuestions = await prisma.question.findMany({
      where: whereClause,
      include: {
        topic: true,
      },
      orderBy: [
        { timesAsked: "asc" }, // Prefer less-asked questions
        { timesCorrect: "asc" }, // Prefer questions answered incorrectly
      ],
    });

    // Filter by difficulty range
    const filteredQuestions = existingQuestions.filter(
      (q) => Math.abs(q.difficulty - difficulty) <= 1
    );

    let questions;

    if (filteredQuestions.length >= count) {
      // Use existing questions - pick adaptively
      // Prioritize weak areas: questions with lower correct rate
      const scored = filteredQuestions.map((q) => {
        const correctRate =
          q.timesAsked > 0 ? q.timesCorrect / q.timesAsked : 0.5;
        // Lower correct rate = higher priority for review
        const priority = 1 - correctRate + (q.timesAsked === 0 ? 0.3 : 0);
        return { ...q, priority };
      });

      scored.sort((a, b) => b.priority - a.priority);

      // Take the top-priority questions, with some randomization
      const topPool = scored.slice(0, Math.min(count * 2, scored.length));
      const shuffled = topPool.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count);

      questions = selected.map((q) => ({
        id: q.id,
        questionHe: q.questionHe,
        optionsHe: q.optionsHe ? JSON.parse(q.optionsHe) : [],
        answerHe: q.answerHe,
        explanationHe: q.explanationHe,
        difficulty: q.difficulty,
        topicName: q.topic.nameHe,
      }));

      // Update timesAsked
      await Promise.all(
        selected.map((q) =>
          prisma.question.update({
            where: { id: q.id },
            data: { timesAsked: { increment: 1 } },
          })
        )
      );
    } else {
      // Need to generate questions with AI
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          materials: true,
          topics: true,
        },
      });

      if (!course) {
        return NextResponse.json(
          { error: "קורס לא נמצא" },
          { status: 404 }
        );
      }

      // Build content from materials (summaries if available)
      const materialContent = course.materials
        .filter((m) => m.summary)
        .map((m) => m.summary)
        .join("\n\n");

      const topicNames = course.topics.map((t) => t.nameHe).join(", ");
      const content =
        materialContent ||
        `קורס: ${course.nameHe}. נושאים: ${topicNames}`;

      const targetTopic =
        course.topics.length > 0
          ? course.topics[Math.floor(Math.random() * course.topics.length)]
          : null;

      const generated = await generateQuestionsFromContent(
        content,
        targetTopic?.nameHe || course.nameHe,
        count,
        difficulty
      );

      // Save generated questions to database
      if (targetTopic) {
        for (const q of generated) {
          await prisma.question.create({
            data: {
              topicId: targetTopic.id,
              source: "ai-generated",
              questionHe: q.questionHe,
              optionsHe: JSON.stringify(q.optionsHe),
              answerHe: q.answerHe,
              explanationHe: q.explanationHe,
              difficulty: q.difficulty,
              timesAsked: 1,
            },
          });
        }
      }

      questions = generated.map((q, i) => ({
        id: `gen-${i}`,
        questionHe: q.questionHe,
        optionsHe: q.optionsHe,
        answerHe: q.answerHe,
        explanationHe: q.explanationHe,
        difficulty: q.difficulty,
        topicName: targetTopic?.nameHe || course.nameHe,
      }));
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error starting quiz:", error);
    return NextResponse.json(
      { error: "שגיאה ביצירת התרגול" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      courseId,
      topicFilter,
      score,
      totalQs,
      correctQs,
      duration,
      answers,
    } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "מזהה קורס חסר" },
        { status: 400 }
      );
    }

    // Save quiz session
    const session = await prisma.quizSession.create({
      data: {
        courseId,
        topicFilter: topicFilter || null,
        score,
        totalQs,
        correctQs,
        duration,
        answers: answers || "[]",
      },
    });

    // Update topic mastery based on quiz results
    // Parse answers to find per-topic performance
    try {
      const parsedAnswers = JSON.parse(answers || "[]");
      const topicPerformance: Record<
        string,
        { correct: number; total: number }
      > = {};

      for (const answer of parsedAnswers) {
        const topic = answer.topicName;
        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { correct: 0, total: 0 };
        }
        topicPerformance[topic].total++;
        if (answer.isCorrect) {
          topicPerformance[topic].correct++;
        }
      }

      // Update mastery for each topic (weighted average with existing mastery)
      for (const [topicName, perf] of Object.entries(topicPerformance)) {
        const topic = await prisma.topic.findFirst({
          where: {
            courseId,
            nameHe: topicName,
          },
        });

        if (topic) {
          const quizMastery = perf.correct / perf.total;
          // Exponential moving average: 70% old mastery, 30% new performance
          const newMastery = topic.mastery * 0.7 + quizMastery * 0.3;

          await prisma.topic.update({
            where: { id: topic.id },
            data: { mastery: Math.min(Math.max(newMastery, 0), 1) },
          });
        }
      }
    } catch {
      // If answer parsing fails, just skip mastery update
      console.error("Could not parse answers for mastery update");
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error saving quiz session:", error);
    return NextResponse.json(
      { error: "שגיאה בשמירת תוצאות התרגול" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    const where = courseId ? { courseId } : {};

    const sessions = await prisma.quizSession.findMany({
      where,
      include: {
        course: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        courseNameHe: s.course.nameHe,
        score: s.score,
        totalQs: s.totalQs,
        correctQs: s.correctQs,
        duration: s.duration,
        createdAt: s.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching quiz sessions:", error);
    return NextResponse.json(
      { error: "שגיאה בטעינת ההיסטוריה" },
      { status: 500 }
    );
  }
}
