"use server";

import { db } from "@/db";
import { orders, vendors, runners, orderItems } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function processOrderSettlement(orderId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true }
  });

  if (!order || order.status !== "delivered" || order.isSettled) return;

  // 1. Calculate Payouts
  const PLATFORM_FEE = 50;
  const RUNNER_FEE = 300;
  
  // Total - Platform Fee - Runner Fee = Vendor Payout
  const vendorPayout = order.totalAmount - PLATFORM_FEE - RUNNER_FEE;

  // 2. Execute Atomic Transaction (All succeed or none)
  await db.transaction(async (tx) => {
    // Update Runner Wallet
    if (order.runnerId) {
      await tx.update(runners)
        .set({ 
          walletBalance: sql`${runners.walletBalance} + ${RUNNER_FEE}`,
          totalDeliveries: sql`${runners.totalDeliveries} + 1` 
        })
        .where(eq(runners.id, order.runnerId));
    }

    // Update Vendor Wallet (Grouped by vendor)
    // For simplicity, we assume one vendor per order for this event
    const firstVendorId = order.items[0]?.vendorId;
    if (firstVendorId) {
      await tx.update(vendors)
        .set({ walletBalance: sql`${vendors.walletBalance} + ${vendorPayout}` })
        .where(eq(vendors.id, firstVendorId));
    }

    // Mark order as settled
    await tx.update(orders).set({ isSettled: true }).where(eq(orders.id, orderId));
  });

  return { success: true };
}
