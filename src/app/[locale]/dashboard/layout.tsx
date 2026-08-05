"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 relative overflow-y-auto focus:outline-none custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
