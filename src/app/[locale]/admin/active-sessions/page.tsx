"use client";

import { useState } from "react";
import { 
  UserCheck, 
  Laptop, 
  Smartphone, 
  Globe, 
  ShieldAlert, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ActiveSession {
  id: string;
  userName: string;
  userRole: string;
  email: string;
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: "sess-1",
    userName: "Admin Officer",
    userRole: "SUPER_ADMIN",
    email: "admin@redcrosseth.org",
    ipAddress: "197.156.103.42",
    device: "Desktop (macOS)",
    browser: "Chrome 122.0",
    location: "Addis Ababa, Ethiopia",
    lastActive: "Just now",
    isCurrent: true
  },
  {
    id: "sess-2",
    userName: "Dr. Aster Bekele",
    userRole: "REGIONAL_ADMIN",
    email: "aster.b@redcrosseth.org",
    ipAddress: "196.189.12.8",
    device: "Laptop (Windows 11)",
    browser: "Edge 121.0",
    location: "Hawassa, Sidama",
    lastActive: "4 minutes ago",
    isCurrent: false
  },
  {
    id: "sess-3",
    userName: "Yonas Haile",
    userRole: "BRANCH_OFFICER",
    email: "yonas.h@redcrosseth.org",
    ipAddress: "197.156.77.19",
    device: "Mobile (Android 14)",
    browser: "Mobile Safari",
    location: "Adama, Oromia",
    lastActive: "18 minutes ago",
    isCurrent: false
  },
  {
    id: "sess-4",
    userName: "Meron Tadesse",
    userRole: "VOLUNTEER_COORDINATOR",
    email: "meron.t@redcrosseth.org",
    ipAddress: "196.188.45.101",
    device: "Desktop (Ubuntu 22.04)",
    browser: "Firefox 123.0",
    location: "Bahir Dar, Amhara",
    lastActive: "35 minutes ago",
    isCurrent: false
  }
];

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleTerminate = (id: string, name: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast.success(`Session for ${name} terminated successfully!`, {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
    });
  };

  const handleTerminateAllOthers = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
    toast.success("All other active sessions revoked successfully!");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Active session list updated.");
    }, 600);
  };

  const filteredSessions = sessions.filter(s => 
    s.userName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase()) ||
    s.ipAddress.includes(search)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-[#ED1C24] rounded-full text-xs font-black uppercase tracking-widest leading-none mb-3">
            <UserCheck className="h-3.5 w-3.5" /> Security &amp; Access Control
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Active User Sessions</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Monitor and govern authenticated staff, regional officers, and administrative sessions in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-xl border-gray-200 h-11 px-4 font-bold text-xs"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={handleTerminateAllOthers}
            className="rounded-xl bg-[#ED1C24] hover:bg-black text-white h-11 px-5 font-black text-xs uppercase tracking-wider shadow-lg shadow-red-500/10 transition-all"
          >
            <ShieldAlert className="h-4 w-4 mr-2" /> Revoke All Other Sessions
          </Button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Active</span>
          <p className="text-2xl font-black text-gray-900">{sessions.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Current Session</span>
          <p className="text-2xl font-black text-emerald-600">Active (This Device)</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Locations</span>
          <p className="text-2xl font-black text-gray-900">4 Regions</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search IP, name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 rounded-xl bg-gray-50 border-none text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredSessions.map((session) => (
            <div key={session.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  session.device.includes("Mobile") 
                    ? "bg-amber-50 text-amber-600" 
                    : "bg-blue-50 text-blue-600"
                }`}>
                  {session.device.includes("Mobile") ? <Smartphone className="h-6 w-6" /> : <Laptop className="h-6 w-6" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-gray-900">{session.userName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-600">
                      {session.userRole}
                    </span>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {session.email} · <span className="font-mono">{session.ipAddress}</span>
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 font-semibold">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-gray-400" /> {session.location}
                    </span>
                    <span>·</span>
                    <span>{session.device} ({session.browser})</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-3.5 w-3.5 text-gray-400" /> {session.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {!session.isCurrent && (
                  <Button
                    variant="outline"
                    onClick={() => handleTerminate(session.id, session.userName)}
                    className="h-10 px-4 rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold text-xs"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Terminate Session
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="p-12 text-center text-gray-400 font-medium">
              No active sessions matching your query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
