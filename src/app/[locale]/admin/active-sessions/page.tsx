"use client";

import { useMemo, useState } from "react";
import { 
  Laptop, 
  Smartphone, 
  ShieldAlert, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Search,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PageHeader, tableClass, theadClass, thClass, trClass, tdClass } from "@/components/admin/page-ui";
import { REGIONS } from "@/lib/constants";

interface ActiveSession {
  id: string;
  userName: string;
  userRole: string;
  email: string;
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  region: string;
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
    region: "Addis Ababa",
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
    region: "Sidama",
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
    region: "Oromia",
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
    region: "Amhara",
    lastActive: "35 minutes ago",
    isCurrent: false
  }
];

const selectClass =
  "h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200";

const roleLabel = (r: string) => r.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [role, setRole] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleTerminate = (id: string, name: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success(`Session for ${name} terminated.`, { icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> });
  };

  const handleTerminateAllOthers = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast.success("All other sessions revoked.");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Session list updated.");
    }, 600);
  };

  const roles = useMemo(() => Array.from(new Set(sessions.map((s) => s.userRole))), [sessions]);

  const filteredSessions = sessions.filter((s) => {
    if (region && s.region !== region) return false;
    if (role && s.userRole !== role) return false;
    const q = search.trim().toLowerCase();
    return !q || s.userName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.ipAddress.includes(q);
  });

  const filtering = Boolean(region || role || search);
  const regionCount = new Set(sessions.map((s) => s.region)).size;
  const others = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Active sessions"
        description={`${sessions.length} signed in across ${regionCount} ${regionCount === 1 ? "region" : "regions"}. You are on the current session.`}
        actions={
          <>
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="h-10 gap-2 rounded-xl border-gray-200 px-4 text-xs font-bold">
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button onClick={handleTerminateAllOthers} disabled={others === 0} className="h-10 gap-2 rounded-xl bg-[#ED1C24] px-5 text-xs font-bold text-white hover:bg-black">
              <ShieldAlert className="h-4 w-4" /> Revoke all other sessions
            </Button>
          </>
        }
      />

      <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
        Sample data. Live session tracking is not connected yet, so these rows are examples and revoking a session here does not sign anyone out.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[14rem] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search name, email, city or IP"
            aria-label="Search sessions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-white pl-10 text-xs text-gray-900"
          />
        </div>
        <select aria-label="Region" value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass}>
          <option value="">All regions</option>
          {REGIONS.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
        <select aria-label="Role" value={role} onChange={(e) => setRole(e.target.value)} className={selectClass}>
          <option value="">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {roleLabel(r)}
            </option>
          ))}
        </select>
        {filtering && (
          <button
            onClick={() => {
              setSearch("");
              setRegion("");
              setRole("");
            }}
            className="inline-flex h-10 items-center gap-1 rounded-xl px-3 text-xs font-bold text-[#B5121B] hover:bg-red-50"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
        <span className="ml-auto text-xs text-gray-500">
          {filteredSessions.length} of {sessions.length} shown
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className={`${tableClass} whitespace-nowrap`}>
            <thead className={theadClass}>
              <tr className="border-b border-gray-100">
                <th className={thClass}>User</th>
                <th className={thClass}>Role</th>
                <th className={thClass}>Location and IP</th>
                <th className={thClass}>Device</th>
                <th className={thClass}>Last active</th>
                <th className={`${thClass} text-right`}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => {
                const mobile = session.device.includes("Mobile");
                const DeviceIcon = mobile ? Smartphone : Laptop;
                return (
                  <tr key={session.id} className={trClass}>
                    <td className={tdClass}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{session.userName}</span>
                        {session.isCurrent && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">This device</span>}
                      </div>
                      <div className="text-xs text-gray-500">{session.email}</div>
                    </td>
                    <td className={tdClass}>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-700">{roleLabel(session.userRole)}</span>
                    </td>
                    <td className={tdClass}>
                      {session.location.replace(", Ethiopia", "")}
                      <div className="font-mono text-xs text-gray-500">{session.ipAddress}</div>
                    </td>
                    <td className={tdClass}>
                      <span className="inline-flex items-center gap-1.5">
                        <DeviceIcon className="h-3.5 w-3.5 text-gray-400" /> {session.device}
                      </span>
                      <div className="text-xs text-gray-500">{session.browser}</div>
                    </td>
                    <td className={`${tdClass} whitespace-nowrap text-xs text-gray-600`}>
                      {session.lastActive}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      {!session.isCurrent && (
                        <Button
                          variant="outline"
                          onClick={() => handleTerminate(session.id, session.userName)}
                          className="h-8 gap-1.5 rounded-lg border-red-100 px-3 text-xs font-bold text-red-700 hover:bg-red-50 hover:text-red-800"
                          aria-label={`Terminate session for ${session.userName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Terminate
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-sm text-gray-500">
                    No sessions match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
