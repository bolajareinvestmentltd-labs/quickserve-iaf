"use client";
import { useCart } from "@/hooks/useCart";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product, vendorName }: { product: any, vendorName: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
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
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-[2rem] flex items-center justify-between group active:scale-95 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-black rounded-2xl border border-zinc-800 flex items-center justify-center text-2xl">
          {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover rounded-2xl" /> : "🥘"}
        </div>
        <div>
          <h4 className="text-white font-bold uppercase italic tracking-tight">{product.name}</h4>
          <p className="text-[#D4AF37] font-black text-sm mt-1">₦{Number(product.price).toLocaleString()}</p>
        </div>
      </div>
      
      <button 
        onClick={handleAdd}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
          added ? 'bg-green-500 rotate-[360deg]' : 'bg-orange-600 active:scale-90 shadow-orange-900/40'
        }`}
      >
        {added ? <Check className="text-white w-5 h-5" /> : <Plus className="text-white w-5 h-5" />}
      </button>
    </div>
  );
}
