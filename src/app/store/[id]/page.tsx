import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import StoreClient from "@/components/StoreClient";

export const dynamic = "force-dynamic";

export default async function StorePage({ params }: any) {
  const vendorId = params.id;
  const vendor = await db.query.vendors.findFirst({ where: eq(vendors.id, vendorId) });
  const vendorProducts = await db.query.products.findMany({ where: eq(products.vendorId, vendorId) });

  if (!vendor) return <div className="bg-black min-h-screen p-10 text-white font-black">Store not found</div>;

  return <StoreClient vendor={vendor} products={vendorProducts} />;
}
