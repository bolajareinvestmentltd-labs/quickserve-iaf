import Header from '@/components/Header';
import Storefront from '@/components/Storefront';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

// This forces Next.js to always fetch fresh data, not cached versions
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Query Drizzle: Join products with vendors to get the business name
  const liveProducts = await db
    .select({
      id: schema.products.id,
      name: schema.products.name,
      price: schema.products.price,
      category: schema.products.category,
      imageUrl: schema.products.imageUrl,
      vendorName: schema.vendors.businessName,
    })
    .from(schema.products)
    .innerJoin(schema.vendors, eq(schema.products.vendorId, schema.vendors.id));

  return (
    <main className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto relative shadow-2xl">
      <Header />
      
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Hungry? 🚀</h1>
        <p className="text-sm text-gray-500 mb-6">Order and we'll bring it to your zone.</p>
        
        {/* Pass the live data to the interactive client component */}
        <Storefront products={liveProducts} />
      </div>
    </main>
  );
}
