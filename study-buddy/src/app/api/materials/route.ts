import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { parsePdfFromPath } from "@/lib/pdf";
import { extractExamMetadata } from "@/lib/pdf";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const courseId = formData.get("courseId") as string;
    const type = (formData.get("type") as string) || "exam";

    if (!file || !courseId) {
      return NextResponse.json(
        { error: "קובץ ומזהה קורס הם שדות חובה" },
        { status: 400 }
      );
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "קורס לא נמצא" },
        { status: 404 }
      );
    }

    // Save file to uploads directory
    const uploadsDir = join(process.cwd(), "uploads", courseId);
    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${type}-${Date.now()}-${file.name}`;
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    // Try to extract metadata and parse content
    let year: number | null = null;
    let summary: string | null = null;
    let processed = false;

    if (file.name.endsWith(".pdf")) {
      try {
        const text = await parsePdfFromPath(filePath);
        const metadata = extractExamMetadata(text);
        year = metadata.year;
        summary = text.substring(0, 5000);
        processed = true;
      } catch (parseError) {
        console.error("Error parsing PDF:", parseError);
      }
    }

    // Create material record
    const material = await prisma.material.create({
      data: {
        courseId,
        type,
        title: file.name.replace(/\.[^.]+$/, ""),
        filePath,
        year,
        processed,
        summary,
      },
    });

    return NextResponse.json({ material }, { status: 201 });
  } catch (error) {
    console.error("Error uploading material:", error);
    return NextResponse.json(
      { error: "שגיאה בהעלאת הקובץ" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    const where = courseId ? { courseId } : {};

    const materials = await prisma.material.findMany({
      where,
      include: {
        course: {
          select: { nameHe: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      materials: materials.map((m) => ({
        id: m.id,
        courseId: m.courseId,
        courseNameHe: m.course.nameHe,
        type: m.type,
        title: m.title,
        year: m.year,
        processed: m.processed,
        hasSummary: !!m.summary,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { error: "שגיאה בטעינת החומרים" },
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
        { error: "מזהה חומר חסר" },
        { status: 400 }
      );
    }

    // Get material to find file path
    const material = await prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      return NextResponse.json(
        { error: "חומר לא נמצא" },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      await unlink(material.filePath);
    } catch {
      // File may not exist, that's ok
      console.warn(`Could not delete file: ${material.filePath}`);
    }

    // Delete from database
    await prisma.material.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { error: "שגיאה במחיקת החומר" },
      { status: 500 }
    );
  }
}
