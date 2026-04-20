import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quickserve | Ilorin Auto Festival",
  description: "Order food and drinks straight to your zone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
