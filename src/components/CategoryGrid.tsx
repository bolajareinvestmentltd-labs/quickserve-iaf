"use client";
import Link from "next/link";
import { Utensils, ShoppingBasket, Pill, Globe, Sparkles } from "lucide-react";

export default function CategoryGrid() {
  const categories = [
    { icon: ShoppingBasket, name: "Supermarkets", color: "text-blue-400" },
    { icon: Pill, name: "Pharmacies", color: "text-red-400" },
    { icon: Globe, name: "African", color: "text-green-400" },
    { icon: Sparkles, name: "More", color: "text-pink-400" },
  ];

  return (
    <div className="px-6 mb-10 mt-6">
      <div className="grid grid-cols-3 gap-3">
        <Link href="/vendors" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-transform shadow-lg shadow-orange-900/20">
          <Utensils className="w-8 h-8 text-orange-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">Restaurants</span>
        </Link>
        {categories.map((item) => (
          <button key={item.name} onClick={() => alert(`${item.name} activating post-festival!`)} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-transform opacity-70">
            <item.icon className={`w-8 h-8 ${item.color}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
