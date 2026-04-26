import { ArrowLeft, PackageSearch, Bike, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminCommandCenter() {
  const cards = [
    { label: "Master Inventory", href: "/admin/inventory", icon: PackageSearch, color: "text-amber-400" },
    { label: "Rider Logistics Team", href: "/admin/runners", icon: Bike, color: "text-sky-400" },
    { label: "Real-Time Orders", href: "/admin/orders", icon: Activity, color: "text-orange-500" },
  ];

  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header className="flex items-center gap-3">
        <Link href="/" className="p-2 bg-zinc-900 rounded-full text-zinc-500 active:scale-90 transition-transform">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Command <span className="text-amber-400">Center</span></h1>
      </header>

      {/* 📊 MINI-STATS ROW (Placeholder) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem]">
          <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Total Delivered</p>
          <p className="text-xl font-black text-white">128 <span className="text-[10px] text-green-500">Orders</span></p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem]">
          <PackageSearch className="w-5 h-5 text-zinc-600 mb-2" />
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Live Products</p>
          <p className="text-xl font-black text-white">64 <span className="text-[10px] text-zinc-600">Items</span></p>
        </div>
      </div>

      {/* 🛠️ OPERATIONS GRID */}
      <div className="grid gap-3">
        {cards.map((card, i) => (
          <Link key={i} href={card.href} className="group bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 flex justify-between items-center active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <p className="text-lg font-bold text-white uppercase italic tracking-tight">{card.label}</p>
            </div>
            <ArrowLeft className="w-4 h-4 text-zinc-700 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
