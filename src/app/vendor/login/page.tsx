"use client";
import { useState } from "react";
import { Store, User, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VendorLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    // For the MVP test, we'll verify this via a dedicated server action later
    // but right now, let's just use the URL redirect logic
    const formData = new FormData(e.currentTarget);
    const user = formData.get("username");
    
    // Mocking the flow: In production, we find the vendor ID by username
    // For now, redirecting to a generic dashboard
    router.push(`/vendor/dashboard`);
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm">
        <header className="text-center mb-10">
          <div className="w-20 h-20 bg-orange-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-orange-600/20">
            <Store className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Kitchen <span className="text-orange-600">Portal</span></h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Vendor Dashboard Login</p>
        </header>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input name="username" placeholder="Username" required className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-orange-500" />
          <input name="password" type="password" placeholder="Password" required className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-orange-500" />
          <button disabled={loading} className="w-full bg-orange-600 text-white font-black py-5 rounded-[2rem] mt-4 uppercase tracking-widest shadow-xl shadow-orange-900/40">
            {loading ? <Loader2 className="animate-spin" /> : "Open Kitchen"}
          </button>
        </form>
      </div>
    </div>
  );
}
