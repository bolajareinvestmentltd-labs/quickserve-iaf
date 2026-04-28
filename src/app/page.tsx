import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import Link from "next/link";
import { Store, Star, Clock, Bike } from "lucide-react";
import DynamicHeader from "@/components/DynamicHeader";
import CategoryGrid from "@/components/CategoryGrid";
import BottomNav from "@/components/BottomNav";

export default async function HomePage() {
  const allVendors = await db.query.vendors.findMany();
  const allProducts = await db.query.products.findMany({ limit: 6 });

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      {/* Dynamic Header with Ticking Clock remains untouched */}
      <DynamicHeader />

      {/* Replaced Vision Grid with Chowdeck-style Categories */}
      <CategoryGrid />

      <div id="explore" className="mb-10 mt-4">
        <h3 className="px-6 text-xl font-black tracking-tighter mb-4 text-white/90">Explore <span className="text-orange-500">Live</span> Vendors</h3>
        <div className="flex overflow-x-auto gap-6 px-6 pb-4 scrollbar-hide">
          {allVendors.map((v) => (
            <Link href={`/vendors/${v.id}`} key={v.id} className="flex flex-col items-center gap-2 w-20 flex-shrink-0 active:scale-95 transition-transform">
              <div className="w-16 h-16 bg-zinc-900 rounded-full border-2 border-zinc-800 flex items-center justify-center overflow-hidden shadow-lg shadow-black/50">
                {v.logoUrl ? <img src={v.logoUrl} alt={v.businessName} className="w-full h-full object-cover" /> : <Store className="w-6 h-6 text-zinc-500" />}
              </div>
              <span className="text-[10px] font-bold text-center leading-tight text-zinc-400 line-clamp-2">{v.businessName}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="px-6 text-xl font-black tracking-tighter mb-4 flex items-center gap-2 text-white/90">Featured 🌟</h3>
        <div className="flex overflow-x-auto gap-4 px-6 pb-8 scrollbar-hide">
          {allProducts.map((p) => (
            <Link href={`/vendors/${p.vendorId}`} key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 w-64 flex-shrink-0 flex flex-col gap-3 transition-transform active:scale-95">
              <div className="w-full h-40 bg-black rounded-2xl border border-zinc-800 flex items-center justify-center overflow-hidden relative">
                 {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="text-zinc-700 font-black italic uppercase text-xs tracking-widest">No Image</div>}
              </div>
              <div>
                <h4 className="font-bold text-white text-base line-clamp-1">{p.name}</h4>
                
                {/* Professional Glovo-Style Data Badges */}
                <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-zinc-400">
                    <span className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-md"><Bike className="w-3 h-3 text-zinc-400"/> ₦200</span>
                    <span className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-md"><Clock className="w-3 h-3 text-zinc-400"/> 15-20 min</span>
                    <span className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-2 py-1 rounded-md"><Star className="w-3 h-3 fill-current"/> 4.8</span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
