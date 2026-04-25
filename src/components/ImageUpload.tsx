"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Image as ImageIcon, CheckCircle2, UploadCloud } from "lucide-react";

export default function ImageUpload() {
  const [imageUrl, setImageUrl] = useState<string>("");

  return (
    <>
      {/* This hidden input silently passes the uploaded URL to the Server Action */}
      <input type="hidden" name="imageUrl" value={imageUrl} />
      
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result: any) => {
          // Cloudinary returns the live image URL here
          setImageUrl(result.info.secure_url);
        }}
      >
        {({ open }) => {
          function handleOnClick(e: React.MouseEvent) {
            e.preventDefault(); // Prevents the main form from submitting
            open();
          }
          
          return (
            <button
              onClick={handleOnClick}
              className={`w-full p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
                imageUrl 
                  ? "border-green-500/50 bg-green-500/10 text-green-500" 
                  : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-orange-500 hover:text-orange-500"
              }`}
            >
              {imageUrl ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-bold text-sm">Image Uploaded Successfully!</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6" />
                  <span className="font-bold text-sm">Tap to Upload Photo</span>
                  <span className="text-xs opacity-70">Opens camera or gallery</span>
                </>
              )}
            </button>
          );
        }}
      </CldUploadWidget>
    </>
  );
}
