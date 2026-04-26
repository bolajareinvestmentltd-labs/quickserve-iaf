"use server";

import { db } from "@/db";
import { runners, vendors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleRunnerStatus(id: string, currentStatus: boolean) {
  await db.update(runners).set({ isOnline: !currentStatus, lastSeen: new Date() }).where(eq(runners.id, id));
  revalidatePath(`/runner/dashboard/${id}`);
}

export async function toggleVendorStatus(id: string, currentStatus: boolean) {
  await db.update(vendors).set({ isSlotActive: !currentStatus, lastSeen: new Date() }).where(eq(vendors.id, id));
  revalidatePath(`/vendor/dashboard/${id}`);
  revalidatePath("/"); // Update the home page live kitchens
}
