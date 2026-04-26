import { db } from "@/db";
import { runners } from "@/db/schema";
import { ArrowLeft, UserPlus, Bike, Copy } from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function AdminRunnerRegistry() {
  // Classic Gold Accent Color: #D4AF37

  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header className="flex items-center gap-3">
        <Link href="/admin" className="p-2 bg-zinc-900 rounded-full text-zinc-500 active:scale-90 transition-transform">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          Logistics <span className="text-[#D4AF37]">Team</span>
        </h1>
      </header>

      {/* Simplified Registry UI with Gold theme */}
      <div className="grid gap-3">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] flex justify-between items-center group active:border-[#D4AF37]/50 transition-colors">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                <Bike className="w-6 h-6 text-zinc-400 group-hover:text-[#D4AF37] transition-colors" />
             </div>
             <div>
                <p className="text-white font-black uppercase italic tracking-tight text-lg">Bolaji Adeoye</p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">Active Rider • ID: IAF_R_1</p>
             </div>
          </div>
          <p className="text-lg font-black text-[#D4AF37] tracking-tighter">16 <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Deliveries</span></p>
        </div>
      </div>
    </div>
  );
}
