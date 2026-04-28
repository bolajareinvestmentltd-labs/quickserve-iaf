"use client";
import { useState } from "react";
import { createProduct } from "@/app/actions/vendor";
import { UploadCloud, Loader2, Store, Plus, Package, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VendorDashboardClient({ vendor, products }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "Meals",
    description: "",
    imageUrl: ""
  });

  const categories = ["Meals", "Drinks", "Snacks", "Bakery", "Specials"];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setProductData({ ...productData, imageUrl: data.secure_url });
    } catch (error) {
      alert("Image upload failed. Check your Vercel keys.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createProduct({ ...productData, vendorId: vendor.id });
    if (res.success) {
      alert("Offering added successfully!");
      setProductData({ name: "", price: "", category: "Meals", description: "", imageUrl: "" });
      router.refresh();
    } else {
      alert("Failed to add offering.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      {/* HEADER */}
      <header className="px-6 py-6 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
             <Store className="w-5 h-5 text-orange-500" /> {vendor.businessName}
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">Vendor Portal</p>
        </div>
        <button onClick={() => router.push('/')} className="p-2 bg-red-950/30 text-red-500 rounded-full active:scale-90 transition-transform">
           <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className="px-6 mt-6 flex flex-col gap-8">
        
        {/* ADD NEW OFFERING FORM */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl shadow-black">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-500" /> Add New Offering
          </h2>

          <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-zinc-700 rounded-2xl h-40 flex flex-col items-center justify-center text-center relative overflow-hidden bg-zinc-950">
               {productData.imageUrl ? (
                 <img src={productData.imageUrl} alt="Product" className="absolute inset-0 w-full h-full object-cover opacity-80" />
               ) : (
                 <UploadCloud className="w-8 h-8 text-zinc-600 mb-2" />
               )}
               <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest relative z-10 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm mt-2">
                 {uploadingImage ? "Uploading..." : productData.imageUrl ? "Image Ready" : "Upload Food Photo"}
               </span>
               <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={uploadingImage} />
            </div>

            {/* Core Details */}
            <input required type="text" placeholder="Item Name (e.g. Chicken Pie)" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
            
            <div className="flex gap-3">
              <input required type="number" placeholder="Price (₦)" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
              <select value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 focus:border-orange-500 outline-none">
                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <textarea placeholder="Short description..." value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500 resize-none h-20" />

            <button type="submit" disabled={loading || uploadingImage} className="w-full bg-orange-600 disabled:bg-zinc-800 text-white font-black py-4 rounded-xl mt-2 active:scale-95 transition-transform flex justify-center uppercase tracking-widest text-sm shadow-lg shadow-orange-900/20">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish to Storefront"}
            </button>
          </form>
        </div>

        {/* ACTIVE MENU LIST */}
        <div>
          <h2 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" /> Live Menu ({products.length})
          </h2>
          <div className="flex flex-col gap-3">
            {products.map((p: any) => (
               <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-16 h-16 bg-black rounded-xl border border-zinc-800 overflow-hidden shrink-0">
                     {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-zinc-600 uppercase">No Img</div>}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-white line-clamp-1">{p.name}</h3>
                        <span className="text-[9px] font-black bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md uppercase tracking-widest">{p.category}</span>
                     </div>
                     <p className="text-orange-500 font-black italic mt-1">₦{p.price}</p>
                  </div>
               </div>
            ))}
            {products.length === 0 && (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-3xl text-zinc-600 font-bold text-xs uppercase tracking-widest">No items published yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
