"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 w-fit">
      <Clock className="w-3.5 h-3.5 text-white animate-pulse" />
      <span className="text-[10px] font-black text-white font-mono tabular-nums">
        {time || "LOADING..."}
      </span>
    </div>
  );
}