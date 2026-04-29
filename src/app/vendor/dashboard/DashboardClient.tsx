"use client";
import { useState, useEffect } from "react";
import { ChefHat, Check, LogOut, MapPin, Package, BarChart3, Settings, LayoutDashboard, Lock, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function DashboardClient({ vendor }: { vendor: any }) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const router = useRouter();

  // New Product State
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch Orders
      const ticketsRes = await fetch(`/api/vendor/tickets?vendorId=${vendor.id}`);
      if (ticketsRes.ok) setTickets(await ticketsRes.json());
      
      // Fetch Inventory
      const productsRes = await fetch(`/api/vendor/products?vendorId=${vendor.id}`);
      if (productsRes.ok) setMenuItems(await productsRes.json());
    } catch (e) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (ticketId: number, orderId: string, newStatus: string) => {
    const res = await fetch("/api/vendor/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, orderId, newStatus })
    });
    if (res.ok) {
      toast.success(`Order marked as ${newStatus}`);
      fetchData();
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return toast.error("Name and price are required");
    
    setIsAdding(true);
    const res = await fetch("/api/vendor/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProduct, vendorId: vendor.id })
    });

    if (res.ok) {
      toast.success("Item added to menu!");
      setNewProduct({ name: "", price: "", description: "" });
      fetchData(); // Refresh inventory
    } else {
      toast.error("Failed to add item");
    }
    setIsAdding(false);
  };

  const handleLogout = () => {
    document.cookie = "vendor_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/vendor");
  };

  const activeTickets = tickets.filter(t => t.status === "pending" || t.status === "preparing");

  const tabs = [
    { id: "orders", icon: LayoutDashboard, label: "Live KDS" },
    { id: "inventory", icon: Package, label: "Inventory" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans pb-24">
      
      {/* HEADER */}
      <header className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-3xl mb-6 shadow-lg">
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">{vendor.businessName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${activeTab === 'orders' ? 'bg-green-500 animate-pulse' : 'bg-zinc-500'}`}></div>
            <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
              {activeTab === 'orders' ? 'Live Kitchen Feed' : activeTab === 'inventory' ? 'Menu Manager' : 'System Locked'}
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <LogOut className="w-4 h-4 text-red-500" />
        </button>
      </header>

      {/* FULL SCALE NAVIGATION */}
      <div className="flex overflow-x-auto gap-3 mb-6 pb-2" style={{ scrollbarWidth: 'none' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/30' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: LOCKED MODULES */}
      {(activeTab === "analytics" || activeTab === "settings") && (
        <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl mt-4 flex flex-col items-center animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
             <Lock className="w-6 h-6 text-zinc-600" />
          </div>
          <h2 className="text-white font-black uppercase tracking-widest text-sm mb-2">{tabs.find(t => t.id === activeTab)?.label} Module</h2>
          <p className="text-zinc-500 font-bold text-[10px] px-8 uppercase tracking-widest leading-relaxed">
            Locked for Auto Fest MVP phase. Will be activated for full standard operations.
          </p>
        </div>
      )}

      {/* TAB: INVENTORY (MENU MANAGER) */}
      {activeTab === "inventory" && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
            <h2 className="font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-orange-500" /> Add New Item</h2>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <input 
                type="text" 
                placeholder="Item Name (e.g., Spicy Chicken Wings)" 
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white font-bold outline-none focus:border-orange-500 transition-colors"
              />
              <div className="flex gap-3">
                <div className="relative w-1/3">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-black">₦</span>
                  <input 
                    type="number" 
                    placeholder="Price" 
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 pl-8 text-sm text-white font-bold outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Short Description (Optional)" 
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-2/3 bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white font-bold outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <button disabled={isAdding} type="submit" className="w-full bg-orange-600 text-white font-black py-3 rounded-xl uppercase tracking-widest text-xs mt-2 active:scale-95 transition-transform">
                {isAdding ? "Adding..." : "Publish to Menu"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-black text-zinc-500 uppercase tracking-widest text-xs mb-3 px-2">Live Menu ({menuItems.length})</h2>
            <div className="space-y-3">
              {menuItems.length === 0 ? (
                <div className="text-center py-10 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl">
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">No items added yet</p>
                </div>
              ) : (
                menuItems.map(item => (
                  <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-white text-sm">{item.name}</h3>
                      <p className="text-orange-500 font-bold text-xs">₦{item.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: LIVE KDS */}
      {activeTab === "orders" && (
        <div className="animate-in fade-in duration-300">
          {loading ? (
            <div className="flex justify-center mt-20"><div className="w-8 h-8 border-4 border-zinc-800 border-t-orange-500 rounded-full animate-spin"></div></div>
          ) : activeTickets.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl">
              <ChefHat className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
              <h2 className="text-zinc-500 font-black tracking-widest uppercase text-sm">Kitchen is quiet</h2>
              <p className="text-zinc-600 text-[10px] mt-2 font-bold uppercase tracking-widest">Waiting for new orders...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTickets.map(ticket => {
                const items = JSON.parse(ticket.items || "[]");
                return (
                  <div key={ticket.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
                    <div className="flex justify-between items-start mb-4 border-b border-zinc-800 pb-4">
                      <div>
                        <h3 className="font-black text-lg text-white uppercase tracking-tight">#{ticket.orderId.slice(0, 5)}</h3>
                        <div className="flex items-center gap-1 mt-1 text-zinc-400">
                          <MapPin className="w-3 h-3 text-orange-500" />
                          <span className="text-[10px] font-bold uppercase">{ticket.customerZone}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ticket.status === 'pending' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                        {ticket.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      {items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-black p-3 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-zinc-800 text-white flex items-center justify-center rounded-md font-black text-xs">{item.quantity}x</span>
                            <span className="font-bold text-sm text-zinc-300 truncate">{item.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {ticket.status === "pending" && (
                      <button onClick={() => updateStatus(ticket.id, ticket.orderId, "preparing")} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform uppercase tracking-widest shadow-lg shadow-orange-900/20">
                        <ChefHat className="w-5 h-5" /> Accept Order
                      </button>
                    )}
                    {ticket.status === "preparing" && (
                      <button onClick={() => updateStatus(ticket.id, ticket.orderId, "ready")} className="w-full bg-green-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform uppercase tracking-widest shadow-lg shadow-green-900/20">
                        <Check className="w-5 h-5" /> Food is Ready
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
