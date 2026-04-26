"use client";
import { useState } from "react";
import PinGate from "@/components/auth/PinGate";

export default function VendorDashboardClient({ children, correctPin }: { children: React.ReactNode, correctPin: string }) {
  const [isVerified, setIsVerified] = useState(false);

  const checkPin = (enteredPin: string) => {
    if (enteredPin === correctPin) {
      setIsVerified(true);
    } else {
      alert("Incorrect PIN. Please try again.");
    }
  };

  if (!isVerified) return <PinGate title="Vendor Access" sub="Security Authentication Required" onVerified={checkPin} />;

  return <>{children}</>;
}
