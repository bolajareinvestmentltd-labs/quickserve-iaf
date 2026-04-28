"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createVendor } from "@/app/actions/vendor";
import { createRunner } from "@/app/actions/runner";
import { cancelOrder } from "@/app/actions/cancel";
import { ShieldAlert, Store, Activity, Users, LogOut, UploadCloud, Loader2, Trash2 } from "lucide-react";

export default function AdminDashboardClient({ initialOrders, initialVendors }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("radar");
  const [cancelling, setCancelling] = useState<string | null>(null);
  
  // VENDOR STATE
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [vendorData, setVendorData] = useState({ businessName: "", username: "", password: "", logoUrl: "", vendorTag: "Prime", rating: "4.8", prepTime: "15-20 min", deliveryFee: 200 });

  // RUNNER STATE
  const [creatingRunner, setCreatingRunner] = useState(false);
  const [runnerData, setRunnerData] = useState({ name: "", email: "", username: "", password: "", phone: "" });

  // Auto-refresh God Mode Radar every 15 seconds
  useEffect(() => {
    if (activeTab === "radar") {
      const interval = setInterval(() => router.refresh(), 15000);
      return () => clearInterval(interval);
    }
  }, [activeTab, router]);

  const handleForceCancel = async (orderId: string) => {
    if (confirm("EMERGENCY OVERRIDE: Are you sure you want to force-cancel this order?")) {
      setCancelling(orderId);
      await cancelOrder(orderId);
      setCancelling(null);
      router.refresh();
    }
  };

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
      setVendorData({ ...vendorData, logoUrl: data.secure_url });
    } catch {
      alert("Image upload failed.");
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

  const handleCreateRunner = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingRunner(true);
    const res = await createRunner(runnerData);
    if (res.success) {
      alert("Runner added to fleet!");
      setRunnerData({ name: "", email: "", username: "", password: "", phone: "" });
      router.refresh();
    } else {
      alert(res.error);
    }
    setCreatingRunner(false);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-32">
      <header className="px-6 py-6 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-orange-500" /> HQ <span className="text-orange-500">Command</span>
        </h1>
        <button onClick={() => router.push('/')} className="p-2 bg-red-950/30 text-red-500 rounded-full active:scale-90 transition-transform">
           <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* ADMIN TABS */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-zinc-900">
         <button onClick={() => setActiveTab("radar")} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === "radar" ? "bg-orange-600 text-white" : "bg-zinc-900 text-zinc-500"}`}>
            <Activity className="w-4 h-4" /> Global Radar
         </button>
         <button onClick={() => setActiveTab("vendors")} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === "vendors" ? "bg-orange-600 text-white" : "bg-zinc-900 text-zinc-500"}`}>
            <Store className="w-4 h-4" /> Storefronts
         </button>
         <button onClick={() => setActiveTab("runners")} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors ${activeTab === "runners" ? "bg-orange-600 text-white" : "bg-zinc-900 text-zinc-500"}`}>
            <Users className="w-4 h-4" /> Fleet Management
         </button>
      </div>

      <div className="px-6 mt-6">
        
        {/* ======================= */}
        {/* TAB 1: GLOBAL RADAR     */}
        {/* ======================= */}
        {activeTab === "radar" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-2">Live Ecosystem Orders</h2>
            {initialOrders.slice().reverse().map((order: any) => (
               <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-black/50">
                  <div className={`absolute top-0 right-0 text-[9px] font-black uppercase px-3 py-1 rounded-bl-lg ${
                    order.status === "delivered" ? "bg-green-600 text-white" : 
                    order.status === "cancelled" ? "bg-red-600 text-white" : 
                    "bg-orange-600 text-white"
                  }`}>
                    {order.status}
                  </div>
                  
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">REF: {order.id.slice(0,8)}</p>
                  <h3 className="text-lg font-black text-white italic">{order.customerName}</h3>
                  <p className="text-sm text-zinc-400 font-medium mb-3">Zone: {order.customerZone || "N/A"} | ₦{order.totalAmount}</p>

                  {(order.status !== "delivered" && order.status !== "cancelled") && (
                     <button onClick={() => handleForceCancel(order.id)} disabled={cancelling === order.id} className="w-full mt-2 bg-red-950/30 border border-red-900/50 text-red-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 text-xs uppercase tracking-widest">
                       {cancelling === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Force Cancel Order</>}
                     </button>
                  )}
               </div>
            ))}
            {initialOrders.length === 0 && <p className="text-center text-zinc-600 font-bold text-sm uppercase tracking-widest mt-10">No active orders</p>}
          </div>
        )}

        {/* ======================= */}
        {/* TAB 2: STOREFRONTS      */}
        {/* ======================= */}
        {activeTab === "vendors" && (
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl shadow-black">
              <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-500" /> Onboard New Storefront
              </h2>
              <form onSubmit={handleCreateVendor} className="flex flex-col gap-4">
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
                <input required type="text" placeholder="Business Name" value={vendorData.businessName} onChange={e => setVendorData({...vendorData, businessName: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                <div className="flex gap-3">
                  <input required type="text" placeholder="Username" value={vendorData.username} onChange={e => setVendorData({...vendorData, username: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                  <input required type="text" placeholder="Password" value={vendorData.password} onChange={e => setVendorData({...vendorData, password: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                </div>
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-2 border-b border-zinc-800 pb-2">Storefront Badges</h3>
                <div className="grid grid-cols-2 gap-3">
                   <input required type="text" placeholder="Tag (e.g., Prime)" value={vendorData.vendorTag} onChange={e => setVendorData({...vendorData, vendorTag: e.target.value})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                   <input required type="text" placeholder="Rating (e.g., 4.8)" value={vendorData.rating} onChange={e => setVendorData({...vendorData, rating: e.target.value})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                   <input required type="text" placeholder="Prep Time" value={vendorData.prepTime} onChange={e => setVendorData({...vendorData, prepTime: e.target.value})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                   <input required type="number" placeholder="Delivery Fee" value={vendorData.deliveryFee} onChange={e => setVendorData({...vendorData, deliveryFee: Number(e.target.value)})} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                </div>
                <button type="submit" disabled={loading || uploadingImage} className="w-full bg-orange-600 disabled:bg-zinc-800 text-white font-black py-4 rounded-xl mt-4 active:scale-95 transition-transform flex justify-center uppercase tracking-widest text-sm">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Storefront"}
                </button>
              </form>
           </div>
        )}

        {/* ======================= */}
        {/* TAB 3: FLEET MANAGEMENT */}
        {/* ======================= */}
        {activeTab === "runners" && (
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl shadow-black">
              <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" /> Onboard New Rider
              </h2>
              <form onSubmit={handleCreateRunner} className="flex flex-col gap-4">
                <input required type="text" placeholder="Full Name" value={runnerData.name} onChange={e => setRunnerData({...runnerData, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                <input type="email" placeholder="Email Address (Optional)" value={runnerData.email} onChange={e => setRunnerData({...runnerData, email: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                <input required type="tel" placeholder="Phone Number" value={runnerData.phone} onChange={e => setRunnerData({...runnerData, phone: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                <div className="flex gap-3">
                  <input required type="text" placeholder="Login Username" value={runnerData.username} onChange={e => setRunnerData({...runnerData, username: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                  <input required type="text" placeholder="Login Password" value={runnerData.password} onChange={e => setRunnerData({...runnerData, password: e.target.value})} className="w-1/2 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-orange-500" />
                </div>
                <button type="submit" disabled={creatingRunner} className="w-full bg-orange-600 disabled:bg-zinc-800 text-white font-black py-4 rounded-xl mt-2 active:scale-95 transition-transform uppercase tracking-widest text-sm">
                  {creatingRunner ? "Adding..." : "Add to Fleet"}
                </button>
              </form>
           </div>
        )}

      </div>
    </div>
  );
}
