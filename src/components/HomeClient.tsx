"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Star, Clock as ClockIcon, MapPin, Search, Store, Utensils, ShoppingBag, Pill, Package, ShoppingCart, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FloatingCart from "@/components/FloatingCart";

export default function HomeClient({ vendors, products }: any) {
  const router = useRouter();
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = products.filter((p: any) => {
    const matchesVendor = selectedVendor ? p.vendorId === selectedVendor : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVendor && matchesSearch;
  });

  return (
    <div className="bg-black min-h-screen text-white pb-32 font-sans relative">
      
      {/* 1. HEADER & HERO SECTION */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-black italic text-white tracking-tighter">QUICK<span className="text-orange-500">SERVE</span></h1>
            <div className="mt-1 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 inline-flex items-center gap-1">
               <MapPin className="w-3 h-3 text-orange-500" />
               <span className="text-[10px] font-bold text-zinc-300">8.49, 4.52</span>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-full flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-green-500" />
            <span className="text-[10px] font-black text-zinc-300 tabular-nums">{time || "Loading..."}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#3a1c09] to-black border border-orange-900/30 rounded-3xl p-6 relative overflow-hidden mb-6">
          <h2 className="text-3xl font-black italic text-white uppercase leading-none tracking-tighter relative z-10 mb-4">
            GET YOUR<br/>CRAVINGS IN<br/><span className="text-orange-500">LESS THAN 5<br/>MINUTES</span>
          </h2>
          <button className="bg-orange-600 text-black font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl relative z-10">
            Auto Fest Combo<br/><span className="text-lg">₦2,500</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Utensils, label: "RESTAURANTS", color: "text-orange-500" },
            { icon: Store, label: "SHOPS", color: "text-blue-400" },
            { icon: Pill, label: "PHARMACIES", color: "text-red-400" },
            { icon: Package, label: "PACKAGES", color: "text-purple-400" },
            { icon: ShoppingCart, label: "MARKETS", color: "text-green-400" },
            { icon: Sparkles, label: "MORE", color: "text-pink-400" }
          ].map((cat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
              <cat.icon className={`w-6 h-6 ${cat.color}`} />
              <span className="text-[8px] font-black tracking-widest uppercase text-zinc-400">{cat.label}</span>
            </div>
          ))}
        </div>

        <div className="relative mb-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search for food or drinks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* 2. EXPLORE */}
      <section className="mt-2 relative z-10">
        <div className="px-4 flex justify-between items-end mb-4">
          <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">Explore</h2>
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
          {vendors.map((vendor: any) => (
            <div 
              key={vendor.id} 
              onClick={() => router.push(`/store/${vendor.id}`)}
              className="min-w-[240px] snap-center bg-zinc-900 border border-zinc-800 rounded-3xl p-2 cursor-pointer transition-all active:scale-95"
            >
              <div className="w-full h-32 bg-black rounded-2xl relative overflow-hidden mb-2">
                {vendor.logoUrl ? (
                  <img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-950"><Store className="w-8 h-8 opacity-50" /></div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-zinc-700/50">
                  <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span className="text-[10px] font-black text-white">{vendor.rating || "4.8"}</span>
                </div>
              </div>
              <div className="px-2 pb-1">
                <h3 className="text-sm font-black text-white truncate mb-1">{vendor.businessName}</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                  <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {vendor.prepTime || "15 min"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED */}
      <section className="px-4 mt-6 relative z-0">
        <h2 className="text-lg font-black italic uppercase tracking-tighter text-white mb-4">Featured</h2>
        <div className="grid grid-cols-2 gap-3 relative z-0">
          {filteredProducts.map((product: any) => {
             const vendor = vendors.find((v: any) => v.id === product.vendorId);
             return <ProductCard key={product.id} product={product} vendorName={vendor?.businessName} />
          })}
        </div>
      </section>

      <div className="h-40" />
      <FloatingCart />
    </div>
  );
}
