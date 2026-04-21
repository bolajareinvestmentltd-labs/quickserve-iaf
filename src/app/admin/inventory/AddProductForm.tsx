"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type Vendor = { id: number; businessName: string };

export default function AddProductForm({ vendors }: { vendors: Vendor[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: '',
    name: '',
    price: '',
    category: 'food',
    imageUrl: '🍔',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendorId || !formData.name || !formData.price) return alert('Fill all required fields');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setFormData({ vendorId: '', name: '', price: '', category: 'food', imageUrl: '🍔' });
        router.refresh(); // Instantly reloads the product list!
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Vendor</label>
        <select 
          value={formData.vendorId} 
          onChange={(e) => setFormData({...formData, vendorId: e.target.value})}
          className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
        >
          <option value="">Select Vendor...</option>
          {vendors.map(v => <option key={v.id} value={v.id}>{v.businessName}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Item Name</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="e.g. Asun & Chips"
          className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Price (₦)</label>
          <input 
            type="number" 
            value={formData.price} 
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="3500"
            className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Emoji/Image</label>
          <input 
            type="text" 
            value={formData.imageUrl} 
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Category</label>
        <select 
          value={formData.category} 
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none"
        >
          <option value="food">Food</option>
          <option value="drink">Drink</option>
          <option value="eatable">Eatable</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition flex justify-center items-center shadow-lg shadow-orange-500/20"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish to Live Menu'}
      </button>
    </form>
  );
}
