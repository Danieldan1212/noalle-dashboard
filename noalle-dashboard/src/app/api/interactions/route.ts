import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const type = searchParams.get("type");
    const limit = searchParams.get("limit");

    const where: Record<string, unknown> = {};
    if (customerId) where.customerId = customerId;
    if (type) where.type = type;

    const interactions = await prisma.interaction.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : 50,
    });

    return NextResponse.json({ interactions });
  } catch (error) {
    console.error("Failed to fetch interactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch interactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { customerId, type, notes, followUpDate } = body;

    if (!customerId || !type || !notes) {
      return NextResponse.json(
        { error: "customerId, type, and notes are required" },
        { status: 400 }
      );
    }

    const customerExists = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customerExists) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const interaction = await prisma.interaction.create({
      data: {
        customerId,
        type,
        notes,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      },
    });

    // Update the customer's updatedAt timestamp
    await prisma.customer.update({
      where: { id: customerId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ interaction }, { status: 201 });
  } catch (error) {
    console.error("Failed to create interaction:", error);
    return NextResponse.json(
      { error: "Failed to create interaction" },
      { status: 500 }
    );
  }
}
