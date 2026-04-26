import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Store, ShoppingBag, Utensils, Zap, MapPin } from "lucide-react";
import Link from "next/link";
import LiveClock from "@/components/LiveClock";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch REAL active vendors from your database
  const activeVendors = await db.query.vendors.findMany({
    where: eq(vendors.isSlotActive, true),
    orderBy: [desc(vendors.createdAt)],
  });

  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header className="flex flex-col gap-3 sticky top-0 bg-black/80 backdrop-blur-md py-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter">QUICK<span className="text-orange-500">SERVE</span></h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Ilorin Auto Fest Edition</p>
          </div>
          <LiveClock />
        </div>
        <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold uppercase tracking-wide">
           <MapPin className="w-3.5 h-3.5" />
           <span>Ilorin Bowl, Main Arena Zone</span>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-3">
        {[
          { name: 'Meals', icon: Utensils, link: '#' },
          { name: 'Drinks', icon: Zap, link: '#' },
          { name: 'Stalls', icon: Store, link: '/vendors' },
          { name: 'Orders', icon: ShoppingBag, link: '/orders' },
        ].map((cat) => (
          <Link href={cat.link} key={cat.name} className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
            <div className="w-full aspect-square bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center border border-dashed border-zinc-700/50 group-active:border-orange-500">
              <cat.icon className="w-6 h-6 text-zinc-600 group-active:text-orange-500" />
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase group-active:text-white">{cat.name}</span>
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Active <span className="text-orange-500">Kitchens</span></h3>
          <Link href="/vendors" className="text-xs font-bold text-zinc-600 uppercase">View All</Link>
        </div>

        <div className="grid gap-3">
          {activeVendors.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-zinc-800 rounded-3xl">
              <Store className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">No Kitchens Live Yet</p>
            </div>
          ) : (
            activeVendors.map((v) => (
              <Link href={`/vendors/${v.id}`} key={v.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2.5rem] flex flex-col gap-4 active:scale-95 transition-transform">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                      <Store className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                       <h4 className="text-white font-bold uppercase italic tracking-tight text-lg">{v.businessName}</h4>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">Stall {v.stallNumber || 'TBD'} • {v.contactPerson}</p>
                    </div>
                 </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
