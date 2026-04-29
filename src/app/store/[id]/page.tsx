import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import StoreClient from "@/components/StoreClient";

export const dynamic = "force-dynamic";

export default async function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await db.query.vendors.findFirst({ where: eq(vendors.id, id) });
  const vendorProducts = await db.query.products.findMany({ where: eq(products.vendorId, id) });

  if (!vendor) {
    return (
      <div className="bg-black min-h-screen p-10 flex flex-col items-center justify-center text-white font-black">
        <p className="text-xl">Store not found</p>
        <a href="/" className="mt-4 text-orange-500 underline text-sm">Go Back Home</a>
      </div>
    );
  }

  return <StoreClient vendor={vendor} products={vendorProducts} />;
}
