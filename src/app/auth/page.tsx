"use client";
import { useState } from "react";
import { sendOtp, verifyOtp } from "@/app/actions/auth";
import { Mail, ShieldCheck, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendOtp(email);
    setStep("otp");
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await verifyOtp(email, otp);
    if (res.success) {
      localStorage.setItem("qs_user_id", res.userId as string);
      router.push("/");
    } else {
      alert(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-sm">
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
            <ShieldCheck className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            {step === "email" ? "Join the" : "Verify"} <span className="text-orange-500">Club</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            {step === "email" ? "Unlock 5% Cashback on every plate" : `Sent to ${email}`}
          </p>
        </header>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
              <input 
                required 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 text-white transition-all" 
              />
            </div>
            <button disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : <>Send Code <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <input 
              required 
              type="text" 
              maxLength={6}
              placeholder="0 0 0 0 0 0" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-orange-500 text-center text-3xl font-black tracking-[0.5em] text-white" 
            />
            <button disabled={loading} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
            </button>
            <button type="button" onClick={() => setStep("email")} className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-2 flex items-center justify-center gap-2">
              <RefreshCw className="w-3 h-3" /> Change Email
            </button>
          </form>
        )}

        <div className="mt-12 text-center">
          <button onClick={() => router.push("/")} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest underline decoration-zinc-800 underline-offset-4">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
