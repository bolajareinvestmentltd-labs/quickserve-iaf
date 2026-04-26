import { db } from "@/db";
import { vendors } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Plus, Store, CheckCircle2, XCircle, Link as LinkIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminVendors() {
  const allVendors = await db.query.vendors.findMany({ orderBy: [desc(vendors.createdAt)] });

  async function toggleActive(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const currentStatus = formData.get("currentStatus") === "true";
    await db.update(vendors).set({ isSlotActive: !currentStatus }).where(eq(vendors.id, id));
    revalidatePath("/admin/vendors");
    revalidatePath("/");
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white pb-32">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-zinc-900 rounded-full text-zinc-500 active:scale-90 transition-transform"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Manage <span className="text-[#D4AF37]">Kitchens</span></h1>
        </div>
        <Link href="/admin/vendors/new" className="bg-[#D4AF37] text-black p-2 rounded-xl font-black active:scale-90 transition-transform"><Plus className="w-6 h-6" /></Link>
      </header>

      <div className="grid gap-4">
        {allVendors.length === 0 ? (
          <p className="text-zinc-600 text-center text-xs font-bold uppercase mt-10">No Vendors Registered</p>
        ) : (
          allVendors.map(v => (
            <div key={v.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-lg uppercase italic">{v.businessName}</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Stall {v.stallNumber} • {v.phone}</p>
                </div>
                
                {/* ACTIVE TOGGLE BUTTON */}
                <form action={toggleActive}>
                  <input type="hidden" name="id" value={v.id} />
                  <input type="hidden" name="currentStatus" value={String(v.isSlotActive)} />
                  <button type="submit" className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border ${v.isSlotActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                    {v.isSlotActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {v.isSlotActive ? 'Live' : 'Hidden'}
                  </button>
                </form>
              </div>

              {/* DASHBOARD LINK FOR ADMIN TO COPY */}
              <div className="bg-black p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-2">
                <span className="text-[9px] text-zinc-500 truncate select-all flex-1">/vendor/dashboard/{v.id}</span>
                <Link href={`/vendor/dashboard/${v.id}`} className="bg-[#D4AF37] text-black px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform">
                  <LinkIcon className="w-3 h-3" /> Visit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
