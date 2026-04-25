import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ShoppingBag, Car, QrCode } from "lucide-react";

// 🚀 CRITICAL: Forces Next.js to fetch fresh data on every load during the festival
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Only fetch vendors who have successfully paid and activated their slot
  const activeVendors = await db.query.vendors.findMany({
    where: eq(vendors.isSlotActive, true),
    orderBy: (vendors, { desc }) => [desc(vendors.createdAt)],
  });

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header Area */}
      <header className="bg-orange-600 p-6 rounded-b-[2rem] shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tight">Quickserve</h1>
          <p className="text-orange-100 text-sm mt-1 font-medium">Ilorin Automotive Festival</p>
        </div>
        {/* Decorative background shape */}
        <div className="absolute -right-4 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 p-5 mt-2">
        <Link 
          href="/rides" 
          className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
            <Car className="text-orange-500 w-6 h-6" />
          </div>
          <span className="font-semibold text-sm text-neutral-200">Find a Ride</span>
        </Link>
        
        <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center gap-3 opacity-60">
          <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
            <QrCode className="text-neutral-400 w-6 h-6" />
          </div>
          <span className="font-semibold text-sm text-neutral-400">Scan QR at Booth</span>
        </div>
      </div>

      {/* Live Vendors Feed */}
      <main className="px-5 mt-2 flex-1">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
          Live Food Vendors ({activeVendors.length})
        </h2>
        
        {activeVendors.length === 0 ? (
          <div className="text-center p-8 bg-neutral-900 border border-neutral-800 border-dashed rounded-2xl mt-4">
            <p className="text-neutral-400 text-sm">No vendors are online yet. Check back soon!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeVendors.map((vendor) => (
              <Link 
                key={vendor.id} 
                href={`/vendor/${vendor.id}`}
                className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-transform"
              >
                <div>
                  <h3 className="font-bold text-white text-lg">{vendor.businessName}</h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{vendor.contactPerson}</p>
                </div>
                <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-orange-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
