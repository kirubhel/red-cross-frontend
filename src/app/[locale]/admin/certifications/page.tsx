"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Plus, Trash2, RotateCcw, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/admin/page-ui";
import { cn } from "@/lib/utils";

const DEFAULT_NAME = "Kirubel Gizaw";

/**
 * Each template is a blank printed form. `fields` are the blanks on it, placed (as a % of
 * the image) on the printed lines, so the admin only has to type values.
 */
type FieldDef = { key: string; label: string; x: number; y: number; size: number; text?: string };
type Template = { id: string; name: string; hint: string; file: string; fields: FieldDef[] };

const ID_INSIDE: FieldDef[] = [
  { key: "name", label: "Full name", x: 30, y: 17.5, size: 64, text: DEFAULT_NAME },
  { key: "age", label: "Age", x: 12.5, y: 28, size: 52 },
  { key: "sex", label: "Sex", x: 34.4, y: 28, size: 52 },
  { key: "region", label: "Region", x: 16.6, y: 38.5, size: 52 },
  { key: "zone", label: "Zone / Sub-city", x: 40.2, y: 38.5, size: 52 },
  { key: "woreda", label: "Woreda", x: 14.9, y: 48.9, size: 46 },
  { key: "kebele", label: "Kebele", x: 29.1, y: 48.9, size: 46 },
  { key: "houseNo", label: "House no.", x: 43.3, y: 48.9, size: 46 },
  { key: "issueDate", label: "Issue date", x: 21.8, y: 59.2, size: 52 },
];

const TEMPLATES: Template[] = [
  {
    id: "regular-inside",
    name: "Regular ID: inside",
    hint: "Member details and renewal table",
    file: "/certificates/membership-regular-id-inside.png",
    fields: ID_INSIDE,
  },
  {
    id: "regular-front-back",
    name: "Regular ID: front and back",
    hint: "Branch contact details",
    file: "/certificates/membership-regular-id-front-back.png",
    fields: [
      { key: "branch", label: "Branch office", x: 22, y: 81, size: 52 },
      { key: "poBox", label: "P.O. Box", x: 44.5, y: 81, size: 52 },
      { key: "tel", label: "Tel.", x: 13.9, y: 91, size: 52 },
      { key: "email", label: "E-mail", x: 39.7, y: 91, size: 46 },
      { key: "no", label: "No.", x: 66.1, y: 91, size: 52 },
    ],
  },
  {
    id: "family-id",
    name: "Family ID: inside",
    hint: "Member details and renewal fee table",
    file: "/certificates/membership-family-id-inside.png",
    fields: [
      { key: "name", label: "Full name", x: 27.8, y: 17.2, size: 64, text: DEFAULT_NAME },
      { key: "age", label: "Age", x: 12.5, y: 27.7, size: 52 },
      { key: "sex", label: "Sex", x: 34.3, y: 27.7, size: 52 },
      { key: "region", label: "Region", x: 16.6, y: 38.1, size: 52 },
      { key: "zone", label: "Zone / Sub-city", x: 40.2, y: 38.1, size: 52 },
      { key: "woreda", label: "Woreda", x: 14.9, y: 48.5, size: 46 },
      { key: "kebele", label: "Kebele", x: 29.1, y: 48.5, size: 46 },
      { key: "houseNo", label: "House no.", x: 43.3, y: 48.5, size: 46 },
      { key: "issueDate", label: "Issue date", x: 21.8, y: 58.8, size: 52 },
    ],
  },
  {
    id: "family",
    name: "Family certificate",
    hint: "Portrait certificate with family table",
    file: "/certificates/family-membership-certificate.png",
    fields: [
      { key: "no", label: "No.", x: 23.1, y: 23.9, size: 56 },
      { key: "name", label: "Full name", x: 34.1, y: 29.7, size: 64, text: DEFAULT_NAME },
      { key: "age", label: "Age", x: 17.4, y: 35.6, size: 56 },
      { key: "sex", label: "Sex", x: 41.3, y: 35.6, size: 56 },
      { key: "region", label: "Region", x: 21.7, y: 41.6, size: 56 },
      { key: "zone", label: "Zone / Sub-city", x: 44.1, y: 41.6, size: 52 },
      { key: "woreda", label: "Woreda", x: 19.7, y: 47.5, size: 46 },
      { key: "kebele", label: "Kebele", x: 34.3, y: 47.5, size: 46 },
      { key: "houseNo", label: "House no.", x: 46.2, y: 47.5, size: 46 },
      { key: "issueDate", label: "Issue date", x: 27.4, y: 53.5, size: 56 },
    ],
  },
  {
    id: "corporate",
    name: "Corporate certificate",
    hint: "Organization name, membership type, branch contacts",
    file: "/certificates/corporate-membership-certificate1.png",
    fields: [
      { key: "no", label: "No.", x: 86.7, y: 13.2, size: 80 },
      { key: "name", label: "Name of the organization", x: 58.8, y: 43.4, size: 84, text: DEFAULT_NAME },
      { key: "type", label: "Type of membership", x: 57.5, y: 58.2, size: 84 },
      { key: "branch", label: "Branch address", x: 24.8, y: 91.5, size: 64 },
      { key: "tel", label: "Tel.", x: 46, y: 91.5, size: 64 },
      { key: "fax", label: "Fax", x: 67.6, y: 91.5, size: 64 },
      { key: "poBox", label: "P.O. Box", x: 89.4, y: 91.5, size: 64 },
    ],
  },
];

type Field = {
  id: string;
  key: string;
  label: string;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  custom?: boolean;
};

const FONT = (size: number) => `bold ${size}px Arial, "Noto Sans Ethiopic", sans-serif`;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function buildFields(t: Template, previous: Field[] = []): Field[] {
  const typed = new Map(previous.filter((f) => !f.custom).map((f) => [f.key, f.text]));
  const base = t.fields.map<Field>((d) => ({
    id: `${t.id}-${d.key}`,
    key: d.key,
    label: d.label,
    text: typed.has(d.key) ? typed.get(d.key)! : d.text ?? "",
    x: d.x,
    y: d.y,
    size: d.size,
    color: "#000000",
  }));
  return [...base, ...previous.filter((f) => f.custom)];
}

function paint(ctx: CanvasRenderingContext2D, img: HTMLImageElement, fields: Field[], selectedId: string | null, guides: boolean) {
  const { width, height } = ctx.canvas;
  ctx.drawImage(img, 0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const f of fields) {
    const x = (width * f.x) / 100;
    const y = (height * f.y) / 100;
    ctx.font = FONT(f.size);
    const selected = guides && f.id === selectedId;
    const shown = f.text || (selected ? f.label : "");
    if (!shown) continue;
    ctx.fillStyle = f.text ? f.color : "rgba(237,28,36,0.55)";
    ctx.fillText(shown, x, y);
    if (selected) {
      const w = ctx.measureText(shown).width;
      ctx.save();
      ctx.strokeStyle = "#ED1C24";
      ctx.lineWidth = Math.max(2, width / 900);
      ctx.setLineDash([width / 160, width / 240]);
      const pad = f.size * 0.25;
      ctx.strokeRect(x - w / 2 - pad, y - f.size * 0.7, w + pad * 2, f.size * 1.4);
      ctx.restore();
    }
  }
}

export default function CertificationsPage() {
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [fields, setFields] = useState<Field[]>(() => buildFields(TEMPLATES[0]));
  const [selectedId, setSelectedId] = useState<string | null>(fields[0]?.id ?? null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const selected = fields.find((f) => f.id === selectedId) ?? null;

  // load the template image
  useEffect(() => {
    let live = true;
    setImg(null);
    setLoadError(false);
    const el = new Image();
    el.onload = () => live && setImg(el);
    el.onerror = () => live && setLoadError(true);
    el.src = template.file;
    return () => {
      live = false;
    };
  }, [template]);

  // redraw the preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) paint(ctx, img, fields, selectedId, true);
  }, [img, fields, selectedId]);

  const chooseTemplate = (t: Template) => {
    if (t.id === template.id) return;
    const next = buildFields(t, fields);
    setTemplate(t);
    setFields(next);
    setSelectedId(next[0]?.id ?? null);
  };

  const update = (id: string, patch: Partial<Field>) => setFields((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const addText = () => {
    const f: Field = { id: `custom-${Date.now()}`, key: "custom", label: "Extra text", text: "", x: 50, y: 70, size: 56, color: "#000000", custom: true };
    setFields((fs) => [...fs, f]);
    setSelectedId(f.id);
  };

  const removeText = (id: string) => {
    setFields((fs) => fs.filter((f) => f.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  };

  const resetPositions = () => {
    setFields((fs) =>
      fs.map((f) => {
        const d = template.fields.find((x) => x.key === f.key);
        return d && !f.custom ? { ...f, x: d.x, y: d.y, size: d.size, color: "#000000" } : f;
      })
    );
  };

  // ---- drag on the preview ----
  const toPercent = useCallback((e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { px: ((e.clientX - rect.left) / rect.width) * 100, py: ((e.clientY - rect.top) / rect.height) * 100 };
  }, []);

  const hitTest = (px: number, py: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return null;
    for (let i = fields.length - 1; i >= 0; i--) {
      const f = fields[i];
      const shown = f.text || (f.id === selectedId ? f.label : "");
      if (!shown) continue;
      ctx.font = FONT(f.size);
      const halfW = ((ctx.measureText(shown).width / 2 + f.size * 0.3) / canvas.width) * 100;
      const halfH = ((f.size * 0.75) / canvas.height) * 100;
      if (Math.abs(px - f.x) <= halfW && Math.abs(py - f.y) <= halfH) return f;
    }
    return null;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { px, py } = toPercent(e);
    const hit = hitTest(px, py);
    if (!hit) return;
    setSelectedId(hit.id);
    drag.current = { id: hit.id, dx: px - hit.x, dy: py - hit.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { px, py } = toPercent(e);
    if (!drag.current) {
      e.currentTarget.style.cursor = hitTest(px, py) ? "grab" : "default";
      return;
    }
    e.currentTarget.style.cursor = "grabbing";
    const { id, dx, dy } = drag.current;
    update(id, { x: Math.round(clamp(px - dx, 0, 100) * 10) / 10, y: Math.round(clamp(py - dy, 0, 100) * 10) / 10 });
  };

  const endDrag = () => {
    drag.current = null;
  };

  const handleDownload = () => {
    if (!img) return;
    const out = document.createElement("canvas");
    out.width = img.naturalWidth;
    out.height = img.naturalHeight;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    paint(ctx, img, fields, null, false); // clean render: no guides
    const who = fields.find((f) => f.key === "name")?.text.trim();
    const file = `${template.name}${who ? ` - ${who}` : ""}.png`.replace(/[\\/:*?"<>|]/g, "");
    out.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const inputClass =
    "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates"
        description="Pick a form, type the member's details, then download the finished certificate as an image to print."
        actions={
          <Button onClick={handleDownload} disabled={!img} className="h-10 gap-2 rounded-xl bg-[#ED1C24] px-5 text-xs font-bold text-white hover:bg-black">
            <Download className="h-4 w-4" /> Download PNG
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="1. Choose a form">
            <div className="grid gap-2" role="radiogroup" aria-label="Certificate form">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  role="radio"
                  aria-checked={template.id === t.id}
                  onClick={() => chooseTemplate(t)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left transition-colors",
                    template.id === t.id ? "border-[#ED1C24] bg-red-50" : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <span className={cn("block text-sm font-bold", template.id === t.id ? "text-[#B5121B]" : "text-gray-900")}>{t.name}</span>
                  <span className="block text-xs text-gray-500">{t.hint}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel
            title="2. Fill in the details"
            description="Leave a field empty to keep that line blank."
            actions={
              <button onClick={resetPositions} className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-black" title="Put every field back on its printed line">
                <RotateCcw className="h-3 w-3" /> Reset layout
              </button>
            }
          >
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="mb-1 flex items-center justify-between text-xs font-bold text-gray-700">
                    {f.label}
                    {f.custom && (
                      <button onClick={() => removeText(f.id)} className="text-gray-400 hover:text-red-600" aria-label={`Remove ${f.label}`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </label>
                  <input
                    id={f.id}
                    value={f.text}
                    onFocus={() => setSelectedId(f.id)}
                    onChange={(e) => update(f.id, { text: e.target.value })}
                    placeholder={f.custom ? "Type any text" : "Leave blank"}
                    className={cn(inputClass, selectedId === f.id && "border-[#ED1C24]")}
                  />
                </div>
              ))}
              <button onClick={addText} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B5121B] hover:underline">
                <Plus className="h-3.5 w-3.5" /> Add extra text
              </button>
            </div>
          </Panel>

          {selected && (
            <Panel title={`Adjust: ${selected.label}`} description="Fine-tune the selected field. You can also drag it on the preview.">
              <div className="space-y-4">
                <Slider label="Size" value={selected.size} suffix="px" min={20} max={240} onChange={(v) => update(selected.id, { size: v })} />
                <Slider label="Left to right" value={selected.x} suffix="%" min={0} max={100} step={0.5} onChange={(v) => update(selected.id, { x: v })} />
                <Slider label="Top to bottom" value={selected.y} suffix="%" min={0} max={100} step={0.5} onChange={(v) => update(selected.id, { y: v })} />
                <div className="flex items-center gap-3">
                  <label htmlFor="field-color" className="text-xs font-bold text-gray-700">
                    Text color
                  </label>
                  <input
                    id="field-color"
                    type="color"
                    value={selected.color}
                    onChange={(e) => update(selected.id, { color: e.target.value })}
                    className="h-8 w-12 cursor-pointer rounded border border-gray-200 p-0.5"
                  />
                </div>
              </div>
            </Panel>
          )}
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <Panel
            title="Preview"
            description={
              <span className="inline-flex items-center gap-1.5">
                <Move className="h-3.5 w-3.5" /> Drag any text to move it. The dashed box marks the selected field and does not print.
              </span>
            }
            bodyClassName="bg-gray-50 rounded-xl p-3 sm:p-4"
          >
            {loadError ? (
              <p className="p-10 text-center text-sm text-gray-500">This form image could not be loaded. Check your connection and pick the form again.</p>
            ) : !img ? (
              <p className="p-10 text-center text-sm text-gray-500">Loading form…</p>
            ) : null}
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              aria-label={`${template.name} preview`}
              className={cn("mx-auto h-auto max-w-full touch-none bg-white shadow-sm", !img && "hidden")}
              style={{ maxHeight: "78vh" }}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, suffix, min, max, step = 1, onChange }: { label: string; value: number; suffix: string; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-xs font-bold text-gray-700">
        {label}
        <span className="tabular-nums text-gray-500">
          {value}
          {suffix}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#ED1C24]" />
    </label>
  );
}
