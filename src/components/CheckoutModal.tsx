"use client";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { initializePayment } from "@/app/actions/paystack";
import { Loader2, Zap } from "lucide-react";

export default function CheckoutModal() {
  const { items, getTotal } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    const res = await initializePayment({
      email: String(formData.get("email")),
      customerName: String(formData.get("name")),
      customerPhone: String(formData.get("phone")),
      customerZone: String(formData.get("zone")),
      amount: getTotal(),
      items: items,
    });

    if (res.url) {
      window.location.href = res.url;
    } else {
      alert("Error initializing payment");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-zinc-900 rounded-[2.5rem] border border-zinc-800">
      <form action={handleAction} className="flex flex-col gap-4">
        <input required name="name" placeholder="Name" className="bg-black p-4 rounded-xl border border-zinc-800 outline-none focus:border-orange-500" />
        <input required name="email" type="email" placeholder="Email" className="bg-black p-4 rounded-xl border border-zinc-800 outline-none focus:border-orange-500" />
        <div className="grid grid-cols-2 gap-2">
           <input required name="phone" placeholder="WhatsApp" className="bg-black p-4 rounded-xl border border-zinc-800 outline-none focus:border-orange-500" />
           <input required name="zone" placeholder="Zone" className="bg-black p-4 rounded-xl border border-zinc-800 outline-none focus:border-orange-500" />
        </div>
        <button disabled={loading} className="bg-orange-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <><Zap className="w-4 h-4 fill-current" /> Pay ₦{getTotal().toLocaleString()}</>}
        </button>
      </form>
    </div>
  );
}
