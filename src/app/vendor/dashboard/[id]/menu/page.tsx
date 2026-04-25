import { db } from "@/db";
import { products, vendors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Camera, Package, DollarSign } from "lucide-react";
import { notFound } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default async function VendorMenuManager({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
    with: { products: { orderBy: [desc(products.createdAt)] } },
  });

  if (!vendor) notFound();

  async function addProduct(formData: FormData) {
    "use server";
    const { id: vId } = await params;
    
    await db.insert(products).values({
      vendorId: vId,
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      imageUrl: formData.get("imageUrl") ? String(formData.get("imageUrl")) : null,
      promoBadge: formData.get("promoBadge") ? String(formData.get("promoBadge")) : null,
      isAvailable: true,
    });

    revalidatePath(`/vendor/dashboard/${vId}/menu`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-black pb-32">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md p-5 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/vendor/dashboard/${id}`} className="p-2 bg-zinc-900 rounded-full text-zinc-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-white font-black uppercase italic tracking-tighter leading-none">Menu Manager</h1>
            <p className="text-[10px] text-orange-500 font-bold uppercase">{vendor.businessName}</p>
          </div>
        </div>
        <Package className="w-6 h-6 text-zinc-700" />
      </header>

      <div className="p-5 flex flex-col gap-8">
        <section className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2.5rem]">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-500" /> Add New Dish
          </h2>
          <form action={addProduct} className="flex flex-col gap-4">
            <input required name="name" type="text" placeholder="Item Name (e.g. Suya Burger)" className="bg-black border border-zinc-800 p-4 rounded-2xl outline-none text-white text-sm focus:border-orange-500 transition-colors" />
            <div className="relative">
              <span className="absolute left-4 top-4 text-zinc-500 font-bold">₦</span>
              <input required name="price" type="number" placeholder="Price" className="w-full bg-black border border-zinc-800 p-4 pl-8 rounded-2xl outline-none text-white text-sm focus:border-orange-500 transition-colors" />
            </div>
            <input name="promoBadge" type="text" placeholder="Promo Tag (e.g. Spicy, Hot)" className="bg-black border border-zinc-800 p-4 rounded-2xl outline-none text-white text-sm focus:border-orange-500 transition-colors" />
            
            <ImageUpload />

            <button type="submit" className="w-full bg-white text-black p-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-transform">
              Upload to Menu
            </button>
          </form>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Live Menu ({vendor.products.length})</h3>
          <div className="grid gap-3">
            {vendor.products.map((item) => (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex items-center gap-4">
                <div className="w-16 h-16 bg-black rounded-2xl border border-zinc-800 overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Camera className="w-5 h-5 text-zinc-800" /></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm uppercase tracking-tight">{item.name}</h4>
                  <p className="text-orange-500 font-black text-xs mt-1">₦{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
