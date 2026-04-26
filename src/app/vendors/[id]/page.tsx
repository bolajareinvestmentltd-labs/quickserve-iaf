import { db } from "@/db";
import { vendors, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Clock, Zap, Utensils } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import FloatingCart from "@/components/FloatingCart";

export default async function VendorStorefront({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
    with: { products: { where: eq(products.isAvailable, true) } }
  });

  if (!vendor) notFound();

  const meals = vendor.products.filter(p => p.category === 'meals');
  const drinks = vendor.products.filter(p => p.category === 'drinks');

  return (
    <div className="bg-black min-h-screen pb-40">
      <FloatingCart />
      
      {/* 🖼️ HERO / HEADER */}
      <div className="relative h-64 bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        <Link href="/" className="absolute top-6 left-6 z-20 p-3 bg-black/50 backdrop-blur-xl rounded-2xl text-white border border-white/10">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="absolute bottom-6 left-6 z-20">
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{vendor.businessName}</h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-[#D4AF37]">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-black uppercase">4.9 (120+)</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase">15-20 MINS</span>
            </div>
          </div>
        </div>
      </div>

      <main className="p-6 flex flex-col gap-10">
        {/* 🥘 MEALS SECTION */}
        {meals.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Utensils className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] italic">Main Plates</h3>
            </div>
            <div className="grid gap-4">
              {meals.map(product => <ProductCard key={product.id} product={product} vendorName={vendor.businessName} />)}
            </div>
          </section>
        )}

        {/* 🥤 DRINKS SECTION */}
        {drinks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] italic">Cold Drinks</h3>
            </div>
            <div className="grid gap-4">
              {drinks.map(product => <ProductCard key={product.id} product={product} vendorName={vendor.businessName} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
