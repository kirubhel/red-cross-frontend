"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Calendar, 
  Heart, 
  CreditCard,
  Search,
  ArrowLeft,
  MoreVertical,
  Trash2,
  Check,
  Filter,
  Loader2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "SUCCESS",
      title: "Membership Verified",
      message: "Your ERCS membership has been successfully verified. You can now access all premium features and your Digital ID card.",
      time: "10 minutes ago",
      isRead: false,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      id: 2,
      type: "ALERT",
      title: "Action Required: Profile Photo",
      message: "Please upload a clear profile photo to complete your Digital ID card generation.",
      time: "2 hours ago",
      isRead: false,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50"
    },
    {
      id: 3,
      type: "INFO",
      title: "Upcoming Training: First Aid",
      message: "Don't forget the First Aid training session scheduled for this Sunday at the HQ.",
      time: "5 hours ago",
      isRead: true,
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      id: 4,
      type: "DONATION",
      title: "Thank You for Your Support",
      message: "Your recent donation of 500 ETB has been received. Thank you for saving lives!",
      time: "Yesterday",
      isRead: true,
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-50"
    },
    {
      id: 5,
      type: "SYSTEM",
      title: "Membership Renewal",
      message: "Your membership is set to expire in 30 days. Renew now to avoid any interruption.",
      time: "2 days ago",
      isRead: true,
      icon: CreditCard,
      color: "text-amber-500",
      bg: "bg-amber-50"
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#ED1C24] animate-spin" />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Link 
            href="/dashboard" 
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#ED1C24] transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
             <h1 className="text-4xl font-black tracking-tighter text-black">Notifications</h1>
             {unreadCount > 0 && (
               <span className="bg-[#ED1C24] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-bounce">
                  {unreadCount} New
               </span>
             )}
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            Stay updated with your activities, missions, and system alerts
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="h-12 px-6 rounded-xl border-2 border-gray-100 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 flex items-center gap-2 transition-all"
           >
              <Check className="h-4 w-4" /> Mark all as read
           </Button>
           <button className="h-12 w-12 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-all">
              <Filter className="h-4 w-4" />
           </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-6">
             <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center">
                <Bell className="h-10 w-10 text-gray-200" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">All caught up!</h3>
                <p className="text-gray-400 font-medium">You have no new notifications at the moment.</p>
             </div>
             <Link href="/dashboard">
                <Button className="bg-black text-white px-8 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest">
                   Go to Dashboard
                </Button>
             </Link>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {notifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  "relative group bg-white p-6 md:p-8 rounded-[32px] border transition-all cursor-pointer flex gap-6 items-start",
                  notif.isRead ? "border-gray-50 opacity-60" : "border-[#ED1C24]/10 shadow-lg shadow-red-500/5"
                )}
              >
                {!notif.isRead && (
                  <div className="absolute top-8 left-0 w-1 h-8 bg-[#ED1C24] rounded-r-full" />
                )}
                
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", notif.bg)}>
                  <notif.icon className={cn("h-7 w-7", notif.color)} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                       <p className={cn("text-[10px] font-black uppercase tracking-widest", notif.color)}>{notif.type}</p>
                       <h3 className="text-xl font-black tracking-tight text-gray-900 mt-0.5">{notif.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                       <Clock className="h-3 w-3" /> {notif.time}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                    className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                   >
                      <Trash2 className="h-4 w-4" />
                   </button>
                   <button className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-all shadow-sm">
                      <MoreVertical className="h-4 w-4" />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Support */}
      <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center shadow-sm shrink-0">
               <Bell className="h-8 w-8 text-[#ED1C24]" />
            </div>
            <div>
               <h4 className="text-xl font-black tracking-tight">Notification Settings</h4>
               <p className="text-sm font-medium text-gray-400">Manage how and when you want to be notified of updates.</p>
            </div>
         </div>
         <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-gray-200 font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
            Customize Alerts
         </Button>
      </div>
    </div>
  );
}
