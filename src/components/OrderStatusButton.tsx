"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function OrderStatusButton({ orderId }: { orderId: number }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (res.ok) {
        router.refresh(); // Instantly updates the server page to remove the order
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button 
      onClick={handleComplete}
      disabled={isUpdating}
      className="mt-4 w-full bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
    >
      {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
        <>
          <CheckCircle className="w-5 h-5" /> Mark as Delivered
        </>
      )}
    </button>
  );
}
