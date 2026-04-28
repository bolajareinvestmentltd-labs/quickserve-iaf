"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginRunner } from "@/app/actions/runner";
import { Package, Loader2 } from "lucide-react";

export default function RunnerLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await loginRunner(username, password);
    
    if (res.success) {
      // Securely store the rider's ID on their specific device
      localStorage.setItem("quickserve_runner_id", res.runnerId!);
      router.push("/runner/dashboard");
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
        <Package className="w-10 h-10 text-orange-500" />
      </div>
      <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Runner Portal</h1>
      <p className="text-zinc-500 font-bold text-sm mb-10 text-center">Log in with credentials provided by HQ.</p>

      <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
        <input required type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-sm font-bold text-white focus:border-orange-500 outline-none" />
        <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-sm font-bold text-white focus:border-orange-500 outline-none" />
        
        <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl mt-4 active:scale-95 transition-transform flex justify-center uppercase tracking-widest text-sm shadow-lg shadow-orange-900/20">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
        </button>
      </form>
    </div>
  );
}
