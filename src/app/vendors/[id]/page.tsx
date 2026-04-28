import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import StorefrontClient from "@/components/StorefrontClient";

export default async function VendorStorefrontPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the asynchronous params per Next.js 16 standards
  const { id } = await params;

  // Fetch Vendor Details
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
  });

  if (!vendor) notFound();

  // Fetch all Offerings for this specific Vendor
  const vendorProducts = await db.query.products.findMany({
    where: eq(products.vendorId, id),
  });

  // Pass it directly to our newly created Client layout
  return <StorefrontClient vendor={vendor} products={vendorProducts} />;
}
