"use client";

import { useEffect, useState, useRef } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { toast } from "sonner";
import { AiChatWidget } from "@/components/admin/AiChatWidget";
import api from "@/lib/api";
import { 
  Bell, 
  Search, 
  Menu, 
  User, 
  ChevronDown,
  ChevronRight,
  LogOut
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingOrgs, setPendingOrgs] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPendingOrgs = async () => {
      try {
        const res = await api.get('/organizations');
        const list = res.data.organizations || [];
        setPendingOrgs(list.filter((org: any) => org.status === 'PENDING'));
      } catch (err) {
        console.error("Failed to fetch pending organizations", err);
      }
    };
    fetchPendingOrgs();

    const interval = setInterval(fetchPendingOrgs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const streamURL = `${baseURL}/notifications/stream?token=${encodeURIComponent(token)}`;

    let eventSource: EventSource;

    const connect = () => {
      console.log("Connecting to Real-Time Notification Stream...");
      eventSource = new EventSource(streamURL);

      eventSource.onmessage = (event) => {
        try {
          const notif = JSON.parse(event.data);
          setUnreadCount((prev) => prev + 1);
          
          if (notif.type === "ALERT") {
            toast.error(notif.message, { description: new Date(notif.timestamp).toLocaleTimeString() });
          } else if (notif.type === "WARNING") {
            toast.warning(notif.message, { description: new Date(notif.timestamp).toLocaleTimeString() });
          } else {
            toast.info(notif.message, { description: new Date(notif.timestamp).toLocaleTimeString() });
          }
        } catch (err) {
          console.error("Error parsing notification", err);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        // Try to reconnect
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="flex h-24 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-8 md:px-12 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
             <button className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-black transition-colors rounded-xl hover:bg-gray-50">
               <Menu className="h-6 w-6" />
             </button>
             <h2 className="hidden text-2xl font-black text-black tracking-tighter sm:block">Overview</h2>
          </div>

          <div className="flex items-center flex-1 justify-end gap-6">
            
            {/* Search Bar */}
            <div className="relative hidden w-full max-w-sm md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search resources, ID, names..." 
                className="h-12 w-full pl-12 pr-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/10 transition-shadow"
              />
            </div>

            <div className="h-8 w-px bg-gray-100 hidden sm:block" />

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => {
                  setUnreadCount(0);
                  setShowNotifDropdown(!showNotifDropdown);
                }}
                className="relative p-3 rounded-full hover:bg-gray-50
                  transition-colors text-gray-400 hover:text-black
                  cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {(unreadCount > 0 || pendingOrgs.length > 0) && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full
                    bg-[#ED1C24] border-2 border-white text-[8px] font-bold
                    text-white flex items-center justify-center"
                  >
                    {unreadCount || pendingOrgs.length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white
                  rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]
                  border border-gray-100 p-4 z-50 animate-in fade-in
                  slide-in-from-top-2 duration-200"
                >
                  <div className="flex items-center justify-between border-b
                    border-gray-50 pb-2 mb-3"
                  >
                    <span className="text-xs font-black text-black uppercase
                      tracking-wider"
                    >
                      Notifications
                    </span>
                    {pendingOrgs.length > 0 && (
                      <span className="bg-red-50 text-[#ED1C24] text-[9px]
                        font-black px-2 py-0.5 rounded-full uppercase
                        tracking-wider"
                      >
                        {pendingOrgs.length} pending
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {pendingOrgs.length > 0 ? (
                      pendingOrgs.map((org: any) => (
                        <div 
                          key={org.id} 
                          onClick={() => {
                            setShowNotifDropdown(false);
                            window.location.href = "/admin/organizations";
                          }}
                          className="p-3 rounded-xl bg-red-50/50 hover:bg-red-50
                            border border-transparent hover:border-red-100/50
                            transition-all cursor-pointer flex gap-3
                            items-start"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white flex
                            items-center justify-center border border-red-50
                            text-[#ED1C24] shrink-0 font-black text-xs"
                          >
                            ORG
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-black
                              leading-snug truncate"
                            >
                              Approval Required
                            </p>
                            <p className="text-[10px] text-gray-500 font-bold
                              leading-normal truncate"
                            >
                              Organization &ldquo;{org.name}&rdquo; is waiting for approval
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-xs font-bold text-gray-400">
                          No notifications present
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile */}
            <div className="relative group/profile">
              <div className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all select-none group">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 text-[#ED1C24] group-hover:scale-105 transition-transform shadow-inner shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden items-center gap-2.5 sm:flex">
                  <span className="text-xs font-black text-black leading-none">Admin User</span>
                  <div className="h-3 w-px bg-gray-200" />
                  <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase flex items-center gap-1 leading-none mt-px">
                    System Admin <ChevronRight className="h-3 w-3 text-gray-300 group-hover:text-[#ED1C24] transition-colors ml-0.5" />
                  </span>
                </div>
              </div>

              {/* Account Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-1 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible translate-y-2 group-hover/profile:translate-y-0 transition-all z-50 overflow-hidden">
                  <button 
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-gray-500 hover:text-[#ED1C24] hover:bg-red-50/50 transition-all text-xs font-bold border-l-2 border-transparent hover:border-[#ED1C24]"
                  >
                    <div className="h-6 w-6 rounded-md bg-gray-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-colors">
                      <LogOut className="h-3 w-3" /> 
                    </div>
                    Sign Out
                  </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Region */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full relative">
           <div className="p-4 md:p-6 pb-20 mx-auto max-w-[1920px]">
              {children}
           </div>
        </main>
        
        {/* AI Chat Assistant Widget */}
        <AiChatWidget />
      </div>
    </div>
  );
}
