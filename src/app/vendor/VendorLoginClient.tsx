"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Store, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";

export default function VendorLoginClient({ vendors }: { vendors: any[] }) {
  const [selectedVendor, setSelectedVendor] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor || passcode.length < 4) {
      toast.error("Select your store and enter a 4-digit PIN");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/vendor/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId: selectedVendor, passcode })
    });

    if (res.ok) {
      toast.success("Access Granted. Welcome to the Kitchen.");
      router.push("/vendor/dashboard");
    } else {
      toast.error("Incorrect PIN. Nice try!");
      setPasscode("");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black opacity-60"></div>
      
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-600/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Vendor <span className="text-orange-500">HQ</span></h1>
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
            <Store className="w-6 h-6 text-zinc-500" />
            <select 
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full bg-transparent text-white font-black outline-none appearance-none"
            >
              <option value="" disabled className="bg-zinc-900 text-zinc-500">Select your storefront...</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id} className="bg-zinc-900">{v.businessName}</option>
              ))}
            </select>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 focus-within:border-orange-500 transition-colors">
            <Lock className="w-6 h-6 text-zinc-500" />
            <input 
              type="password" 
              inputMode="numeric"
              maxLength={4}
              placeholder="4-Digit PIN"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-transparent text-white font-black text-xl tracking-[0.5em] outline-none placeholder:tracking-normal placeholder:text-zinc-600 placeholder:text-base"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-orange-900/20 uppercase tracking-widest mt-8"
          >
            {loading ? "Authenticating..." : "Unlock Dashboard"} <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
