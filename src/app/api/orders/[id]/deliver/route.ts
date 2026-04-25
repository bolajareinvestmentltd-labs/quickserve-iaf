import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const updatedOrder = await db.update(orders)
      .set({ status: "delivered" })
      .where(eq(orders.id, id))
      .returning();

    if (updatedOrder.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
