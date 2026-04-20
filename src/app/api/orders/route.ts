import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, deliveryZone, ticketId, totalAmount, items, reference } = body;

    const [newOrder] = await db.insert(schema.orders).values({
      customerName,
      customerPhone,
      deliveryZone,
      ticketId: ticketId || null, // Handle optional ticket ID
      totalAmount: totalAmount.toString(),
      status: 'pending',
    }).returning();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemsToInsert = items.map((item: any) => ({
      orderId: newOrder.id,
      productId: item.id,
      quantity: item.quantity,
      subtotal: (item.price * item.quantity).toString(),
    }));

    await db.insert(schema.orderItems).values(itemsToInsert);

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
