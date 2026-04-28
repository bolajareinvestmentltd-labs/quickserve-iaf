"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Bike, ThumbsUp, ShieldCheck } from "lucide-react";
import ProductDrawer from "./ProductDrawer";
import BottomNav from "@/components/BottomNav";

export default function StorefrontClient({ vendor, products }: any) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  // Dynamically extract unique categories from the vendor's products
  const categories = ["All", ...Array.from(new Set(products.map((p: any) => p.category || "Meals")))];

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p: any) => (p.category || "Meals") === activeCategory);

  const openProduct = (product: any) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      {/* 1. STOREFRONT HEADER IMAGE */}
      <div className="h-56 w-full bg-zinc-900 relative">
         {vendor.logoUrl ? (
           <img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover opacity-50" />
         ) : (
           <div className="w-full h-full flex items-center justify-center text-zinc-700 font-black italic">STOREFRONT</div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
         <Link href="/" className="absolute top-10 left-6 bg-black/60 p-2.5 rounded-full text-white backdrop-blur-md active:scale-90">
            <ArrowLeft className="w-5 h-5" />
         </Link>
      </div>

      {/* 2. THE BADGES & INFO CARD */}
      <div className="px-6 -mt-12 relative z-10">
         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl shadow-black">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic line-clamp-1">{vendor.businessName}</h1>

            <div className="flex flex-wrap gap-2 mt-5">
              <div className="flex flex-col items-center justify-center bg-black border border-zinc-800 rounded-xl py-2 px-1 flex-1">
                <ThumbsUp className="w-4 h-4 text-green-500 mb-1" />
                <span className="text-[10px] font-bold text-zinc-400">{vendor.rating || "98%"}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-black border border-zinc-800 rounded-xl py-2 px-1 flex-1">
                <Clock className="w-4 h-4 text-zinc-400 mb-1" />
                <span className="text-[10px] font-bold text-zinc-400">{vendor.prepTime || "15-20'"}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-black border border-zinc-800 rounded-xl py-2 px-1 flex-1">
                <Bike className="w-4 h-4 text-zinc-400 mb-1" />
                <span className="text-[10px] font-bold text-zinc-400">₦{vendor.deliveryFee || "200"}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-black border border-zinc-800 rounded-xl py-2 px-1 flex-1">
                <ShieldCheck className="w-4 h-4 text-purple-500 mb-1" />
                <span className="text-[10px] font-bold text-zinc-400 truncate w-full text-center">{vendor.vendorTag || "Prime"}</span>
              </div>
            </div>
         </div>
      </div>

      {/* 3. HORIZONTAL CATEGORIES */}
      <div className="mt-8 px-6 overflow-x-auto scrollbar-hide flex gap-3 pb-2">
         {categories.map((cat: any) => (
            <button
              key={cat as string}
              onClick={() => setActiveCategory(cat as string)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                activeCategory === cat ? "bg-orange-600 text-white border-orange-500" : "bg-zinc-900 text-zinc-400 border-zinc-800"
              }`}
            >
              {cat as string}
            </button>
         ))}
      </div>

      {/* 4. OFFERINGS GRID */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-4">
         {filteredProducts.map((product: any) => (
            <div key={product.id} onClick={() => openProduct(product)} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden active:scale-95 transition-transform flex flex-col shadow-lg shadow-black/50">
               <div className="w-full h-32 bg-black relative">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-700 uppercase font-black tracking-widest">No Image</div>
                  )}
               </div>
               <div className="p-4 flex flex-col flex-grow justify-between">
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-tight">{product.name}</h3>
                  <p className="text-orange-500 font-black italic mt-2 text-sm">₦{product.price}</p>
               </div>
            </div>
         ))}
         {filteredProducts.length === 0 && (
           <div className="col-span-2 text-center py-10 text-zinc-500 font-bold uppercase tracking-widest text-xs">No offerings in this category</div>
         )}
      </div>

      <ProductDrawer product={selectedProduct} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} vendor={vendor} />
      <BottomNav />
    </div>
  );
}
