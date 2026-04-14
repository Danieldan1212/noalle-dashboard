import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage");
    const source = searchParams.get("source");
    const isVip = searchParams.get("isVip");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (stage) where.stage = stage;
    if (source) where.source = source;
    if (isVip) where.isVip = isVip === "true";
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { instagram: { contains: search } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
        },
        interactions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const enriched = customers.map((customer) => {
      const totalSpent = customer.orders.reduce(
        (sum, order) => sum + order.amount,
        0
      );
      const lastInteraction =
        customer.interactions.length > 0
          ? customer.interactions[0].createdAt
          : null;

      return {
        ...customer,
        orderCount: customer.orders.length,
        totalSpent,
        lastInteraction,
      };
    });

    return NextResponse.json({ customers: enriched });
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, instagram, source, stage, isVip, notes } = body;

    if (!name || !source || !stage) {
      return NextResponse.json(
        { error: "Name, source, and stage are required" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        instagram: instagram || null,
        source,
        stage,
        isVip: isVip || false,
        notes: notes || null,
      },
    });

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    console.error("Failed to create customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
