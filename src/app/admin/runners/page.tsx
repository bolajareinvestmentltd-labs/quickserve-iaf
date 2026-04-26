import { db } from "@/db";
import { runners } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { Bike, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminRunners() {
  const allRunners = await db.query.runners.findMany();

  async function registerRunner(formData: FormData) {
    "use server";
    await db.insert(runners).values({
      name: String(formData.get("name")),
      phone: String(formData.get("phone")),
    });
    revalidatePath("/admin/runners");
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <header className="flex items-center gap-3 mb-8">
        <Link href="/admin" className="p-2 bg-zinc-900 rounded-full text-zinc-500"><ArrowLeft className="w-4 h-4" /></Link>
        <h1 className="text-2xl font-black italic uppercase">Rider <span className="text-[#D4AF37]">Registry</span></h1>
      </header>

      <form action={registerRunner} className="bg-zinc-900 p-6 rounded-[2.5rem] flex flex-col gap-4 border border-zinc-800 mb-8">
        <input name="name" placeholder="Rider Full Name" required className="bg-black text-white p-4 rounded-2xl outline-none" />
        <input name="phone" placeholder="WhatsApp Number" required className="bg-black text-white p-4 rounded-2xl outline-none" />
        <button className="bg-[#D4AF37] text-black font-black py-4 rounded-2xl uppercase">Activate Rider</button>
      </form>

      <div className="grid gap-3">
        {allRunners.map(r => (
          <div key={r.id} className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex justify-between items-center">
            <div>
              <p className="font-black uppercase italic">{r.name}</p>
              <p className="text-[10px] text-zinc-500">ID: {r.id.slice(0,8)}</p>
            </div>
            <Bike className="text-[#D4AF37]" />
          </div>
        ))}
      </div>
    </div>
  );
}
