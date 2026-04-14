import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  scrapeExamList,
  downloadExamPdf,
  parseExamUrl,
  type ScraperConfig,
} from "@/lib/scraper";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, courseId } = body;

    if (!url || !courseId) {
      return NextResponse.json(
        { error: "כתובת URL ומזהה קורס הם שדות חובה" },
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

    // Parse URL to determine portal type
    const urlInfo = parseExamUrl(url);

    const config: ScraperConfig = {
      portalUrl: url,
      portalType: url.includes("moodle") ? "moodle" : "custom",
    };

    // Scrape exam list
    const exams = await scrapeExamList(config);

    if (exams.length === 0) {
      return NextResponse.json(
        {
          message: "לא נמצאו מבחנים בכתובת זו. ייתכן שנדרשת הזדהות.",
          university: urlInfo.university,
          courseId: urlInfo.courseId,
          examsFound: 0,
        },
        { status: 200 }
      );
    }

    // Download and save each exam
    const uploadsDir = join(process.cwd(), "uploads", courseId);
    await mkdir(uploadsDir, { recursive: true });

    const savedMaterials = [];

    for (const exam of exams) {
      try {
        const pdfBuffer = await downloadExamPdf(exam.downloadUrl, config);
        const fileName = `exam-${exam.year || "unknown"}-${Date.now()}.pdf`;
        const filePath = join(uploadsDir, fileName);

        await writeFile(filePath, pdfBuffer);

        // Save to database
        const material = await prisma.material.create({
          data: {
            courseId,
            type: "exam",
            title: exam.title || `מבחן ${exam.year || ""}`,
            filePath,
            year: exam.year,
            processed: false,
          },
        });

        savedMaterials.push(material);
      } catch (downloadError) {
        console.error(`Error downloading exam: ${exam.title}`, downloadError);
      }
    }

    return NextResponse.json({
      message: `נמצאו ${exams.length} מבחנים, ${savedMaterials.length} נשמרו בהצלחה`,
      university: urlInfo.university,
      examsFound: exams.length,
      examsSaved: savedMaterials.length,
    });
  } catch (error) {
    console.error("Error scraping exams:", error);
    return NextResponse.json(
      { error: "שגיאה בהורדת מבחנים מהפורטל" },
      { status: 500 }
    );
  }
}
