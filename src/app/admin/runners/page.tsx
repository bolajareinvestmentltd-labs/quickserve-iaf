import { db } from "@/db";
import { runners } from "@/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UserPlus, Bike, Copy } from "lucide-react";

export default async function AdminRunners() {
  const allRunners = await db.query.runners.findMany({ orderBy: [desc(runners.createdAt)] });

  async function registerRunner(formData: FormData) {
    "use server";
    await db.insert(runners).values({
      name: String(formData.get("name")),
      phone: String(formData.get("phone")),
    });
    revalidatePath("/admin/runners");
  }

  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Runner <span className="text-orange-500">Registry</span></h1>
      </header>

      <form action={registerRunner} className="bg-zinc-900 p-6 rounded-[2.5rem] flex flex-col gap-4 border border-zinc-800">
        <div className="flex items-center gap-3 mb-2">
          <UserPlus className="text-orange-500 w-5 h-5" />
          <h2 className="text-white font-bold">Onboard New Runner</h2>
        </div>
        <input required name="name" placeholder="Runner Full Name" className="bg-black border border-zinc-800 p-4 rounded-2xl text-white outline-none focus:border-orange-500" />
        <input required name="phone" placeholder="WhatsApp Number" className="bg-black border border-zinc-800 p-4 rounded-2xl text-white outline-none focus:border-orange-500" />
        <button className="bg-orange-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-xl shadow-orange-900/20">Activate Runner</button>
      </form>

      <div className="grid gap-3">
        {allRunners.map(r => (
          <div key={r.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl flex justify-between items-center">
            <div>
              <p className="text-white font-bold">{r.name}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">ID: {r.id.slice(0,8)}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-orange-500 font-black text-sm">₦{r.walletBalance}</p>
              <span className="text-[9px] text-zinc-600 font-bold uppercase">Earned</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
