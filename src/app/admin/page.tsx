import { db } from "@/db";
import { orders, vendors } from "@/db/schema";
import { desc } from "drizzle-orm";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Fetch God Mode Data
  const allOrders = await db.query.orders.findMany();
  const allVendors = await db.query.vendors.findMany();

  return <AdminDashboardClient initialOrders={allOrders} initialVendors={allVendors} />;
}
