"use client";
import { useState, useEffect } from "react";
import { MapPin, Clock3 } from "lucide-react";

export default function DynamicHeader() {
  const [location, setLocation] = useState<string>("Locating...");
  const [time, setTime] = useState("");

  useEffect(() => {
    // 1. DYNAMIC GEOLOCATION
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
        },
        () => {
          setLocation("QuickServe Hub"); // Fallback if denied
        }
      );
    } else {
      setLocation("Location Unsupported");
    }

    // 2. TICKING CLOCK
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId); // Cleanup on unmount
  }, []);

  return (
    <header className="px-6 pt-10 pb-4 flex justify-between items-center bg-black sticky top-0 z-40 border-b border-zinc-900">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-black italic tracking-tighter uppercase text-white">
          Quick<span className="text-orange-500">Serve</span>
        </h1>
        <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs font-bold text-zinc-300 truncate max-w-[120px]">{location}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2.5 rounded-2xl border border-zinc-800 text-sm font-bold text-zinc-400">
        <Clock3 className="w-4 h-4 text-green-500" />
        {time}
      </div>
    </header>
  );
}
