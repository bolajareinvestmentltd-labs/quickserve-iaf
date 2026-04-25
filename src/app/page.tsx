import Link from "next/link";
import { MapPin, Bell, ChevronDown, UtensilsCrossed, Car, Shirt, Wrench, GlassWater, HeartPulse } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categories = [
    { name: "Food & Grills", icon: UtensilsCrossed, color: "bg-orange-500/10 text-orange-500", href: "/vendors" },
    { name: "IAF Carpool", icon: Car, color: "bg-blue-500/10 text-blue-500", href: "/rides" },
    { name: "Official Merch", icon: Shirt, color: "bg-purple-500/10 text-purple-500", href: "#" },
    { name: "Auto Parts", icon: Wrench, color: "bg-zinc-800 text-zinc-400", href: "#" },
    { name: "Pit Stop", icon: GlassWater, color: "bg-cyan-500/10 text-cyan-500", href: "#" },
    { name: "First Aid", icon: HeartPulse, color: "bg-red-500/10 text-red-500", href: "#" },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. TOP HEADER (Location & Profile) */}
      <header className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500/20 p-2 rounded-xl">
            <MapPin className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Your Location</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </div>
            <p className="text-white font-bold text-sm">Ilorin Auto Fest, Main Bowl</p>
          </div>
        </div>
        <button className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-zinc-400" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-black"></div>
        </button>
      </header>

      {/* 2. THE MULTICOLORED LOGO SECTION */}
      <section className="px-5 py-2">
        <h1 className="text-4xl font-black tracking-tighter">
          <span className="text-white">Quick</span>
          <span className="text-orange-500">Serve</span>
        </h1>
      </section>

      {/* 3. PROMO BANNER (Special Offer) */}
      <section className="px-5 mt-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-orange-400 p-6 rounded-[2.5rem] shadow-xl shadow-orange-900/20">
          <div className="relative z-10 w-2/3">
            <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">% IAF Special Offer</span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight">Fastest Bites at the Pit Stop</h2>
            <p className="text-orange-500 mt-2 text-xs font-bold px-3 py-2 bg-white rounded-full w-fit">
              Claim 10% Discount →
            </p>
          </div>
          {/* Abstract Circle Art */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute top-4 right-8 opacity-20">
            <UtensilsCrossed className="w-24 h-24 text-white -rotate-12" />
          </div>
        </div>
      </section>

      {/* 4. SERVICE GRID (Chowdeck Style) */}
      <section className="px-5 mt-8">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-black text-white">Festival Services</h3>
          <Link href="/vendors" className="text-orange-500 text-xs font-bold uppercase tracking-wider">View All</Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={cat.href}
              className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
            >
              <div className={`w-full aspect-square rounded-[2rem] flex items-center justify-center ${cat.color} border border-white/5`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. QUICK ACCESS (Horizontal Scroll or Bottom Banner) */}
      <section className="px-5 mt-10">
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-black uppercase">Need a tech expert?</p>
            <p className="text-white font-bold text-sm">Visit the Tech Hub</p>
          </div>
          <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
            <ChevronDown className="w-5 h-5 text-zinc-500 -rotate-90" />
          </div>
        </div>
      </section>
    </div>
  );
}
