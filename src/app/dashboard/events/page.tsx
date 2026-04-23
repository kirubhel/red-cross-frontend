"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ChevronRight, 
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Heart,
  Award,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const eventCategories = [
  { label: "All Events", value: "all" },
  { label: "Training", value: "training" },
  { label: "Field Work", value: "field" },
  { label: "Donation", value: "donation" },
  { label: "Outreach", value: "outreach" },
];

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock events for now, ideally fetched from an API
  const events = [
    {
      id: 1,
      title: "Advanced First Aid Training",
      category: "training",
      date: "April 28, 2024",
      time: "09:00 AM - 04:00 PM",
      location: "ERCS HQ, Addis Ababa",
      attendees: 45,
      maxCapacity: 100,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      type: "Official Training"
    },
    {
      id: 2,
      title: "Annual Blood Donation Drive",
      category: "donation",
      date: "May 02, 2024",
      time: "10:00 AM - 06:00 PM",
      location: "Meskel Square, Addis Ababa",
      attendees: 120,
      maxCapacity: 500,
      image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800",
      type: "Community Event"
    },
    {
      id: 3,
      title: "Community Health Awareness",
      category: "outreach",
      date: "May 10, 2024",
      time: "08:30 AM - 01:00 PM",
      location: "Kality Sub-city Health Center",
      attendees: 28,
      maxCapacity: 50,
      image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=800",
      type: "Volunteering"
    },
    {
      id: 4,
      title: "Disaster Response Simulation",
      category: "training",
      date: "June 05, 2024",
      time: "06:00 AM - 08:00 PM",
      location: "ERCS Warehouse Complex",
      attendees: 75,
      maxCapacity: 80,
      image: "https://images.unsplash.com/photo-1502101872923-d48509bff386?auto=format&fit=crop&q=80&w=800",
      type: "Drill"
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === "all" || event.category === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#ED1C24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Link 
            href="/dashboard" 
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#ED1C24] transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black tracking-tighter text-black">Upcoming Events</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            Discover missions, trainings, and community outreach programs
          </p>
        </div>
        <Button className="bg-[#ED1C24] hover:bg-black text-white px-8 h-14 rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl shadow-red-500/20 transition-all flex items-center gap-2">
          <Plus className="h-4 w-4" /> Propose an Event
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full lg:w-auto no-scrollbar">
          {eventCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={cn(
                "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap",
                filter === cat.value 
                  ? "bg-black text-white shadow-lg" 
                  : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-black"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          <input 
            type="text" 
            placeholder="Search events, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl h-14 pl-12 pr-6 font-bold text-gray-900 focus:ring-2 focus:ring-[#ED1C24]/10 transition-all shadow-sm"
          />
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 cursor-pointer hover:text-[#ED1C24]" />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredEvents.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer flex flex-col"
          >
            {/* Image Section */}
            <div className="h-60 relative overflow-hidden">
               <img 
                 src={event.image} 
                 alt={event.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-xl">
                  <p className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest">{event.type}</p>
               </div>
               <div className="absolute bottom-4 right-4 h-12 w-12 bg-[#ED1C24] text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
               </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col space-y-6">
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#ED1C24]">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-tighter">{event.date}</span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-gray-900 group-hover:text-[#ED1C24] transition-colors leading-tight">
                    {event.title}
                  </h3>
               </div>

               <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-gray-400 text-sm font-bold">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-sm font-bold">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{event.time}</span>
                  </div>
               </div>

               {/* Attendees Progress */}
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-gray-400">Capacity</span>
                     <span className="text-black">{event.attendees} / {event.maxCapacity} joined</span>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                     <div 
                       className="h-full bg-amber-500 rounded-full" 
                       style={{ width: `${(event.attendees / event.maxCapacity) * 100}%` }}
                     />
                  </div>
               </div>

               <div className="pt-4 flex items-center justify-between">
                  <div className="flex -space-x-3">
                     {[1, 2, 3, 4].map((i) => (
                       <div key={i} className="h-9 w-9 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img src={`https://i.pravatar.cc/150?u=${i + event.id}`} alt="user" className="h-full w-full object-cover" />
                       </div>
                     ))}
                     <div className="h-9 w-9 rounded-xl border-2 border-white bg-[#ED1C24] text-white flex items-center justify-center text-[10px] font-black">
                        +{event.attendees - 4}
                     </div>
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-black text-[#ED1C24] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                     See Details <ChevronRight className="h-3 w-3" />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Banner */}
      <div className="bg-[#ED1C24] rounded-[48px] p-10 md:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="md:w-1/2 space-y-6 relative z-10">
            <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
               <Award className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">Become a <br />Humanitarian Hero</h2>
            <p className="text-lg font-medium opacity-80">Join our major volunteer convention this summer and gain certified skills in disaster management and community health.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Button className="h-16 px-10 bg-white text-[#ED1C24] hover:bg-black hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all">
                  Register for Convention
               </Button>
               <Button variant="outline" className="h-16 px-10 border-2 border-white/30 bg-transparent text-white hover:bg-white hover:text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  Learn More
               </Button>
            </div>
         </div>

         <div className="md:w-1/2 grid grid-cols-2 gap-4 relative z-10">
            {[
              { label: "Hours Saved", val: "12,400+", icon: Clock },
              { label: "Lives Impacted", val: "50,000+", icon: Heart },
              { label: "Cities Reached", val: "42", icon: MapPin },
              { label: "Active Members", val: "18k+", icon: Users },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-[32px] space-y-3">
                 <stat.icon className="h-6 w-6 opacity-60" />
                 <div>
                    <p className="text-2xl font-black">{stat.val}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
