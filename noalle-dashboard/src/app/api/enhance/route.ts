import { NextRequest, NextResponse } from "next/server";
import * as fal from "@fal-ai/serverless-client";
import { falClient } from "@/lib/fal";

fal.config({ credentials: process.env.FAL_KEY || "" });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const publicUrl = await fal.storage.upload(file);

    const validTypes = ["enhance", "removeBackground", "lighting"];
    const enhanceType = validTypes.includes(type || "") ? type! : "enhance";

    let enhancedUrl: string;

    switch (enhanceType) {
      case "removeBackground":
        enhancedUrl = await falClient.removeBackground(publicUrl);
        break;
      case "lighting":
        enhancedUrl = await falClient.improvedLighting(publicUrl);
        break;
      case "enhance":
      default:
        enhancedUrl = await falClient.enhanceImage(publicUrl);
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
