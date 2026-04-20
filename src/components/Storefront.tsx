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
    { id: 'food', label: 'Food', icon: Pizza, color: 'text-orange-600', bg: 'bg-orange-100', activeBg: 'bg-orange-500', activeText: 'text-white' },
    { id: 'drink', label: 'Drinks', icon: CupSoda, color: 'text-blue-600', bg: 'bg-blue-100', activeBg: 'bg-blue-500', activeText: 'text-white' },
    { id: 'eatable', label: 'Eatables', icon: Cookie, color: 'text-amber-600', bg: 'bg-amber-100', activeBg: 'bg-amber-500', activeText: 'text-white' },
  ] as const;

  const filteredProducts = products.filter((p) => p.category === active);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      vendorName: product.vendorName,
    });
    // Optional: You could trigger a small haptic vibration here for mobile users!
  };

  return (
    <div className="space-y-6">
      {/* CATEGORY FILTER */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all shadow-sm ${
                isActive ? `${cat.activeBg} ${cat.activeText}` : `${cat.bg} ${cat.color} opacity-80`
              }`}
            >
              <Icon className="w-5 h-5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* DYNAMIC PRODUCT FEED */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Festival Favorites</h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col">
              <div className="h-24 bg-gray-50 rounded-xl flex items-center justify-center text-4xl mb-3">
                {item.imageUrl}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 leading-tight mb-1 text-sm">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{item.vendorName}</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-black text-gray-900 text-sm">₦{Number(item.price).toLocaleString()}</span>
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="bg-black text-white p-1.5 rounded-lg hover:bg-orange-500 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500 text-sm">
              No items available in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
