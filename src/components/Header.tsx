"use client";
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function Header() {
  const totalItems = useCartStore((state) => state.totalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-40">
      <h1 className="text-2xl font-black italic tracking-tighter text-gray-900">
        QUICK<span className="text-orange-500">SERVE</span>
      </h1>
      <button 
        onClick={toggleCart}
        className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition active:scale-95"
      >
        <ShoppingCart className="w-5 h-5 text-gray-800" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1 border-2 border-white">
            {totalItems}
          </span>
        )}
      </button>
    </header>
  );
}
