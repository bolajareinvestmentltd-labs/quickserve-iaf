"use server";

import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";

export async function initializePayment(data: {
  email: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  customerZone: string;
  userId?: string;
  items: any[];
}) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  try {
    // 1. Create the transaction with Paystack
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount * 100, // Paystack works in Kobo
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/success`,
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: data.customerName },
            { display_name: "Zone", variable_name: "zone", value: data.customerZone },
          ]
        }
      }),
    });

    const resData = await response.json();

    if (!resData.status) throw new Error(resData.message);

    // 2. Create the Order in your DB as 'pending'
    // We use the reference from Paystack to track it later
    const [newOrder] = await db.insert(orders).values({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerZone: data.customerZone,
      totalAmount: data.amount,
      status: "pending",
      deliveryCode: Math.floor(1000 + Math.random() * 9000).toString(), // Generate 4-digit code
    }).returning();

    // 3. Link the items to the order
    for (const item of data.items) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.id,
        vendorId: item.vendorId,
        quantity: item.quantity,
      });
    }

    return { url: resData.data.authorization_url, orderId: newOrder.id };
  } catch (error) {
    console.error("Payment Init Error:", error);
    return { error: "Failed to initialize payment" };
  }
}
