"use client";

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useCallback } from 'react';

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value
}) => {
  const handleUpload = useCallback((result: any) => {
    onChange(result.info.secure_url);
  }, [onChange]);

  return (
    <CldUploadWidget 
      onSuccess={handleUpload} 
      // 🟢 ACÁ ESTÁ EL ARREGLO MAESTRO
      uploadPreset="alquileres_cloud" 
      options={{ maxFiles: 1 }}
    >
      {({ open }) => {
        return (
          <div onClick={() => open?.()} className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 border-gray-300 flex flex-col justify-center items-center h-full rounded-lg bg-gray-50">
            {value ? (
              <div className="absolute inset-0 w-full h-full">
                <Image fill style={{ objectFit: 'cover' }} src={value} alt="Upload" className="rounded-lg" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <span className="font-semibold text-sm">📷 Subir Foto</span>
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
}

export default ImageUpload;