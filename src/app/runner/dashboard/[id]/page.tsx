import { db } from "@/db";
import { runners, orders } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { Bike, Wallet, CheckCircle2, Shield } from "lucide-react";
import { notFound } from "next/navigation";
import StatusPing from "@/components/StatusPing"; // We'll create this below

export default async function RunnerDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const runner = await db.query.runners.findFirst({ where: eq(runners.id, id) });
  if (!runner) notFound();

  return (
    <div className="p-5 flex flex-col gap-6 bg-black min-h-screen">
      <StatusPing id={id} type="runner" />
      
      <header className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
             <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active Now</span>
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{runner.name}</h1>
          <p className="text-zinc-500 text-[10px] font-bold mt-2 uppercase flex items-center gap-1">
             <Shield className="w-3 h-3" /> ID: {id.slice(0, 8)}
          </p>
        </div>
      </header>

      {/* WALLET & LOGISTICS UI... */}
    </div>
  );
}
