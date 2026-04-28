"use server";
import { db } from "@/db";
import { ratings } from "@/db/schema";

export async function submitRating(data: any) {
  try {
    await db.insert(ratings).values({
      orderId: data.orderId,
      vendorId: data.vendorId || null,
      runnerId: data.runnerId || null,
      rating: data.rating,
      feedback: data.feedback || "",
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to submit rating" };
  }
}
