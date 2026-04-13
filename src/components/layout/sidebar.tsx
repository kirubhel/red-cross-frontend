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

const menuItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/volunteers", label: "Volunteers", icon: HandHeart },
  { href: "/admin/organizations", label: "Organizations", icon: Building2 },
  { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/news", label: "News & Media", icon: Newspaper },
  { href: "/admin/user-management", label: "User Management", icon: ShieldCheck },
  { href: "/admin/forms", label: "Form Configuration", icon: ClipboardList },
  { href: "/admin/membership-plans", label: "Membership Plans", icon: CreditCard },
  { href: "/admin/cms", label: "Landing Page CMS", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];


export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex h-full flex-col bg-gray-950 border-r border-gray-900 text-white relative z-20 transition-all duration-300",
      isCollapsed ? "w-[88px]" : "w-[280px]"
    )}>
      
      {/* Brand Header */}
      <div className={cn("flex h-24 items-center border-b border-gray-900 pb-2 pt-4 relative", isCollapsed ? "justify-center px-0" : "px-6 gap-4")}>
         <div className="bg-white p-1.5 rounded-xl shrink-0">
           <Image src="/logo.jpg" alt="ERCS" width={40} height={40} className="object-contain" />
         </div>
         
         <div className={cn("flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
          <span className="text-xl font-black tracking-tighter uppercase leading-none">ERCS</span>
          <span className="text-[9px] font-black text-[#ED1C24] uppercase tracking-[0.2em]">Ethiopia Portal</span>
         </div>
         
         <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className={cn(
             "absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors bg-gray-900 p-1.5 rounded-lg border border-gray-800 z-50",
             isCollapsed ? "-right-3" : "right-4"
           )}
         >
           {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
         </button>
      </div>

      {/* Navigation Space */}
      <nav className={cn("flex-1 space-y-3 py-8 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-300", isCollapsed ? "px-4" : "px-4")}>
        <h4 className={cn("text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 px-2 whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "h-0 opacity-0 mb-0" : "h-auto opacity-100")}>
          Main Menu
        </h4>
        
        {menuItems.map((item) => {
          // Exact match for /admin to prevent it from matching /admin/everything
          const isActive = item.href === "/admin" 
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "group flex items-center rounded-2xl transition-all duration-300",
                isCollapsed ? "justify-center p-3.5" : "justify-between px-4 py-3.5",
                isActive
                  ? "bg-[#ED1C24] text-white shadow-lg shadow-red-500/20"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-300",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-[#ED1C24]"
                )} />
                <span className={cn("text-sm font-bold whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                  {item.label}
                </span>
              </div>
              <div className={cn("overflow-hidden transition-all duration-300 shrink-0", isCollapsed ? "w-0 opacity-0" : "w-4 opacity-100")}>
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </div>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
