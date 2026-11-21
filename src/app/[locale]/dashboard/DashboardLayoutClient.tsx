"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { usePathname } from "@/i18n/routing";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the phone drawer after navigating, and on Escape.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="flex h-dvh bg-gray-50 overflow-hidden">
      <DashboardSidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden flex h-14 shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-2">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="member-sidebar"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-[#ED1C24]"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Image src="/logo.png" alt="" width={28} height={28} className="object-contain" unoptimized />
          <span className="text-base font-black uppercase tracking-tight text-gray-900">ERCS</span>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ED1C24]">
            {t.dashboard.memberPortal}
          </span>
        </header>
        <main className="flex-1 relative overflow-y-auto focus:outline-none custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
