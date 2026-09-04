"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Camera, RefreshCw, X, Check, FlipHorizontal, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelfieCameraModalProps {
  isOpen: boolean;
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

export default function SelfieCameraModal({
  isOpen,
  onCapture,
  onClose,
}: SelfieCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Stop camera media stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Start camera media stream
  const startCamera = useCallback(async () => {
    stopStream();
    setIsLoading(true);
    setCameraError(null);
    setCapturedImage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera is not supported on this browser/device.");
      }

      // Check available video devices
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoDevices.length > 1);
      } catch {
        // Ignore enumerate error if not permitted yet
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setIsLoading(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. Please allow camera access in your browser settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera device found on this system.");
      } else {
        setCameraError(err.message || "Failed to initialize camera.");
      }
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
      setCapturedImage(null);
    }
    return () => {
      stopStream();
    };
  }, [isOpen, startCamera, stopStream]);

  // Capture snapshot from active video stream
  const handleTakeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 640;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // If front camera, mirror snapshot for natural appearance
    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedImage(dataUrl);
    stopStream();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Confirm snapshot and send to cropper
  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  // Toggle front/back camera
  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[36px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh] border border-gray-100">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-[#ED1C24]">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-black">Take Profile Selfie</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">
                Digital ID Photo Capture
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-white space-y-3 max-w-xs">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
              <p className="text-xs font-bold text-gray-200">{cameraError}</p>
              <Button
                onClick={startCamera}
                variant="outline"
                className="text-xs font-bold bg-white text-black hover:bg-gray-100 rounded-xl"
              >
                Try Again
              </Button>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured selfie"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-cover ${
                  facingMode === "user" ? "scale-x-[-1]" : ""
                }`}
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-[#ED1C24]" />
                  Opening Camera...
                </div>
              )}
              {/* Selfie Frame Guide */}
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-white/40 pointer-events-none flex items-end justify-center pb-4">
                <span className="bg-black/60 text-white/90 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                  Center your face inside circle
                </span>
              </div>
            </>
          )}

          {/* Hidden Canvas for capture rendering */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls Footer */}
        <div className="p-5 bg-gray-50 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <Button
                type="button"
                onClick={handleRetake}
                variant="outline"
                className="flex-1 h-12 rounded-2xl font-bold text-xs bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" /> Retake Photo
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="flex-1 h-12 rounded-2xl font-extrabold text-xs bg-[#ED1C24] hover:bg-[#CC1820] text-white shadow-lg shadow-red-500/25"
              >
                <Check className="h-4 w-4 mr-1.5" /> Use Photo
              </Button>
            </>
          ) : (
            <>
              {hasMultipleCameras ? (
                <button
                  type="button"
                  onClick={handleToggleCamera}
                  className="h-12 w-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Switch Camera"
                >
                  <FlipHorizontal className="h-5 w-5" />
                </button>
              ) : (
                <div className="w-12" />
              )}

              {/* Big Shutter Button */}
              <button
                type="button"
                disabled={isLoading || Boolean(cameraError)}
                onClick={handleTakeSnapshot}
                className="h-16 w-16 rounded-full bg-[#ED1C24] text-white flex items-center justify-center shadow-xl shadow-red-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer border-4 border-white"
                title="Take Selfie"
              >
                <Camera className="h-7 w-7" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="h-12 px-4 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
