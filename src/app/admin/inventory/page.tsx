import { PackageSearch, ShieldAlert, ArrowLeft, Store, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminInventoryMonitor() {
  // Classic Gold Accent Color: #D4AF37
  
  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-zinc-900 rounded-full text-zinc-500 active:scale-90 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Master <span className="text-[#D4AF37]">Inventory</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-sm">Real-time oversight of all products live in the festival bowl.</p>
      </header>

      {/* 📊 SUMMARY MINI-CARDS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl">
          <p className="text-[10px] font-black text-zinc-500 uppercase">Total Items</p>
          <p className="text-2xl font-black text-white">128</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl">
          <p className="text-[10px] font-black text-zinc-500 uppercase">Active Kitchens</p>
          <p className="text-2xl font-black text-white">16</p>
        </div>
      </div>

      {/* 🍱 PRODUCT FEED */}
      <div className="flex flex-col gap-4">
        {/* Simplified feed item using Gold theme */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-[2rem] flex items-center justify-between group active:border-[#D4AF37]/50 transition-colors">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl bg-black border border-zinc-800 overflow-hidden">
               {/* Replace with real image logic */}
               <img src="https://res.cloudinary.com/din74ljlu/image/upload/v1713915157/Spicy_Party_Jollof_zszv9v.jpg" className="w-full h-full object-cover" />
             </div>
             <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-tight">Classic Jollof</h4>
                <div className="flex items-center gap-2 mt-1 text-zinc-600">
                  <Store className="w-3 h-3" />
                  <p className="text-[10px] font-bold uppercase">Mama's Kitchen</p>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
             <p className="text-[#D4AF37] font-black text-sm tracking-tighter">₦2,500</p>
             <div className="flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">Live</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
