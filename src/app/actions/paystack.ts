"use server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { redirect } from "next/navigation";

export async function initializePayment(formData: any, cart: any[], cartTotal: number) {
  const serviceFee = 50;
  const deliveryFee = 200;
  const finalTotal = cartTotal + serviceFee + deliveryFee;

  const [order] = await db.insert(orders).values({
    customerName: formData.fullName,
    customerPhone: formData.phone,
    customerZone: formData.zone,
    totalAmount: finalTotal,
  }).returning();

  const itemsToInsert = cart.map(item => ({
    orderId: order.id, productId: item.id, vendorId: item.vendorId, quantity: item.quantity,
  }));
  await db.insert(orderItems).values(itemsToInsert);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const callback_url = `${baseUrl}/orders/${order.id}/track`;

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: formData.email || "guest@quickserve.com", amount: finalTotal * 100, callback_url: callback_url }),
  });
  
  const result = await response.json();
  if (result.status) redirect(result.data.authorization_url);
  throw new Error("Payment init failed");
}
