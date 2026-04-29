import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const vendorId = searchParams.get("vendorId");
  if (!vendorId) return NextResponse.json([]);

  try {
    const vendorProducts = await db.query.products.findMany({ 
      where: eq(products.vendorId, vendorId) 
    });
    return NextResponse.json(vendorProducts);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    await db.insert(products).values({
      id: crypto.randomUUID(),
      vendorId: body.vendorId,
      name: body.name,
      price: body.price,
      description: body.description || "",
      imageUrl: "", // Left blank for MVP, can be updated later
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
