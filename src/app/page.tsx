import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import HomeClient from "@/components/HomeClient";

// Force Next.js to always fetch fresh data, so if a vendor adds a menu item, 
// customers see it instantly without refreshing.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch all live data
  const allVendors = await db.query.vendors.findMany();
  
  // Only fetch products that the vendor has marked as available
  const allProducts = await db.query.products.findMany({
    where: eq(products.isAvailable, true),
  });

  return <HomeClient vendors={allVendors} products={allProducts} />;
}
