import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        materials: {
          orderBy: { createdAt: "desc" },
        },
        topics: {
          include: {
            questions: true,
          },
        },
        quizzes: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute stats for each course
    const coursesWithStats = courses.map((course) => {
      const topicMasteries = course.topics.map((t) => t.mastery);
      const averageMastery =
        topicMasteries.length > 0
          ? topicMasteries.reduce((sum, m) => sum + m, 0) /
            topicMasteries.length
          : 0;

      // Build quiz history for charts
      const quizHistory = course.quizzes.map((q) => ({
        date: new Date(q.createdAt).toLocaleDateString("he-IL", {
          month: "short",
          day: "numeric",
        }),
        score: q.score,
        totalQs: q.totalQs,
        correctQs: q.correctQs,
      }));

      return {
        id: course.id,
        name: course.name,
        nameHe: course.nameHe,
        semester: course.semester,
        examDate: course.examDate?.toISOString() || null,
        materials: course.materials.map((m) => ({
          id: m.id,
          type: m.type,
          title: m.title,
          year: m.year,
          processed: m.processed,
          createdAt: m.createdAt.toISOString(),
        })),
        topics: course.topics.map((t) => ({
          id: t.id,
          nameHe: t.nameHe,
          mastery: t.mastery,
        })),
        averageMastery,
        topicCount: course.topics.length,
        quizCount: course.quizzes.length,
        quizHistory,
      };
    });

    // Find weak topics across all courses
    const weakTopics = courses
      .flatMap((course) =>
        course.topics
          .filter((t) => t.mastery < 0.5)
          .map((t) => ({
            id: t.id,
            nameHe: t.nameHe,
            mastery: t.mastery,
            courseNameHe: course.nameHe,
          }))
      )
      .sort((a, b) => a.mastery - b.mastery);

    return NextResponse.json({
      courses: coursesWithStats,
      weakTopics,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "שגיאה בטעינת הקורסים" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameHe, semester, examDate } = body;

    if (!name || !nameHe) {
      return NextResponse.json(
        { error: "שם הקורס הוא שדה חובה" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        name,
        nameHe,
        semester: semester || null,
        examDate: examDate ? new Date(examDate) : null,
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "שגיאה ביצירת הקורס" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "מזהה קורס חסר" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, nameHe, semester, examDate } = body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(nameHe !== undefined && { nameHe }),
        ...(semester !== undefined && { semester: semester || null }),
        ...(examDate !== undefined && {
          examDate: examDate ? new Date(examDate) : null,
        }),
      },
    });

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "שגיאה בעדכון הקורס" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "מזהה קורס חסר" },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "שגיאה במחיקת הקורס" },
      { status: 500 }
    );
  }
}
