"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Bell, 
  Settings, 
  LogOut,
  HandHeart,
  ChevronRight,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardList,
  Newspaper,
  ShieldCheck,
  Building2,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationSections = [
  {
    title: "Core Registry",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/members", label: "Members", icon: Users },
      { href: "/admin/volunteers", label: "Volunteers", icon: HandHeart },
      { href: "/admin/organizations", label: "Organizations", icon: Building2 },
      { href: "/admin/volunteer-requests", label: "Volunteer Requests", icon: ClipboardList },
      { href: "/admin/certifications", label: "Certifications", icon: ShieldCheck },
    ]
  },
  {
    title: "Operations & Finance",
    items: [
      { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/news", label: "News & Media", icon: Newspaper },
      { href: "/admin/cms", label: "Landing Page CMS", icon: LayoutDashboard },
    ]
  },
  {
    title: "Administration",
    items: [
      { href: "/admin/user-management", label: "User Management", icon: ShieldCheck },
      { href: "/admin/forms", label: "Form Configuration", icon: ClipboardList },
      { href: "/admin/membership-plans", label: "Membership Plans", icon: CreditCard },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex h-full flex-col bg-white border-r border-gray-100 relative z-20 transition-all duration-300",
      "shadow-[2px_0_10px_rgba(0,0,0,0.02)]",
      isCollapsed ? "w-[88px]" : "w-[280px]"
    )}>
      
      {/* Brand Header */}
      <div className={cn(
        "flex h-24 items-center border-b border-gray-50 pb-2 pt-4 relative",
        isCollapsed ? "justify-center px-0" : "px-6 gap-4"
      )}>
         <div className="bg-gray-50 border border-gray-100 p-1.5 rounded-xl shrink-0 shadow-sm">
           <Image
             src="/logo.png"
             alt="ERCS"
             width={40}
             height={40}
             className="object-contain"
             unoptimized
           />
         </div>
         
         <div className={cn(
           "flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300",
           isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
         )}>
          <span className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            ERCS
          </span>
          <span className="text-[9px] font-black text-[#ED1C24] uppercase tracking-[0.2em]">
            Ethiopia Portal
          </span>
         </div>
         
         <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className={cn(
             "absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ED1C24]",
             "transition-colors bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm z-50",
             isCollapsed ? "-right-3" : "right-4"
           )}
         >
           {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
         </button>
      </div>

      {/* Navigation Space */}
      <nav className="flex-1 space-y-6 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar px-4">
        {navigationSections.map((section, secIdx) => (
          <div key={secIdx} className="space-y-2">
            <h4 className={cn(
              "text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 px-3 mb-3",
              "whitespace-nowrap overflow-hidden transition-all duration-300",
              isCollapsed ? "h-0 opacity-0 mb-0" : "h-auto opacity-100"
            )}>
              {section.title}
            </h4>
            
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = item.href === "/admin" 
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "group flex items-center rounded-xl transition-all duration-200",
                      isCollapsed ? "justify-center p-3" : "justify-between px-3 py-2.5",
                      isActive
                        ? "bg-[#ED1C24] text-white shadow-sm shadow-[#ED1C24]/10"
                        : "text-gray-500 hover:bg-red-50/40 hover:text-[#ED1C24]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        isActive ? "text-white" : "text-gray-400 group-hover:text-[#ED1C24]"
                      )} />
                      <span className={cn(
                        "text-xs font-bold whitespace-nowrap overflow-hidden transition-all duration-300",
                        isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                      )}>
                        {item.label}
                      </span>
                    </div>
                    <div className={cn(
                      "overflow-hidden transition-all duration-200 shrink-0",
                      isCollapsed ? "w-0 opacity-0" : "w-4 opacity-100"
                    )}>
                      {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </div>
  );
}
