"use server";
import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. ADMIN LOGIN (With Bulletproof Fallback)
export async function adminLogin(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  // It will try to use Vercel's variables first, but fallback to these strings if Vercel fails
  const validUser = process.env.ADMIN_USERNAME || "Quickserve_admin";
  const validPass = process.env.ADMIN_PASSWORD || "Ka$kaz@zs/z@z6.";

  if (username === validUser && password === validPass) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "active", { path: "/" });
    redirect("/admin");
  }
  
  throw new Error("Invalid Command Credentials");
}

// 2. VENDOR LOGIN (Database Check)
export async function vendorLogin(formData: FormData) {
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));

  const vendor = await db.query.vendors.findFirst({
    where: and(eq(vendors.username, username), eq(vendors.password, password)),
  });

  if (vendor) {
    const cookieStore = await cookies();
    cookieStore.set("vendor_session", vendor.id, { path: "/" });
    redirect("/vendor/dashboard");
  }
  
  throw new Error("Invalid Vendor Credentials");
}
