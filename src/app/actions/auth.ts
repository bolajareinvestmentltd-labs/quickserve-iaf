"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Temporary in-memory store for OTPs (In production, use Redis)
const otpStore = new Map<string, { otp: string; expires: number }>();

export async function sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(email, { otp, expires });

  // 📧 INTEGRATION POINT: This is where you'd call your email API
  console.log(`[AUTH] OTP for ${email}: ${otp}`); 
  
  return { success: true };
}

export async function verifyOtp(email: string, enteredOtp: string) {
  const record = otpStore.get(email);

  if (!record || record.expires < Date.now()) {
    return { success: false, message: "OTP expired or not found" };
  }

  if (record.otp !== enteredOtp) {
    return { success: false, message: "Invalid OTP" };
  }

  // OTP is correct - clear it
  otpStore.delete(email);

  // Check if user exists, if not, create them
  let user = await db.query.users.findFirst({ where: eq(users.email, email) });

  if (!user) {
    [user] = await db.insert(users).values({
      email,
      isVerified: true,
      walletBalance: 0,
      cashbackBalance: 0,
    }).returning();
  } else if (!user.isVerified) {
    await db.update(users).set({ isVerified: true }).where(eq(users.id, user.id));
  }

  return { success: true, userId: user.id };
}
