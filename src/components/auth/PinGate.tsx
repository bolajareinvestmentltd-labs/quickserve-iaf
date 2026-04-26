"use client";
import { useState } from "react";
import { Lock, Delete, ChevronRight } from "lucide-react";

export default function PinGate({ onVerified, title, sub }: { onVerified: (pin: string) => void, title: string, sub: string }) {
  const [pin, setPin] = useState("");

  const handlePress = (num: string) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const handleClear = () => setPin(prev => prev.slice(0, -1));

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
          <Lock className="w-6 h-6 text-[#D4AF37]" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{title}</h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">{sub}</p>
      </div>

      {/* PIN DOTS */}
      <div className="flex gap-4 mb-16">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
            pin.length > i ? 'bg-[#D4AF37] border-[#D4AF37] scale-125 shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'border-zinc-800'
          }`} />
        ))}
      </div>

      {/* NUMPAD */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0"].map((btn, i) => (
          btn === "" ? <div key={i} /> : (
            <button key={i} onClick={() => handlePress(btn)} className="h-20 bg-zinc-900/50 border border-zinc-800 text-2xl font-black text-white rounded-3xl active:bg-[#D4AF37] active:text-black transition-all">
              {btn}
            </button>
          )
        ))}
        <button onClick={handleClear} className="h-20 flex items-center justify-center text-zinc-500 active:text-white">
          <Delete />
        </button>
      </div>

      {pin.length === 4 && (
        <button onClick={() => onVerified(pin)} className="mt-12 flex items-center gap-2 text-[#D4AF37] font-black uppercase tracking-widest animate-bounce">
          Enter System <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
