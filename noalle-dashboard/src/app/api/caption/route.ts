import { NextRequest, NextResponse } from "next/server";
import { aiClient } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { imageDescription, productType, occasion, platform, tone } = body;

    const result = await aiClient.generateCaption({
      imageDescription,
      productType: productType || "תכשיט",
      occasion,
      platform: platform || "all",
      tone,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Caption generation failed:", error);
    return NextResponse.json(
      { error: "Caption generation failed" },
      { status: 500 }
    );
  }
}
