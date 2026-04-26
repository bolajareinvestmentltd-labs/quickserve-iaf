import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, Star, Clock } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default async function VendorStorefront({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
    with: { products: true }
  });

  if (!vendor) return <div className="p-6 text-white text-center mt-20">Kitchen not found</div>;

  // Extract unique categories from the vendor's products
  const categories = [...new Set(vendor.products.map(p => p.category))];

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      {/* HEADER SECTION */}
      <div className="p-6 pt-10 bg-gradient-to-b from-zinc-900 to-black">
        <Link href="/" className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center rounded-full mb-6">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">
          {vendor.businessName}
        </h1>
        <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
          <span className="flex items-center gap-1 text-[#D4AF37]"><Star className="w-4 h-4 fill-current" /> 4.9 (120+)</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10-15 MINS</span>
        </div>
      </div>

      {/* MENU SECTION */}
      <div className="p-6">
        {categories.length === 0 ? (
          <div className="text-center mt-10 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            Menu is currently being updated...
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat as string} className="mb-10">
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4 text-zinc-500">
                {cat}
              </h3>
              <div className="grid gap-4">
                {vendor.products
                  .filter(p => p.category === cat)
                  .map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
