import Header from '@/components/Header';
import Storefront from '@/components/Storefront';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Store } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VendorPage({ params }: { params: { id: string } }) {
  const vendorId = parseInt(params.id);
  
  if (isNaN(vendorId)) return notFound();

  // Fetch specific vendor
  const vendorData = await db.query.vendors.findFirst({
    where: eq(schema.vendors.id, vendorId),
  });

  if (!vendorData) return notFound();

  // Fetch only this vendor's products
  const vendorProducts = await db.query.products.findMany({
    where: eq(schema.products.vendorId, vendorId),
  });

  // Map to the shape expected by Storefront
  const mappedProducts = vendorProducts.map(p => ({
    ...p,
    price: p.price.toString(),
    vendorName: vendorData.businessName
  }));

  return (
    <main className="pb-24">
      <Header />
      
      <div className="container mx-auto px-4 md:px-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-bold text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Vendors
        </Link>

        <div className="bg-[#14171F] border border-white/5 rounded-3xl p-6 md:p-8 mb-8 flex items-center gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center">
             <Store className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white mb-1">{vendorData.businessName}</h1>
            <p className="text-orange-500 font-bold text-sm tracking-wide uppercase">Zone: {vendorData.boothLocation}</p>
          </div>
        </div>

        <Storefront products={mappedProducts} />
      </div>
    </main>
  );
}
