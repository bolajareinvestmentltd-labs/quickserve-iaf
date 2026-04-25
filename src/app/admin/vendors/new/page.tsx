import { db } from "@/db";
import { vendors } from "@/db/schema";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Store, User, Mail, Phone } from "lucide-react";

export default function NewVendorPage() {
  // 🚀 NEXT.JS SERVER ACTION: Processes data directly on the server securely
  async function createVendor(formData: FormData) {
    "use server";
    
    // Auto lowercase the email to prevent database unique constraint crashes
    const email = String(formData.get("email")).toLowerCase();
    
    await db.insert(vendors).values({
      businessName: String(formData.get("businessName")),
      contactPerson: String(formData.get("contactPerson")),
      email: email,
      phone: String(formData.get("phone")),
      paymentStatus: "successful", // As Admin, we assume you collected the ₦100 fee
      isSlotActive: true, // Auto-activate them for the festival
    });

    redirect("/admin/vendors");
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 pb-24">
      <div className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md p-4 flex items-center border-b border-neutral-800">
        <Link href="/admin/vendors" className="p-2 bg-neutral-900 rounded-full text-white active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="ml-4 font-bold text-white">Onboard New Vendor</span>
      </div>

      <form action={createVendor} className="p-5 flex flex-col gap-4 mt-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
          <Store className="text-orange-500 w-5 h-5 shrink-0" />
          <input required name="businessName" type="text" placeholder="Business Name (e.g. Iya Basira)" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
          <User className="text-neutral-400 w-5 h-5 shrink-0" />
          <input required name="contactPerson" type="text" placeholder="Owner's Full Name" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
          <Mail className="text-neutral-400 w-5 h-5 shrink-0" />
          <input required name="email" type="email" placeholder="Email Address" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
          <Phone className="text-neutral-400 w-5 h-5 shrink-0" />
          <input required name="phone" type="tel" placeholder="WhatsApp Number" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
        </div>

        <button type="submit" className="w-full bg-orange-600 text-white p-4 rounded-2xl font-bold mt-6 active:scale-95 transition-transform shadow-lg">
          Onboard Vendor
        </button>
      </form>
    </div>
  );
}
