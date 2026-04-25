import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft, Store, MapPin } from "lucide-react";
import Link from "next/link";
import AddToCartBtn from "@/components/AddToCartBtn";

export const dynamic = 'force-dynamic';

export default async function VendorPage({ params }: { params: { id: string } }) {
  // Fetch vendor and their available products in one clean query
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, params.id),
    with: {
      products: {
        where: (products, { eq }) => eq(products.isAvailable, true),
      },
    },
  });

  if (!vendor) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-neutral-950">
      {/* 1. Sticky Header / Nav */}
      <div className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md p-4 flex items-center border-b border-neutral-800">
        <Link href="/" className="p-2 bg-neutral-900 rounded-full text-white active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="ml-4 font-bold text-white truncate">{vendor.businessName}</span>
      </div>

      {/* 2. Chowdeck-style Hero Section */}
      <div className="bg-neutral-900 px-5 pt-6 pb-8 border-b border-neutral-800 rounded-b-3xl">
        <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4">
          <Store className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-3xl font-black text-white">{vendor.businessName}</h1>
        <div className="flex items-center text-neutral-400 mt-2 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>Ilorin Automotive Festival</span>
        </div>
      </div>

      {/* 3. Product Menu List */}
      <main className="px-5 mt-6 flex-1">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
          Menu ({vendor.products.length})
        </h2>

        {vendor.products.length === 0 ? (
          <div className="text-center p-8 bg-neutral-900 border border-neutral-800 border-dashed rounded-2xl">
            <p className="text-neutral-400 text-sm">This vendor is updating their menu. Check back shortly!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {vendor.products.map((product) => (
              <div 
                key={product.id} 
                className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex gap-4 items-center"
              >
                {/* Image Placeholder - Ready for Cloudinary */}
                <div className="w-20 h-20 bg-neutral-800 rounded-xl flex-shrink-0 overflow-hidden relative">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg truncate">{product.name}</h3>
                  <p className="font-semibold text-orange-500 mt-1">
                    ₦{(product.price).toLocaleString()}
                  </p>
                </div>

                {/* Client Component Button */}
                <div className="flex-shrink-0">
                  <AddToCartBtn 
                    product={{ id: product.id, name: product.name, price: product.price }} 
                    vendorId={vendor.id} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
