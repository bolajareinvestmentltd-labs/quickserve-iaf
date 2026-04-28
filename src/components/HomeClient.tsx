"use client";
import { useState, useEffect } from "react";
import { Star, Clock, MapPin, Search, Store, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FloatingCart from "@/components/FloatingCart";

export default function HomeClient({ vendors, products }: any) {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("Fetching location...");

  // The Live Ticking Clock & Mock Geolocation
  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    
    // Simulate fetching real location (In production, wire this to the Geolocation API)
    setTimeout(() => setLocation("Oko Erin, Kwara State"), 1500);

    return () => clearInterval(timer);
  }, []);

  const filteredProducts = products.filter((p: any) => {
    const matchesVendor = selectedVendor ? p.vendorId === selectedVendor : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVendor && matchesSearch;
  });

  return (
    <div className="bg-black min-h-screen text-white pb-32 font-sans relative">
      
      {/* 1. HERO BANNER & HEADER */}
      <div className="bg-zinc-950 border-b border-zinc-900 pb-6 rounded-b-[2rem] shadow-2xl shadow-orange-900/10 relative overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black opacity-60"></div>
        
        <header className="px-6 pt-8 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-orange-500 font-black tracking-widest uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Current Location
              </span>
              <h1 className="text-sm font-bold text-white truncate max-w-[200px]">
                {location}
              </h1>
            </div>
            
            {/* THE TICKING CLOCK */}
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex flex-col items-center shadow-lg">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">Local Time</span>
              <span className="text-sm font-black text-orange-500 tabular-nums tracking-tight">{time || "..."}</span>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Craving something? Search here..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-orange-500 transition-colors shadow-inner"
            />
          </div>
        </header>
      </div>

      {/* 2. VENDOR CAROUSEL (The Storefronts) */}
      <section className="mt-8 relative z-10">
        <div className="px-6 flex justify-between items-end mb-4">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Top Storefronts</h2>
          {selectedVendor && (
            <button onClick={() => setSelectedVendor(null)} className="text-[10px] font-black text-orange-500 uppercase tracking-widest active:scale-95 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
        
        <div className="flex overflow-x-auto gap-4 px-6 pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
          {vendors.map((vendor: any) => (
            <div 
              key={vendor.id} 
              onClick={() => setSelectedVendor(vendor.id === selectedVendor ? null : vendor.id)}
              className={`min-w-[260px] snap-center bg-zinc-900 border rounded-3xl p-2 cursor-pointer transition-all active:scale-95 ${selectedVendor === vendor.id ? 'border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.15)]' : 'border-zinc-800 shadow-lg shadow-black'}`}
            >
              <div className="w-full h-36 bg-black rounded-2xl relative overflow-hidden mb-3">
                {vendor.logoUrl ? (
                  <img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-950">
                    <Store className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-[9px] font-black uppercase tracking-widest">No Cover Image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-zinc-700/50 shadow-xl">
                  <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span className="text-[10px] font-black text-white">{vendor.rating || "4.8"}</span>
                </div>
                {vendor.vendorTag && (
                  <div className="absolute bottom-2 left-2 bg-orange-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-md shadow-lg tracking-widest">
                    {vendor.vendorTag}
                  </div>
                )}
              </div>
              <div className="px-3 pb-2">
                <h3 className="text-md font-black text-white truncate mb-1">{vendor.businessName}</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-zinc-500" /> {vendor.prepTime || "15 min"}</span>
                  <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                  <span className="text-orange-500">₦{vendor.deliveryFee} Delivery</span>
                </div>
              </div>
            </div>
          ))}
          {vendors.length === 0 && (
             <div className="w-full text-center py-12 border border-dashed border-zinc-800 rounded-3xl text-zinc-600 font-bold text-xs uppercase tracking-widest">No storefronts active</div>
          )}
        </div>
      </section>

      {/* 3. DYNAMIC MENU GRID */}
      <section className="px-6 mt-6 relative z-0">
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white mb-6">
          {selectedVendor ? 'Store Menu' : 'Trending Now'}
        </h2>
        
        {/* We use z-0 and relative positioning to prevent overlap issues with the floating cart */}
        <div className="grid grid-cols-2 gap-4 relative z-0">
          {filteredProducts.map((product: any) => {
             const vendor = vendors.find((v: any) => v.id === product.vendorId);
             return (
               <ProductCard key={product.id} product={product} vendorName={vendor?.businessName} />
             )
          })}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-zinc-950 border border-zinc-900 rounded-3xl mt-4 flex flex-col items-center">
            <Search className="w-8 h-8 text-zinc-800 mb-3" />
            <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest">No items found.</p>
          </div>
        )}
      </section>

      {/* 4. THE PROPER CART DRAWER */}
      {/* We are relying on your existing FloatingCart component to render correctly over everything */}
      <div className="relative z-50">
        <FloatingCart />
      </div>
    </div>
  );
}
