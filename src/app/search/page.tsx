import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="p-6 bg-black min-h-screen flex flex-col pt-20">
      <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-6">Discover <span className="text-orange-500">Food</span></h1>
      <div className="relative group">
        <Search className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
        <input type="text" autoFocus placeholder="What are you craving?" className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none text-white focus:border-orange-500 transition-all shadow-xl" />
      </div>
    </div>
  );
}
