import { db } from "@/db";
import { vendors, products, orders } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import VendorDashboardClient from "@/components/VendorDashboardClient";

export default async function VendorDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Authenticate Vendor
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
  });

  if (!vendor) notFound();

  // 2. Fetch Menu
  const vendorProducts = await db.query.products.findMany({
    where: eq(products.vendorId, id),
  });

  // 3. Fetch Active Orders
  const activeOrders = await db.query.orders.findMany({
    where: inArray(orders.status, ["pending", "preparing", "out_for_delivery"]),
  });

  return <VendorDashboardClient vendor={vendor} products={vendorProducts} allOrders={activeOrders} />;
}
