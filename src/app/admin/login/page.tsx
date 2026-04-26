"use client";
import { useState } from "react";
import { ShieldAlert, Lock, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions/admin-auth";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleForm(formData: FormData) {
    setLoading(true);
    const res = await loginAdmin(formData);
    
    if (res.success) {
      router.push("/admin");
    } else {
      alert(res.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm">
        <header className="text-center mb-12">
          <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/20">
            <ShieldAlert className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Admin <span className="text-[#D4AF37]">Login</span></h1>
        </header>

        <form action={handleForm} className="flex flex-col gap-4">
          <div className="relative group">
            <User className="absolute left-4 top-4 w-5 h-5 text-zinc-600 group-focus-within:text-[#D4AF37]" />
            <input name="username" required placeholder="Username" className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-[#D4AF37] transition-all" />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-zinc-600 group-focus-within:text-[#D4AF37]" />
            <input name="password" type="password" required placeholder="Password" className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-[#D4AF37] transition-all" />
          </div>
          <button disabled={loading} className="w-full bg-[#D4AF37] text-black font-black py-5 rounded-[2rem] mt-4 uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
          </button>
        </form>
      </div>
    </div>
  );
}
