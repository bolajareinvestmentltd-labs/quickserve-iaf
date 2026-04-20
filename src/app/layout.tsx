import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/CartDrawer";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Quickserve | Fast Festival Delivery",
  description: "Order food and drinks straight to your zone.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-[#0A0C10] text-gray-100 min-h-screen selection:bg-orange-500 selection:text-white`}>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
