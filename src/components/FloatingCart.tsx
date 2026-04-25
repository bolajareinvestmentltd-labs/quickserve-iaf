"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { X, Minus, Plus, ArrowRight, CheckCircle2, Loader2, MapPin, User, Phone } from "lucide-react";

export default function FloatingCart() {
  const pathname = usePathname();
  const { items, addItem, removeItem, clearCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", zone: "" });
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch and check route
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔒 THE FIX: Hide entirely if the user is in the admin area
  if (!mounted || pathname?.startsWith('/admin')) return null;
  if (items.length === 0 && !isOpen) return null;

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerZone: formData.zone,
          totalAmount: totalPrice,
          items: items,
        }),
      });

      if (response.ok) {
        setStep("success");
        clearCart();
        setTimeout(() => {
          setIsOpen(false);
          setStep("cart");
        }, 3000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Network error. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && items.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-40">
          <button onClick={() => setIsOpen(true)} className="w-full bg-orange-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-between active:scale-95 transition-transform">
            <div className="flex items-center gap-3">
              <div className="bg-orange-800/50 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{totalItems}</div>
              <span className="font-bold">View order</span>
            </div>
            <span className="font-bold">₦{totalPrice.toLocaleString()}</span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => !isLoading && setIsOpen(false)} />
          <div className="relative w-full max-w-md bg-neutral-900 rounded-t-3xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-10 bg-neutral-900">
              <h2 className="text-xl font-black text-white">{step === "cart" ? "Your Order" : step === "checkout" ? "Details" : "Success"}</h2>
              <button onClick={() => !isLoading && setIsOpen(false)} className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 active:scale-95"><X className="w-5 h-5" /></button>
            </div>

            {step === "cart" && (
              <>
                <div className="overflow-y-auto p-5 flex-1 flex flex-col gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold truncate">{item.name}</h3>
                        <p className="text-orange-500 font-semibold mt-1">₦{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-neutral-800 p-1.5 rounded-full">
                        <button onClick={() => removeItem(item.id)} className="w-7 h-7 bg-neutral-700 rounded-full flex items-center justify-center text-white"><Minus className="w-4 h-4" /></button>
                        <span className="text-white font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => addItem(item as any)} className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-5 bg-neutral-900 border-t border-neutral-800 sticky bottom-0">
                  <div className="flex justify-between text-neutral-400 mb-4 text-sm font-medium">
                    <span>Total Amount</span>
                    <span className="text-white font-bold text-lg">₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <button onClick={() => setStep("checkout")} className="w-full bg-orange-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    Proceed to Details <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {step === "checkout" && (
              <form onSubmit={handleCheckoutSubmit} className="flex flex-col flex-1 overflow-y-auto">
                <div className="p-5 flex flex-col gap-4">
                  <div className="bg-neutral-800 rounded-2xl p-4 flex items-center gap-3">
                    <User className="text-neutral-400 w-5 h-5 shrink-0" />
                    <input required type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
                  </div>
                  <div className="bg-neutral-800 rounded-2xl p-4 flex items-center gap-3">
                    <Phone className="text-neutral-400 w-5 h-5 shrink-0" />
                    <input required type="tel" placeholder="WhatsApp / Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
                  </div>
                  <div className="bg-neutral-800 rounded-2xl p-4 flex items-center gap-3">
                    <MapPin className="text-neutral-400 w-5 h-5 shrink-0" />
                    <input required type="text" placeholder="Where are you? (e.g. VIP Tent)" value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})} className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
                  </div>
                </div>
                <div className="mt-auto p-5 bg-neutral-900 border-t border-neutral-800">
                  <button disabled={isLoading} type="submit" className="w-full bg-orange-600 disabled:bg-orange-800 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ₦${totalPrice.toLocaleString()}`}
                  </button>
                </div>
              </form>
            )}

            {step === "success" && (
              <div className="p-10 flex flex-col items-center justify-center text-center flex-1">
                <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
                <h3 className="text-2xl font-black text-white">Order Sent!</h3>
                <p className="text-neutral-400 mt-2">The vendor has received your order. We'll bring it right over.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
