"use client";
import { useState } from "react";
import { ShieldCheck, Upload, Landmark, UserCheck, ChevronRight, Loader2 } from "lucide-react";

export default function KYCCenter() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: "Identity", sub: "Government Issued ID", icon: UserCheck },
    { id: 2, title: "Settlement", sub: "Bank Account Details", icon: Landmark },
    { id: 3, title: "Review", sub: "Awaiting Verification", icon: ShieldCheck },
  ];

  return (
    <div className="p-6 bg-black min-h-screen text-white flex flex-col">
      <header className="mb-10 pt-10">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Identity <span className="text-[#D4AF37]">Vault</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Compliance & Security Center</p>
      </header>

      {/* STEP INDICATOR */}
      <div className="flex gap-2 mb-10">
        {steps.map((s) => (
          <div key={s.id} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-[#D4AF37]' : 'bg-zinc-800'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 border border-white/5">
              <Upload className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h2 className="text-xl font-bold uppercase italic tracking-tight mb-2">Upload ID Card</h2>
            <p className="text-zinc-500 text-xs leading-relaxed mb-8">Please provide a clear photo of your NIN slip, Voter's card, or Driver's License.</p>
            <button className="w-full bg-zinc-800 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-[0.2em]">Select Document</button>
          </div>
          <button onClick={() => setStep(2)} className="w-full bg-[#D4AF37] text-black font-black py-5 rounded-[2rem] uppercase tracking-widest flex items-center justify-center gap-2">Next Step <ChevronRight className="w-4 h-4" /></button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
          <input placeholder="Bank Name" className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-[#D4AF37]" />
          <input placeholder="Account Number" className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-[#D4AF37]" />
          <input placeholder="Account Holder Name" className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-[#D4AF37]" />
          <button onClick={() => setStep(3)} className="w-full bg-[#D4AF37] text-black font-black py-5 rounded-[2rem] mt-6 uppercase tracking-widest">Submit for Review</button>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-[3rem] flex items-center justify-center mb-8 border border-[#D4AF37]/20">
            <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Verification <br /> <span className="text-[#D4AF37]">In Progress</span></h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-[240px]">Our compliance team is reviewing your documents. This usually takes 2-4 hours.</p>
        </div>
      )}
    </div>
  );
}
