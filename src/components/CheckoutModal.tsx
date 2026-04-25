"use client";

import { useState } from "react";
import { initializePayment } from "@/app/actions/paystack";
import { MapPin, Phone, User, CreditCard, Loader2, X } from "lucide-react";

export default function CheckoutModal({ cart, total, onClose }: { cart: any[], total: number, onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout(formData: FormData) {
    setLoading(true);
    try {
        const authUrl = await initializePayment(formData, cart);
        window.location.href = authUrl;
    } catch (e) {
        setLoading(false);
        alert("Payment initialization failed. Check your connection.");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 rounded-t-[3rem] p-8 border-t border-zinc-800 animate-in slide-in-from-bottom duration-500 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Delivery <span className="text-orange-500">Details</span></h2>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-500"><X className="w-5 h-5" /></button>
        </div>
        
        <form action={handleCheckout} className="flex flex-col gap-4">
          <input type="hidden" name="totalAmount" value={total} />
          <div className="relative">
            <User className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
            <input required name="customerName" placeholder="Full Name" className="w-full bg-black border border-zinc-800 p-4 pl-12 rounded-2xl outline-none text-white focus:border-orange-500 transition-colors" />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
            <input required name="customerPhone" placeholder="WhatsApp Number" className="w-full bg-black border border-zinc-800 p-4 pl-12 rounded-2xl outline-none text-white focus:border-orange-500 transition-colors" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
            <select required name="customerZone" className="w-full bg-black border border-zinc-800 p-4 pl-12 rounded-2xl outline-none text-white appearance-none focus:border-orange-500 transition-colors">
              <option value="">Select Delivery Zone</option>
              <option value="Main Bowl - Sector A">Main Bowl - Sector A</option>
              <option value="VIP Pavilion">VIP Pavilion</option>
              <option value="Exhibitor Stand">Exhibitor Stand</option>
              <option value="Pit Stop Lane">Pit Stop Lane</option>
            </select>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl mt-4 uppercase shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <CreditCard className="w-5 h-5" />}
            {loading ? "Processing..." : `Secure Pay ₦${total.toLocaleString()}`}
          </button>
        </form>
      </div>
    </div>
  );
}
