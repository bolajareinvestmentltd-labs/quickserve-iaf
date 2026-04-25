import { db } from "@/db";
import { vendors } from "@/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Store, UserPlus, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminVendors() {
  const allVendors = await db.query.vendors.findMany({
    orderBy: [desc(vendors.createdAt)],
  });

  async function onboardVendor(formData: FormData) {
    "use server";
    await db.insert(vendors).values({
      businessName: String(formData.get("businessName")),
      contactPerson: String(formData.get("contactPerson")),
      email: String(formData.get("email")),
      phone: String(formData.get("phone")),
      isSlotActive: true, // Auto-activate on onboarding
      paymentStatus: "successful", // Assuming they paid at the gate
    });
    revalidatePath("/admin/vendors");
  }

  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      <header>
        <h1 className="text-3xl font-black text-white italic">VENDOR <span className="text-orange-500">ONBOARDING</span></h1>
        <p className="text-zinc-500 text-sm">Register new kitchens and generate access keys.</p>
      </header>

      {/* 📝 REGISTRATION FORM */}
      <section className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2.5rem]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
            <UserPlus className="text-orange-500 w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">New Vendor Registration</h2>
        </div>

        <form action={onboardVendor} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required name="businessName" type="text" placeholder="Business Name (e.g. Pitstop Grills)" className="bg-black border border-zinc-800 p-4 rounded-2xl outline-none text-white focus:border-orange-500 transition-colors" />
            <input required name="contactPerson" type="text" placeholder="Manager Name" className="bg-black border border-zinc-800 p-4 rounded-2xl outline-none text-white focus:border-orange-500 transition-colors" />
            <input required name="email" type="email" placeholder="Email Address" className="bg-black border border-zinc-800 p-4 rounded-2xl outline-none text-white focus:border-orange-500 transition-colors" />
            <input required name="phone" type="text" placeholder="WhatsApp Number" className="bg-black border border-zinc-800 p-4 rounded-2xl outline-none text-white focus:border-orange-500 transition-colors" />
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-900/20 active:scale-95 transition-transform">
            Activate & Generate Link
          </button>
        </form>
      </section>

      {/* 📋 VENDOR LIST & DASHBOARD LINKS */}
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">Active Partners ({allVendors.length})</h3>
        
        <div className="grid gap-3">
          {allVendors.map((vendor) => (
            <div key={vendor.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                    <Store className="text-zinc-400 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase tracking-tighter">{vendor.businessName}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{vendor.contactPerson} • {vendor.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Link href={`/admin/vendors/${vendor.id}/products`} className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                      <SettingsIcon className="w-4 h-4" />
                   </Link>
                </div>
              </div>

              {/* 🔗 THE ACCESS KEY SECTION */}
              <div className="bg-black/50 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Private Dashboard Link</span>
                  <code className="text-[10px] text-zinc-400 truncate max-w-[200px]">/vendor/dashboard/{vendor.id}</code>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/vendor/dashboard/${vendor.id}`} 
                    target="_blank"
                    className="p-2 bg-orange-500/10 text-orange-500 rounded-xl border border-orange-500/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Simple internal icon component for settings
function SettingsIcon({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}