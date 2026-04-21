"use client";
import { useCartStore } from '@/store/cart';
import { X, MapPin, Phone, Minus, Plus, User, Loader2, CheckCircle, Ticket } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, totalPrice, clearCart } = useCartStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState('');
  const [ticketId, setTicketId] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);

  const DELIVERY_FEE = 500;
  const subtotal = totalPrice();
  const finalTotal = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

  const ADMIN_WHATSAPP_NUMBER = "2348000000000"; 

  useEffect(() => {
    if (isOpen && !paystackLoaded) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => setPaystackLoaded(true);
      document.body.appendChild(script);
    }
  }, [isOpen, paystackLoaded]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setOrderComplete(false), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!name || !phone || !zone) {
      alert("Name, Phone, and Zone are required.");
      return;
    }
    if (!paystackLoaded || !(window as any).PaystackPop) {
      alert("Payment system loading. Please wait.");
      return;
    }

    setIsProcessing(true);

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    const handler = (window as any).PaystackPop.setup({
      key: paystackKey,
      // THE FIX: Changed .local to .com so Paystack accepts it
      email: `${phone.replace(/\s/g, '')}@quickserve.com`,
      amount: finalTotal * 100,
      currency: "NGN",
      onClose: () => setIsProcessing(false),
      onSuccess: async (transaction: any) => {
        setIsProcessing(true);
        try {
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerName: name,
              customerPhone: phone,
              deliveryZone: zone,
              ticketId: ticketId,
              totalAmount: finalTotal,
              items: items,
              reference: transaction.reference,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setCurrentOrderId(data.orderId);
            clearCart();
            setOrderComplete(true);
          } else {
            throw new Error("Failed to save to db");
          }
        } catch (error) {
          console.error(error);
          alert("Order synced failed. Ref: " + transaction.reference);
        } finally {
          setIsProcessing(false);
        }
      }
    });
    handler.openIframe();
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hello Quickserve! I just placed Order #${currentOrderId}. My name is ${name} and I am located at: ${zone}. Please confirm!`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');
    closeCart();
  };

  if (orderComplete) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeCart} />
        <div className="relative bg-[#14171F] border-t border-white/10 w-full max-w-md mx-auto rounded-t-3xl h-[65vh] flex flex-col items-center justify-center p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce border border-green-500/30">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 uppercase italic">Payment Received!</h2>
          <p className="text-gray-400 text-center mb-2">
            Your runner is heading to <span className="font-bold text-orange-500">{zone}</span>.
          </p>
          <p className="text-xs text-gray-500 mb-8 text-center bg-[#0A0C10] p-3 rounded-lg border border-white/5">
            For live updates on your food, click below to message your assigned runner.
          </p>
          
          <button 
            onClick={handleWhatsAppRedirect}
            className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl text-lg hover:bg-[#1DA851] transition flex items-center justify-center gap-2 mb-3 shadow-xl shadow-green-500/20"
          >
            <Phone className="w-5 h-5" /> Message Runner
          </button>
          
          <button onClick={closeCart} className="w-full bg-[#0A0C10] text-gray-400 border border-white/10 font-bold py-4 rounded-2xl hover:text-white transition">
            Close 
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={closeCart} />
      <div className="relative bg-[#14171F] border-t border-white/10 w-full max-w-md mx-auto rounded-t-3xl h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-300">
        
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Your Order</h2>
          <button onClick={closeCart} className="p-2 bg-[#0A0C10] border border-white/5 hover:border-white/10 rounded-full text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
               <div className="text-6xl opacity-50">🛒</div>
               <p className="font-bold">Your cart is empty</p>
             </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-[#0A0C10] border border-white/5 p-3 rounded-2xl">
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-white">{item.name}</h4>
                  <p className="font-black text-orange-500 text-sm mt-1">₦{item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3 bg-[#14171F] p-1 rounded-xl border border-white/10">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                  <span className="font-bold text-sm w-4 text-center text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest">Delivery Details</h3>
              
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full bg-[#0A0C10] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number" className="w-full bg-[#0A0C10] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input type="text" value={zone} onChange={(e) => setZone(e.target.value)} placeholder="e.g. VIP Tent, Drift Track" className="w-full bg-[#0A0C10] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500" />
              </div>
              <div className="relative mt-2">
                <Ticket className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input type="text" value={ticketId} onChange={(e) => setTicketId(e.target.value)} placeholder="Ticket ID (Optional)" className="w-full bg-[#0A0C10] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500" />
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-white/5 bg-[#14171F]">
            <div className="flex justify-between font-black text-white text-lg mb-4"><span>Total</span><span className="text-orange-500">₦{finalTotal.toLocaleString()}</span></div>
            <button onClick={handleCheckout} disabled={isProcessing} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Pay Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
