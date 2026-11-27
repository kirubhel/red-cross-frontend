"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, KeyRound, Lock } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { getUserScope, type UserScope } from "@/lib/auth-scope";
import { PageHeader, Panel } from "@/components/admin/page-ui";
import { Button } from "@/components/ui/button";

type Form = {
  first_name: string;
  father_name: string;
  grandfather_name: string;
  email: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  profession: string;
};

const EMPTY: Form = {
  first_name: "",
  father_name: "",
  grandfather_name: "",
  email: "",
  phone_number: "",
  gender: "",
  date_of_birth: "",
  profession: "",
};

const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

const fieldClass =
  "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/30";
const labelClass = "flex flex-col gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400";

function errorText(err: any, fallback: string): string {
  const data = err?.response?.data;
  if (typeof data === "string" && data.trim()) return data.trim();
  return data?.message || data?.error || fallback;
}

export default function AdminProfilePage() {
  const [scope, setScope] = useState<UserScope | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [photoUrl, setPhotoUrl] = useState("");
  const [hasPerson, setHasPerson] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    setScope(getUserScope());
    let cancelled = false;
    (async () => {
      try {
        const [me, profile] = await Promise.all([api.get("/auth/me"), api.get("/person/profile")]);
        if (cancelled) return;
        const linked = Boolean(me.data?.person_id);
        const p = profile.data?.person || {};
        setHasPerson(linked);
        setPhotoUrl(p.photo_url || "");
        setForm({
          // A staff account with no person record yet shows a placeholder name; leave the
          // name fields empty so the placeholder is never saved as their real name.
          first_name: linked ? p.first_name || "" : "",
          father_name: linked ? p.father_name || "" : "",
          grandfather_name: linked ? p.grandfather_name || "" : "",
          email: p.email || me.data?.email || "",
          phone_number: p.phone_number || me.data?.phone_number || "",
          gender: String(p.gender || "").toUpperCase(),
          date_of_birth: String(p.date_of_birth || "").slice(0, 10),
          profession: p.profession || "",
        });
      } catch (err) {
        if (!cancelled) toast.error(errorText(err, "Could not load your profile"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // Creating the personal record needs a name; contact details can be saved without one.
    if (!hasPerson && (form.first_name.trim() || form.father_name.trim()) && !(form.first_name.trim() && form.father_name.trim())) {
      toast.error("Enter both your first name and father name");
      return;
    }
    setSaving(true);
    try {
      // The server only changes fields sent non-empty. Region, zone, woreda and branch are
      // assigned by the organisation and are deliberately not part of this form.
      const payload: Record<string, string> = {};
      (Object.keys(form) as (keyof Form)[]).forEach((k) => {
        const v = form[k].trim();
        if (v) payload[k] = v;
      });
      await api.put("/person/profile", payload);
      if (!hasPerson && payload.first_name && payload.father_name) setHasPerson(true);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(errorText(err, "Could not update your profile"));
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("Profile photo must be smaller than 3MB");
      return;
    }
    if (!hasPerson) {
      toast.error("Save your name first, then add a photo");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await api.post("/person/profile/photo", fd);
      const url = up.data?.url;
      if (!url) throw new Error("Storage did not return a photo URL");
      await api.put("/person/profile", { photo_url: url });
      setPhotoUrl(url);
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(errorText(err, "Could not upload the photo"));
    } finally {
      setUploading(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return void toast.error("New password must be at least 8 characters");
    if (newPassword === oldPassword) return void toast.error("New password must be different from the current one");
    if (newPassword !== confirmPassword) return void toast.error("The new passwords do not match");
    setChangingPassword(true);
    try {
      await api.post("/auth/change-password", { old_password: oldPassword, new_password: newPassword });
      toast.success("Password changed");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = errorText(err, "");
      toast.error(/incorrect/i.test(msg) ? "Your current password is incorrect" : msg || "Could not change the password");
    } finally {
      setChangingPassword(false);
    }
  };

  const initials = (form.first_name[0] || form.email[0] || "A").toUpperCase();

  const jurisdiction: [string, string][] = scope
    ? [
        ["Role", scope.scopeBadgeTitle || scope.role],
        ["Region", scope.isSuperAdmin ? "All regions" : scope.regionName || "—"],
        ["Zone", scope.zoneId || "—"],
        ["Woreda", scope.woredaId || "—"],
        ["Branch", scope.branchId || "—"],
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="Your personal details, contact information and password." />

      <Panel
        title="Assigned jurisdiction"
        description="Set by the organisation. You can't change your own role or area."
        actions={<Lock className="h-4 w-4 text-gray-300" aria-hidden />}
      >
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {jurisdiction.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</dt>
              <dd className="mt-1 break-words text-sm font-bold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Personal & contact details">
        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : (
          <form onSubmit={saveProfile} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                {photoUrl ? (
                  <img src={photoUrl} alt="Your profile photo" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-2xl font-black text-gray-400">{initials}</span>
                )}
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={uploadPhoto} className="sr-only" id="admin-photo" />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="h-10 rounded-xl border-gray-200 text-[10px] font-black uppercase tracking-widest"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading…" : photoUrl ? "Change photo" : "Add photo"}
                </Button>
                <p className="mt-1.5 text-xs text-gray-400">JPG or PNG, up to 3MB.</p>
              </div>
            </div>

            {!hasPerson && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800">
                Your account has no personal record yet. Add your first name and father name below to create it. You can update your email and phone without one.
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className={labelClass}>First name<input className={fieldClass} value={form.first_name} onChange={set("first_name")} autoComplete="given-name" /></label>
              <label className={labelClass}>Father name<input className={fieldClass} value={form.father_name} onChange={set("father_name")} /></label>
              <label className={labelClass}>Grandfather name<input className={fieldClass} value={form.grandfather_name} onChange={set("grandfather_name")} /></label>
              <label className={labelClass}>Email<input type="email" className={fieldClass} value={form.email} onChange={set("email")} autoComplete="email" /></label>
              <label className={labelClass}>Phone number<input type="tel" className={fieldClass} value={form.phone_number} onChange={set("phone_number")} autoComplete="tel" /></label>
              <label className={labelClass}>
                Gender
                <select className={fieldClass} value={form.gender} onChange={set("gender")}>
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </label>
              <label className={labelClass}>Date of birth<input type="date" className={fieldClass} value={form.date_of_birth} onChange={set("date_of_birth")} /></label>
              <label className={labelClass}>Profession<input className={fieldClass} value={form.profession} onChange={set("profession")} /></label>
            </div>

            <p className="text-xs text-gray-400">
              Your email and phone number are also how you sign in. They must not belong to another account.
            </p>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="h-11 rounded-xl bg-[#ED1C24] px-6 text-[10px] font-black uppercase tracking-widest text-white">
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        )}
      </Panel>

      <Panel
        title="Change password"
        actions={<KeyRound className="h-4 w-4 text-gray-300" aria-hidden />}
      >
        <form onSubmit={changePassword} className="grid max-w-xl grid-cols-1 gap-4">
          <label className={labelClass}>
            Current password
            <input type="password" className={fieldClass} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} autoComplete="current-password" required />
          </label>
          <label className={labelClass}>
            New password
            <input type="password" className={fieldClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" minLength={8} required />
          </label>
          <label className={labelClass}>
            Confirm new password
            <input type="password" className={fieldClass} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" minLength={8} required />
          </label>
          <div>
            <Button type="submit" disabled={changingPassword} className="h-11 rounded-xl bg-black px-6 text-[10px] font-black uppercase tracking-widest text-white">
              {changingPassword ? "Changing…" : "Change password"}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
