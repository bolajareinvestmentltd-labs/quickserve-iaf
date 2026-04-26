import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import Link from "next/link";
import { MapPin, Utensils, Store, Pill, Package, ShoppingBasket, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default async function HomePage() {
  const allVendors = await db.query.vendors.findMany();
  const allProducts = await db.query.products.findMany({ limit: 6 });

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      {/* 1. TOP HEADER */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-center bg-black sticky top-0 z-40">
        <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold">Auto Fest '26 Zone</span>
        </div>
      </header>

      {/* 2. HERO BANNER */}
      <div className="px-6 mb-8 mt-2">
        <div className="bg-gradient-to-r from-orange-900 to-black border border-orange-600/30 rounded-3xl p-6 relative overflow-hidden">
          <div className="relative z-10 w-2/3">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-tight mb-2">Get the Fest Combo now</h2>
            <div className="inline-block bg-orange-500 text-black font-black px-3 py-1 text-sm rounded-lg border border-orange-400">
              ₦2,500 Only
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/20 blur-3xl rounded-full"></div>
        </div>
      </div>

      {/* 3. THE VISION GRID */}
      <div className="px-6 mb-10">
        <div className="grid grid-cols-3 gap-3">
          <Link href="#explore" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-transform">
            <Utensils className="w-8 h-8 text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Restaurants</span>
          </Link>
          {[
            { icon: Store, name: "Shops", color: "text-blue-400" },
            { icon: Pill, name: "Pharmacies", color: "text-red-400" },
            { icon: Package, name: "Packages", color: "text-purple-400" },
            { icon: ShoppingBasket, name: "Markets", color: "text-green-400" },
            { icon: Sparkles, name: "More", color: "text-pink-400" },
          ].map((item) => (
            <div key={item.name} onClick={() => alert("Coming Soon after Auto Fest!")} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-transform opacity-70 cursor-pointer">
              <item.icon className={`w-8 h-8 ${item.color}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. EXPLORE (Circular Vendors) */}
      <div id="explore" className="mb-10">
        <h3 className="px-6 text-xl font-black tracking-tighter mb-4">Explore</h3>
        <div className="flex overflow-x-auto gap-6 px-6 pb-4 scrollbar-hide">
          {allVendors.map((v) => (
            <Link href={`/vendors/${v.id}`} key={v.id} className="flex flex-col items-center gap-2 w-20 flex-shrink-0 active:scale-95 transition-transform">
              <div className="w-16 h-16 bg-zinc-900 rounded-full border-2 border-zinc-800 flex items-center justify-center overflow-hidden shadow-lg">
                {v.logoUrl ? <img src={v.logoUrl} alt={v.businessName} className="w-full h-full object-cover" /> : <Store className="w-6 h-6 text-zinc-500" />}
              </div>
              <span className="text-[10px] font-bold text-center leading-tight text-zinc-400 line-clamp-2">{v.businessName}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. FEATURED (Product Cards) */}
      <div>
        <h3 className="px-6 text-xl font-black tracking-tighter mb-4 flex items-center gap-2">Featured 🌟</h3>
        <div className="flex overflow-x-auto gap-4 px-6 pb-8 scrollbar-hide">
          {allProducts.map((p) => (
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 w-60 flex-shrink-0 flex flex-col gap-3">
              <div className="w-full h-32 bg-black rounded-2xl border border-zinc-800 flex items-center justify-center">
                <Utensils className="w-8 h-8 text-zinc-700" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{p.name}</h4>
                <p className="text-orange-500 font-black italic mt-1">₦{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
