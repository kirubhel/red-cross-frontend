"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import Header from "@/components/layout/Header";
import api from "@/lib/api";

const ADMIN_ROLES = ["SUPER_ADMIN", "REGIONAL_ADMIN", "ZONE_ADMIN", "ZONAL_ADMIN", "WOREDA_ADMIN", "BRANCH_OFFICER"];

// Where a user lands once their password is changed, by the role saved at login.
function homeForRole(role: string) {
  if (ADMIN_ROLES.includes(role)) return "/admin";
  if (role === "ORGANIZATION") return "/organization/portal";
  return "/dashboard";
}

// First-login screen for accounts an admin created with a temporary password.
export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/staff/login");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) return setError("New password must be at least 8 characters.");
    if (newPassword === oldPassword) return setError("New password must be different from the temporary one.");
    if (newPassword !== confirmPassword) return setError("The new passwords do not match.");

    setLoading(true);
    try {
      await api.post("/auth/change-password", { old_password: oldPassword, new_password: newPassword });
      router.push(homeForRole(localStorage.getItem("user_role") || ""));
    } catch (err: any) {
      const data = err.response?.data;
      const msg = typeof data === "string" ? data : data?.message || "";
      setError(/incorrect/i.test(msg) ? "The temporary password is incorrect." : msg || "Could not change the password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "h-11 rounded-xl bg-gray-50 text-black border-gray-200 font-bold text-sm pr-10";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto flex max-w-md flex-col px-4 pb-16 pt-28">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#ED1C24]">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Set your password</h1>
              <p className="text-sm text-gray-500">
                Your account was created with a temporary password. Choose your own to continue.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: "old", label: "Temporary password (from the SMS)", value: oldPassword, set: setOldPassword, auto: "current-password" },
              { id: "new", label: "New password", value: newPassword, set: setNewPassword, auto: "new-password" },
              { id: "confirm", label: "Confirm new password", value: confirmPassword, set: setConfirmPassword, auto: "new-password" },
            ].map((f) => (
              <div key={f.id} className="space-y-1.5">
                <Label htmlFor={f.id} className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  {f.label}
                </Label>
                <div className="relative">
                  <Input
                    id={f.id}
                    type={show ? "text" : "password"}
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    autoComplete={f.auto}
                    className={inputClass}
                    required
                  />
                  {f.id === "old" && (
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      aria-label={show ? "Hide passwords" : "Show passwords"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-[#ED1C24]">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-[#ED1C24] font-bold text-white hover:bg-[#c8161d]"
            >
              {loading ? "Saving..." : "Save new password"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
