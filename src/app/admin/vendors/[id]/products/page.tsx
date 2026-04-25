import { db } from "@/db";
import { products, vendors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, Package, DollarSign, Tag, Image as ImageIcon } from "lucide-react";
import { notFound } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default async function VendorProductsManager({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 🚀 The Fix: Await the params

  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
    with: { products: { orderBy: [desc(products.createdAt)] } },
  });

  if (!vendor) notFound();

  async function addProduct(formData: FormData) {
    "use server";
    const { id: vendorId } = await params; // Must await here too in Server Actions
    
    await db.insert(products).values({
      vendorId: vendorId,
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      promoBadge: formData.get("promoBadge") ? String(formData.get("promoBadge")) : null,
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      isAvailable: true,
    });

    revalidatePath(`/admin/vendors/${vendorId}/products`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 pb-24">
      <div className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md p-4 flex items-center border-b border-neutral-800">
        <Link href="/admin/vendors" className="p-2 bg-neutral-900 rounded-full text-white active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="ml-4">
          <span className="font-bold text-white block leading-tight">{vendor.businessName}</span>
          <span className="text-xs text-zinc-400">Menu Manager</span>
        </div>
      </div>
      <div className="p-5">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
          <h2 className="text-lg font-black text-white mb-4">Add New Item</h2>
          <form action={addProduct} className="flex flex-col gap-4">
            <input required name="name" type="text" placeholder="Item Name" className="bg-neutral-800 p-4 rounded-2xl outline-none text-white" />
            <input required name="price" type="number" placeholder="Price" className="bg-neutral-800 p-4 rounded-2xl outline-none text-white" />
            <input name="promoBadge" type="text" placeholder="Promo Badge (Optional)" className="bg-neutral-800 p-4 rounded-2xl outline-none text-white" />
            <ImageUpload />
            <button type="submit" className="w-full bg-orange-600 text-white p-4 rounded-2xl font-bold active:scale-95 transition-transform">Save Item</button>
          </form>
        </div>
      </div>
    </div>
  );
}
