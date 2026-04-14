import { NextRequest, NextResponse } from "next/server";
import { explainConcept } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { concept, courseContext } = body;

    if (!concept || !concept.trim()) {
      return NextResponse.json(
        { error: "יש להזין מושג להסבר" },
        { status: 400 }
      );
    }

    const explanation = await explainConcept(
      concept.trim(),
      courseContext || undefined
    );

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Error explaining concept:", error);
    return NextResponse.json(
      { error: "שגיאה בהסבר המושג" },
      { status: 500 }
    );
  }
}
