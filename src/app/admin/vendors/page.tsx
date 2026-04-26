import { db } from "@/db";
import { vendors } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { Plus, Store, Key, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function VendorManagement() {
  const allVendors = await db.query.vendors.findMany();

  async function createVendor(formData: FormData) {
    "use server";
    await db.insert(vendors).values({
      businessName: String(formData.get("businessName")),
      contactPerson: String(formData.get("contactPerson")),
      email: String(formData.get("email")),
      phone: String(formData.get("phone")),
      username: String(formData.get("username")),
      password: String(formData.get("password")),
    });
    revalidatePath("/admin/vendors");
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white pb-32">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 bg-zinc-900 rounded-full text-zinc-500"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Vendor <span className="text-[#D4AF37]">Registry</span></h1>
      </header>

      {/* CREATE VENDOR FORM */}
      <form action={createVendor} className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 mb-10 flex flex-col gap-3">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2 mb-2 text-center">Onboard New Kitchen</p>
        <input name="businessName" placeholder="Business Name (e.g. Jollof Hub)" required className="bg-black p-4 rounded-xl border border-zinc-800 outline-none focus:border-[#D4AF37]" />
        <div className="grid grid-cols-2 gap-2">
          <input name="username" placeholder="Login Username" required className="bg-black p-4 rounded-xl border border-zinc-800 outline-none focus:border-[#D4AF37]" />
          <input name="password" placeholder="Login Password" required className="bg-black p-4 rounded-xl border border-zinc-800 outline-none focus:border-[#D4AF37]" />
        </div>
        <input name="email" type="email" placeholder="Contact Email" required className="bg-black p-4 rounded-xl border border-zinc-800 outline-none focus:border-[#D4AF37]" />
        <button className="bg-[#D4AF37] text-black font-black py-5 rounded-2xl mt-2 uppercase tracking-widest">Register Vendor</button>
      </form>

      {/* VENDOR LIST */}
      <div className="grid gap-3">
        {allVendors.map((v) => (
          <div key={v.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                <Store className="text-[#D4AF37] w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black uppercase italic text-sm">{v.businessName}</h4>
                <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">User: {v.username} • PIN: {v.password}</p>
              </div>
            </div>
            <Link href={`/admin/vendors/${v.id}/products`} className="p-3 bg-white/5 rounded-xl text-zinc-500 hover:text-white">
              <Plus className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
