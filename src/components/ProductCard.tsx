"use client";
import { Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function ProductCard({ product, vendorName }: { product: any, vendorName?: string }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    // Add product to cart with quantity 1
    addItem({ ...product, vendorName: vendorName || "QuickServe Store" }, 1);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3 flex flex-col justify-between relative overflow-hidden group">
      <div className="w-full h-32 bg-black rounded-2xl mb-3 relative overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-90 group-active:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black text-[10px] uppercase tracking-widest">No Image</div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-black text-white leading-tight mb-1">{product.name}</h3>
        <p className="text-[10px] font-bold text-zinc-500 line-clamp-1 mb-2">{product.description || "Fresh & Delicious"}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm font-black text-orange-500 italic">₦{product.price}</p>
          <button onClick={handleAdd} className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-orange-900/20">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
