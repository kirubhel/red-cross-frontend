"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Plus, Trash2, Save, XCircle,
  CheckCircle2, UserX, User, Users, Search, RefreshCw, X,
  Eye, EyeOff, LayoutDashboard, HandHeart, Building2,
  ClipboardList, BarChart3, CreditCard, Bell, Newspaper,
  Settings, MapPin, Globe, Lock, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import PhoneNumberInput, { buildFullPhoneNumber } from "@/components/ui/phone-number-input";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type SystemUser = {
  id: string;
  email: string;
  phone_number: string;
  role: string;
  region_id: number;
  zone_id: string;
  woreda_id: string;
  branch_id: string;
  status: string;
  created_at: string;
};

type NewUserForm = {
  email: string;
  phone_number: string;
  password: string;
  role: number;
  region: number;
  zone: string;
  woreda: string;
  branch: string;
};

const ALL_ROLES = [
  { label: "Super Admin", value: 1, minScope: "SUPER_ADMIN" },
  { label: "Regional Admin", value: 2, minScope: "SUPER_ADMIN" },
  { label: "Zonal Admin", value: 3, minScope: "REGIONAL_ADMIN" },
  { label: "Woreda Admin", value: 4, minScope: "ZONAL_ADMIN" },
  { label: "Branch Officer", value: 7, minScope: "REGIONAL_ADMIN" },
  { label: "Volunteer", value: 5, minScope: "ALL" },
  { label: "Member", value: 6, minScope: "ALL" },
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
  "ZONE_ADMIN": "Zonal Admin",
  "ZONAL_ADMIN": "Zonal Admin",
  "WOREDA_ADMIN": "Woreda Admin",
  "VOLUNTEER": "Volunteer",
  "MEMBER": "Member",
  "BRANCH_OFFICER": "Branch Officer",
};

const DEFAULT_REGIONS = [
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
  { label: "South Ethiopia", value: 14 },
];

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
  1: "bg-red-100 text-red-700 border-red-200",
  2: "bg-orange-100 text-orange-700 border-orange-200",
  3: "bg-amber-100 text-amber-700 border-amber-200",
  4: "bg-sky-100 text-sky-700 border-sky-200",
  7: "bg-blue-100 text-blue-700 border-blue-200",
  5: "bg-emerald-100 text-emerald-700 border-emerald-200",
  6: "bg-gray-100 text-gray-700 border-gray-200",
  "ROLE_super_admin": "bg-red-100 text-red-700 border-red-200",
  "SUPER_ADMIN": "bg-red-100 text-red-700 border-red-200",
  "ROLE_regional_admin": "bg-orange-100 text-orange-700 border-orange-200",
  "REGIONAL_ADMIN": "bg-orange-100 text-orange-700 border-orange-200",
  "ROLE_zonal_admin": "bg-amber-100 text-amber-700 border-amber-200",
  "ZONE_ADMIN": "bg-amber-100 text-amber-700 border-amber-200",
  "ZONAL_ADMIN": "bg-amber-100 text-amber-700 border-amber-200",
  "ROLE_woreda_admin": "bg-sky-100 text-sky-700 border-sky-200",
  "WOREDA_ADMIN": "bg-sky-100 text-sky-700 border-sky-200",
  "ROLE_branch_officer": "bg-blue-100 text-blue-700 border-blue-200",
  "BRANCH_OFFICER": "bg-blue-100 text-blue-700 border-blue-200",
  "ROLE_volunteer": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "VOLUNTEER": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "ROLE_member": "bg-gray-100 text-gray-700 border-gray-200",
  "MEMBER": "bg-gray-100 text-gray-700 border-gray-200",
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [countryIso, setCountryIso] = useState("ET");
  const [showPassword, setShowPassword] = useState(false);
  const [editRole, setEditRole] = useState<number>(5);
  const [editStatus, setEditStatus] = useState<string>("ACTIVE");
  const [editBranch, setEditBranch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"ADMIN" | "MEMBER">("ADMIN");

  // Geographic state
  const [regions, setRegions] = useState<any[]>(DEFAULT_REGIONS);
  const [zones, setZones] = useState<any[]>([]);
  const [woredas, setWoredas] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Filters
  const [filterRegion, setFilterRegion] = useState<number>(0);
  const [filterZone, setFilterZone] = useState<string>("");
  const [filterWoreda, setFilterWoreda] = useState<string>("");

  // Create User Form State
  const [form, setForm] = useState<NewUserForm>({
    email: "",
    phone_number: "",
    password: "",
    role: 5,
    region: 1,
    zone: "",
    woreda: "",
    branch: "",
  });

  // Determine Current Logged-In User Scope
  const adminScope = useMemo(() => {
    const rawRole = currentUser?.role || (typeof window !== "undefined" ? localStorage.getItem("user_role") : "") || "SUPER_ADMIN";
    const rawRegId = Number(currentUser?.region_id || (typeof window !== "undefined" ? localStorage.getItem("user_region") : 0) || 0);
    const rawZoneId = currentUser?.zone_id || (typeof window !== "undefined" ? localStorage.getItem("user_zone") : "") || "";
    const rawWoredaId = currentUser?.woreda_id || (typeof window !== "undefined" ? localStorage.getItem("user_woreda") : "") || "";
    const rawBranchId = currentUser?.branch_id || (typeof window !== "undefined" ? localStorage.getItem("user_branch") : "") || "";

    const isSuper = rawRole === "SUPER_ADMIN" || rawRole === "ROLE_super_admin" || rawRole === 1 || rawRole === "1";
    const isRegional = rawRole === "REGIONAL_ADMIN" || rawRole === "ROLE_regional_admin" || rawRole === 2 || rawRole === "2";
    const isZonal = rawRole === "ZONE_ADMIN" || rawRole === "ZONAL_ADMIN" || rawRole === "ROLE_zonal_admin" || rawRole === 3 || rawRole === "3";
    const isWoreda = rawRole === "WOREDA_ADMIN" || rawRole === "ROLE_woreda_admin" || rawRole === 4 || rawRole === "4";
    const isBranch = rawRole === "BRANCH_OFFICER" || rawRole === "ROLE_branch_officer" || rawRole === 7 || rawRole === "7";

    return {
      isSuper,
      isRegional,
      isZonal,
      isWoreda,
      isBranch,
      regionId: rawRegId,
      zoneId: rawZoneId,
      woredaId: rawWoredaId,
      branchId: rawBranchId,
      roleName: isSuper ? "Super Admin" : isRegional ? "Regional Admin" : isZonal ? "Zonal Admin" : isWoreda ? "Woreda Admin" : isBranch ? "Branch Officer" : "Administrator"
    };
  }, [currentUser]);

  // Allowed roles that the active administrator can create/assign
  const allowedRoles = useMemo(() => {
    if (adminScope.isSuper) {
      return ALL_ROLES;
    }
    if (adminScope.isRegional) {
      // Regional Admin cannot create Super Admin or other Regional Admins
      return ALL_ROLES.filter(r => r.value !== 1 && r.value !== 2);
    }
    if (adminScope.isZonal) {
      return ALL_ROLES.filter(r => [4, 7, 5, 6].includes(r.value));
    }
    // Woreda / Branch Officer
    return ALL_ROLES.filter(r => [5, 6].includes(r.value));
  }, [adminScope]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/person/profile");
      const person = res.data?.person;
      if (person) {
        setCurrentUser(person);
        if (person.region_id && person.region_id > 0) {
          setFilterRegion(Number(person.region_id));
          setForm(f => ({
            ...f,
            region: Number(person.region_id),
            zone: person.zone_id || "",
            woreda: person.woreda_id || "",
            branch: person.branch_id || ""
          }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    try {
      const [zRes, wRes, bRes, sRes] = await Promise.all([
        api.get("/location/zones").catch(() => ({ data: { zones: [] } })),
        api.get("/location/woredas").catch(() => ({ data: { woredas: [] } })),
        api.get("/location/branches").catch(() => ({ data: { branches: [] } })),
        api.get("/system-settings").catch(() => ({ data: { settings: {} } }))
      ]);

      setZones(zRes.data?.zones || []);
      setWoredas(wRes.data?.woredas || []);
      setBranches(bRes.data?.branches || []);

      const settings = sRes.data?.settings || {};
      if (settings.all_regions) {
        try {
          const parsed = JSON.parse(settings.all_regions);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRegions(parsed.map((r: any) => ({ label: r.name || r.label, value: Number(r.id || r.value) })));
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
    fetchProfile();
  }, [fetchLocations, fetchProfile]);

  // Handle URL create query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("create") === "true") {
        setShowCreate(true);
        setSelectedUser(null);
      }
    }
  }, []);

  // Fetch users with RBAC scope
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/users?page=1&page_size=150";
      
      if (!adminScope.isSuper) {
        if (adminScope.regionId > 0) url += `&region_id=${adminScope.regionId}`;
        if (adminScope.zoneId) url += `&zone_id=${adminScope.zoneId}`;
        if (adminScope.woredaId) url += `&woreda_id=${adminScope.woredaId}`;
        if (adminScope.branchId) url += `&branch_id=${adminScope.branchId}`;
      } else {
        if (filterRegion > 0) url += `&region_id=${filterRegion}`;
        if (filterZone !== "") url += `&zone_id=${filterZone}`;
        if (filterWoreda !== "") url += `&woreda_id=${filterWoreda}`;
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
  }, [adminScope, filterRegion, filterZone, filterWoreda]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Cascaded Zone options for Filter Bar
  const filterZoneOptions = useMemo(() => {
    const activeReg = adminScope.isSuper ? filterRegion : adminScope.regionId;
    if (!activeReg || activeReg === 0) return zones;
    return zones.filter(z => Number(z.region_id) === Number(activeReg));
  }, [zones, filterRegion, adminScope]);

  // Cascaded Woreda options for Filter Bar
  const filterWoredaOptions = useMemo(() => {
    if (filterZone) {
      return woredas.filter(w => String(w.zone_id) === String(filterZone));
    }
    const activeReg = adminScope.isSuper ? filterRegion : adminScope.regionId;
    if (activeReg && activeReg > 0) {
      const regionZoneIds = zones.filter(z => Number(z.region_id) === Number(activeReg)).map(z => String(z.id));
      return woredas.filter(w => regionZoneIds.includes(String(w.zone_id)));
    }
    return woredas;
  }, [woredas, filterZone, filterRegion, adminScope, zones]);

  // Cascaded Zones for Create User Form
  const formZoneOptions = useMemo(() => {
    const regId = adminScope.isSuper ? form.region : adminScope.regionId;
    if (!regId) return [];
    return zones.filter(z => Number(z.region_id) === Number(regId));
  }, [zones, form.region, adminScope]);

  // Cascaded Woredas for Create User Form
  const formWoredaOptions = useMemo(() => {
    if (!form.zone) return [];
    return woredas.filter(w => String(w.zone_id) === String(form.zone));
  }, [woredas, form.zone]);

  // Cascaded Branches for Create User Form
  const formBranchOptions = useMemo(() => {
    const regId = adminScope.isSuper ? form.region : adminScope.regionId;
    return branches.filter(b => {
      if (regId && Number(b.region_id) !== Number(regId)) return false;
      if (form.zone && b.zone_id && String(b.zone_id) !== String(form.zone)) return false;
      return true;
    });
  }, [branches, form.region, form.zone, adminScope]);

  const handleCreateUser = async () => {
    if (!form.email || !form.password) {
      toast.error("Email and password are required.");
      return;
    }
    setSaving(true);
    try {
      const finalPhone = buildFullPhoneNumber(countryIso, form.phone_number);
      const effectiveRegion = adminScope.isSuper ? form.region : adminScope.regionId;

      await api.post("/users/create", {
        email: form.email,
        phone_number: finalPhone,
        password: form.password,
        role: form.role,
        region: effectiveRegion,
        zone_id: form.zone,
        woreda_id: form.woreda,
        branch_id: form.branch,
      });

      toast.success("User created successfully.", { icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> });
      setShowCreate(false);
      setForm({
        email: "",
        phone_number: "",
        password: "",
        role: allowedRoles[0]?.value || 5,
        region: adminScope.isSuper ? 1 : adminScope.regionId,
        zone: "",
        woreda: "",
        branch: "",
      });
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to create user.", { icon: <XCircle className="h-5 w-5 text-[#ED1C24]" /> });
    } finally {
      setSaving(false);
    }
  };

  const handleSelectUser = (user: SystemUser) => {
    setSelectedUser(user);
    const roleByVal = ALL_ROLES.find(r => r.value === Number(user.role));
    if (roleByVal) {
      setEditRole(roleByVal.value);
    } else {
      const label = ROLE_LABELS[user.role] || user.role;
      setEditRole(ALL_ROLES.find(r => r.label === label)?.value ?? 5);
    }
    setEditStatus(user.status || "ACTIVE");
    setEditBranch(user.branch_id || "");
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
        branch_id: editBranch,
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

  const getRegionName = (regId: number) => {
    return regions.find(r => Number(r.value) === Number(regId))?.label || `Region ${regId}`;
  };

  const getZoneName = (zoneId: string) => {
    return zones.find(z => String(z.id) === String(zoneId))?.name || zoneId;
  };

  const getWoredaName = (woredaId: string) => {
    return woredas.find(w => String(w.id) === String(woredaId))?.name || woredaId;
  };

  const getBranchName = (branchId: string) => {
    return branches.find(b => String(b.id) === String(branchId))?.name || branchId;
  };

  const filtered = users.filter(u => {
    const isSearchMatch = (u.email || "").toLowerCase().includes(search.toLowerCase()) || 
                          (u.phone_number || "").includes(search);
    
    const roleVal = Number(u.role);
    const isVolunteerOrMember = roleVal === 5 || roleVal === 6 || u.role === "VOLUNTEER" || u.role === "MEMBER";
    const isOrg = roleVal === 8 || u.role === "ORGANIZATION";
    
    if (isOrg) return false;

    // RBAC client-side filter enforcement
    if (!adminScope.isSuper && adminScope.regionId > 0) {
      if (Number(u.region_id) !== Number(adminScope.regionId)) {
        return false;
      }
    }

    if (activeTab === "ADMIN") return isSearchMatch && !isVolunteerOrMember;
    return isSearchMatch && isVolunteerOrMember;
  });

  return (
    <div className="space-y-6 w-full max-w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-xl space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-50 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
            {adminScope.isSuper ? (
              <><Globe className="h-3.5 w-3.5" /> Super Admin — Full National Jurisdiction</>
            ) : (
              <><MapPin className="h-3.5 w-3.5" /> {adminScope.roleName} — {getRegionName(adminScope.regionId)} Jurisdiction</>
            )}
          </div>
          <h1 className="text-3xl font-black text-black tracking-tighter leading-none">
            User <span className="text-[#ED1C24]">Management</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm leading-snug">
            Manage admin users, regional branches, and personnel access according to geographic jurisdiction.
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
            onClick={() => { 
              setShowCreate(true); 
              setSelectedUser(null); 
              setForm({ 
                email: "",
                phone_number: "",
                password: "",
                role: allowedRoles[0]?.value || 5,
                region: adminScope.isSuper ? 1 : adminScope.regionId,
                zone: "",
                woreda: "",
                branch: "",
              }); 
            }}
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

          {/* Cascaded Location Filters */}
          <div className="bg-gray-50/70 p-3 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-[#ED1C24]" /> Cascaded Location Filters
              </span>
              {((adminScope.isSuper && filterRegion > 0) || filterZone !== "" || filterWoreda !== "") && (
                <button 
                  onClick={() => { 
                    if (adminScope.isSuper) setFilterRegion(0); 
                    setFilterZone(""); 
                    setFilterWoreda(""); 
                  }}
                  className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                >
                  Reset Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Region Selector */}
              {adminScope.isSuper ? (
                <select
                  value={filterRegion}
                  onChange={e => { 
                    setFilterRegion(Number(e.target.value)); 
                    setFilterZone(""); 
                    setFilterWoreda(""); 
                  }}
                  className="h-8 rounded-lg bg-white border border-gray-200 px-2 text-[10px] font-bold text-gray-800 focus:ring-1 focus:ring-red-500/20"
                >
                  <option value={0}>All Regions</option>
                  {regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              ) : (
                <div className="h-8 rounded-lg bg-red-50/50 border border-red-100 px-2 flex items-center justify-between text-[10px] font-extrabold text-[#ED1C24] truncate">
                  <span className="truncate">{getRegionName(adminScope.regionId)}</span>
                  <Lock className="h-2.5 w-2.5 shrink-0 opacity-60 ml-1" />
                </div>
              )}

              {/* Cascaded Zone Selector */}
              <select
                value={filterZone}
                onChange={e => { 
                  setFilterZone(e.target.value); 
                  setFilterWoreda(""); 
                }}
                className="h-8 rounded-lg bg-white border border-gray-200 px-2 text-[10px] font-bold text-gray-800 focus:ring-1 focus:ring-red-500/20"
              >
                <option value="">All Zones</option>
                {filterZoneOptions.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>

              {/* Cascaded Woreda Selector */}
              <select
                value={filterWoreda}
                onChange={e => setFilterWoreda(e.target.value)}
                className="h-8 rounded-lg bg-white border border-gray-200 px-2 text-[10px] font-bold text-gray-800 focus:ring-1 focus:ring-red-500/20"
              >
                <option value="">All Woredas</option>
                {filterWoredaOptions.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* User Cards List */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              <div className="h-32 flex flex-col items-center justify-center bg-gray-50 rounded-2xl gap-2">
                <div className="h-6 w-6 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Loading Personnel...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
                <ShieldCheck className="h-8 w-8 text-gray-300 mx-auto mb-2 opacity-50" />
                <p className="font-bold text-xs text-gray-400">No personnel found in this jurisdiction.</p>
              </div>
            ) : (
              filtered.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={cn(
                    "group cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 relative",
                    selectedUser?.id === user.id
                      ? "bg-black border-black text-white shadow-lg scale-[1.01]"
                      : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/80"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                        selectedUser?.id === user.id ? "bg-white/10" : "bg-gray-100"
                      )}>
                        <User className={cn("h-4 w-4", selectedUser?.id === user.id ? "text-white" : "text-gray-600")} />
                      </div>
                      <div className="min-w-0">
                        <p className={cn("font-black truncate text-xs", selectedUser?.id === user.id ? "text-white" : "text-slate-900")}>
                          {user.email || user.phone_number || "Unknown"}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className={cn(
                            "px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md border",
                            selectedUser?.id === user.id
                              ? "bg-white/15 border-white/20 text-white"
                              : (ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700")
                          )}>
                            {ROLE_LABELS[user.role] || user.role}
                          </span>

                          {user.region_id > 0 && (
                            <span className={cn(
                              "px-1.5 py-0.5 text-[8px] font-bold rounded-md flex items-center gap-0.5",
                              selectedUser?.id === user.id ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"
                            )}>
                              <MapPin className="h-2.5 w-2.5 text-[#ED1C24]" /> {getRegionName(user.region_id)}
                              {user.zone_id ? ` · ${getZoneName(user.zone_id)}` : ""}
                            </span>
                          )}

                          {user.branch_id && (
                            <span className={cn(
                              "px-1.5 py-0.5 text-[8px] font-bold rounded-md flex items-center gap-0.5",
                              selectedUser?.id === user.id ? "bg-white/10 text-gray-300" : "bg-blue-50 text-blue-700 border border-blue-100"
                            )}>
                              <Building2 className="h-2.5 w-2.5" /> {getBranchName(user.branch_id)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md",
                        user.status === "ACTIVE"
                          ? selectedUser?.id === user.id ? "bg-green-400/20 text-green-300" : "bg-green-50 text-green-600 border border-green-100"
                          : selectedUser?.id === user.id ? "bg-red-400/20 text-red-300" : "bg-red-50 text-red-500 border border-red-100"
                      )}>
                        {user.status}
                      </span>
                      <button
                        onClick={e => handleDeleteUser(e, user.id)}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100",
                          selectedUser?.id === user.id ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-500"
                        )}
                        title="Delete User"
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

        {/* Right Panel: Create / Edit User */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {showCreate ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden"
              >
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24]">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-black tracking-tight">Create Personnel Account</h3>
                        <p className="text-gray-400 font-medium text-xs">
                          {adminScope.isSuper ? "Register new system user or administrator across any region." : `Register new staff or personnel in ${getRegionName(adminScope.regionId)}.`}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address *</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="user@redcrosseth.org"
                        className="h-10 rounded-xl bg-gray-50 text-black border-gray-200 font-bold text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Phone Number *</Label>
                       <PhoneNumberInput
                           countryCode={countryIso}
                           onCountryChange={(code) => {
                               setCountryIso(code);
                               setForm(f => ({ ...f, phone_number: "" }));
                           }}
                           localNumber={form.phone_number}
                           onLocalNumberChange={(val) =>
                               setForm(f => ({ ...f, phone_number: val }))
                           }
                       />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                          placeholder="Minimum 8 characters"
                          className="h-10 rounded-xl bg-gray-50 text-black border-gray-200 font-bold text-sm pr-10"
                          required
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
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Assigned Role *</Label>
                      <select
                        value={form.role}
                        onChange={e => setForm(f => ({ ...f, role: Number(e.target.value) }))}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-200 px-3 font-bold text-sm focus:ring-2 focus:ring-red-500/20"
                      >
                        {allowedRoles.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Region Selector (Cascaded / Locked) */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center justify-between">
                        <span>Region *</span>
                        {!adminScope.isSuper && <span className="text-[9px] font-black text-[#ED1C24] flex items-center gap-0.5"><Lock className="h-2.5 w-2.5" /> Locked by Jurisdiction</span>}
                      </Label>
                      {adminScope.isSuper ? (
                        <select
                          value={form.region}
                          onChange={e => setForm(f => ({ 
                            ...f, 
                            region: Number(e.target.value), 
                            zone: "", 
                            woreda: "", 
                            branch: "" 
                          }))}
                          className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-200 px-3 font-bold text-sm focus:ring-2 focus:ring-red-500/20"
                        >
                          {regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      ) : (
                        <div className="flex h-10 w-full rounded-xl bg-gray-100 text-gray-700 border border-gray-200 px-3 font-bold text-sm items-center justify-between">
                          <span>{getRegionName(adminScope.regionId)}</span>
                          <Lock className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Zone Selector (Cascaded from Region) */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Zone / Sub-City</Label>
                      <select
                        value={form.zone}
                        onChange={e => setForm(f => ({ 
                          ...f, 
                          zone: e.target.value, 
                          woreda: "", 
                          branch: "" 
                        }))}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-200 px-3 font-bold text-sm focus:ring-2 focus:ring-red-500/20"
                      >
                        <option value="">All Zones in Region</option>
                        {formZoneOptions.map(z => (
                          <option key={z.id} value={z.id}>{z.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Woreda Selector (Cascaded from Zone) */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Woreda / Kebele</Label>
                      <select
                        value={form.woreda}
                        onChange={e => setForm(f => ({ 
                          ...f, 
                          woreda: e.target.value, 
                          branch: "" 
                        }))}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-200 px-3 font-bold text-sm focus:ring-2 focus:ring-red-500/20"
                      >
                        <option value="">All Woredas in Zone</option>
                        {formWoredaOptions.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Branch Selector (Cascaded from Region & Zone) */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Assigned Branch (If Applicable)</Label>
                      <select
                        value={form.branch || ""}
                        onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-200 px-3 font-bold text-sm focus:ring-2 focus:ring-red-500/20"
                      >
                        <option value="">No Branch (Unassigned / General)</option>
                        {formBranchOptions.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.branch_type?.replace(/_/g, ' ')})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Module Access & Capabilities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {MODULE_PERMISSIONS.map(m => (
                        <div key={m.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5" />
                          <div className="flex items-center gap-1.5 min-w-0">
                            <m.icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span className="text-[11px] font-bold text-gray-700 truncate">{m.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateUser}
                    disabled={saving}
                    className="w-full h-11 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#ED1C24] hover:bg-black text-white transition-all shadow-md shadow-[#ED1C24]/20"
                  >
                    {saving ? "Creating Personnel Account..." : <><Plus className="mr-2 h-4 w-4" /> Create Personnel Account</>}
                  </Button>
                </div>
              </motion.div>
            ) : selectedUser ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-xl sticky top-6"
              >
                <div className="space-y-6">
                  {/* User Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#ED1C24] font-black text-base shrink-0">
                        {selectedUser.email ? selectedUser.email[0].toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-900 tracking-tight truncate text-base">{selectedUser.email || "No Email"}</h3>
                        <p className="text-xs font-bold text-gray-400 font-mono">{selectedUser.phone_number || "No Phone Number"}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Geographic Jurisdiction Summary */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Assigned Jurisdiction</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase block">Region</span>
                        <span className="font-extrabold text-slate-900">{getRegionName(selectedUser.region_id)}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase block">Zone</span>
                        <span className="font-extrabold text-slate-900">{selectedUser.zone_id ? getZoneName(selectedUser.zone_id) : "All Zones"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase block">Woreda</span>
                        <span className="font-extrabold text-slate-900">{selectedUser.woreda_id ? getWoredaName(selectedUser.woreda_id) : "All Woredas"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase block">Branch</span>
                        <span className="font-extrabold text-slate-900">{selectedUser.branch_id ? getBranchName(selectedUser.branch_id) : "General"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Role Authority</Label>
                      <select
                        value={editRole}
                        onChange={e => setEditRole(Number(e.target.value))}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-200 px-3 font-bold text-sm focus:ring-2 focus:ring-red-500/20"
                      >
                        {allowedRoles.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Account Status</Label>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value)}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-200 px-3 font-bold text-sm focus:ring-2 focus:ring-red-500/20"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Reassign Branch (Cascaded for {getRegionName(selectedUser.region_id)})</Label>
                      <select
                        value={editBranch}
                        onChange={e => setEditBranch(e.target.value)}
                        className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-200 px-3 font-bold text-sm focus:ring-2 focus:ring-red-500/20"
                      >
                        <option value="">No Branch (Unassigned / General)</option>
                        {branches
                          .filter(b => !selectedUser.region_id || Number(b.region_id) === Number(selectedUser.region_id))
                          .map(b => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.branch_type?.replace(/_/g, ' ')})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleUpdateUser}
                      disabled={saving}
                      className="flex-1 h-11 rounded-xl font-black text-xs uppercase tracking-widest bg-black hover:bg-[#ED1C24] text-white transition-all shadow-md"
                    >
                      {saving ? "Saving Changes..." : <><Save className="mr-2 h-3.5 w-3.5" /> Save Changes</>}
                    </Button>
                    <Button
                      onClick={e => handleDeleteUser(e as any, selectedUser.id)}
                      variant="outline"
                      className="h-11 rounded-xl px-4 font-black text-xs uppercase tracking-widest border-red-200 text-red-600 hover:bg-red-50"
                      title="Delete User"
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
                className="h-full min-h-[350px] bg-white rounded-3xl border border-gray-200 border-dashed flex items-center justify-center p-8 text-center"
              >
                <div className="max-w-sm space-y-3">
                  <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24] mx-auto">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Personnel Directory</h3>
                  <p className="text-gray-400 font-medium text-xs">
                    Select a staff member, regional admin, or volunteer from the left list to review permissions and jurisdiction, or click <strong className="text-slate-700">+ Create User</strong>.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
