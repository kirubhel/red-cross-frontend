"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ShieldCheck,
  CheckCircle2,
  Share2,
  Sparkles,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type EventItem = {
  id: string;
  title: string;
  category: "training" | "field" | "donation" | "outreach" | "youth";
  categoryLabel: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  attendees: number;
  maxCapacity: number;
  image: string;
  type: string;
  description: string;
  organizer: string;
  prerequisites?: string;
  certification?: string;
};

const ERCS_STATIC_EVENTS: EventItem[] = [
  {
    id: "ercs-ev-01",
    title: "World Red Cross & Red Crescent Day 2026 Celebration",
    category: "outreach",
    categoryLabel: "Special Gathering",
    date: "May 08, 2026",
    time: "08:30 AM - 04:30 PM",
    location: "Addis Ababa",
    venue: "ERCS National Headquarters, Ras Desta Damtew St",
    attendees: 380,
    maxCapacity: 500,
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
    type: "National Commemoration",
    description: "Annual commemoration honoring humanitarian service, international volunteerism, and community solidarity across all Ethiopian branches.",
    organizer: "ERCS Youth & Volunteer Directorate",
    certification: "Commemorative Participation Certificate"
  },
  {
    id: "ercs-ev-02",
    title: "National Emergency Blood Donation Drive",
    category: "donation",
    categoryLabel: "Blood Drive",
    date: "June 14, 2026",
    time: "08:00 AM - 06:00 PM",
    location: "Meskel Square, Addis Ababa",
    venue: "National Blood Bank Service Pavilion",
    attendees: 215,
    maxCapacity: 400,
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800",
    type: "Public Health Campaign",
    description: "Multi-branch emergency blood donation drive to support critical trauma centers and maternity hospitals throughout the country.",
    organizer: "ERCS Health & Care Department in partnership with NBBS",
    certification: "Donor Hero Recognition Pin"
  },
  {
    id: "ercs-ev-03",
    title: "Standard First Aid & CPR Certification Workshop",
    category: "training",
    categoryLabel: "Training Workshop",
    date: "July 04, 2026",
    time: "09:00 AM - 05:00 PM",
    location: "Bishoftu / Oromia",
    venue: "ERCS Regional Training Center",
    attendees: 42,
    maxCapacity: 50,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    type: "Accredited Training",
    description: "Comprehensive hands-on training covering trauma management, CPR, airway obstruction, burn treatment, and psychological first aid.",
    organizer: "ERCS First Aid Training Unit",
    certification: "2-Year Official First Aid Certificate",
    prerequisites: "Active Member or Registered Volunteer"
  },
  {
    id: "ercs-ev-04",
    title: "Disaster Preparedness & Flood Rescue Simulation Drill",
    category: "field",
    categoryLabel: "Emergency Drill",
    date: "August 12, 2026",
    time: "06:30 AM - 03:00 PM",
    location: "Adama Regional Hub",
    venue: "Awash Basin Contingency Grounds",
    attendees: 88,
    maxCapacity: 100,
    image: "https://images.unsplash.com/photo-1502101872923-d48509bff386?auto=format&fit=crop&q=80&w=800",
    type: "Field Exercise",
    description: "Full-scale multi-agency disaster simulation testing emergency rapid response teams, evacuation routes, triage zones, and shelter setup.",
    organizer: "ERCS Disaster Preparedness & Prevention (DPP) Department",
    certification: "Rapid Response Team Endorsement"
  },
  {
    id: "ercs-ev-05",
    title: "Community Health & Water Sanitation Campaign (WASH)",
    category: "outreach",
    categoryLabel: "Community Outreach",
    date: "September 02, 2026",
    time: "09:00 AM - 02:00 PM",
    location: "Akaki Kality Sub-City",
    venue: "Woreda 03 Community Center",
    attendees: 64,
    maxCapacity: 120,
    image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=800",
    type: "Volunteering Action",
    description: "Door-to-door hygiene promotion, water purification tablet distribution, and sanitation education for vulnerable households.",
    organizer: "Addis Ababa Branch Volunteer Committee",
    certification: "Community Impact Credit (6 Hours)"
  },
  {
    id: "ercs-ev-06",
    title: "Youth Humanitarian Leadership & Climate Forum",
    category: "youth",
    categoryLabel: "Youth & Climate",
    date: "October 18, 2026",
    time: "09:30 AM - 04:00 PM",
    location: "Hawassa, Sidama",
    venue: "Lake View Humanitarian Assembly Hall",
    attendees: 110,
    maxCapacity: 150,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
    type: "Leadership Forum",
    description: "Empowering young humanitarian leaders with climate resilience strategies, green tree planting initiatives, and digital community mobilization.",
    organizer: "ERCS National Youth Council",
    certification: "Youth Ambassador Credential"
  }
];

const EVENT_CATEGORIES = [
  { label: "All Events", value: "all" },
  { label: "Training & CPR", value: "training" },
  { label: "Emergency Drills", value: "field" },
  { label: "Blood Drives", value: "donation" },
  { label: "Community Outreach", value: "outreach" },
  { label: "Youth & Climate", value: "youth" },
];

export default function EventsPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const filteredEvents = useMemo(() => {
    return ERCS_STATIC_EVENTS.filter((event) => {
      const matchesFilter = filter === "all" || event.category === filter;
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  const handleRegister = (event: EventItem) => {
    setIsRegistering(true);
    setTimeout(() => {
      setRegisteredEvents((prev) => [...prev, event.id]);
      setIsRegistering(false);
      setSelectedEvent(null);
      toast.success(`Successfully registered for ${event.title}!`, {
        description: `Your attendance has been confirmed for ${event.date} at ${event.location}.`,
      });
    }, 600);
  };

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
            <Calendar className="h-3.5 w-3.5" /> Official Event Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Humanitarian <span className="text-[#ED1C24]">Events & Drills</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm max-w-2xl">
            Join national campaigns, emergency response simulations, first aid workshops, and volunteer mobilization gatherings.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center font-black">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Events</p>
              <p className="text-base font-black text-black leading-none">{ERCS_STATIC_EVENTS.length}</p>
            </div>
          </div>

          <div className="px-4 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-black">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">My RSVPs</p>
              <p className="text-base font-black text-green-600 leading-none">{registeredEvents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events by name, location, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 bg-gray-50/70 text-black border-gray-200 rounded-2xl text-xs font-semibold focus:border-[#ED1C24]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar-small">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                filter === cat.value
                  ? "bg-black text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, idx) => {
          const isRegistered = registeredEvents.includes(event.id);
          const percentFull = Math.round((event.attendees / event.maxCapacity) * 100);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-red-100 transition-all flex flex-col overflow-hidden group"
            >
              {/* Event Image Banner */}
              <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                
                {/* Category & Status Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider border border-white/10">
                    {event.categoryLabel}
                  </span>

                  {isRegistered && (
                    <span className="px-2.5 py-1 rounded-lg bg-green-500 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="h-3 w-3" /> Registered
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-300">
                    {event.type}
                  </span>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-black text-black tracking-tight leading-snug group-hover:text-[#ED1C24] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Key Metadata */}
                <div className="space-y-2 text-xs font-semibold text-gray-600 pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#ED1C24] shrink-0" />
                    <span>{event.date} • {event.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#ED1C24] shrink-0" />
                    <span className="truncate">{event.location} ({event.venue})</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <Users className="h-3.5 w-3.5 text-blue-500" />
                      <span>{event.attendees + (isRegistered ? 1 : 0)} / {event.maxCapacity} Confirmed</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-400">{percentFull}% Full</span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        percentFull > 85 ? "bg-[#ED1C24]" : "bg-green-500"
                      )} 
                      style={{ width: `${Math.min(100, percentFull)}%` }} 
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    onClick={() => setSelectedEvent(event)}
                    variant="outline"
                    className="flex-1 h-10 rounded-xl text-xs font-bold border-gray-200 hover:bg-gray-50"
                  >
                    View Details
                  </Button>

                  <Button
                    onClick={() => {
                      if (isRegistered) {
                        toast.info("You are already registered for this event.");
                      } else {
                        setSelectedEvent(event);
                      }
                    }}
                    className={cn(
                      "h-10 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                      isRegistered
                        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        : "bg-[#ED1C24] hover:bg-black text-white shadow-md"
                    )}
                  >
                    {isRegistered ? "Going ✓" : "RSVP"}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* EVENT DETAIL / RSVP MODAL */}
      <AnimatePresence>
        {selectedEvent && (() => {
          const isRegistered = registeredEvents.includes(selectedEvent.id);

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto"
              >
                {/* Banner */}
                <div className="h-44 w-full relative bg-gray-100">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 hover:bg-black text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#ED1C24] text-white text-[9px] font-black uppercase tracking-wider">
                      {selectedEvent.categoryLabel}
                    </span>
                    <h3 className="text-xl font-black tracking-tight leading-tight mt-1.5">
                      {selectedEvent.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Date & Time</p>
                      <p className="font-bold text-black">{selectedEvent.date}</p>
                      <p className="text-gray-500 font-medium text-[11px]">{selectedEvent.time}</p>
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Venue</p>
                      <p className="font-bold text-black truncate">{selectedEvent.location}</p>
                      <p className="text-gray-500 font-medium text-[11px] truncate">{selectedEvent.venue}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-black">About This Event</h4>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      {selectedEvent.description}
                    </p>
                  </div>

                  {/* Organizer & Certification */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="font-bold text-gray-500">Organized By:</span>
                      <span className="font-black text-black">{selectedEvent.organizer}</span>
                    </div>

                    {selectedEvent.certification && (
                      <div className="flex items-center justify-between text-xs p-3 bg-red-50/60 rounded-xl border border-red-100">
                        <span className="font-bold text-[#ED1C24] flex items-center gap-1">
                          <Award className="h-3.5 w-3.5" /> Award / Credit:
                        </span>
                        <span className="font-black text-red-900">{selectedEvent.certification}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedEvent(null)}
                      className="h-11 px-5 rounded-xl font-bold text-xs"
                    >
                      Close
                    </Button>

                    <Button
                      onClick={() => handleRegister(selectedEvent)}
                      disabled={isRegistering || isRegistered}
                      className={cn(
                        "h-11 px-7 rounded-xl font-black text-xs uppercase tracking-wider transition-all",
                        isRegistered
                          ? "bg-green-600 text-white cursor-default"
                          : "bg-[#ED1C24] hover:bg-black text-white shadow-lg shadow-red-500/20"
                      )}
                    >
                      {isRegistered ? "Already Registered ✓" : isRegistering ? "Confirming RSVP..." : "Confirm My Attendance"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
