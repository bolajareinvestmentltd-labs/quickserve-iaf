"use server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { redirect } from "next/navigation";

export async function initializePayment(formData: any, cart: any[], cartTotal: number) {
  try {
    const platformFee = 50;
    const finalTotal = cartTotal + platformFee;

    // 1. Create the Order in the Database
    const [order] = await db.insert(orders).values({
      customerName: formData.fullName,
      customerPhone: formData.phone,
      customerZone: formData.zone,
      totalAmount: finalTotal,
    }).returning();

    // 2. Insert all Cart Items
    const itemsToInsert = cart.map(item => ({
      orderId: order.id,
      productId: item.id,
      vendorId: item.vendorId,
      quantity: item.quantity,
    }));
    await db.insert(orderItems).values(itemsToInsert);

    // 3. Define the Callback URL (Localhost vs Live Vercel URL)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callback_url = `${baseUrl}/orders/${order.id}/track`;

    // 4. Initialize Paystack Transaction
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email || "guest@quickserve.com",
        amount: finalTotal * 100, // Paystack requires kobo/cents
        callback_url: callback_url, // <-- THIS IS THE MAGIC REDIRECT KEY
        metadata: {
          orderId: order.id,
          custom_fields: [
            { display_name: "Customer", variable_name: "customer_name", value: formData.fullName },
            { display_name: "Zone", variable_name: "zone", value: formData.zone }
          ]
        }
      }),
    });

    const result = await response.json();
    
    // 5. Redirect the user to the Paystack Checkout Page
    if (result.status) {
      redirect(result.data.authorization_url);
    } else {
      console.error("Paystack Init Error:", result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Payment initialization failed:", error);
    throw error;
  }
}
