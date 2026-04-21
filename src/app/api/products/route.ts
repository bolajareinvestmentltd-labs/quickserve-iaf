import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vendorId, name, price, category, imageUrl } = body;

    if (!vendorId || !name || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.insert(schema.products).values({
      vendorId: parseInt(vendorId),
      name,
      price: price.toString(),
      category: category as 'food' | 'drink' | 'eatable',
      imageUrl: imageUrl || '🍽️',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to add product:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
