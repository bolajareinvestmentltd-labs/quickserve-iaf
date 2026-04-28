"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, Trash2, Loader2, Info } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart() as any;
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", zone: "" });

  // THE FIX: Wait for the phone to take over before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a blank dark screen for a split second to prevent the Hydration Crash
  if (!mounted) return <div className="bg-black min-h-screen" />;

  // 1. EMPTY STATE
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-6">
         <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-black/50">
           <Trash2 className="text-zinc-600 w-8 h-8" />
         </div>
         <h1 className="text-2xl font-black uppercase italic mb-2">Basket is Empty</h1>
         <p className="text-zinc-500 font-medium mb-8 text-center px-6">Looks like you haven't added anything to your order yet.</p>
         <button onClick={() => router.push('/')} className="bg-orange-600 text-white font-black py-4 px-10 rounded-2xl active:scale-95 transition-transform uppercase tracking-widest text-sm shadow-lg shadow-orange-900/20">
           Start Browsing
         </button>
         <BottomNav />
      </div>
    );
  }

  // 2. VENDOR GROUPING LOGIC
  const groupedItems = cart.items.reduce((acc: any, item: any) => {
    const vendor = item.vendorName || "QuickServe Hub";
    if (!acc[vendor]) acc[vendor] = [];
    acc[vendor].push(item);
    return acc;
  }, {});

  const subtotal = cart.items.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);
  const serviceFee = 50;
  const deliveryFee = 200;
  const grandTotal = subtotal + serviceFee + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items,
          totalAmount: grandTotal,
          customerDetails: formData,
        }),
      });
      const data = await res.json();
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        alert("Payment initialization failed.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      {/* HEADER */}
      <header className="px-6 pt-10 pb-4 flex items-center justify-between bg-black sticky top-0 z-40 border-b border-zinc-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="bg-zinc-900 p-2 rounded-full text-zinc-500 hover:text-white transition-colors active:scale-90">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase text-white">
            Review <span className="text-orange-500">Order</span>
          </h1>
        </div>
        {/* CLEAR CART BUTTON */}
        <button onClick={() => cart.clearCart()} className="text-red-500 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-lg active:scale-90 transition-transform border border-red-500/20">
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </header>

      <div className="px-6 mt-6">
        {/* ORDER ITEMS GROUPED BY VENDOR */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-6 shadow-lg shadow-black/50">
          {Object.entries(groupedItems).map(([vendorName, vendorItems]: any) => (
            <div key={vendorName} className="mb-6 last:mb-0">
              <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3 border-b border-zinc-800 pb-2 flex items-center gap-2">
                🏪 {vendorName}
              </h2>
              <div className="flex flex-col gap-3">
                {vendorItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                      <span className="text-zinc-500 text-xs">{item.quantity}x</span> <span className="line-clamp-1">{item.name}</span>
                    </span>
                    <span className="text-sm font-black text-white shrink-0">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8 shadow-lg shadow-black/50">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            Payment Summary <Info className="w-3 h-3" />
          </h3>
          <div className="flex flex-col gap-3 text-sm font-bold text-zinc-400">
            <div className="flex justify-between"><span className="font-medium">Subtotal</span><span className="text-white">₦{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="font-medium">Service Fee</span><span className="text-white">₦{serviceFee}</span></div>
            <div className="flex justify-between"><span className="font-medium">Delivery Fee</span><span className="text-white">₦{deliveryFee}</span></div>
            <div className="border-t border-zinc-800 mt-2 pt-4 flex justify-between items-center">
              <span className="text-base font-black text-white uppercase tracking-widest">Total</span>
              <span className="text-xl font-black italic text-orange-500">₦{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* CHECKOUT FORM & PAY BUTTON */}
        <form onSubmit={handleCheckout} className="flex flex-col gap-3">
          <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-orange-500 transition-colors" />
          <div className="flex gap-3">
            <input required type="tel" placeholder="WhatsApp No." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-orange-500 transition-colors" />
            <input required type="text" placeholder="Zone / Stall" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-orange-500 transition-colors" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black py-4 rounded-2xl mt-4 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 uppercase tracking-widest text-sm">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `PAY NOW - ₦${grandTotal.toLocaleString()}`}
          </button>
        </form>
      </div>
    </div>
  );
}
