"use server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. CREATE THE VIP LIST OF ALLOWED WORDS
type OrderStatus = "pending" | "paid" | "accepted" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

// 2. TELL TYPESCRIPT THAT newStatus MUST BE ON THE LIST
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus, vendorId?: string) {
  await db.update(orders)
    .set({ status: newStatus })
    .where(eq(orders.id, orderId));
    
  if (vendorId) {
    revalidatePath(`/vendor/dashboard/${vendorId}`);
  }
}
