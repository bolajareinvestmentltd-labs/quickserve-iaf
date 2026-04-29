"use client";
import { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingBasket } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-hot-toast";

export default function ProductModal({ product, vendorName, onClose }: any) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  // 🔒 SCROLL LOCK MAGIC: Freezes the background when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAdd = () => {
    addItem({ ...product, vendorName }, quantity);
    toast.success(`Added ${quantity}x ${product.name} to basket`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      {/* Centered Card (Mobile First) */}
      <div className="w-full max-w-sm bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 animate-in zoom-in-95 duration-200">
        <div className="relative h-48 w-full bg-black">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black uppercase tracking-widest">No Image</div>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full border border-zinc-700/50 active:scale-90 transition-transform">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-black text-white italic leading-tight">{product.name}</h2>
            <p className="text-xl font-black text-orange-500 italic">₦{product.price}</p>
          </div>
          <p className="text-zinc-400 font-bold text-xs mb-6 leading-relaxed line-clamp-3">
            {product.description || "Freshly prepared and delivered hot to your location."}
          </p>

          <div className="bg-black/50 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between mb-6">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Quantity</span>
            <div className="flex items-center gap-5">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center active:scale-90 transition-transform">
                <Minus className="w-4 h-4 text-zinc-400" />
              </button>
              <span className="text-lg font-black text-white tabular-nums">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center active:scale-90 transition-transform">
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <button onClick={handleAdd} className="w-full bg-orange-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-orange-900/20 text-sm uppercase tracking-tight">
            <ShoppingBasket className="w-5 h-5" /> Add to Basket — ₦{(product.price * quantity).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}
