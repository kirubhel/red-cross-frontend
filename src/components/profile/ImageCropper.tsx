"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Loader2, Crop, X } from 'lucide-react';
import getCroppedImg from '@/lib/cropImage';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black tracking-tight text-black">Crop Profile Photo</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Adjust to fit your Digital ID</p>
          </div>
          <button 
            onClick={onCancel}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="relative flex-1 min-h-[400px] bg-gray-50">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropAreaComplete}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Zoom Level</span>
               <span className="text-[10px] font-black text-black">{Math.round(zoom * 100)}%</span>
            </div>
            <input 
               type="range"
               value={zoom}
               min={1}
               max={3}
               step={0.1}
               aria-labelledby="Zoom"
               onChange={(e) => onZoomChange(parseFloat(e.target.value))}
               className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#ED1C24]"
            />
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 h-14 rounded-2xl border-2 border-gray-100 font-black uppercase tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCrop}
              disabled={loading}
              className="flex-[2] h-14 rounded-2xl bg-[#ED1C24] hover:bg-black text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20 gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crop className="h-4 w-4" />}
              Apply & Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
