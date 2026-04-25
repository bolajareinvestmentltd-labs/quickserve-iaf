import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    columns: { status: true }
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ status: order.status });
}
