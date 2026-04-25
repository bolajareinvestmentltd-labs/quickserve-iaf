import Link from "next/link";
import { 
  MapPin, Bell, UtensilsCrossed, Car, Shirt, 
  Wrench, GlassWater, HeartPulse, ChevronRight 
} from "lucide-react";
import LiveClock from "@/components/LiveClock";

export default function Home() {
  const categories = [
    { name: "Food", icon: UtensilsCrossed, color: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/20", text: "text-orange-500", href: "/vendors" },
    { name: "Rides", icon: Car, color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20", text: "text-blue-400", href: "/rides" },
    { name: "Merch", icon: Shirt, color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20", text: "text-purple-400", href: "#" },
    { name: "Parts", icon: Wrench, color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", href: "#" },
    { name: "Drinks", icon: GlassWater, color: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400", href: "#" },
    { name: "Safety", icon: HeartPulse, color: "from-red-500/20 to-red-500/5", border: "border-red-500/20", text: "text-red-400", href: "#" },
  ];

  return (
    <div className="flex flex-col gap-8 pt-6">
      {/* 📍 HEADER (Admin gear removed) */}
      <header className="px-5 flex justify-between items-center">
        <div className="bg-zinc-900/50 border border-zinc-800 py-2 px-4 rounded-full flex items-center gap-3 backdrop-blur-md">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-500 uppercase leading-none">Live At</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              Ilorin Auto Fest <ChevronRight className="w-3 h-3 text-orange-500" />
            </span>
          </div>
        </div>
        
        <button className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-zinc-400" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-orange-600 rounded-full border-4 border-black" />
        </button>
      </header>

      {/* 🏎️ BRAND TITLE */}
      <section className="px-6">
        <h1 className="text-5xl font-black italic tracking-tighter leading-none">
          QUICK<span className="text-orange-500">SERVE</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-2 font-medium tracking-tight">Ilorin Automotive Festival 2026</p>
      </section>

      {/* 🧧 THE 5-MINUTE HERO CARD */}
      <section className="px-5">
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-8 rounded-[2.5rem] relative overflow-hidden shadow-[0_20px_50px_rgba(234,88,12,0.3)]">
          <div className="relative z-10">
            <LiveClock />
            
            <h2 className="text-3xl font-black text-white mt-4 leading-tight uppercase">
              Food & <br/>Drinks
            </h2>
            <p className="text-white/90 text-sm mt-3 font-bold max-w-[220px] leading-snug">
              Don't move a muscle. We'll deliver to your spot in <span className="text-black bg-white px-1.5 rounded">5 MINUTES</span> or less.
            </p>
            
            <Link href="/vendors" className="inline-block bg-white text-orange-600 text-[10px] font-black px-6 py-3 rounded-2xl mt-6 uppercase shadow-xl active:scale-95 transition-transform">
              Order Now
            </Link>
          </div>
          
          {/* Decorative Icon */}
          <UtensilsCrossed className="absolute -right-6 -bottom-6 w-44 h-44 text-black/10 -rotate-12" />
        </div>
      </section>

      {/* 📦 SERVICE GRID */}
      <section className="px-5 pb-10">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-black text-white">Services</h3>
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Explore All</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} className="flex flex-col items-center gap-3 group">
              <div className={`w-full aspect-square rounded-[2.2rem] flex items-center justify-center bg-gradient-to-b ${cat.color} border ${cat.border} shadow-lg transition-all duration-300 group-active:scale-90`}>
                <cat.icon className={`w-8 h-8 ${cat.text}`} />
              </div>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter group-hover:text-white transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}