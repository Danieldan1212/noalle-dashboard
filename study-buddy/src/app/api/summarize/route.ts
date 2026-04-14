import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateStudySummary } from "@/lib/ai";
import { parsePdfFromBuffer, parsePdfFromPath } from "@/lib/pdf";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let content = "";
    let courseNameHe = "כללי";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const courseId = formData.get("courseId") as string | null;

      // Get course name
      if (courseId) {
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          include: { materials: true },
        });

        if (course) {
          courseNameHe = course.nameHe;

          // If no file uploaded, use existing materials
          if (!file) {
            for (const material of course.materials) {
              if (material.summary) {
                content += `\n\n${material.summary}`;
              } else {
                try {
                  const text = await parsePdfFromPath(material.filePath);
                  content += `\n\n${text}`;
                } catch {
                  console.error(
                    `Could not parse material: ${material.id}`
                  );
                }
              }
            }
          }
        }
      }

      // Parse uploaded file
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        if (file.name.endsWith(".pdf")) {
          content = await parsePdfFromBuffer(buffer);
        } else {
          // For text-based files
          content = buffer.toString("utf-8");
        }
      }
    } else {
      const body = await request.json();
      content = body.content || "";
      courseNameHe = body.courseNameHe || "כללי";
    }

    if (!content.trim()) {
      return NextResponse.json(
        { error: "אין תוכן ליצירת סיכום. העלה קובץ או הוסף חומרי לימוד." },
        { status: 400 }
      );
    }

    const summary = await generateStudySummary(content, courseNameHe);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "שגיאה ביצירת הסיכום" },
      { status: 500 }
    );
  }
}
