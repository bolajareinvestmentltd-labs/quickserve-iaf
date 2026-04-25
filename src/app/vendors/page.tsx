import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Store, ShieldCheck } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export const dynamic = 'force-dynamic';

export default async function VendorsPage() {
  const allVendors = await db.query.vendors.findMany({
    where: eq(vendors.isSlotActive, true),
    orderBy: [desc(vendors.createdAt)]
  });

  return (
    <div className="bg-black min-h-screen pb-32">
      <header className="p-6 flex items-center gap-4">
        <Link href="/" className="p-2 bg-zinc-900 rounded-full text-zinc-500"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">THE <span className="text-orange-500">BOWL</span></h1>
      </header>

      <div className="px-6 grid gap-4">
        {allVendors.map((v) => {
          const isOnline = v.lastSeen && (new Date().getTime() - new Date(v.lastSeen).getTime() < 120000);
          
          return (
            <Link key={v.id} href={`/vendors/${v.id}`} className="group bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] flex flex-col gap-4 relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                    <Store className="w-7 h-7 text-zinc-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{v.businessName}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 flex items-center gap-1">
                       <ShieldCheck className="w-3 h-3 text-orange-500" /> Stall {v.stallNumber || '00'} • {v.contactPerson}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${isOnline ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className={`text-[8px] font-black uppercase ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                    {isOnline ? 'Online' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500/5 blur-3xl rounded-full" />
            </Link>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}
