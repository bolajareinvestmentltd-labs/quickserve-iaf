"use client";
import { useState, useEffect } from "react";
import { createProduct } from "@/app/actions/vendor";
import { updateOrderStatus } from "@/app/actions/order";
import { UploadCloud, Loader2, Store, Plus, Package, LogOut, BellRing, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VendorDashboardClient({ vendor, products, allOrders = [] }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  
  // REAL-TIME REFRESH: Pulses the page every 10 seconds to check for new paid orders
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [router]);

  // VENDOR ORDER FILTERING LOGIC
  // This extracts only the items from the global cart that belong to THIS vendor
  const myOrders = allOrders.map((order: any) => {
    if (!order.items) return null;
    try {
      const parsedItems = JSON.parse(order.items);
      const vendorItems = parsedItems.filter((item: any) => item.vendorId === vendor.id);
      if (vendorItems.length === 0) return null;
      return { ...order, vendorItems };
    } catch {
      return null;
    }
  }).filter(Boolean);

  const [productData, setProductData] = useState({ name: "", price: "", category: "Meals", description: "", imageUrl: "" });
  const categories = ["Meals", "Drinks", "Snacks", "Bakery", "Specials"];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      setProductData({ ...productData, imageUrl: data.secure_url });
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createProduct({ ...productData, vendorId: vendor.id });
    if (res.success) {
      setProductData({ name: "", price: "", category: "Meals", description: "", imageUrl: "" });
      router.refresh();
    }
    setLoading(false);
  };

  const handleAcceptOrder = async (orderId: string) => {
    setProcessingOrder(orderId);
    await updateOrderStatus(orderId, "preparing", vendor.id);
    setProcessingOrder(null);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      <header className="px-6 py-6 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
             <Store className="w-5 h-5 text-orange-500" /> {vendor.businessName}
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">Vendor Command Center</p>
        </div>
        <button onClick={() => router.push('/')} className="p-2 bg-red-950/30 text-red-500 rounded-full active:scale-90 transition-transform"><LogOut className="w-5 h-5" /></button>
      </header>

      <div className="px-6 mt-6 flex flex-col gap-8">
        
        {/* ========================================= */}
        {/* 1. THE LIVE ORDER INBOX */}
        {/* ========================================= */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
            <BellRing className="w-4 h-4 animate-bounce" /> Live Order Radar
          </h2>
          
          {myOrders.length === 0 ? (
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 text-center text-zinc-500 font-bold text-xs uppercase tracking-widest flex flex-col items-center gap-3">
               <Package className="w-8 h-8 opacity-50" />
               Waiting for incoming orders...
             </div>
          ) : (
             <div className="flex flex-col gap-4">
                {myOrders.map((order: any) => (
                  <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg shadow-black flex flex-col gap-4 relative overflow-hidden">
                     {order.status === "preparing" && <div className="absolute top-0 right-0 bg-orange-600 text-[9px] font-black uppercase px-3 py-1 rounded-bl-lg">Preparing</div>}
                     {order.status === "out_for_delivery" && <div className="absolute top-0 right-0 bg-green-600 text-[9px] font-black uppercase px-3 py-1 rounded-bl-lg">With Runner</div>}

                     <div>
                       <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Order #{order.id.slice(0,6)}</p>
                       <h3 className="text-lg font-black text-white italic">{order.customerName}</h3>
                     </div>

                     {/* The specific items ordered from THIS vendor */}
                     <div className="bg-black border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2">
                        {order.vendorItems.map((item: any, i: number) => (
                           <div key={i} className="flex justify-between items-center text-sm font-bold">
                              <span className="text-zinc-300"><span className="text-orange-500">{item.quantity}x</span> {item.name}</span>
                           </div>
                        ))}
                     </div>

                     {/* Action Buttons */}
                     {order.status === "pending" && (
                       <button onClick={() => handleAcceptOrder(order.id)} disabled={processingOrder === order.id} className="w-full bg-orange-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform uppercase tracking-widest text-xs">
                         {processingOrder === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Accept & Prepare</>}
                       </button>
                     )}
                     
                     {order.status === "preparing" && (
                       <div className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 font-black py-4 rounded-xl flex items-center justify-center uppercase tracking-widest text-[10px]">
                         Waiting for Runner Pickup
                       </div>
                     )}
                  </div>
                ))}
             </div>
          )}
        </div>

        <div className="h-px w-full bg-zinc-900 my-2"></div>

        {/* ========================================= */}
        {/* 2. MENU MANAGEMENT (Preserved) */}
        {/* ========================================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl shadow-black">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-500" /> Add New Offering
          </h2>
          <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
            <div className="border-2 border-dashed border-zinc-700 rounded-2xl h-40 flex flex-col items-center justify-center text-center relative overflow-hidden bg-zinc-950">
               {productData.imageUrl ? <img src={productData.imageUrl} alt="Product" className="absolute inset-0 w-full h-full object-cover opacity-80" /> : <UploadCloud className="w-8 h-8 text-zinc-600 mb-2" />}
               <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest relative z-10 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm mt-2">
                 {uploadingImage ? "Uploading..." : productData.imageUrl ? "Image Ready" : "Upload Food Photo"}
               </span>
               <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={uploadingImage} />
            </div>
            <input required type="text" placeholder="Item Name" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-orange-500" />
            <div className="flex gap-3">
              <input required type="number" placeholder="Price (₦)" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-orange-500" />
              <select value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-zinc-300 outline-none focus:border-orange-500">
                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <textarea placeholder="Short description..." value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-orange-500 resize-none h-20" />
            <button type="submit" disabled={loading || uploadingImage} className="w-full bg-orange-600 disabled:bg-zinc-800 text-white font-black py-4 rounded-xl mt-2 active:scale-95 transition-transform flex justify-center uppercase tracking-widest text-sm shadow-lg shadow-orange-900/20">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish to Storefront"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
