"use client";

import { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

export default function LiveLocation() {
  const [address, setAddress] = useState("Locating...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          // Extract specific parts or full address
          setAddress(data.display_name.split(',')[0] + ", " + data.address.city);
        } catch (e) {
          setAddress("Ilorin Auto Fest");
        }
      });
    }
  }, []);

  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
      <Navigation className="w-3 h-3 text-orange-500 fill-current animate-pulse" />
      <span className="text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[150px]">
        {address}
      </span>
    </div>
  );
}
