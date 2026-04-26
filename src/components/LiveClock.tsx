"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    // Immediate set
    setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    
    // Set interval for every second
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
      <Clock className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
      <span className="text-sm font-bold text-white font-mono tracking-tighter">{time}</span>
    </div>
  );
}
