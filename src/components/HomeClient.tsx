"use client";
import { useState } from "react";
import { Star, Clock, MapPin, Search, Store } from "lucide-react";
import ProductCard from "@/components/ProductCard";
// We import your existing FloatingCart
import FloatingCart from "@/components/FloatingCart";

export default function HomeClient({ vendors, products }: any) {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Instantly filter the menu based on the selected store or search bar
  const filteredProducts = products.filter((p: any) => {
    const matchesVendor = selectedVendor ? p.vendorId === selectedVendor : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVendor && matchesSearch;
  });

  return (
    <div className="bg-black min-h-screen text-white pb-32 font-sans">
      {/* 1. STICKY HEADER & SEARCH */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-black/80 backdrop-blur-xl z-40">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Delivering to</p>
            <h1 className="text-sm font-black text-white flex items-center gap-1">
              <MapPin className="w-4 h-4 text-orange-500" /> Kwara Festival Hub
            </h1>
          </div>
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
            <Store className="w-5 h-5 text-orange-500" />
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search for food or drinks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </header>

      {/* 2. VENDOR CAROUSEL */}
      <section className="mt-6">
        <div className="px-6 flex justify-between items-end mb-4">
          <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">Top Storefronts</h2>
          {selectedVendor && (
            <button onClick={() => setSelectedVendor(null)} className="text-[10px] font-black text-orange-500 uppercase tracking-widest active:scale-95">View All</button>
          )}
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-6 pb-4" style={{ scrollbarWidth: 'none' }}>
          {vendors.map((vendor: any) => (
            <div 
              key={vendor.id} 
              onClick={() => setSelectedVendor(vendor.id === selectedVendor ? null : vendor.id)}
              className={`min-w-[240px] bg-zinc-900 border rounded-3xl p-2 cursor-pointer transition-all active:scale-95 ${selectedVendor === vendor.id ? 'border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.2)]' : 'border-zinc-800'}`}
            >
              <div className="w-full h-32 bg-black rounded-2xl relative overflow-hidden mb-3">
                {vendor.logoUrl ? (
                  <img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700"><Store className="w-8 h-8" /></div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-zinc-700/50">
                  <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span className="text-[10px] font-black text-white">{vendor.rating || "4.8"}</span>
                </div>
                {vendor.vendorTag && (
                  <div className="absolute bottom-2 left-2 bg-orange-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md shadow-lg">
                    {vendor.vendorTag}
                  </div>
                )}
              </div>
              <div className="px-2 pb-1">
                <h3 className="text-sm font-black text-white truncate mb-1">{vendor.businessName}</h3>
                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {vendor.prepTime || "15 min"}</span>
                  <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                  <span>₦{vendor.deliveryFee} Delivery</span>
                </div>
              </div>
            </div>
          ))}
          {vendors.length === 0 && (
             <div className="w-full text-center py-10 border border-dashed border-zinc-800 rounded-3xl text-zinc-600 font-bold text-xs uppercase tracking-widest">No storefronts available</div>
          )}
        </div>
      </section>

      {/* 3. DYNAMIC MENU GRID */}
      <section className="px-6 mt-6">
        <h2 className="text-lg font-black italic uppercase tracking-tighter text-white mb-4">
          {selectedVendor ? 'Store Menu' : 'Trending Now'}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product: any) => {
             const vendor = vendors.find((v: any) => v.id === product.vendorId);
             return (
               <ProductCard key={product.id} product={product} vendorName={vendor?.businessName} />
             )
          })}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-3xl mt-4">
            <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest">No items found.</p>
          </div>
        )}
      </section>

      {/* YOUR FLOATING CHECKOUT DRAWER */}
      <FloatingCart />
    </div>
  );
}
