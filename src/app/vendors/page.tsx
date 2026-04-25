import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Store, ChevronRight, Star, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VendorDiscovery() {
  const activeVendors = await db.query.vendors.findMany({
    where: eq(vendors.isSlotActive, true),
    orderBy: [desc(vendors.createdAt)],
  });

  return (
    <div className="p-5 flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-black text-white italic">SELECT <span className="text-orange-500">KITCHEN</span></h1>
        <p className="text-zinc-500 text-sm">Active vendors serving the main bowl</p>
      </header>

      <div className="flex flex-col gap-4">
        {activeVendors.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 border-dashed p-10 rounded-[2rem] text-center">
            <p className="text-zinc-500 font-bold uppercase text-xs">No Kitchens Online Yet</p>
          </div>
        ) : (
          activeVendors.map((vendor) => (
            <Link key={vendor.id} href={`/vendor/${vendor.id}`} className="group relative bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] flex items-center justify-between active:scale-95 transition-all overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                  <Store className="w-7 h-7 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg leading-none uppercase italic tracking-tighter">{vendor.businessName}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-[10px] bg-green-500/10 text-green-500 font-black px-2 py-0.5 rounded-full uppercase">
                      <Star className="w-2.5 h-2.5 fill-current" /> 4.9
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold">
                      <Clock className="w-2.5 h-2.5" /> 5-10 MINS
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-zinc-700 group-hover:text-orange-500 transition-colors" />
              {/* Background Glow */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-500/5 blur-3xl" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}