"use client";
import { useState } from "react";
import { createVendor } from "@/app/actions/vendor";
import { Store, ShieldAlert, Loader2, UploadCloud, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [vendorData, setVendorData] = useState({
    businessName: "",
    username: "",
    password: "",
    logoUrl: "",
    vendorTag: "Prime",
    rating: "4.8",
    prepTime: "15-20 min",
    deliveryFee: 200
  });

  // Handle Cloudinary Upload for Vendor Logo
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
      setVendorData({ ...vendorData, logoUrl: data.secure_url });
    } catch (error) {
      alert("Image upload failed. Check your Vercel keys.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createVendor(vendorData);
    if (res.success) {
      alert("Vendor created successfully!");
      setVendorData({ businessName: "", username: "", password: "", logoUrl: "", vendorTag: "Prime", rating: "4.8", prepTime: "15-20 min", deliveryFee: 200 });
      router.refresh();
    } else {
      alert("Failed to create vendor.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      <header className="px-6 py-6 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-orange-500" /> System <span className="text-orange-500">Admin</span>
        </h1>
        <button onClick={() => router.push('/')} className="p-2 bg-red-950/30 text-red-500 rounded-full active:scale-90 transition-transform">
           <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className="px-6 mt-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl shadow-black">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-500" /> Onboard New Storefront
          </h2>

          <form onSubmit={handleCreateVendor} className="flex flex-col gap-4">
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-zinc-950">
               {vendorData.logoUrl ? (
                 <img src={vendorData.logoUrl} alt="Logo" className="absolute inset-0 w-full h-full object-cover opacity-60" />
               ) : (
                 <UploadCloud className="w-8 h-8 text-zinc-600 mb-2" />
               )}
               <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest relative z-10">
                 {uploadingImage ? "Uploading..." : vendorData.logoUrl ? "Logo Uploaded" : "Upload Store Logo"}
               </span>
               <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" disabled={uploadingImage} />
            </div>

            {/* Core Details */}
            <input required type="text" placeholder="Business Name" value={vendorData.businessName} onChange={e => setVendorData({...vendorData, businessName: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
            <div className="flex gap-3">
              <input required type="text" placeholder="Username" value={vendorData.username} onChange={e => setVendorData({...vendorData, username: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
              <input required type="text" placeholder="Password" value={vendorData.password} onChange={e => setVendorData({...vendorData, password: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
            </div>

            {/* Glovo Badges */}
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-2 border-b border-zinc-800 pb-2">Storefront Badges</h3>
            <div className="grid grid-cols-2 gap-3">
               <input required type="text" placeholder="Tag (e.g., Prime)" value={vendorData.vendorTag} onChange={e => setVendorData({...vendorData, vendorTag: e.target.value})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
               <input required type="text" placeholder="Rating (e.g., 4.8)" value={vendorData.rating} onChange={e => setVendorData({...vendorData, rating: e.target.value})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
               <input required type="text" placeholder="Prep Time (15-20 min)" value={vendorData.prepTime} onChange={e => setVendorData({...vendorData, prepTime: e.target.value})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
               <input required type="number" placeholder="Delivery Fee" value={vendorData.deliveryFee} onChange={e => setVendorData({...vendorData, deliveryFee: Number(e.target.value)})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
            </div>

            <button type="submit" disabled={loading || uploadingImage} className="w-full bg-orange-600 disabled:bg-zinc-800 text-white font-black py-4 rounded-xl mt-4 active:scale-95 transition-transform flex justify-center uppercase tracking-widest text-sm shadow-lg shadow-orange-900/20">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Storefront"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
