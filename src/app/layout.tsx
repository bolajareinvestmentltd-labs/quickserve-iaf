import "./globals.css";
import BottomNav from "@/components/BottomNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white antialiased selection:bg-orange-500/30">
        <div className="flex justify-center bg-[#0a0a0a] min-h-screen">
          {/* Constrained mobile shell with a subtle glow */}
          <main className="w-full max-w-md bg-black relative shadow-[0_0_50px_rgba(0,0,0,0.5)] min-h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
              {children}
            </div>
            <BottomNav />
          </main>
        </div>
      </body>
    </html>
  );
}