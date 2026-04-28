"use server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function claimOrder(orderId: string, runnerId: string) {
  await db.update(orders)
    .set({ status: "out_for_delivery", runnerId })
    .where(eq(orders.id, orderId));
    
  revalidatePath("/runner/dashboard");
}

export async function verifyDeliveryCode(orderId: string, code: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId)
  });
  
  if (!order) return { success: false, error: "Order not found" };
  if (order.deliveryCode !== code) return { success: false, error: "Invalid PIN. Check customer's screen." };

  await db.update(orders)
    .set({ status: "delivered" })
    .where(eq(orders.id, orderId));
    
  revalidatePath("/runner/dashboard");
  return { success: true };
}
