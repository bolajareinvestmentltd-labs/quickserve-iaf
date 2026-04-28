"use client";
import { useState } from "react";
import ProductModal from "./ProductModal";

export default function ProductCard({ product, vendorName }: { product: any, vendorName?: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div onClick={() => setShowModal(true)} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3 flex flex-col justify-between relative overflow-hidden group active:scale-95 transition-transform">
        <div className="w-full h-32 bg-black rounded-2xl mb-3 relative overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-90 group-active:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black text-[8px] uppercase tracking-widest">No Image</div>
          )}
        </div>
        <div>
          <h3 className="text-[12px] font-black text-white leading-tight mb-1 truncate">{product.name}</h3>
          <p className="text-[14px] font-black text-orange-500 italic">₦{product.price}</p>
        </div>
      </div>

      {showModal && (
        <ProductModal 
          product={product} 
          vendorName={vendorName} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}
