"use client";
import { useState } from 'react';
import { Pizza, CupSoda, Cookie, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cart';

type Product = {
  id: number;
  name: string;
  price: string;
  category: 'food' | 'drink' | 'eatable';
  imageUrl: string | null;
  vendorName: string;
};

export default function Storefront({ products }: { products: Product[] }) {
  const [active, setActive] = useState<'food' | 'drink' | 'eatable'>('food');
  const addItem = useCartStore((state) => state.addItem);

  const categories = [
    { id: 'food', label: 'Food', icon: Pizza },
    { id: 'drink', label: 'Drinks', icon: CupSoda },
    { id: 'eatable', label: 'Eatables', icon: Cookie },
  ] as const;

  const filteredProducts = products.filter((p) => p.category === active);

  return (
    <div className="space-y-8">
      {/* Premium Dark Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 border border-transparent" 
                  : "bg-[#14171F] text-gray-400 border border-white/5 hover:bg-[#1A1D24] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Responsive Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((item) => (
          <div key={item.id} className="group bg-[#14171F] rounded-3xl p-4 border border-white/5 flex flex-col hover:border-orange-500/30 transition-all duration-300 shadow-xl">
            <div className="h-32 md:h-40 bg-[#0A0C10] rounded-2xl flex items-center justify-center text-5xl mb-4 border border-white/5 group-hover:scale-[1.02] transition-transform">
              {item.imageUrl}
            </div>
            <div className="flex-1">
              <h3 className="font-black text-white text-lg leading-tight mb-1">{item.name}</h3>
              <p className="text-xs text-gray-500 font-bold tracking-wide uppercase mb-4">{item.vendorName}</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <span className="font-black text-orange-500 text-xl">₦{Number(item.price).toLocaleString()}</span>
              <button 
                onClick={() => addItem({ id: item.id, name: item.name, price: Number(item.price), vendorName: item.vendorName })}
                className="bg-white text-black p-3 rounded-xl hover:bg-orange-500 hover:text-white transition-colors active:scale-95 shadow-lg"
              >
                <Plus className="w-5 h-5 font-black" />
              </button>
            </div>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-16 bg-[#14171F] rounded-3xl border border-white/5">
            <div className="text-4xl mb-3 opacity-50">🍽️</div>
            <p className="text-gray-400 font-bold">This vendor hasn't added items in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
