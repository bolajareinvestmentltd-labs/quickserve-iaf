import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import Link from "next/link";
import { Store, ShoppingBag, Utensils, Zap, Star, Search } from "lucide-react";
import LiveLocation from "@/components/LiveLocation";
import LiveClock from "@/components/LiveClock";
import BottomNav from "@/components/BottomNav";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const activeVendors = await db.query.vendors.findMany({
    where: eq(vendors.isSlotActive, true),
    orderBy: [desc(vendors.createdAt)],
    limit: 6
  });

  return (
    <div className="bg-black min-h-screen pb-32">
      {/* 🔝 TOP BAR */}
      <header className="p-6 flex flex-col gap-4 bg-zinc-900/20 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white italic tracking-tighter leading-none">QUICK<span className="text-orange-500">SERVE</span></h1>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">Auto Fest Edition</p>
          </div>
          <LiveClock />
        </div>
        <LiveLocation />
      </header>

      <main className="p-6 flex flex-col gap-8">
        {/* 🔍 SEARCH BAR */}
        <div className="relative group">
          <Search className="absolute left-4 top-4 w-5 h-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
          <input type="text" placeholder="Search for food, drinks, stalls..." className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none text-white focus:border-orange-500 transition-all shadow-xl shadow-black" />
        </div>

        {/* 🥘 CATEGORIES */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest italic">Fast Categories</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[ { n: 'Meals', i: Utensils }, { n: 'Drinks', i: Zap }, { n: 'Stalls', i: Store }, { n: 'Orders', i: ShoppingBag } ].map((cat) => (
              <Link href={cat.n === 'Stalls' ? '/vendors' : '#'} key={cat.n} className="flex flex-col items-center gap-2 group">
                <div className="w-full aspect-square bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center group-active:scale-90 transition-transform group-hover:border-orange-500/50">
                  <cat.i className="w-6 h-6 text-zinc-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase">{cat.n}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 🏪 FEATURED KITCHENS (With Active Status) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest italic">Active Kitchens</h3>
            <Link href="/vendors" className="text-[10px] font-black text-orange-500 uppercase">View All</Link>
          </div>
          
          <div className="grid gap-3">
            {activeVendors.map((v) => {
              // Online Logic: If lastSeen was in the last 2 minutes
              const isOnline = v.lastSeen && (new Date().getTime() - new Date(v.lastSeen).getTime() < 120000);
              
              return (
                <Link key={v.id} href={`/vendors/${v.id}`} className="bg-zinc-900 border border-zinc-800 p-4 rounded-[2rem] flex items-center justify-between active:scale-95 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                        <Store className="w-6 h-6 text-orange-500" />
                      </div>
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-zinc-900 ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase italic tracking-tight">{v.businessName}</h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase">Stall {v.stallNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                    <Star className="w-2.5 h-2.5 text-orange-500 fill-current" />
                    <span className="text-[10px] font-black text-white">4.9</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
