"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserScope } from "@/lib/auth-scope";

export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [scopeInfo, setScopeInfo] = useState<any>(null);

  useEffect(() => {
    const scope = getUserScope();
    setScopeInfo(scope);
    if (scope.isSuperAdmin) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  if (isAuthorized === null) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12">
        <div className="h-8 w-8 border-4 border-red-100 border-t-[#ED1C24] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center max-w-lg mx-auto">
        <div className="h-16 w-16 bg-red-50 text-[#ED1C24] rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-red-100">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-black tracking-tight mb-2">
          Super Admin Privileges Required
        </h2>
        <p className="text-sm font-medium text-gray-500 mb-6 leading-relaxed">
          This configuration section is reserved exclusively for National Super Administrators. Your active role is{" "}
          <strong className="text-gray-900">{scopeInfo?.scopeBadgeTitle || "Regional Admin"}</strong> (
          {scopeInfo?.scopeBadgeScope || "Restricted Jurisdiction"}).
        </p>
        <Button
          onClick={() => router.push("/admin")}
          className="h-11 px-6 rounded-2xl bg-black hover:bg-[#ED1C24] text-white font-black text-xs uppercase tracking-widest transition-colors shadow-lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
