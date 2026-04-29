import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq } from "drizzle-orm";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function VendorDashboard() {
  // Await cookies to satisfy Next.js rules
  const cookieStore = await cookies();
  const vendorId = cookieStore.get("vendor_token")?.value;

  if (!vendorId) {
    redirect("/vendor");
  }

  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, vendorId)
  });

  if (!vendor) {
     redirect("/vendor");
  }

  return <DashboardClient vendor={vendor} />;
}
