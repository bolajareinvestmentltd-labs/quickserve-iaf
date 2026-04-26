"use client";
import { useCart } from "@/hooks/useCart";
import { Plus, Check, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const isSoldOut = product.inventoryStatus !== "available";

  const handleAdd = () => {
    if (isSoldOut) return;
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: Number(product.price), 
      vendorId: product.vendorId, 
      quantity: 1 
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={`bg-zinc-900 border border-zinc-800 p-5 rounded-[2.5rem] flex items-center justify-between transition-all ${isSoldOut ? 'opacity-50 grayscale' : 'active:scale-95'}`}>
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-1">
          {product.promoBadge && (
            <span className="bg-orange-500/10 text-orange-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-orange-500/20">
              {product.promoBadge}
            </span>
          )}
        </div>
        <h4 className="text-white font-black uppercase italic tracking-tight text-lg leading-tight">{product.name}</h4>
        <p className="text-zinc-500 text-[9px] font-bold leading-tight mt-1 uppercase tracking-tight line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-2 mt-3">
          <p className="text-[#D4AF37] font-black text-sm italic tracking-tighter">₦{Number(product.price).toLocaleString()}</p>
          <span className="text-zinc-600 text-[10px] font-black uppercase italic">/ {product.unit}</span>
        </div>
      </div>
      
      <button 
        disabled={isSoldOut}
        onClick={handleAdd}
        className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all ${
          isSoldOut ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' :
          added ? 'bg-green-500 rotate-[360deg]' : 'bg-orange-600 shadow-xl shadow-orange-900/40'
        }`}
      >
        {isSoldOut ? <AlertTriangle className="w-5 h-5" /> : 
         added ? <Check className="text-white w-6 h-6" /> : <Plus className="text-white w-6 h-6" />}
      </button>
    </div>
  );
}
