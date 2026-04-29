"use client";
import { useEffect } from "react";

export default function ClientCookieSetter({ orderId }: { orderId: string }) {
  useEffect(() => {
    // Safely set the cookie natively in the browser
    document.cookie = `active_order=${orderId}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }, [orderId]);
  
  return null; // This component is completely invisible
}
