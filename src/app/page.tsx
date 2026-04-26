import { Store, ShoppingBag, Utensils, Zap, Star, MapPin } from "lucide-react";
import LiveClock from "@/components/LiveClock";

export default function Home() {
  return (
    <div className="p-6 flex flex-col gap-8 bg-black min-h-screen pb-32">
      {/* TOP HEADER */}
      <header className="flex flex-col gap-3 sticky top-0 bg-black/80 backdrop-blur-md py-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter">QUICK<span className="text-orange-500">SERVE</span></h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Ilorin Auto Fest Edition</p>
          </div>
          <LiveClock />
        </div>
        <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold uppercase tracking-wide">
           <MapPin className="w-3.5 h-3.5" />
           <span>Ilorin Bowl, Main Arena Zone</span>
        </div>
      </header>

      {/* MEALS CATS (Unchanged) */}
      <section className="grid grid-cols-4 gap-3">
        {[
          { name: 'Meals', icon: Utensils },
          { name: 'Drinks', icon: Zap },
          { name: 'Stalls', icon: Store },
          { name: 'My Orders', icon: ShoppingBag },
        ].map((cat) => (
          <div key={cat.name} className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
            <div className="w-full aspect-square bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center border border-dashed border-zinc-700/50 group-active:border-orange-500">
              <cat.icon className="w-6 h-6 text-zinc-600 group-active:text-orange-500" />
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase group-active:text-white">{cat.name}</span>
          </div>
        ))}
      </section>

      {/* ACTIVE KITCHENS FEED (New Production Design) */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Active <span className="text-orange-500">Kitchens</span></h3>
          <span className="text-xs font-bold text-zinc-600 uppercase">View All</span>
        </div>

        <div className="grid gap-3">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2.5rem] flex flex-col gap-4 active:scale-95 transition-transform">
             <div className="flex items-center gap-4">
                <img src="https://res.cloudinary.com/din74ljlu/image/upload/v1713915157/Mama_s_Kitchen_logo_ej6vxj.jpg" className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                   <h4 className="text-white font-bold uppercase italic tracking-tight text-lg">Mama's Kitchen</h4>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">Stall 2 • Jollof & Grill Specialists</p>
                </div>
             </div>
             <div className="flex gap-2">
                {['Party Jollof', 'Suya Skewer', 'Plantain'].map(tag => (
                   <span key={tag} className="text-[9px] text-zinc-400 font-bold bg-white/5 px-2 py-1 rounded-full uppercase tracking-widest border border-white/5">{tag}</span>
                ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
