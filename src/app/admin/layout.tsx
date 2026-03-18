import { Sidebar } from "@/components/layout/sidebar";
import { Bell, Search, User, Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <button className="relative p-3 rounded-full hover:bg-gray-50 transition-colors text-gray-400 hover:text-black">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#ED1C24] border-2 border-white" />
            </button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-[20px] hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all select-none group">
              <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-[#ED1C24] group-hover:scale-105 transition-transform">
                <User className="h-5 w-5" />
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-sm font-black text-black leading-tight">Admin User</span>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">System Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Region */}
        <main className="flex-1 overflow-y-auto w-full relative">
           <div className="p-8 md:p-12 pb-24 mx-auto max-w-7xl">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
