import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerZone, items, totalAmount } = body;

    // 1. Validate payload
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Create the master Order record
    const [newOrder] = await db.insert(orders).values({
      customerName,
      customerPhone,
      customerZone,
      totalAmount,
      status: "pending", // Vendor will see this on their dashboard
    }).returning({ id: orders.id });

    // 3. Prepare the individual order items for bulk insertion
    const itemsToInsert = items.map((item: any) => ({
      orderId: newOrder.id,
      productId: item.id,
      vendorId: item.vendorId, // Crucial for routing the order to the correct vendor's dashboard
      quantity: item.quantity,
    }));

    // 4. Bulk insert the items
    await db.insert(orderItems).values(itemsToInsert);

    // Return success to the frontend
    return NextResponse.json({ success: true, orderId: newOrder.id });

  } catch (error) {
    console.error("Checkout Engine Error:", error);
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}
