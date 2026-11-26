"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Map, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface LocationRegion {
  id: number;
  name: string;
}
export interface LocationZone {
  id: string;
  region_id: number;
  name: string;
  code: string;
}
export interface LocationWoreda {
  id: string;
  zone_id: string;
  name: string;
  code: string;
}

export interface NewLocation {
  /** Zone: the parent region. Woreda: the region of the parent zone. */
  regionId: number;
  /** Woreda only. */
  zoneId: string;
  name: string;
  code: string;
}

interface Props {
  kind: "zone" | "woreda";
  open: boolean;
  onClose: () => void;
  regions: LocationRegion[];
  zones: LocationZone[];
  woredas: LocationWoreda[];
  /** Pre-selected from the filters on the page. */
  defaultRegionId?: number;
  defaultZoneId?: string;
  /** Saves the new item. Throw an Error with a readable message to keep the dialog open. */
  onSubmit: (value: NewLocation) => Promise<void>;
}

const selectClass =
  "h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-black outline-none focus:border-[#ED1C24] focus:ring-2 focus:ring-red-100 disabled:bg-gray-50 disabled:text-gray-400";
const labelClass = "px-1 text-[10px] font-black uppercase tracking-widest text-gray-500";

function suggestCode(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

/** Native modal <dialog>: the browser handles focus, Esc, the inert page and focus return. */
export function AddLocationDialog({ kind, open, onClose, regions, zones, woredas, defaultRegionId, defaultZoneId, onSubmit }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [regionId, setRegionId] = useState<number>(0);
  const [zoneId, setZoneId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isZone = kind === "zone";
  const noun = isZone ? "zone" : "woreda";
  const regionZones = zones.filter((z) => z.region_id === regionId);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const startRegion = defaultRegionId && defaultRegionId > 0 ? defaultRegionId : regions[0]?.id ?? 0;
      const startZones = zones.filter((z) => z.region_id === startRegion);
      setRegionId(startRegion);
      setZoneId(defaultZoneId && startZones.some((z) => z.id === defaultZoneId) ? defaultZoneId : startZones[0]?.id ?? "");
      setName("");
      setCode("");
      setCodeTouched(false);
      setError("");
      setBusy(false);
      dialog.showModal();
      // The name field is only enabled once the state above has rendered, so autofocus alone
      // would miss it; focus it as soon as that has happened.
      setTimeout(() => nameRef.current?.focus(), 0);
    } else if (!open && dialog.open) {
      dialog.close();
    }
    // Only react to opening/closing; the defaults are read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const changeRegion = (id: number) => {
    setRegionId(id);
    setZoneId(zones.find((z) => z.region_id === id)?.id ?? "");
    setError("");
  };

  const changeName = (value: string) => {
    setName(value);
    if (!codeTouched) setCode(suggestCode(value));
    setError("");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, " ");
    const cleanCode = code.trim().toUpperCase();

    if (!cleanName) return setError(`Enter the ${noun} name.`);
    if (!cleanCode) return setError("Enter a short code, for example AK.");
    if (!/^[A-Z0-9-]{1,8}$/.test(cleanCode)) return setError("The code can only use letters, numbers and dashes (up to 8 characters).");
    if (isZone) {
      if (!regionId) return setError("Choose the region this zone belongs to.");
      if (zones.some((z) => z.region_id === regionId && z.name.trim().toLowerCase() === cleanName.toLowerCase())) {
        return setError(`There is already a zone called "${cleanName}" in this region.`);
      }
    } else {
      if (!zoneId) return setError("Choose the zone this woreda belongs to.");
      if (woredas.some((w) => w.zone_id === zoneId && w.name.trim().toLowerCase() === cleanName.toLowerCase())) {
        return setError(`There is already a woreda called "${cleanName}" in this zone.`);
      }
    }

    setBusy(true);
    setError("");
    try {
      await onSubmit({ regionId, zoneId, name: cleanName, code: cleanCode });
      onClose();
    } catch (err: any) {
      setError(err?.message || `Could not add the ${noun}. Please try again.`);
    } finally {
      setBusy(false);
    }
  };

  const Icon = isZone ? MapPin : Map;
  const blocked = !isZone && regionZones.length === 0;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="add-location-title"
      // Click outside or Esc closes it; while saving it stays put.
      {...({ closedby: busy ? "none" : "any" } as object)}
      onClose={onClose}
      onCancel={(e) => {
        if (busy) e.preventDefault();
      }}
      className="m-auto max-h-[90vh] w-[min(30rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-0 text-black shadow-2xl backdrop:overflow-hidden backdrop:overscroll-contain backdrop:bg-black/40 backdrop:backdrop-blur-sm [&:modal]:overscroll-contain"
    >
      <form onSubmit={submit} noValidate>
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#ED1C24]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h1 id="add-location-title" className="text-lg font-black leading-tight">
                Add {isZone ? "Zone" : "Woreda"}
              </h1>
              <p className="text-xs font-semibold text-gray-500">
                {isZone ? "A zone belongs to one region." : "A woreda belongs to one zone."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-50 disabled:opacity-40"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-1.5">
            <Label htmlFor="loc-region" className={labelClass}>
              {isZone ? "Parent region" : "Region"}
            </Label>
            <select id="loc-region" value={regionId} onChange={(e) => changeRegion(Number(e.target.value))} className={selectClass}>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {!isZone && (
            <div className="space-y-1.5">
              <Label htmlFor="loc-zone" className={labelClass}>
                Parent zone
              </Label>
              <select
                id="loc-zone"
                value={zoneId}
                onChange={(e) => {
                  setZoneId(e.target.value);
                  setError("");
                }}
                disabled={blocked}
                className={selectClass}
              >
                {blocked ? <option value="">No zones in this region yet</option> : null}
                {regionZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.code})
                  </option>
                ))}
              </select>
              {blocked && <p className="px-1 text-xs font-semibold text-amber-700">Add a zone to this region first, then add its woredas.</p>}
            </div>
          )}

          <div className="grid grid-cols-[1fr_7rem] gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="loc-name" className={labelClass}>
                {isZone ? "Zone name" : "Woreda name"}
              </Label>
              <Input
                id="loc-name"
                ref={nameRef}
                autoComplete="off"
                value={name}
                onChange={(e) => changeName(e.target.value)}
                disabled={blocked}
                maxLength={100}
                className="h-11 rounded-xl border-gray-200 text-sm font-bold text-black"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-code" className={labelClass}>
                Code
              </Label>
              <Input
                id="loc-code"
                autoComplete="off"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setCodeTouched(true);
                  setError("");
                }}
                disabled={blocked}
                maxLength={8}
                className="h-11 rounded-xl border-gray-200 text-sm font-bold uppercase text-black"
              />
            </div>
          </div>

          <p role="alert" className={`min-h-5 px-1 text-sm font-semibold text-red-700 ${error ? "" : "invisible"}`}>
            {error || "."}
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50/60 p-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={busy} className="h-10 rounded-xl border-gray-200 text-xs font-bold">
            Cancel
          </Button>
          <Button type="submit" disabled={busy || blocked} className="h-10 gap-2 rounded-xl bg-[#ED1C24] px-5 text-xs font-bold text-white hover:bg-[#c8161d]">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Add {noun}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
