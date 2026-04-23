"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  User, 
  HandHeart,
  Calendar,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  History,
  Newspaper,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/volunteer", label: "Volunteering", icon: HandHeart },
  { href: "/dashboard/events", label: "Upcoming Events", icon: Calendar },
  { href: "/dashboard/donations", label: "My Donations", icon: Heart },
  { href: "/dashboard/membership", label: "Membership", icon: CreditCard },
  { href: "/dashboard/history", label: "Impact History", icon: History },
  { href: "/dashboard/news", label: "ERCS News", icon: Newspaper },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const role = localStorage.getItem("user_role");
        const profileRes = await api.get("/person/profile").catch(() => null);
        
        setUser({
          name: profileRes?.data?.first_name ? `${profileRes.data.first_name} ${profileRes.data.last_name}` : "ERCS User",
          role: role || "MEMBER"
        });
      } catch (err) {
        setUser({ name: "ERCS User", role: "MEMBER" });
      }
    };
    fetchUser();
  }, []);

  const isVolunteer = user?.role === "VOLUNTEER" || (user?.role !== "MEMBER" && user?.role !== "5" && user?.role !== 5);

  const filteredMenuItems = menuItems.filter(item => {
    if (!isVolunteer) {
      // Member only sees these
      const memberLinks = ["/dashboard", "/dashboard/profile", "/dashboard/events", "/dashboard/news", "/dashboard/notifications"];
      return memberLinks.includes(item.href);
    }
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    window.location.href = "/login";
  };

  return (
    <div className={cn(
      "flex h-full flex-col bg-white border-r border-gray-100 relative z-20 transition-all duration-300 shadow-[2px_0_10px_rgba(0,0,0,0.02)]",
      isCollapsed ? "w-[88px]" : "w-[280px]"
    )}>
      
      {/* Brand Header */}
      <div className={cn("flex h-24 items-center border-b border-gray-50 pb-2 pt-4 relative", isCollapsed ? "justify-center px-0" : "px-6 gap-4")}>
         <div className="bg-gray-50 border border-gray-100 p-1.5 rounded-xl shrink-0 shadow-sm">
           <Image src="/logo.jpg" alt="ERCS" width={40} height={40} className="object-contain" unoptimized />
         </div>
         
         <div className={cn("flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
          <span className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">ERCS</span>
          <span className="text-[9px] font-black text-[#ED1C24] uppercase tracking-[0.2em]">Member Portal</span>
         </div>
         
         <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className={cn(
             "absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ED1C24] transition-colors bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm z-50",
             isCollapsed ? "-right-3" : "right-4"
           )}
         >
           {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
         </button>
      </div>

      {/* Navigation Space */}
      <nav className={cn("flex-1 space-y-1.5 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-300", isCollapsed ? "px-3" : "px-4")}>
        <h4 className={cn("text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 px-2 whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "h-0 opacity-0 mb-0" : "h-auto opacity-100")}>
          Main Menu
        </h4>
        
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "group flex items-center rounded-2xl transition-all duration-300",
                isCollapsed ? "justify-center p-3.5" : "justify-between px-4 py-3",
                isActive
                  ? "bg-[#ED1C24] text-white shadow-md shadow-[#ED1C24]/20"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#ED1C24]"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-300",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-[#ED1C24]"
                )} />
                <span className={cn("text-sm font-bold whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                  {item.label}
                </span>
              </div>
              <div className={cn("overflow-hidden transition-all duration-300 shrink-0", isCollapsed ? "w-0 opacity-0" : "w-4 opacity-100")}>
                {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 mt-auto border-t border-gray-50 space-y-2">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 transition-all",
          isCollapsed ? "justify-center" : "px-4"
        )}>
          <div className="h-9 w-9 rounded-xl bg-[#ED1C24] text-white flex items-center justify-center shrink-0 shadow-sm">
             <User className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
               <span className="text-xs font-black text-gray-900 truncate">{user?.name || "Loading..."}</span>
               <span className="text-[9px] font-bold text-[#ED1C24] uppercase tracking-widest truncate">{user?.role}</span>
            </div>
          )}
        </div>

        <button 
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center rounded-2xl p-3 text-red-500 hover:bg-red-50 transition-all font-bold group",
            isCollapsed ? "justify-center" : "gap-4 px-4"
          )}
        >
          <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          {!isCollapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>

    </div>
  );
}
