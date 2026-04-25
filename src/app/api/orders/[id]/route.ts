import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // 🚀 The Fix: Await the params
    const body = await req.json();

    await db.update(orders)
      .set({ status: body.status })
      .where(eq(orders.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
