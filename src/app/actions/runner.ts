"use server";
import { db } from "@/db";
import { orders, runners } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createRunner(data: any) {
  try {
    // We let the database auto-generate the secure UUID
    await db.insert(runners).values({
      name: data.name,
      username: data.username,
      password: data.password,
      phone: data.phone,
      email: data.email || null,
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create runner. Username might be taken." };
  }
}

export async function loginRunner(username: string, password: string) {
  const runner = await db.query.runners.findFirst({
    where: eq(runners.username, username),
  });
  
  if (!runner || runner.password !== password) {
    return { success: false, error: "Invalid credentials" };
  }
  
  return { success: true, runnerId: runner.id };
}

export async function claimOrder(orderId: string, runnerId: string) {
  await db.update(orders).set({ status: "out_for_delivery", runnerId }).where(eq(orders.id, orderId));
  revalidatePath("/runner/dashboard");
}

export async function verifyDeliveryCode(orderId: string, code: string) {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order) return { success: false, error: "Order not found" };
  if (order.deliveryCode !== code) return { success: false, error: "Invalid PIN." };

  await db.update(orders).set({ status: "delivered" }).where(eq(orders.id, orderId));
  revalidatePath("/runner/dashboard");
  return { success: true };
}
