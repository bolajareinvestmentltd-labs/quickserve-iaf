"use client";
import { ShoppingCart, Timer } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import Link from 'next/link';

export default function Header() {
  const totalItems = useCartStore((state) => state.totalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <header className="flex items-center justify-between p-4 md:px-8 bg-[#0A0C10]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
      <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition">
        {/* Custom Q Logo with Timer */}
        <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
          <span className="text-white font-black text-xl italic">Q</span>
          <Timer className="absolute -bottom-2 -right-2 w-5 h-5 text-white bg-[#0A0C10] rounded-full p-0.5" />
        </div>
        <h1 className="text-2xl font-black italic tracking-tighter text-white">
          QUICK<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">SERVE</span>
        </h1>
      </Link>
      
      <button 
        onClick={toggleCart}
        className="relative p-3 bg-[#1A1D24] border border-white/10 rounded-2xl hover:bg-[#222630] hover:border-orange-500/50 transition-all active:scale-95 shadow-lg"
      >
        <ShoppingCart className="w-5 h-5 text-gray-300" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[24px] h-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[11px] font-black flex items-center justify-center rounded-full px-1.5 border-2 border-[#0A0C10] shadow-md">
            {totalItems}
          </span>
        )}
      </button>
    </header>
  );
}
