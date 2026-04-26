import { db } from "@/db";
import { runners } from "@/db/schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ComplianceHub() {
  // Fetch all runners directly since we removed the KYC requirement for the festival MVP
  const allRunners = await db.query.runners.findMany();

  return (
    <div className="p-6 bg-black min-h-screen text-white pb-32">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 bg-zinc-900 rounded-full text-zinc-500 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Logistics <span className="text-blue-500">Team</span>
        </h1>
      </header>

      <div className="mb-8">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">
          Active Fleet ({allRunners.length})
        </h2>
        <div className="grid gap-3">
          {allRunners.length === 0 ? (
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider text-center mt-6">
              No runners onboarded yet.
            </p>
          ) : (
            allRunners.map(r => (
              <div key={r.id} className="bg-zinc-900 p-5 rounded-2xl flex justify-between items-center border border-zinc-800 transition-all active:scale-95">
                <div>
                  <p className="font-black text-white uppercase italic text-lg">{r.name}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">
                    {r.phone} • PIN: {r.pin}
                  </p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  r.isOnline 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {r.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
