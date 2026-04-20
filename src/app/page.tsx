import Header from '@/components/Header';
import { db } from '@/db';
import * as schema from '@/db/schema';
import Link from 'next/link';
import { Store, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allVendors = await db.query.vendors.findMany({
    with: { products: true }
  });

  return (
    <main className="pb-24">
      <Header />
      
      <div className="container mx-auto px-4 md:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">
            Hungry? <span className="text-orange-500">We're running.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">Select a vendor to view their inventory.</p>
        </div>
        
        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop, 4 on huge screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {allVendors.map((vendor) => (
            <Link 
              href={`/vendor/${vendor.id}`} 
              key={vendor.id}
              className="group flex flex-col bg-[#14171F] border border-white/5 rounded-3xl p-5 hover:bg-[#1A1D24] hover:border-orange-500/30 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#222630] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Store className="w-6 h-6 text-orange-500" />
                </div>
                <span className="text-xs font-bold tracking-widest text-gray-500 uppercase bg-[#0A0C10] px-3 py-1 rounded-full border border-white/5">
                  ID: {vendor.id}
                </span>
              </div>
              
              <h2 className="text-xl font-black text-white mb-1 group-hover:text-orange-400 transition-colors">{vendor.businessName}</h2>
              <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">
                Located at {vendor.boothLocation}. Serving {vendor.products.length} premium items.
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                <span>View Inventory</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
