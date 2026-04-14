import { NextRequest, NextResponse } from "next/server";
import { falClient } from "@/lib/fal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { imageUrl, type } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    const validTypes = ["enhance", "removeBackground", "lighting"];
    const enhanceType = validTypes.includes(type) ? type : "enhance";

    let enhancedUrl: string;

    switch (enhanceType) {
      case "removeBackground":
        enhancedUrl = await falClient.removeBackground(imageUrl);
        break;
      case "lighting":
        enhancedUrl = await falClient.improvedLighting(imageUrl);
        break;
      case "enhance":
      default:
        enhancedUrl = await falClient.enhanceImage(imageUrl);
        break;
    }

    return NextResponse.json({ enhancedUrl, type: enhanceType });
  } catch (error) {
    console.error("Image enhancement failed:", error);
    return NextResponse.json(
      { error: "Image enhancement failed" },
      { status: 500 }
    );
  }
}
