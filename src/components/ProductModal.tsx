"use client";
import { useState } from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-hot-toast";

export default function ProductModal({ product, vendorName, onClose }: any) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ ...product, vendorName }, quantity);
    toast.success(`Added ${quantity}x ${product.name} to plate`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-900 rounded-t-[3rem] overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-2xl border-t border-zinc-800">
        <div className="relative h-64 w-full bg-black">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black uppercase tracking-widest">No Image</div>
          )}
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/50 backdrop-blur-md rounded-full border border-zinc-700/50">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-8 pt-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-black text-white italic">{product.name}</h2>
            <p className="text-2xl font-black text-orange-500 italic">₦{product.price}</p>
          </div>
          <p className="text-zinc-500 font-bold text-sm mb-8 leading-relaxed">
            {product.description || "Freshly prepared and delivered hot to your location."}
          </p>

          <div className="bg-black/50 border border-zinc-800 rounded-3xl p-4 flex items-center justify-between mb-8">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Quantity</span>
            <div className="flex items-center gap-6">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center active:scale-90 transition-transform">
                <Minus className="w-4 h-4 text-zinc-400" />
              </button>
              <span className="text-xl font-black text-white tabular-nums">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center active:scale-90 transition-transform">
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <button onClick={handleAdd} className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg shadow-orange-900/20 text-lg uppercase tracking-tight">
            <ShoppingBag className="w-6 h-6" /> Add to Plate — ₦{(product.price * quantity).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}
