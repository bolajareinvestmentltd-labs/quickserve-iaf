import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import VendorDashboardClient from "@/components/VendorDashboardClient";

export default async function VendorDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the asynchronous params per Next.js 16 requirements
  const { id } = await params;

  // 1. Authenticate / Fetch Vendor
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
  });

  if (!vendor) notFound();

  // 2. Fetch all products belonging to this vendor
  const vendorProducts = await db.query.products.findMany({
    where: eq(products.vendorId, id),
    orderBy: [desc(products.createdAt)], // Shows newest items first
  });

  return <VendorDashboardClient vendor={vendor} products={vendorProducts} />;
}
