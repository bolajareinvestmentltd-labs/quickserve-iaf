"use client";
import { useCart } from "@/hooks/useCart";
import { ArrowRight, Zap, Gift } from "lucide-react";

export default function CheckoutForm() {
  const { cart, cartTotal } = useCart();
  const platformFee = 50;
  const finalTotal = cartTotal + platformFee;

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
      {/* CASHBACK BANNER - SCALED DOWN */}
      <div className="bg-gradient-to-r from-orange-900/40 to-black border border-orange-600/30 p-4 rounded-2xl flex items-center gap-4">
        <div className="bg-orange-600 p-2 rounded-xl"><Gift className="w-5 h-5 text-white" /></div>
        <div>
          <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Guest Member</p>
          <p className="text-white text-xs font-medium leading-tight mt-0.5">Sign up now to claim <span className="text-orange-500 font-bold">₦122.5</span> cashback!</p>
        </div>
      </div>

      {/* RECEIPT BREAKDOWN */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-2">
        <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest border-b border-zinc-800 pb-2 mb-1">Order Summary</h3>
        <div className="flex justify-between text-sm text-zinc-300 font-medium">
          <span>Subtotal ({cart.length} items)</span>
          <span>₦{cartTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-zinc-300 font-medium">
          <span>Platform Fee</span>
          <span>₦{platformFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-white pt-2 mt-1 border-t border-zinc-800">
          <span className="font-bold text-sm">Final Plate</span>
          <span className="font-black italic text-xl text-orange-500">₦{finalTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* COMPACT INPUTS */}
      <div className="grid gap-3 mt-2">
        <input name="fullName" placeholder="Full Name" required className="bg-zinc-900 text-sm p-4 rounded-xl border border-zinc-800 outline-none focus:border-orange-500 text-white" />
        <div className="grid grid-cols-2 gap-3">
          <input name="phone" placeholder="WhatsApp No." required className="bg-zinc-900 text-sm p-4 rounded-xl border border-zinc-800 outline-none focus:border-orange-500 text-white" />
          <input name="zone" placeholder="Zone / Stall" required className="bg-zinc-900 text-sm p-4 rounded-xl border border-zinc-800 outline-none focus:border-orange-500 text-white" />
        </div>
        <input name="email" type="email" placeholder="Email (for receipt)" className="bg-zinc-900 text-sm p-4 rounded-xl border border-zinc-800 outline-none focus:border-orange-500 text-white" />
      </div>

      {/* ACTION BUTTON */}
      <button className="bg-orange-600 text-white font-black py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-orange-900/20">
        <Zap className="w-5 h-5 fill-current" />
        PAY ₦{finalTotal.toLocaleString()}
      </button>
    </div>
  );
}
