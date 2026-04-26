"use client";
import { useTransition } from "react";
import { Power, Radio } from "lucide-react";

export default function AvailabilitySwitch({ 
  id, 
  status, 
  onToggle 
}: { 
  id: string, 
  status: boolean, 
  onToggle: (id: string, status: boolean) => Promise<void> 
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      disabled={isPending}
      onClick={() => startTransition(() => onToggle(id, status))}
      className={`w-full p-6 rounded-[2.5rem] flex items-center justify-between transition-all border-2 ${
        status 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-zinc-900 border-zinc-800'
      } ${isPending ? 'opacity-50 grayscale' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
          status ? 'bg-green-500' : 'bg-zinc-800'
        }`}>
          <Power className={`w-6 h-6 ${status ? 'text-white' : 'text-zinc-500'}`} />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">System Status</p>
          <h3 className={`text-xl font-black italic uppercase leading-none ${
            status ? 'text-white' : 'text-zinc-700'
          }`}>
            {status ? 'Accepting Orders' : 'Offline / On Break'}
          </h3>
        </div>
      </div>
      
      {status && (
        <div className="flex items-center gap-2 pr-2">
          <span className="text-[8px] font-black text-green-500 uppercase animate-pulse">Live</span>
          <Radio className="w-4 h-4 text-green-500" />
        </div>
      )}
    </button>
  );
}
