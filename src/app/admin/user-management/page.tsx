"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Plus, Trash2, Save, XCircle,
  CheckCircle2, UserX, User, Search, RefreshCw, X,
  Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type SystemUser = {
  id: string;
  email: string;
  phone_number: string;
  role: string;
  region_id: number;
  status: string;
  created_at: string;
};

type NewUserForm = {
  email: string;
  phone_number: string;
  password: string;
  role: number;
  region: number;
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
  { label: "Federal HQ", value: 14 },
  { label: "Addis Ababa", value: 1 },
  { label: "Dire Dawa", value: 2 },
  { label: "Tigray", value: 3 },
  { label: "Afar", value: 4 },
  { label: "Amhara", value: 5 },
  { label: "Oromia", value: 6 },
  { label: "Somali", value: 7 },
  { label: "Benishangul-Gumuz", value: 8 },
  { label: "SNNPR", value: 9 },
  { label: "Gambela", value: 10 },
  { label: "Harari", value: 11 },
  { label: "Sidama", value: 12 },
  { label: "South West", value: 13 },
];

const DEFAULT_FORM: NewUserForm = {
  email: "",
  phone_number: "",
  password: "",
  role: 5,
  region: 14,
};

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


export default function UserManagementPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [form, setForm] = useState<NewUserForm>({ ...DEFAULT_FORM });
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editRole, setEditRole] = useState<number>(5);
  const [editStatus, setEditStatus] = useState<string>("ACTIVE");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/users?page=1&page_size=100");
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
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreateUser = async () => {
    if (!form.email || !form.password) {
      toast.error("Email and password are required.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/users/create", {
        email: form.email,
        phone_number: form.phone_number,
        password: form.password,
        role: form.role,
        region: form.region,
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

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone_number?.includes(search)
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-4 leading-none">
            User <span className="text-[#ED1C24]">Management</span>
          </h1>
          <p className="text-lg font-bold text-gray-400 leading-snug">
            Create admin users, assign roles and permissions, and manage access across all modules.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Button
            onClick={fetchUsers}
            variant="outline"
            className="h-14 rounded-2xl px-8 font-black text-xs uppercase tracking-widest hover:bg-gray-50 border-gray-200"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button
            onClick={() => { setShowCreate(true); setSelectedUser(null); setForm({ ...DEFAULT_FORM }); }}
            className="h-14 rounded-2xl px-8 font-black text-xs uppercase tracking-widest bg-[#ED1C24] hover:bg-black text-white transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" /> Create User
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* User List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by email or phone..."
              className="pl-11 h-12 rounded-2xl bg-gray-50 border-gray-100 font-medium text-black"
            />
          </div>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {loading ? (
              <div className="h-32 flex items-center justify-center bg-gray-50 rounded-3xl">
                <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center p-10 bg-gray-50 rounded-3xl border border-gray-100">
                <ShieldCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="font-bold text-gray-400">No users found.</p>
              </div>
            ) : (
              filtered.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={cn(
                    "group cursor-pointer p-5 rounded-[20px] border transition-all duration-200 relative",
                    selectedUser?.id === user.id
                      ? "bg-black border-black text-white shadow-xl scale-[1.01]"
                      : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0",
                        selectedUser?.id === user.id ? "bg-white/10" : "bg-gray-100"
                      )}>
                        <User className={cn("h-5 w-5", selectedUser?.id === user.id ? "text-white" : "text-gray-500")} />
                      </div>
                      <div className="min-w-0">
                        <p className={cn("font-black truncate text-sm", selectedUser?.id === user.id ? "text-white" : "text-black")}>
                          {user.email || user.phone_number || "Unknown"}
                        </p>
                        <span className={cn(
                          "inline-block mt-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full",
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
                        "px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-full",
                        user.status === "ACTIVE"
                          ? selectedUser?.id === user.id ? "bg-green-400/20 text-green-300" : "bg-green-50 text-green-600"
                          : selectedUser?.id === user.id ? "bg-red-400/20 text-red-300" : "bg-red-50 text-red-500"
                      )}>
                        {user.status}
                      </span>
                      <button
                        onClick={e => handleDeleteUser(e, user.id)}
                        className={cn(
                          "p-2 rounded-xl transition-colors opacity-0 group-hover:opacity-100",
                          selectedUser?.id === user.id ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-500"
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
              >
                <div className="p-10 space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24]">
                        <Plus className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-black tracking-tighter">Create User</h3>
                        <p className="text-gray-400 font-medium">Add a new admin or staff member.</p>
                      </div>
                    </div>
                    <button onClick={() => setShowCreate(false)} className="p-3 rounded-2xl hover:bg-gray-50">
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="admin@ercs.org"
                        className="h-14 rounded-2xl bg-black text-white border-none font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</Label>
                      <Input
                        value={form.phone_number}
                        onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))}
                        placeholder="+251..."
                        className="h-14 rounded-2xl bg-black text-white border-none font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                          placeholder="Minimum 8 characters"
                          className="h-14 rounded-2xl bg-black text-white border-none font-bold pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role</Label>
                      <select
                        value={form.role}
                        onChange={e => setForm(f => ({ ...f, role: Number(e.target.value) }))}
                        className="flex h-14 w-full rounded-2xl bg-black text-white border-none px-5 font-bold focus:ring-1 focus:ring-red-500/20 appearance-none"
                      >
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Region</Label>
                      <select
                        value={form.region}
                        onChange={e => setForm(f => ({ ...f, region: Number(e.target.value) }))}
                        className="flex h-14 w-full rounded-2xl bg-black text-white border-none px-5 font-bold focus:ring-1 focus:ring-red-500/20 appearance-none"
                      >
                        {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateUser}
                    disabled={saving}
                    className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-[#ED1C24] hover:bg-black text-white transition-all"
                  >
                    {saving ? "Creating..." : <><Plus className="mr-2 h-4 w-4" /> Create User Account</>}
                  </Button>
                </div>
              </motion.div>
            ) : selectedUser ? (
              <motion.div
                key={`edit-${selectedUser.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
              >
                <div className="p-10 space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-black tracking-tighter">{selectedUser.email || selectedUser.phone_number}</h3>
                        <p className="text-gray-400 font-medium text-sm">User ID: {selectedUser.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="p-3 rounded-2xl hover:bg-gray-50">
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role</Label>
                      <select
                        value={editRole}
                        onChange={e => setEditRole(Number(e.target.value))}
                        className="flex h-14 w-full rounded-2xl bg-black text-white border-none px-5 font-bold focus:ring-1 focus:ring-red-500/20 appearance-none"
                      >
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</Label>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value)}
                        className="flex h-14 w-full rounded-2xl bg-black text-white border-none px-5 font-bold focus:ring-1 focus:ring-red-500/20 appearance-none"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Permissions info box */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Role Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {editRole === 1 && ["USERS_MANAGE","MEMBERS_WRITE","MEMBERS_READ","FINANCE_MANAGE","MISSIONS_MANAGE"].map(p => (
                        <span key={p} className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-full">{p}</span>
                      ))}
                      {editRole === 2 && ["MEMBERS_READ","MISSIONS_MANAGE"].map(p => (
                        <span key={p} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-full">{p}</span>
                      ))}
                      {editRole === 7 && ["MEMBERS_READ","MEMBERS_WRITE"].map(p => (
                        <span key={p} className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded-full">{p}</span>
                      ))}
                      {[3,4,5,6].includes(editRole) && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-wider rounded-full">Portal Access Only</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleUpdateUser}
                      disabled={saving}
                      className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-black hover:bg-[#ED1C24] text-white transition-all"
                    >
                      {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                    </Button>
                    <Button
                      onClick={e => handleDeleteUser(e as any, selectedUser.id)}
                      variant="outline"
                      className="h-14 rounded-2xl px-6 font-black text-xs uppercase tracking-widest border-red-100 text-red-500 hover:bg-red-50"
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
                className="h-full min-h-[500px] bg-white rounded-[40px] border border-gray-100 border-dashed flex items-center justify-center p-10"
              >
                <div className="text-center max-w-sm">
                  <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-black text-black tracking-tighter mb-2">Select a User</h3>
                  <p className="text-gray-400 font-bold">Choose a user from the list to manage their role and permissions, or create a new one.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
