"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, Download, ImagePlus, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import ImageCropper from "@/components/profile/ImageCropper";
import SelfieCameraModal from "@/components/profile/SelfieCameraModal";

type Step = "photo" | "card";

interface PostPaymentFlowProps {
  isOpen: boolean;
  memberId?: string;
  onClose: () => void;
}

// Shown after a membership payment is confirmed and the receipt is closed:
// 1. ask for a profile photo, 2. offer the ID card download.
export default function PostPaymentFlow({ isOpen, memberId, onClose }: PostPaymentFlowProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("photo");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setStep("photo");
    try {
      setSignedIn(!!localStorage.getItem("token"));
    } catch {
      setSignedIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", { description: "Please choose an image." });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File too large", { description: "Your photo must be smaller than 3MB." });
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => setSelectedImage(reader.result as string));
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (blob: Blob) => {
    setSelectedImage(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", new File([blob], "profile.jpg", { type: "image/jpeg" }));
      const uploadRes = await api.post("/person/profile/photo", fd);
      const photoUrl = uploadRes.data?.url;
      if (!photoUrl) throw new Error("The photo could not be stored.");

      const profileRes = await api.get("/person/profile");
      const person = { ...(profileRes.data?.person || profileRes.data || {}) };
      if (person.region_id && !person.region) person.region = person.region_id;
      if (person.date_of_birth === "") delete person.date_of_birth;
      await api.put("/person/profile", { ...person, photo_url: photoUrl });

      toast.success("Photo saved", { description: "It will appear on your ID card." });
      setStep("card");
    } catch (err: any) {
      const detail = err?.response?.data?.error || err?.response?.data || err?.message;
      toast.error("Could not save your photo", {
        description: typeof detail === "string" ? detail : "Please try again, or add it later from your profile.",
      });
    } finally {
      setUploading(false);
    }
  };

  const goToCard = (download: boolean) => {
    onClose();
    router.push(download ? "/dashboard?download_id=1" : "/dashboard");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 text-center space-y-6 shadow-2xl">
          {!signedIn ? (
            <>
              <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center">
                <LogIn className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black tracking-tight">Sign in to finish</h3>
                <p className="text-sm text-gray-500 font-medium">
                  Your payment is confirmed{memberId ? ` and your Member ID is ${memberId}` : ""}. Sign in to add your photo and download your ID card.
                </p>
              </div>
              <Button onClick={() => { onClose(); router.push("/login"); }} className="w-full h-12 bg-[#ED1C24] hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest">
                Sign in
              </Button>
            </>
          ) : step === "photo" ? (
            <>
              <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 text-[#ED1C24] flex items-center justify-center">
                <Camera className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black tracking-tight">Add your photo</h3>
                <p className="text-sm text-gray-500 font-medium">
                  Your photo goes on your digital Member ID card. Use a clear photo of your face.
                </p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
              <div className="space-y-3">
                <Button disabled={uploading} onClick={() => setCameraOpen(true)} className="w-full h-12 bg-[#ED1C24] hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest gap-2">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  {uploading ? "Saving…" : "Take a photo"}
                </Button>
                <Button disabled={uploading} variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest gap-2">
                  <ImagePlus className="h-4 w-4" /> Choose from gallery
                </Button>
                <button type="button" disabled={uploading} onClick={() => setStep("card")} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                  Skip for now
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black tracking-tight">Your ID card is ready</h3>
                <p className="text-sm text-gray-500 font-medium">
                  {memberId ? <>Member ID <span className="font-mono font-black text-[#ED1C24]">{memberId}</span>. </> : null}
                  Download your digital Member ID card now and keep it on your phone.
                </p>
              </div>
              <div className="space-y-3">
                <Button onClick={() => goToCard(true)} className="w-full h-12 bg-[#ED1C24] hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest gap-2">
                  <Download className="h-4 w-4" /> Download ID card
                </Button>
                <button type="button" onClick={() => goToCard(false)} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                  Go to my dashboard
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedImage && (
        <ImageCropper image={selectedImage} onCropComplete={uploadPhoto} onCancel={() => setSelectedImage(null)} />
      )}
      <SelfieCameraModal
        isOpen={cameraOpen}
        onCapture={(img) => { setCameraOpen(false); setSelectedImage(img); }}
        onClose={() => setCameraOpen(false)}
      />
    </>
  );
}
