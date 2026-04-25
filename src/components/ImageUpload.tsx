"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Image as ImageIcon, UploadCloud, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ImageUpload() {
  const [url, setUrl] = useState("");

  return (
    <div className="w-full">
      <CldUploadWidget 
        uploadPreset="quickserve_preset"
        onSuccess={(result: any) => {
          setUrl(result.info.secure_url);
        }}
      >
        {({ open }) => (
          <div 
            onClick={() => open()}
            className={`group relative w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              url 
                ? 'border-green-500/50 bg-green-500/5' 
                : 'border-zinc-800 bg-black hover:border-orange-500/50'
            }`}
          >
            {url ? (
              <>
                <img src={url} className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-40" />
                <CheckCircle2 className="w-8 h-8 text-green-500 relative z-10" />
                <span className="text-[10px] font-black text-green-500 uppercase mt-2 relative z-10">Image Ready</span>
                {/* Hidden input to pass the URL to the server action */}
                <input type="hidden" name="imageUrl" value={url} />
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-zinc-700 group-hover:text-orange-500 transition-colors" />
                <span className="text-[10px] font-black text-zinc-500 uppercase mt-2 tracking-widest">Upload Food Photo</span>
              </>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}
