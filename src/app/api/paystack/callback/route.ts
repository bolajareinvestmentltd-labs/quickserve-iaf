import { db } from "@/db";
import { orders, vendors, runners, orderItems } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) return NextResponse.redirect(new URL("/", req.url));

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: { with: { product: true } } }
  });

  if (order && order.status === "pending") {
    // 1. Mark Order as Paid & Gen Delivery Code
    const secretCode = Math.floor(1000 + Math.random() * 9000).toString();
    await db.update(orders).set({ 
      status: "paid", 
      deliveryCode: secretCode 
    }).where(eq(orders.id, orderId));

    // 2. Split Money logic
    const vendorSales: Record<string, number> = {};
    
    order.items.forEach(item => {
      const amount = item.product.price * item.quantity;
      vendorSales[item.vendorId] = (vendorSales[item.vendorId] || 0) + amount;
    });

    // 3. Update Vendor Wallets (Total - 50 commission)
    for (const [vId, totalSale] of Object.entries(vendorSales)) {
      const netPay = totalSale - 50; 
      await db.update(vendors)
        .set({ walletBalance: sql`${vendors.walletBalance} + ${netPay}` })
        .where(eq(vendors.id, vId));
    }

    // 4. Update Runner Wallet (The 300 fee)
    // For now, we add it to a 'General Pool' or assign it later.
    // Logic: Once a runner accepts the order, they get the 300.
    
    return NextResponse.redirect(new URL(`/track/${orderId}`, req.url));
  }

  return NextResponse.redirect(new URL("/", req.url));
}
