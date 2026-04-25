"use server";

import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";

export async function initializePayment(formData: FormData, cartItems: any[]) {
  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const customerZone = formData.get("customerZone") as string;
  const subTotal = Number(formData.get("totalAmount"));
  
  // 🚚 Add the ₦300 Delivery Fee to the user's total
  const finalTotal = subTotal + 300;

  const [newOrder] = await db.insert(orders).values({
    customerName,
    customerPhone,
    customerZone,
    totalAmount: finalTotal,
    status: "pending",
  }).returning();

  for (const item of cartItems) {
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: item.id,
      vendorId: item.vendorId,
      quantity: item.quantity,
    });
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: `${customerPhone}@quickserve.iaf`,
      amount: finalTotal * 100, // Kobo
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/callback?orderId=${newOrder.id}`,
    }),
  });

  const data = await response.json();
  return data.data.authorization_url;
}
