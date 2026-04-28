"use client";
import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function ProductDrawer({ product, isOpen, onClose, vendor }: any) {
  const [quantity, setQuantity] = useState(1);
  const cartStore = useCart() as any;

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    cartStore.addItem({ 
      ...product, 
      vendorId: vendor.id, 
      vendorName: vendor.businessName 
    }, quantity);
    onClose();
  };

  return (
    <>
      {/* Centered Modal Overlay - z-[60] ensures it sits ABOVE the BottomNav */}
      <div className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm transition-opacity flex items-center justify-center p-4" onClick={onClose}>
        
        {/* The Modal Card - Scaled for Mobile */}
        <div 
          className="bg-zinc-900 w-full max-w-sm rounded-[2rem] border border-zinc-800 flex flex-col max-h-[85vh] overflow-hidden shadow-2xl shadow-black"
          onClick={(e) => e.stopPropagation()} // Prevents clicking inside the card from closing it
        >
          
          {/* Image Header */}
          <div className="w-full h-48 bg-black relative shrink-0">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700 font-black italic uppercase tracking-widest text-xs">No Image</div>
            )}
            <button onClick={onClose} className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white backdrop-blur-md active:scale-90 transition-transform">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details & Controls */}
          <div className="p-5 flex flex-col gap-3 overflow-y-auto">
            <div>
              <h2 className="text-xl font-black text-white leading-tight">{product.name}</h2>
              <p className="text-orange-500 font-black italic text-lg mt-1">₦{product.price}</p>
            </div>
            
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              {product.description || "Freshly prepared and packaged to order."}
            </p>
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between mt-2 bg-black border border-zinc-800 rounded-2xl p-2 pl-5">
              <span className="font-bold text-zinc-300 text-xs uppercase tracking-widest">Quantity</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-zinc-400 hover:text-white active:scale-90 bg-zinc-900 rounded-lg"><Minus className="w-4 h-4" /></button>
                <span className="font-black text-lg w-6 text-center text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-orange-500 hover:text-orange-400 active:scale-90 bg-orange-500/10 rounded-lg"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
            
            {/* Add to Order Action */}
            <button onClick={handleAddToCart} className="w-full bg-orange-600 text-white font-black py-3.5 rounded-2xl mt-2 active:scale-95 transition-transform flex justify-between px-5 shadow-lg shadow-orange-900/20">
              <span className="uppercase tracking-widest text-xs">Add to Order</span>
              <span className="text-sm">₦{(product.price * quantity).toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
