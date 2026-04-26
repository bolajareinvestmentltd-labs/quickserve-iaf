"use server";
import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. ADMIN LOGIN (Uses Environment Variables)
export async function adminLogin(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "active", { path: "/" });
    redirect("/admin");
  }
  
  throw new Error("Invalid Admin Credentials");
}

// 2. VENDOR LOGIN (Uses Database)
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
