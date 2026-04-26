import { db } from "@/db";
import { vendors } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArrowLeft, Store } from "lucide-react";
import Link from "next/link";

export default function NewVendor() {
  async function createVendor(formData: FormData) {
    "use server";
    await db.insert(vendors).values({
      businessName: String(formData.get("businessName")),
      stallNumber: String(formData.get("stallNumber")),
      contactPerson: String(formData.get("contactPerson")),
      email: String(formData.get("email")),
      phone: String(formData.get("phone")),
    });
    revalidatePath("/admin/vendors");
    redirect("/admin/vendors");
  }

  return (
    <div className="p-6 bg-black min-h-screen pb-32">
      <header className="flex items-center gap-3 mb-8">
        <Link href="/admin/vendors" className="p-2 bg-zinc-900 rounded-full text-zinc-500 active:scale-90 transition-transform">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Onboard <span className="text-[#D4AF37]">Kitchen</span></h1>
      </header>

      <form action={createVendor} className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem]">
        <div className="flex items-center gap-3 mb-2">
          <Store className="text-[#D4AF37] w-5 h-5" />
          <h2 className="text-white font-bold">Kitchen Details</h2>
        </div>
        
        <input name="businessName" placeholder="Business Name (e.g. Mama's Kitchen)" required className="bg-black text-white placeholder-zinc-600 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-[#D4AF37] transition-colors" />
        
        <div className="grid grid-cols-2 gap-4">
          <input name="stallNumber" placeholder="Stall No." required className="bg-black text-white placeholder-zinc-600 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-[#D4AF37] transition-colors" />
          <input name="contactPerson" placeholder="Manager Name" required className="bg-black text-white placeholder-zinc-600 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-[#D4AF37] transition-colors" />
        </div>

        <input name="phone" type="tel" placeholder="WhatsApp Number" required className="bg-black text-white placeholder-zinc-600 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-[#D4AF37] transition-colors" />
        <input name="email" type="email" placeholder="Email Address" required className="bg-black text-white placeholder-zinc-600 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-[#D4AF37] transition-colors" />
        
        <button type="submit" className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-2xl mt-4 uppercase shadow-xl shadow-[#D4AF37]/20 active:scale-95 transition-all">
          Register Vendor
        </button>
      </form>
    </div>
  );
}
