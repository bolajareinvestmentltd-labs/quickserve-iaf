"use client";
import { useState } from "react";
import { ArrowLeft, Star, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import FloatingCart from "@/components/FloatingCart";

export default function StoreClient({ vendor, products }: any) {
  const router = useRouter();
  
  // Group products by category
  const categories = Array.from(new Set(products.map((p: any) => p.category)));

  return (
    <div className="bg-black min-h-screen text-white pb-32 font-sans relative">
      <div className="h-64 w-full relative">
        {vendor.logoUrl ? (
          <img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-zinc-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <button onClick={() => router.push("/")} className="absolute top-8 left-6 p-3 bg-black/50 backdrop-blur-md rounded-full border border-zinc-700/50">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="px-6 -mt-16 relative z-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">{vendor.businessName}</h1>
        <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">
          <span className="flex items-center gap-1"><Star className="w-4 h-4 text-orange-500 fill-orange-500" /> {vendor.rating || "4.8"}</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-zinc-500" /> {vendor.prepTime || "15-20 min"}</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span className="text-orange-500">₦{vendor.deliveryFee} Delivery</span>
        </div>

        {/* Category Quick-Links */}
        <div className="flex gap-2 overflow-x-auto pb-6" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat: any) => (
            <button key={cat} onClick={() => document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth' })} className="whitespace-nowrap bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              {cat}
            </button>
          ))}
        </div>

        {/* Product Sections */}
        <div className="flex flex-col gap-10">
          {categories.map((cat: any) => (
            <div key={cat} id={cat}>
              <h2 className="text-lg font-black italic uppercase tracking-tighter text-white mb-4 border-l-4 border-orange-600 pl-3">{cat}</h2>
              <div className="grid grid-cols-2 gap-4">
                {products.filter((p: any) => p.category === cat).map((product: any) => (
                  <ProductCard key={product.id} product={product} vendorName={vendor.businessName} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

       <div className="h-40" />
      <FloatingCart />
    </div>
  );
}
