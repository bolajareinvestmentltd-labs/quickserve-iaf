"use server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function cancelOrder(orderId: string) {
  await db.update(orders)
    .set({ status: "cancelled" })
    .where(eq(orders.id, orderId));
    
  revalidatePath(`/orders/${orderId}/track`);
}
