"use server";
import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. ADMIN LOGIN (With Anti-Space Protection)
export async function adminLogin(formData: FormData) {
  // .trim() removes invisible spaces added by mobile keyboards
  const username = String(formData.get("username")).trim();
  const password = String(formData.get("password")).trim();

  // Hardcoded to completely bypass Vercel environment variable errors for the festival
  const validUser = "Quickserve_admin";
  const validPass = "Ka$kaz@zs/z@z6.";

  if (username === validUser && password === validPass) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "active", { path: "/" });
    redirect("/admin");
  }
  
  throw new Error("Invalid Command Credentials");
}

// 2. VENDOR LOGIN (With Correct ID Routing)
export async function vendorLogin(formData: FormData) {
  const username = String(formData.get("username")).trim();
  const password = String(formData.get("password")).trim();

  const vendor = await db.query.vendors.findFirst({
    where: and(eq(vendors.username, username), eq(vendors.password, password)),
  });

  if (vendor) {
    const cookieStore = await cookies();
    cookieStore.set("vendor_session", vendor.id, { path: "/" });
    // FIX: Redirects to their specific ID dashboard so it doesn't 404!
    redirect(`/vendor/dashboard/${vendor.id}`);
  }
  
  throw new Error("Invalid Vendor Credentials");
}
