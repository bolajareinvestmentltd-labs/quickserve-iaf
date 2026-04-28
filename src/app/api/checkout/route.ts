import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { items, totalAmount, customerDetails } = await req.json();

    // 1. PAYSTACK EMAIL LOGIC
    const dummyEmail = customerDetails.email || `${customerDetails.phone.replace(/\s+/g, '')}@quickserve.local`;

    // 2. INITIALIZE PAYSTACK
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: dummyEmail,
        amount: totalAmount * 100, // Kobo conversion
        callback_url: `https://quickserve-iaf.vercel.app/orders/verify`, 
        metadata: {
          customer_name: customerDetails.name,
          whatsapp: customerDetails.phone,
          zone: customerDetails.zone,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      console.error("Paystack API Error:", paystackData.message);
      return NextResponse.json({ error: paystackData.message }, { status: 400 });
    }

    // 3. SECURELY LOG THE ORDER IN THE DATABASE
    const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString(); 
    
    await db.insert(orders).values({
      id: paystackData.data.reference, 
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerZone: customerDetails.zone,
      totalAmount: totalAmount, // FIX: Added missing totalAmount
      status: "pending",        // FIX: Changed from "waiting" to "pending"
      deliveryCode: deliveryCode,
    });

    // 4. RETURN THE LINK TO THE FRONTEND
    return NextResponse.json({ authorizationUrl: paystackData.data.authorization_url });

  } catch (error) {
    console.error("Checkout Crash:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
