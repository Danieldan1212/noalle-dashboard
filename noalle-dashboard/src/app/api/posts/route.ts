import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { metaClient } from "@/lib/meta";
import { pinterestClient } from "@/lib/pinterest";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (platform) where.platforms = { contains: platform };
    if (from || to) {
      where.createdAt = {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      };
    }

    const posts = await prisma.socialPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      imageUrl,
      enhancedUrl,
      captionHe,
      captionEn,
      hashtags,
      platforms,
      status,
      scheduledFor,
    } = body;

    if (!imageUrl || !captionHe || !platforms) {
      return NextResponse.json(
        { error: "imageUrl, captionHe, and platforms are required" },
        { status: 400 }
      );
    }

    // Create post record
    const post = await prisma.socialPost.create({
      data: {
        imageUrl,
        enhancedUrl: enhancedUrl || null,
        captionHe,
        captionEn: captionEn || null,
        hashtags: typeof hashtags === "string" ? hashtags : (hashtags || []).join(","),
        platforms: typeof platforms === "string" ? platforms : platforms.join(","),
        status: status || "draft",
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        postedAt: status === "posted" ? new Date() : null,
      },
    });

    // If publishing now, send to platforms
    if (status === "posted") {
      const platformList =
        typeof platforms === "string" ? platforms.split(",") : platforms;
      const postImageUrl = enhancedUrl || imageUrl;
      const fullCaption = `${captionHe}\n\n${captionEn || ""}\n\n${hashtags}`;

      const publishResults: Record<string, unknown> = {};

      for (const platform of platformList) {
        try {
          switch (platform.trim()) {
            case "instagram":
              publishResults.instagram = await metaClient.publishToInstagram({
                imageUrl: postImageUrl,
                caption: fullCaption,
              });
              break;
            case "facebook":
              publishResults.facebook = await metaClient.publishToFacebook({
                message: fullCaption,
                imageUrl: postImageUrl,
              });
              break;
            case "pinterest":
              publishResults.pinterest = await pinterestClient.createPin({
                title: captionHe.slice(0, 100),
                description: fullCaption,
                imageUrl: postImageUrl,
              });
              break;
          }
        } catch (platformError) {
          console.error(`Failed to publish to ${platform}:`, platformError);
          publishResults[platform.trim()] = {
            error: String(platformError),
          };
        }
      }

      return NextResponse.json(
        { post, publishResults },
        { status: 201 }
      );
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
