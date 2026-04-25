"use server";

import { db } from "@/db";
import { orders, runners } from "@/db/schema";
import { eq, sql, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function acceptOrder(orderId: string, runnerId: string) {
  try {
    // 1. Double check the order is still available (Concurrency check)
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), isNull(orders.runnerId))
    });

    if (!order) throw new Error("Order already taken by another runner!");

    // 2. Assign Runner to Order & Update Status
    await db.update(orders)
      .set({ 
        runnerId: runnerId,
        status: "accepted" 
      })
      .where(eq(orders.id, orderId));

    // 3. Move the ₦300 to the Runner's wallet immediately
    await db.update(runners)
      .set({ 
        walletBalance: sql`${runners.walletBalance} + 300`,
        totalDeliveries: sql`${runners.totalDeliveries} + 1`
      })
      .where(eq(runners.id, runnerId));

    revalidatePath(`/runner/dashboard/${runnerId}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Could not claim order." };
  }
}
