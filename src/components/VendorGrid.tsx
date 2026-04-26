import Link from "next/link";
import { Store } from "lucide-react";

export default function VendorGrid({ vendors }: { vendors: any[] }) {
  if (vendors.length === 0) {
    return <p className="text-zinc-500 text-xs font-bold uppercase text-center mt-6">No kitchens live yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {vendors.map((v) => (
        <Link 
          href={`/vendors/${v.id}`} 
          key={v.id} 
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center text-center transition-transform active:scale-95"
        >
          <div className="w-14 h-14 bg-black rounded-full mb-3 flex items-center justify-center border border-zinc-700 overflow-hidden">
            {v.logoUrl ? (
              <img src={v.logoUrl} alt={v.businessName} className="w-full h-full object-cover" />
            ) : (
              <Store className="w-6 h-6 text-zinc-500" />
            )}
          </div>
          <h3 className="text-white font-black italic uppercase text-sm leading-tight line-clamp-1">{v.businessName}</h3>
          <p className="text-zinc-500 text-[9px] font-bold mt-1 uppercase tracking-widest">{v.cuisineType}</p>
        </Link>
      ))}
    </div>
  );
}
