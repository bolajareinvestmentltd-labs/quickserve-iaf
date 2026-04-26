import { db } from "@/db";
import { vendors, runners } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CheckCircle, XCircle, Eye, ShieldAlert } from "lucide-react";

export default async function ComplianceHub() {
  const pendingVendors = await db.query.vendors.findMany({ where: eq(vendors.kycStatus, 'pending') });
  const pendingRunners = await db.query.runners.findMany({ where: eq(runners.kycStatus, 'pending') });

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <header className="mb-10">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Compliance <span className="text-[#D4AF37]">Queue</span></h1>
      </header>

      <div className="flex flex-col gap-8">
        <section>
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" /> Vendor Approvals ({pendingVendors.length})
          </h3>
          <div className="grid gap-3">
            {pendingVendors.map(v => (
              <div key={v.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] flex justify-between items-center">
                <div>
                  <p className="font-black uppercase italic">{v.businessName}</p>
                  <p className="text-[9px] text-zinc-500 font-bold mt-1">NIN: Pending Review</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white/5 rounded-xl text-zinc-500"><Eye className="w-4 h-4" /></button>
                  <button className="p-3 bg-green-500/10 rounded-xl text-green-500"><CheckCircle className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
