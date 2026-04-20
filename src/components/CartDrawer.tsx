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

  // The central Quickserve Dispatch Number
  const ADMIN_WHATSAPP_NUMBER = "+2349122690946"; 

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
      email: `${phone.replace(/\s/g, '')}@quickserve.local`,
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCart} />
        <div className="relative bg-white w-full max-w-md mx-auto rounded-t-3xl h-[65vh] flex flex-col items-center justify-center p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase italic">Payment Received!</h2>
          <p className="text-gray-500 text-center mb-2">
            Your runner is heading to <span className="font-bold text-gray-900">{zone}</span>.
          </p>
          <p className="text-xs text-gray-400 mb-8 text-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            For live updates on your food, click below to message your assigned runner.
          </p>
          
          <button 
            onClick={handleWhatsAppRedirect}
            className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl text-lg hover:bg-[#1DA851] transition flex items-center justify-center gap-2 mb-3 shadow-xl shadow-green-500/20"
          >
            <Phone className="w-5 h-5" /> Message Runner
          </button>
          
          <button onClick={closeCart} className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl">
            Close 
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeCart} />
      <div className="relative bg-white w-full max-w-md mx-auto rounded-t-3xl h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-300">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Your Order</h2>
          <button onClick={closeCart} className="p-2 bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
               <div className="text-6xl">🛒</div>
               <p>Your cart is empty</p>
             </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl">
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                  <p className="font-bold text-orange-500 text-sm mt-1">₦{item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-gray-200">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-500"><Minus className="w-4 h-4" /></button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-500"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">Delivery Details</h3>
              
              {/* Core Details */}
              <div className="relative"><User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" /><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500" /></div>
              <div className="relative"><Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" /><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500" /></div>
              <div className="relative"><MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" /><input type="text" value={zone} onChange={(e) => setZone(e.target.value)} placeholder="e.g. VIP Tent, Drift Track" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500" /></div>
              
              {/* Optional Ticket ID */}
              <div className="relative mt-2">
                <Ticket className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="Ticket ID (Optional)" 
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex justify-between font-black text-gray-900 text-lg mb-4"><span>Total</span><span>₦{finalTotal.toLocaleString()}</span></div>
            <button onClick={handleCheckout} disabled={isProcessing} className="w-full bg-black text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center">
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Pay Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
