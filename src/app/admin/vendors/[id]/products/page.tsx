import { db } from "@/db";
import { products, vendors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, Package, DollarSign, Tag, Image as ImageIcon } from "lucide-react";
import { notFound } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default async function VendorProductsManager({ params }: { params: { id: string } }) {
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, params.id),
    with: {
      products: {
        orderBy: [desc(products.createdAt)],
      },
    },
  });

  if (!vendor) notFound();

  async function addProduct(formData: FormData) {
    "use server";
    
    await db.insert(products).values({
      vendorId: params.id,
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      promoBadge: formData.get("promoBadge") ? String(formData.get("promoBadge")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      isAvailable: true,
    });

    revalidatePath(`/admin/vendors/${params.id}/products`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 pb-24">
      <div className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md p-4 flex items-center border-b border-neutral-800">
        <Link href="/admin/vendors" className="p-2 bg-neutral-900 rounded-full text-white active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="ml-4">
          <span className="font-bold text-white block leading-tight">{vendor.businessName}</span>
          <span className="text-xs text-neutral-400">Menu Manager</span>
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
          Live Menu ({vendor.products.length})
        </h2>

        {vendor.products.length === 0 ? (
          <div className="text-center p-8 bg-neutral-900 border border-neutral-800 border-dashed rounded-2xl mb-8">
            <Package className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-neutral-400 text-sm">No items yet. Add one below!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-8">
            {vendor.products.map((product) => (
              <div key={product.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex gap-4 relative overflow-hidden">
                {product.promoBadge && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl z-10">
                    {product.promoBadge.toUpperCase()}
                  </div>
                )}
                
                <div className="w-16 h-16 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-neutral-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate pr-8">{product.name}</h3>
                  <p className="text-orange-500 font-bold mt-1">₦{product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
          <h2 className="text-lg font-black text-white mb-4">Add New Item</h2>
          
          <form action={addProduct} className="flex flex-col gap-4">
            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center gap-3">
              <Package className="text-neutral-400 w-5 h-5 shrink-0" />
              <input required name="name" type="text" placeholder="Item Name (e.g. Jollof Rice)" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center gap-3">
              <DollarSign className="text-neutral-400 w-5 h-5 shrink-0" />
              <input required name="price" type="number" placeholder="Price (e.g. 2500)" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4 flex items-center gap-3">
              <Tag className="text-orange-500 w-5 h-5 shrink-0" />
              <input name="promoBadge" type="text" placeholder="Promo Badge (Optional - e.g. 10% OFF)" className="bg-transparent outline-none text-white w-full placeholder:text-neutral-500" />
            </div>

            {/* 🚀 THE NATIVE IMAGE UPLOAD WIDGET */}
            <ImageUpload />

            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white p-4 rounded-2xl font-bold mt-2 active:scale-95 transition-transform shadow-lg">
              Save Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
