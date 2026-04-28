import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, vendorTickets } from "@/db/schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) return NextResponse.redirect(new URL("/", req.url));

  try {
    // 1. Ask Paystack if the payment is genuinely successful
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const paystackData = await paystackRes.json();

    if (paystackData.status && paystackData.data.status === "success") {
      const metadata = paystackData.data.metadata;
      const cartItems = JSON.parse(metadata.items || "[]");

      // 2. Prevent duplicate processing
      const existingOrder = await db.query.orders.findFirst({ 
        where: (orders, { eq }) => eq(orders.id, reference) 
      });
      
      if (!existingOrder) {
        // Generate the secure 4-digit runner PIN
        const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        // 3. CREATE THE PARENT ORDER (For the Customer)
        await db.insert(orders).values({
          id: reference,
          customerName: metadata.customerName || "Guest",
          customerPhone: metadata.customerPhone || "N/A",
          customerZone: metadata.customerZone || "Festival Hub",
          totalAmount: paystackData.data.amount / 100, // Convert Kobo to Naira
          deliveryFee: 300,
          customerServiceFee: 50,
          deliveryCode: deliveryCode,
          status: "pending",
          items: metadata.items, // Keep a raw backup
        });

        // 4. THE ESCROW SPLIT: Group items by Vendor
        const vendorGroups = cartItems.reduce((acc: any, item: any) => {
          if (!acc[item.vendorId]) acc[item.vendorId] = [];
          acc[item.vendorId].push(item);
          return acc;
        }, {});

        // 5. CREATE THE CHILD TICKETS (For the Dashboards)
        for (const vendorId of Object.keys(vendorGroups)) {
          const itemsForThisVendor = vendorGroups[vendorId];
          
          // Calculate specific subtotal for this specific vendor
          const subtotal = itemsForThisVendor.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0);
          
          const vendorFee = 50; // QuickServe HQ Cut
          const payoutAmount = subtotal - vendorFee; // What the vendor actually earns

          await db.insert(vendorTickets).values({
            orderId: reference,
            vendorId: vendorId,
            items: JSON.stringify(itemsForThisVendor),
            subtotal: subtotal,
            vendorFee: vendorFee,
            payoutAmount: payoutAmount,
            status: "pending",
          });
        }
      }
      // Redirect customer to their tracking screen
      return NextResponse.redirect(new URL(`/orders`, req.url));
    }
  } catch (error) {
    console.error("Paystack Error:", error);
  }
  return NextResponse.redirect(new URL("/", req.url));
}
