"use client";
import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function ProductDrawer({ product, isOpen, onClose, vendor }: any) {
  const [quantity, setQuantity] = useState(1);
  const cartStore = useCart() as any;

  // Reset quantity to 1 every time the drawer opens
  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    // We attach the vendor details so the Cart knows exactly where to group it
    cartStore.addItem({ 
      ...product, 
      vendorId: vendor.id, 
      vendorName: vendor.businessName 
    }, quantity);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 z-50 rounded-t-[2rem] border-t border-zinc-800 flex flex-col max-h-[90vh] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Large Product Image Header */}
        <div className="w-full h-56 bg-black relative">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700 font-black italic uppercase tracking-widest text-xs">No Image</div>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white backdrop-blur-md active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Details & Controls */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto pb-10">
          <div>
            <h2 className="text-2xl font-black text-white leading-tight">{product.name}</h2>
            <p className="text-orange-500 font-black italic text-xl mt-1">₦{product.price}</p>
          </div>
          
          <p className="text-sm text-zinc-400 font-medium">
            {product.description || "Freshly prepared and packaged to order."}
          </p>
          
          {/* Quantity Selector */}
          <div className="flex items-center justify-between mt-4 bg-black border border-zinc-800 rounded-2xl p-2 pl-6">
            <span className="font-bold text-zinc-300 text-sm uppercase tracking-widest">Quantity</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-zinc-400 hover:text-white active:scale-90 bg-zinc-900 rounded-xl"><Minus className="w-4 h-4" /></button>
              <span className="font-black text-xl w-4 text-center text-white">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-orange-500 hover:text-orange-400 active:scale-90 bg-orange-500/10 rounded-xl"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
          
          {/* Add to Order Action */}
          <button onClick={handleAddToCart} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl mt-4 active:scale-95 transition-transform flex justify-between px-6 shadow-lg shadow-orange-900/20">
            <span className="uppercase tracking-widest text-sm">Add to Order</span>
            <span>₦{(product.price * quantity).toLocaleString()}</span>
          </button>
        </div>
      </div>
    </>
  );
}
