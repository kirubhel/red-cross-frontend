"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DonatePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home where the donation modal is now integrated
    router.replace("/?donate=true");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-ercs-red border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black uppercase tracking-widest text-xs text-black/40">Loading Secure Portal...</p>
      </div>
    </div>
  );
}


