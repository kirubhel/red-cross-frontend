"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Plus, Trash2, Save, XCircle,
  CheckCircle2, UserX, User, Users, Search, RefreshCw, X,
  Eye, EyeOff, LayoutDashboard, HandHeart, Building2,
  ClipboardList, BarChart3, CreditCard, Bell, Newspaper,
  Settings, MapPin, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type SystemUser = {
  id: string;
  email: string;
  phone_number: string;
  role: string;
  region_id: number;
  zone_id: number;
  woreda_id: number;
  branch_id: number;
  status: string;
  created_at: string;
};

type NewUserForm = {
  email: string;
  phone_number: string;
  password: string;
  role: number;
  region: number;
  zone: number;
  woreda: number;
  branch: number;
};

const ROLES = [
  { label: "Super Admin", value: 1 },
  { label: "Regional Admin", value: 2 },
  { label: "Zonal Admin", value: 3 },
  { label: "Woreda Admin", value: 4 },
  { label: "Volunteer", value: 5 },
  { label: "Member", value: 6 },
  { label: "Branch Officer", value: 7 },
];

const ROLE_LABELS: Record<string | number, string> = {
  1: "Super Admin",
  2: "Regional Admin",
  3: "Zonal Admin",
  4: "Woreda Admin",
  5: "Volunteer",
  6: "Member",
  7: "Branch Officer",
  "ROLE_super_admin": "Super Admin",
  "ROLE_regional_admin": "Regional Admin",
  "ROLE_zonal_admin": "Zonal Admin",
  "ROLE_woreda_admin": "Woreda Admin",
  "ROLE_volunteer": "Volunteer",
  "ROLE_member": "Member",
  "ROLE_branch_officer": "Branch Officer",
  "SUPER_ADMIN": "Super Admin",
  "REGIONAL_ADMIN": "Regional Admin",
  "VOLUNTEER": "Volunteer",
  "MEMBER": "Member",
  "BRANCH_OFFICER": "Branch Officer",
};


const REGIONS = [
  { label: "South Ethiopia", value: 14 },
  { label: "Addis Ababa", value: 1 },
  { label: "Dire Dawa", value: 2 },
  { label: "Tigray", value: 3 },
  { label: "Afar", value: 4 },
  { label: "Amhara", value: 5 },
  { label: "Oromia", value: 6 },
  { label: "Somali", value: 7 },
  { label: "Benishangul Gumz", value: 8 },
  { label: "Central Ethiopia", value: 9 },
  { label: "Gambela", value: 10 },
  { label: "Harari", value: 11 },
  { label: "Sidama", value: 12 },
  { label: "South West Ethiopia", value: 13 },
];

const DEFAULT_FORM: NewUserForm = {
  email: "",
  phone_number: "",
  password: "",
  role: 5,
  region: 14,
  zone: 0,
  woreda: 0,
  branch: 0,
};

const MODULE_PERMISSIONS = [
  { id: "OVERVIEW", label: "Overview", icon: LayoutDashboard },
  { id: "MEMBERS", label: "Members", icon: Users },
  { id: "VOLUNTEERS", label: "Volunteers", icon: HandHeart },
  { id: "ORGANIZATIONS", label: "Organizations", icon: Building2 },
  { id: "VOLUNTEER_REQUESTS", label: "Volunteer Requests", icon: ClipboardList },
  { id: "CERTIFICATIONS", label: "Certifications", icon: ShieldCheck },
  { id: "REPORTS", label: "Reports & Analytics", icon: BarChart3 },
  { id: "PAYMENTS", label: "Payments", icon: CreditCard },
  { id: "NOTIFICATIONS", label: "Notifications", icon: Bell },
  { id: "NEWS", label: "News & Media", icon: Newspaper },
  { id: "USER_MANAGEMENT", label: "User Management", icon: ShieldCheck },
  { id: "FORMS", label: "Form Configuration", icon: ClipboardList },
  { id: "MEMBERSHIP_PLANS", label: "Membership Plans", icon: CreditCard },
  { id: "CMS", label: "Landing Page CMS", icon: LayoutDashboard },
  { id: "SETTINGS", label: "Settings", icon: Settings },
];

const ROLE_COLORS: Record<string | number, string> = {
  1: "bg-red-100 text-red-700",
  2: "bg-orange-100 text-orange-700",
  7: "bg-blue-100 text-blue-700",
  5: "bg-green-100 text-green-700",
  6: "bg-gray-100 text-gray-700",
  "ROLE_super_admin": "bg-red-100 text-red-700",
  "SUPER_ADMIN": "bg-red-100 text-red-700",
  "ROLE_regional_admin": "bg-orange-100 text-orange-700",
  "REGIONAL_ADMIN": "bg-orange-100 text-orange-700",
  "ROLE_branch_officer": "bg-blue-100 text-blue-700",
  "BRANCH_OFFICER": "bg-blue-100 text-blue-700",
  "ROLE_volunteer": "bg-green-100 text-green-700",
  "VOLUNTEER": "bg-green-100 text-green-700",
  "ROLE_member": "bg-gray-100 text-gray-700",
  "MEMBER": "bg-gray-100 text-gray-700",
};

const ALL_COUNTRY_CODES = getCountries().map(country => ({
  code: `+${getCountryCallingCode(country)}`,
  name: (en as any)[country] || country
}));

export default function UserManagementPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [form, setForm] = useState<NewUserForm>({ ...DEFAULT_FORM });
  const [saving, setSaving] = useState(false);
  const [countryCode, setCountryCode] = useState("+251");
  const [showPassword, setShowPassword] = useState(false);
  const [editRole, setEditRole] = useState<number>(5);
  const [editStatus, setEditStatus] = useState<string>("ACTIVE");
  const [activeTab, setActiveTab] = useState<"ADMIN" | "MEMBER">("ADMIN");
  const [zones, setZones] = useState<any[]>([]);
  const [woredas, setWoredas] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filterRegion, setFilterRegion] = useState<number>(0);
  const [filterZone, setFilterZone] = useState<number>(0);
  const [filterWoreda, setFilterWoreda] = useState<number>(0);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/person/profile");
      setCurrentUser(res.data?.person);
      if (res.data?.person) {
        setForm(f => ({
          ...f,
          region: res.data.person.region_id || 14,
          zone: res.data.person.zone_id || 0,
          woreda: res.data.person.woreda_id || 0,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      const [zRes, wRes] = await Promise.all([
        api.get("/location/zones"),
        api.get("/location/woredas")
      ]);
      setZones(zRes.data?.zones || []);
      setWoredas(wRes.data?.woredas || []);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  }, []);

  useEffect(() => { fetchLocations(); fetchProfile(); }, [fetchLocations, fetchProfile]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/users?page=1&page_size=100";
      if (currentUser?.role !== "SUPER_ADMIN" && currentUser?.role !== 1) {
          if (currentUser?.region_id) url += `&region_id=${currentUser.region_id}`;
          if (currentUser?.zone_id) url += `&zone_id=${currentUser.zone_id}`;
          if (currentUser?.woreda_id) url += `&woreda_id=${currentUser.woreda_id}`;
          if (currentUser?.branch_id) url += `&branch_id=${currentUser.branch_id}`;
      } else {
          if (filterRegion > 0) url += `&region_id=${filterRegion}`;
          if (filterZone > 0) url += `&zone_id=${filterZone}`;
          if (filterWoreda > 0) url += `&woreda_id=${filterWoreda}`;
      }
      const res = await api.get(url);
      if (res.data?.users) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }
    } catch {
      toast.error("Failed to load users.", { icon: <XCircle className="h-5 w-5 text-[#ED1C24]" /> });
    } finally {
      setLoading(false);
    }
  }, [currentUser, filterRegion, filterZone, filterWoreda]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreateUser = async () => {
    if (!form.email || !form.password) {
      toast.error("Email and password are required.");
      return;
    }
    setSaving(true);
    try {
      // Normalize: strip leading 0s and duplicate country code
      const cleanPhone = form.phone_number.replace(/^0+/, "").replace(countryCode, "");
      const finalPhone = `${countryCode}${cleanPhone}`;

      await api.post("/users/create", {
        email: form.email,
        phone_number: finalPhone,
        password: form.password,
        role: form.role,
        region: form.region,
        zone_id: form.zone,
        woreda_id: form.woreda,
        branch_id: form.branch,
      });
      toast.success("User created successfully.", { icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> });
      setShowCreate(false);
      setForm({ ...DEFAULT_FORM });
      fetchUsers();
    } catch {
      toast.error("Failed to create user.", { icon: <XCircle className="h-5 w-5 text-[#ED1C24]" /> });
    } finally {
      setSaving(false);
    }
  };

  const handleSelectUser = (user: SystemUser) => {
    setSelectedUser(user);
    // Try matching by value first (if it's already a role number)
    const roleByVal = ROLES.find(r => r.value === Number(user.role));
    if (roleByVal) {
      setEditRole(roleByVal.value);
    } else {
      // Fallback to label match
      const label = ROLE_LABELS[user.role] || user.role;
      setEditRole(ROLES.find(r => r.label === label)?.value ?? 5);
    }
    setEditStatus(user.status || "ACTIVE");
    setShowCreate(false);
  };


  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await api.put(`/users/${selectedUser.id}`, {
        id: selectedUser.id,
        role: editRole,
        region_id: selectedUser.region_id,
        zone_id: selectedUser.zone_id,
        woreda_id: selectedUser.woreda_id,
        branch_id: selectedUser.branch_id,
        status: editStatus,
      });
      toast.success("User updated successfully.", { icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> });
      setSelectedUser(null);
      fetchUsers();
    } catch {
      toast.error("Failed to update user.", { icon: <XCircle className="h-5 w-5 text-[#ED1C24]" /> });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted.", { icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> });
      if (selectedUser?.id === id) setSelectedUser(null);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user.", { icon: <XCircle className="h-5 w-5 text-[#ED1C24]" /> });
    }
  };

  const filtered = users.filter(u => {
    const isSearchMatch = u.email?.toLowerCase().includes(search.toLowerCase()) || 
                          u.phone_number?.includes(search);
    
    // Role values 5 and 6 are Volunteer and Member, 8 is Organization
    const roleVal = Number(u.role);
    const isVolunteerOrMember = roleVal === 5 || roleVal === 6 || u.role === "VOLUNTEER" || u.role === "MEMBER";
    const isOrg = roleVal === 8 || u.role === "ORGANIZATION";
    
    if (isOrg) return false; // Explicitly hide organizations as requested

    if (activeTab === "ADMIN") return isSearchMatch && !isVolunteerOrMember;
    return isSearchMatch && isVolunteerOrMember;
  });

  return (
    <div className="space-y-6 w-full max-w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-xl space-y-1.5">
          <h1 className="text-3xl font-black text-black tracking-tighter leading-none">
            User <span className="text-[#ED1C24]">Management</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm leading-snug">
            Create admin users, assign roles and permissions, and manage access across all modules.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={fetchUsers}
            variant="outline"
            className="h-10 rounded-xl px-5 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 border-gray-200"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Refresh
          </Button>
          <Button
            onClick={() => { setShowCreate(true); setSelectedUser(null); setForm({ ...DEFAULT_FORM }); }}
            className="h-10 rounded-xl px-5 font-black text-[10px] uppercase tracking-widest bg-[#ED1C24] hover:bg-black text-white transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Create User
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* User List Panel */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tab Switcher */}
          <div className="flex p-1 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setActiveTab("ADMIN")}
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                activeTab === "ADMIN" ? "bg-white text-[#ED1C24] shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Staff & Admins
            </button>
            <button
              onClick={() => setActiveTab("MEMBER")}
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                activeTab === "MEMBER" ? "bg-white text-[#ED1C24] shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Members & Volunteers
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by email or phone..."
              className="pl-10 h-10 rounded-xl bg-white border-gray-200 text-sm font-medium text-black focus:ring-1 focus:ring-red-500/20"
            />
          </div>

          <div className="bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Filters</span>
              {(filterRegion > 0 || filterZone > 0 || filterWoreda > 0) && (
                <button 
                  onClick={() => { setFilterRegion(0); setFilterZone(0); setFilterWoreda(0); }}
                  className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={filterRegion}
                onChange={e => { setFilterRegion(Number(e.target.value)); setFilterZone(0); setFilterWoreda(0); }}
                className="h-8 rounded-lg bg-white border border-gray-100 px-2 text-[10px] font-bold text-gray-600 focus:ring-1 focus:ring-red-500/20 appearance-none"
              >
                <option value={0}>Region</option>
                {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>

              <select
                value={filterZone}
                onChange={e => { setFilterZone(Number(e.target.value)); setFilterWoreda(0); }}
                className="h-8 rounded-lg bg-white border border-gray-100 px-2 text-[10px] font-bold text-gray-600 focus:ring-1 focus:ring-red-500/20 appearance-none"
              >
                <option value={0}>Zone</option>
                {zones.filter(z => filterRegion === 0 || z.region_id === filterRegion).map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>

              <select
                value={filterWoreda}
                onChange={e => setFilterWoreda(Number(e.target.value))}
                className="h-8 rounded-lg bg-white border border-gray-100 px-2 text-[10px] font-bold text-gray-600 focus:ring-1 focus:ring-red-500/20 appearance-none"
              >
                <option value={0}>Woreda</option>
                {woredas.filter(w => filterZone === 0 || w.zone_id === filterZone).map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {loading ? (
              <div className="h-24 flex items-center justify-center bg-gray-50 rounded-2xl">
                <div className="h-6 w-6 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <ShieldCheck className="h-8 w-8 text-gray-300 mx-auto mb-2 opacity-50" />
                <p className="font-bold text-xs text-gray-400">No users found.</p>
              </div>
            ) : (
              filtered.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={cn(
                    "group cursor-pointer p-4 rounded-xl border transition-all duration-200 relative",
                    selectedUser?.id === user.id
                      ? "bg-black border-black text-white shadow-md scale-[1.01]"
                      : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                        selectedUser?.id === user.id ? "bg-white/10" : "bg-gray-100"
                      )}>
                        <User className={cn("h-4 w-4", selectedUser?.id === user.id ? "text-white" : "text-gray-500")} />
                      </div>
                      <div className="min-w-0">
                        <p className={cn("font-black truncate text-xs", selectedUser?.id === user.id ? "text-white" : "text-black")}>
                          {user.email || user.phone_number || "Unknown"}
                        </p>
                        <span className={cn(
                          "inline-block mt-0.5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md",
                          selectedUser?.id === user.id
                            ? "bg-white/10 text-white"
                            : (ROLE_COLORS[user.role] || "bg-gray-100 text-gray-600")
                        )}>
                          {ROLE_LABELS[user.role] || user.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md",
                        user.status === "ACTIVE"
                          ? selectedUser?.id === user.id ? "bg-green-400/20 text-green-300" : "bg-green-50 text-green-600"
                          : selectedUser?.id === user.id ? "bg-red-400/20 text-red-300" : "bg-red-50 text-red-500"
                      )}>
                        {user.status}
                      </span>
                      <button
                        onClick={e => handleDeleteUser(e, user.id)}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100",
                          selectedUser?.id === user.id ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-500"
                        )}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {showCreate ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-black tracking-tighter">Create User</h3>
                        <p className="text-gray-400 font-medium text-xs">Add a new admin or staff member.</p>
                      </div>
                    </div>
                    <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl hover:bg-gray-50">
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Email</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="admin@ercs.org"
                        className="h-10 rounded-xl bg-gray-50 text-black border-gray-100 font-bold text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                       <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Phone</Label>
                       <div className="flex gap-2">
                           <select 
                               value={countryCode} 
                               onChange={(e) => setCountryCode(e.target.value)}
                               className="w-24 h-10 rounded-xl bg-gray-50 text-black border border-gray-100 font-bold text-[10px] appearance-none px-2 focus:ring-1 focus:ring-red-500/20"
                           >
                               {ALL_COUNTRY_CODES.sort((a, b) => (a.name || "").localeCompare(b.name || "")).map((c, i) => (
                                   <option key={`${c.code}-${i}`} value={c.code} className="bg-white">{c.name} ({c.code})</option>
                               ))}
                           </select>
                           <Input
                               value={form.phone_number}
                               onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))}
                               placeholder="912345678"
                               className="flex-1 h-10 rounded-xl bg-gray-50 text-black border-gray-100 font-bold text-sm"
                           />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                          placeholder="Minimum 8 characters"
                          className="h-10 rounded-xl bg-gray-50 text-black border-gray-100 font-bold text-sm pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Role</Label>
                      <select
                        value={form.role}
                        onChange={e => setForm(f => ({ ...f, role: Number(e.target.value) }))}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-100 px-3 font-bold text-sm focus:ring-1 focus:ring-red-500/20 appearance-none"
                      >
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Region</Label>
                      <select
                        value={form.region}
                        onChange={e => setForm(f => ({ ...f, region: Number(e.target.value), zone: 0, woreda: 0 }))}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-100 px-3 font-bold text-sm focus:ring-1 focus:ring-red-500/20 appearance-none"
                      >
                        {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Zone</Label>
                      <select
                        value={form.zone}
                        onChange={e => setForm(f => ({ ...f, zone: Number(e.target.value), woreda: 0 }))}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-100 px-3 font-bold text-sm focus:ring-1 focus:ring-red-500/20 appearance-none"
                      >
                        <option value={0}>All Zones</option>
                        {zones.filter(z => z.region_id === form.region).map(z => (
                          <option key={z.id} value={z.id}>{z.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Woreda</Label>
                      <select
                        value={form.woreda}
                        onChange={e => setForm(f => ({ ...f, woreda: Number(e.target.value) }))}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-100 px-3 font-bold text-sm focus:ring-1 focus:ring-red-500/20 appearance-none"
                      >
                        <option value={0}>All Woredas</option>
                        {woredas.filter(w => w.zone_id === form.zone).map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Branch (If applicable)</Label>
                      <Input
                        type="number"
                        value={form.branch || ""}
                        onChange={e => setForm(f => ({ ...f, branch: Number(e.target.value) }))}
                        placeholder="Branch ID"
                        className="h-10 rounded-xl bg-gray-50 text-black border-gray-100 font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Module Access Permissions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {MODULE_PERMISSIONS.map(m => (
                        <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                          <div className="flex items-center gap-1.5">
                            <m.icon className="h-3 w-3 text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-600 truncate">{m.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateUser}
                    disabled={saving}
                    className="w-full h-10 rounded-xl font-black text-xs uppercase tracking-widest bg-[#ED1C24] hover:bg-black text-white transition-all"
                  >
                    {saving ? "Creating..." : <><Plus className="mr-2 h-3.5 w-3.5" /> Create User</>}
                  </Button>
                </div>
              </motion.div>
            ) : selectedUser ? (
              <motion.div
                key={`edit-${selectedUser.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-black tracking-tighter">{selectedUser.email || selectedUser.phone_number}</h3>
                        <p className="text-gray-400 font-medium text-[10px]">User ID: {selectedUser.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="p-2 rounded-xl hover:bg-gray-50">
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Role</Label>
                      <select
                        value={editRole}
                        onChange={e => setEditRole(Number(e.target.value))}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-100 px-3 font-bold text-sm focus:ring-1 focus:ring-red-500/20 appearance-none"
                      >
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Status</Label>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value)}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-100 px-3 font-bold text-sm focus:ring-1 focus:ring-red-500/20 appearance-none"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Region</Label>
                      <select
                        value={selectedUser.region_id}
                        disabled
                        className="flex h-10 w-full rounded-xl bg-gray-200 text-gray-500 border border-gray-100 px-3 font-bold text-sm appearance-none"
                      >
                        {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Zone</Label>
                      <select
                        value={selectedUser.zone_id}
                        disabled
                        className="flex h-10 w-full rounded-xl bg-gray-200 text-gray-500 border border-gray-100 px-3 font-bold text-sm appearance-none"
                      >
                        <option value={0}>All Zones</option>
                        {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Permissions section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Module Permissions</Label>
                      <span className="text-[8px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase">Customizable Access</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {MODULE_PERMISSIONS.map(m => (
                        <div key={m.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all group">
                          <input 
                            type="checkbox" 
                            checked={[1,2].includes(editRole)} // Mock logic for now
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500" 
                          />
                          <div className="flex items-center gap-2 min-w-0">
                            <m.icon className="h-3.5 w-3.5 text-gray-400 group-hover:text-red-500 transition-colors shrink-0" />
                            <span className="text-[10px] font-bold text-gray-600 truncate">{m.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Permissions info box */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Role Permissions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {editRole === 1 && ["USERS_MANAGE","MEMBERS_WRITE","MEMBERS_READ","FINANCE_MANAGE","MISSIONS_MANAGE"].map(p => (
                        <span key={p} className="px-2 py-0.5 bg-red-50 text-red-600 text-[8px] font-black uppercase tracking-wider rounded-md">{p}</span>
                      ))}
                      {editRole === 2 && ["MEMBERS_READ","MISSIONS_MANAGE"].map(p => (
                        <span key={p} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-wider rounded-md">{p}</span>
                      ))}
                      {editRole === 7 && ["MEMBERS_READ","MEMBERS_WRITE"].map(p => (
                        <span key={p} className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-wider rounded-md">{p}</span>
                      ))}
                      {[3,4,5,6].includes(editRole) && (
                        <span className="px-2 py-0.5 bg-white border border-gray-100 text-gray-500 text-[8px] font-black uppercase tracking-wider rounded-md">Portal Access Only</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleUpdateUser}
                      disabled={saving}
                      className="flex-1 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest bg-black hover:bg-[#ED1C24] text-white transition-all"
                    >
                      {saving ? "Saving..." : <><Save className="mr-2 h-3.5 w-3.5" /> Save</>}
                    </Button>
                    <Button
                      onClick={e => handleDeleteUser(e as any, selectedUser.id)}
                      variant="outline"
                      className="h-10 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest border-red-100 text-red-500 hover:bg-red-50"
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[300px] bg-white rounded-2xl border border-gray-100 border-dashed flex items-center justify-center p-6"
              >
                <div className="text-center max-w-sm">
                  <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-black tracking-tighter mb-1">Select a User</h3>
                  <p className="text-gray-400 font-bold text-xs">Choose a user from the list to manage their role and permissions, or create a new one.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
