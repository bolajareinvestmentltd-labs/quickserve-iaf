import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, vendorTickets } from "@/db/schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  // We use the environment variable or a fallback to your live domain
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quickserve-iaf.vercel.app";

  if (!reference) return NextResponse.redirect(new URL("/", baseUrl));

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const paystackData = await paystackRes.json();

    if (paystackData.status && paystackData.data.status === "success") {
      const metadata = paystackData.data.metadata;
      const cartItems = JSON.parse(metadata.items || "[]");

      const existingOrder = await db.query.orders.findFirst({ 
        where: (orders, { eq }) => eq(orders.id, reference) 
      });
      
      if (!existingOrder) {
        const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        await db.insert(orders).values({
          id: reference,
          customerName: metadata.customerName || "Guest",
          customerPhone: metadata.customerPhone || "N/A",
          customerZone: metadata.customerZone || "Festival Hub",
          totalAmount: paystackData.data.amount / 100,
          deliveryFee: 300,
          customerServiceFee: 50,
          deliveryCode: deliveryCode,
          status: "pending",
          items: metadata.items,
        });

        const vendorGroups = cartItems.reduce((acc: any, item: any) => {
          if (!acc[item.vendorId]) acc[item.vendorId] = [];
          acc[item.vendorId].push(item);
          return acc;
        }, {});

        for (const vendorId of Object.keys(vendorGroups)) {
          const itemsForThisVendor = vendorGroups[vendorId];
          const subtotal = itemsForThisVendor.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0);
          await db.insert(vendorTickets).values({
            orderId: reference,
            vendorId: vendorId,
            items: JSON.stringify(itemsForThisVendor),
            subtotal: subtotal,
            vendorFee: 50,
            payoutAmount: subtotal - 50,
            status: "pending",
          });
        }
      }
      // ABSOLUTE REDIRECT
      return NextResponse.redirect(`${baseUrl}/orders`);
    }
  } catch (error) {
    console.error("Paystack Error:", error);
  }
  return NextResponse.redirect(`${baseUrl}/`);
}
