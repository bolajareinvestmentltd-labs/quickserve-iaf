"use server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitRating(orderId: string, rating: number, feedback: string) {
  await db.update(orders)
    .set({ rating, feedback })
    .where(eq(orders.id, orderId));
    
  revalidatePath(`/orders/${orderId}/track`);
}
