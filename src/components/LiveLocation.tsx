"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export default function LiveLocation() {
  const [address, setAddress] = useState("Locating...");
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          // Extract a clean, readable portion of the address
          const area = data.address.suburb || data.address.neighbourhood || data.address.road || "Unknown Area";
          const city = data.address.city || data.address.town || data.address.state || "";
          setAddress(`${area}, ${city}`);
        } catch (e) {
          setAddress("GPS Active - Tap for Map");
        }
      }, () => {
        setAddress("Location Access Denied");
      });
    } else {
      setAddress("Geolocation not supported");
    }
  }, []);

  const mapLink = coords ? `https://maps.google.com/?q=${coords.lat},${coords.lon}` : "#";

  return (
    <a href={mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 text-[11px] font-bold uppercase tracking-wide active:scale-95 transition-transform bg-white/5 px-3 py-1.5 rounded-full w-fit">
      <MapPin className="w-3.5 h-3.5 text-orange-500" />
      <span className="truncate max-w-[220px]">{address}</span>
    </a>
  );
}
