import React, { useState } from "react";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images = [],
  onChange,
  maxImages = Infinity,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const filesToProcess = Array.from(files);

      const base64Promises = filesToProcess.map(convertToBase64);
      const base64Results = await Promise.all(base64Promises);

      onChange([...images, ...base64Results]);
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((src, index) => (
          <div key={index} className="relative group">
            <div className="relative h-24 w-24 rounded-md overflow-hidden border">
              <Image
                src={src}
                alt={`Car image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <div className="relative h-24 w-24 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Upload size={20} />
              <span className="text-xs mt-1">Add</span>
            </>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500">Click on an image to remove it.</p>
    </div>
  );
}
