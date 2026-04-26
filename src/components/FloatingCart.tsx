"use client";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FloatingCart() {
  const { items, getTotal } = useCart();
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-28 left-6 right-6 z-[110] animate-in fade-in slide-in-from-bottom-4">
      <Link href="/checkout" className="bg-orange-600 p-5 rounded-[2rem] flex items-center justify-between shadow-2xl shadow-orange-900/40 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="bg-black/20 p-2 rounded-xl">
            <ShoppingBag className="text-white w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-orange-200 uppercase tracking-widest leading-none">Your Plate</p>
            <p className="text-white font-black text-lg leading-none mt-1">{items.length} Items</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-white font-black text-xl italic">₦{getTotal().toLocaleString()}</p>
          <div className="bg-white text-orange-600 p-2 rounded-full">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </div>
  );
}
