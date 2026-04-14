import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeExam, generatePracticeExam } from "@/lib/ai";
import { parsePdfFromPath } from "@/lib/pdf";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, courseId, questionCount = 20 } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "מזהה קורס חסר" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        materials: {
          where: { type: "exam" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "קורס לא נמצא" },
        { status: 404 }
      );
    }

    if (course.materials.length === 0) {
      return NextResponse.json(
        { error: "אין מבחנים מועלים לקורס זה" },
        { status: 400 }
      );
    }

    // Gather content from exam materials
    let combinedContent = "";
    for (const material of course.materials) {
      if (material.summary) {
        combinedContent += `\n\n--- ${material.title} ---\n${material.summary}`;
      } else {
        // Try to parse PDF
        try {
          const text = await parsePdfFromPath(material.filePath);
          combinedContent += `\n\n--- ${material.title} ---\n${text}`;

          // Save summary for future use
          await prisma.material.update({
            where: { id: material.id },
            data: {
              summary: text.substring(0, 5000),
              processed: true,
            },
          });
        } catch (parseError) {
          console.error(
            `Error parsing material ${material.id}:`,
            parseError
          );
        }
      }
    }

    if (!combinedContent.trim()) {
      return NextResponse.json(
        { error: "לא ניתן לקרוא את תוכן המבחנים" },
        { status: 400 }
      );
    }

    if (action === "analyze") {
      const analysis = await analyzeExam(combinedContent);

      // Create or update topics based on analysis
      for (const topic of analysis.topics) {
        const existingTopic = await prisma.topic.findFirst({
          where: {
            courseId,
            nameHe: topic.name,
          },
        });

        if (!existingTopic) {
          await prisma.topic.create({
            data: {
              courseId,
              name: topic.name,
              nameHe: topic.name,
              mastery: 0,
            },
          });
        }
      }

      return NextResponse.json({ analysis });
    }

    if (action === "generate") {
      const questions = await generatePracticeExam(
        combinedContent,
        course.nameHe,
        questionCount
      );

      return NextResponse.json({ questions });
    }

    return NextResponse.json(
      { error: "פעולה לא מוכרת" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in generate route:", error);
    return NextResponse.json(
      { error: "שגיאה בעיבוד הבקשה" },
      { status: 500 }
    );
  }
}
