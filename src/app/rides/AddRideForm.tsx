"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Car } from 'lucide-react';

export default function AddRideForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    driverName: '', vehicleInfo: '', destination: '', departureTime: '', whatsappNumber: '', seats: '3'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ driverName: '', vehicleInfo: '', destination: '', departureTime: '', whatsappNumber: '', seats: '3' });
        router.refresh();
      } else {
        alert('Failed to post ride');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#14171F] p-6 rounded-3xl border border-white/5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Car className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-bold text-white">Post a Ride</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input required type="text" placeholder="Your Name" value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none" />
        <input required type="text" placeholder="Vehicle (e.g. Camry)" value={formData.vehicleInfo} onChange={e => setFormData({...formData, vehicleInfo: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none" />
        <input required type="text" placeholder="Destination (e.g. Tanke)" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none" />
        <input required type="text" placeholder="Time (e.g. 8:00 PM)" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none" />
        <input required type="tel" placeholder="WhatsApp Number" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none" />
        <input required type="number" placeholder="Seats" value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none" />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition flex justify-center items-center shadow-lg shadow-orange-500/20">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'List Available Seats'}
      </button>
    </form>
  );
}
