import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = parseInt(params.id);
    if (isNaN(orderId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await req.json();
    
    await db.update(schema.orders)
      .set({ status: body.status })
      .where(eq(schema.orders.id, orderId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
