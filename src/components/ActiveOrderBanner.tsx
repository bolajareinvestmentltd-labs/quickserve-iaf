"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, ArrowRight } from "lucide-react";

export default function ActiveOrderBanner() {
  const [activeOrder, setActiveOrder] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const orderCookie = cookies.find(c => c.trim().startsWith('active_order='));
    if (orderCookie) {
      setActiveOrder(orderCookie.split('=')[1]);
    }
  }, []);

  if (!activeOrder) return null;

  return (
    <div 
      onClick={() => router.push(`/orders/${activeOrder}/track`)}
      className="bg-gradient-to-r from-orange-600 to-orange-500 mx-4 mt-6 rounded-3xl p-4 flex items-center justify-between shadow-2xl shadow-orange-900/40 active:scale-95 transition-transform cursor-pointer animate-in fade-in slide-in-from-top-4 z-50 relative"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center animate-pulse">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-black text-sm italic leading-tight">ORDER PREPARING</h3>
          <p className="text-orange-100 text-[10px] font-bold tracking-widest uppercase">Tap to track live</p>
        </div>
      </div>
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
        <ArrowRight className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}
