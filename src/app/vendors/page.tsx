import { db } from "@/db";
import { vendors } from "@/db/schema";
import Link from "next/link";
import { ArrowLeft, Star, Clock, Bike, Store } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default async function AllVendorsPage() {
  const allVendors = await db.query.vendors.findMany();

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      {/* 1. HEADER */}
      <header className="px-6 pt-10 pb-4 flex items-center gap-4 bg-black sticky top-0 z-40 border-b border-zinc-900">
        <Link href="/" className="bg-zinc-900 p-2 rounded-full text-zinc-500 hover:text-white transition-colors active:scale-90">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black italic tracking-tighter uppercase text-white">
          All <span className="text-orange-500">Restaurants</span>
        </h1>
      </header>

      {/* 2. THE STOREFRONT LIST */}
      <div className="px-6 mt-6 flex flex-col gap-6">
        {allVendors.map((v: any) => (
          <Link href={`/vendors/${v.id}`} key={v.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col gap-4 active:scale-95 transition-transform shadow-lg shadow-black/50">
            
            {/* Storefront Banner Image */}
            <div className="w-full h-40 bg-black rounded-2xl border border-zinc-800 flex items-center justify-center overflow-hidden relative">
              {v.logoUrl ? (
                <img src={v.logoUrl} alt={v.businessName} className="w-full h-full object-cover opacity-80" />
              ) : (
                <Store className="w-8 h-8 text-zinc-700" />
              )}
              {/* Floating Status Tag */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-700/50">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{v.vendorTag || "Prime"}</span>
              </div>
            </div>

            {/* Storefront Details & Badges */}
            <div>
              <h2 className="text-lg font-black text-white leading-tight">{v.businessName}</h2>
              
              <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-bold text-zinc-400">
                <span className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-md"><Star className="w-3 h-3 text-orange-500 fill-orange-500"/> {v.rating || "4.8"}</span>
                <span className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-md"><Clock className="w-3 h-3 text-zinc-400"/> {v.prepTime || "15-20 min"}</span>
                <span className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-md"><Bike className="w-3 h-3 text-zinc-400"/> ₦{v.deliveryFee || "200"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
