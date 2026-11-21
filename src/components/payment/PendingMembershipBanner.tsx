"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

type MembershipState = { person_id: string; payment_required: boolean };

// Shown to a signed-in member whose membership fee is unpaid: they have no Member ID yet.
// The server works out the fee and region from the member's own record.
export default function PendingMembershipBanner() {
  const [state, setState] = useState<MembershipState | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/membership/me")
      .then((res) => {
        if (!cancelled) setState(res.data);
      })
      .catch(() => {
        /* not a member profile, or the check is unavailable: show nothing */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!state?.payment_required) return null;

  const pay = async () => {
    setPaying(true);
    setError("");
    try {
      const res = await api.post("/payment/initiate", {
        provider: "ARIFPAY",
        purpose: "MEMBERSHIP",
        person_id: state.person_id,
      });
      if (res.data?.payment_url) {
        window.location.href = res.data.payment_url;
        return;
      }
      setError("Could not start the payment. Please try again.");
    } catch (err: any) {
      const data = err?.response?.data;
      setError((typeof data === "string" ? data : data?.message) || "Could not start the payment. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div
      role="status"
      className="bg-red-50 border border-red-200 rounded-[28px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-start md:items-center gap-3 text-red-900">
        <div className="h-10 w-10 bg-[#ED1C24] rounded-xl flex items-center justify-center text-white shrink-0">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-tight">Complete your membership payment</h4>
          <p className="text-xs font-semibold text-red-800">
            Your Member ID is issued as soon as your membership fee is paid.
          </p>
          {error ? <p role="alert" className="text-xs font-bold mt-1 text-red-900">{error}</p> : null}
        </div>
      </div>
      <Button
        onClick={pay}
        disabled={paying}
        aria-busy={paying}
        className="w-full md:w-auto bg-[#ED1C24] hover:bg-black text-white px-6 h-11 rounded-xl font-black text-[10px] uppercase tracking-widest"
      >
        {paying ? "Starting…" : "Pay now"}
      </Button>
    </div>
  );
}
