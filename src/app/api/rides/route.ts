import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await db.insert(schema.rides).values({
      driverName: body.driverName,
      vehicleInfo: body.vehicleInfo,
      destination: body.destination,
      departureTime: body.departureTime,
      whatsappNumber: body.whatsappNumber,
      seats: parseInt(body.seats)
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ride creation failed:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
