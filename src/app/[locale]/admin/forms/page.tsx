"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Save, 
  Users, 
  HandHeart, 
  ChevronRight,
  GripVertical,
  Check,
  Layout,
  Settings2,
  Loader2,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Cell, CellValue } from "exceljs";

type FormField = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "number" | "date";
  required: boolean;
  unique: boolean;
  placeholder: string;
  options?: { label: string; value: string }[];
  dataSource?: string;
  sourceColumn?: string;
  nullableCount?: number;
  duplicateCount?: number;
  sampleValues?: string[];
  audience?: "ALL" | "INDIVIDUAL" | "CORPORATE";
};

type ExcelCellValue = string | number | boolean | null;

const normalizeFieldId = (value: string) => {
  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char: string) => char.toUpperCase())
    .replace(/^[^a-zA-Z]+/, "");
  return cleaned ? cleaned.charAt(0).toLowerCase() + cleaned.slice(1) : `field_${Date.now()}`;
};

const readExcelCell = (cell: Cell): ExcelCellValue => {
  const value = cell?.value;
  if (value === undefined || value === null || value === "") return null;
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (typeof value === "object") {
    if ("text" in value) return String(value.text).trim() || null;
    if ("result" in value) return value.result === undefined || value.result === null ? null : String(value.result).trim();
    if ("richText" in value && Array.isArray(value.richText)) {
      const text = value.richText.map((part: { text?: string }) => part.text || "").join("").trim();
      return text || null;
    }
    return JSON.stringify(value);
  }
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") return value;
  return String(value).trim() || null;
};

const inferFieldType = (label: string, values: string[]): FormField["type"] => {
  const normalized = label.toLowerCase();
  if (normalized.includes("email")) return "email";
  if (normalized.includes("mobile") || normalized.includes("phone") || normalized.includes("tel")) return "tel";
  if (normalized.includes("date")) return "date";
  if (values.length > 0 && values.every(value => /^-?\d+(\.\d+)?$/.test(value))) return "number";
  const uniqueValues = new Set(values.map(value => value.toLowerCase()));
  if (uniqueValues.size > 0 && uniqueValues.size <= 12 && values.length >= uniqueValues.size) return "select";
  return "text";
};

const buildOptions = (values: string[]) => {
  return Array.from(new Set(values.filter(Boolean))).slice(0, 50).map(value => ({
    label: value,
    value,
  }));
};

const FieldItem = ({ field, updateField, removeField, isCoreField }: { field: FormField, updateField: any, removeField: any, isCoreField: any }) => {
  const dragControls = useDragControls();
  const currentAudience = field.audience || "ALL";

  return (
    <Reorder.Item
      value={field}
      layout
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#ED1C24]/30 hover:shadow-xl hover:shadow-red-500/5 transition-all flex items-start gap-6 relative"
    >
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        className="pt-2 text-gray-300 group-hover:text-[#ED1C24] transition-colors cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Label */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Label</Label>
          <Input 
            value={field.label} 
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className="h-11 rounded-xl bg-gray-50 border-none font-bold text-sm text-black"
          />
          {field.sourceColumn && (
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[8px] font-black uppercase tracking-widest text-gray-500">
                Excel: {field.sourceColumn}
              </span>
              <span className={cn(
                "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest",
                field.nullableCount === 0 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
              )}>
                Nulls: {field.nullableCount || 0}
              </span>
            </div>
          )}
        </div>

        {/* Input Type */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Input Type</Label>
          <select 
            value={field.type}
            onChange={(e) => updateField(field.id, { type: e.target.value as any })}
            className="flex h-11 w-full rounded-xl bg-gray-50 border-none px-4 py-2 text-sm font-bold focus:ring-1 focus:ring-red-500/10 appearance-none transition-all text-black"
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="tel">Phone</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="select">Select</option>
          </select>
        </div>

        {/* Audience / Applicability */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Target Audience</Label>
            <span className={cn(
              "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
              currentAudience === "ALL" ? "bg-gray-100 text-gray-600" :
              currentAudience === "INDIVIDUAL" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
            )}>
              {currentAudience}
            </span>
          </div>
          <select 
            value={currentAudience}
            onChange={(e) => updateField(field.id, { audience: e.target.value as any })}
            className="flex h-11 w-full rounded-xl bg-gray-50 border-none px-3 py-2 text-xs font-black text-gray-900 focus:ring-1 focus:ring-red-500/10 appearance-none transition-all cursor-pointer"
          >
            <option value="ALL">Both (Individual & Corporate)</option>
            <option value="INDIVIDUAL">Individual Only</option>
            <option value="CORPORATE">Corporate Only</option>
          </select>
        </div>

        {/* Placeholder */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Placeholder</Label>
          <Input 
            value={field.placeholder} 
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            className="h-11 rounded-xl bg-gray-50 border-none font-bold text-sm text-black"
          />
        </div>

        {/* Switches */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex flex-col items-center gap-1.5">
            <Label className="text-[9px] font-black uppercase tracking-widest text-black">Required</Label>
            <div 
              onClick={() => updateField(field.id, { required: !field.required })}
              className={cn(
                "w-10 h-5 rounded-full transition-all cursor-pointer relative",
                field.required ? "bg-[#ED1C24]" : "bg-gray-200"
              )}
            >
              <div className={cn(
                "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
                field.required ? "left-5" : "left-0.5"
              )} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <Label className="text-[9px] font-black uppercase tracking-widest text-black">Unique</Label>
            <div 
              onClick={() => updateField(field.id, { unique: !field.unique })}
              className={cn(
                "w-10 h-5 rounded-full transition-all cursor-pointer relative",
                field.unique ? "bg-blue-600" : "bg-gray-200"
              )}
            >
              <div className={cn(
                "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
                field.unique ? "left-5" : "left-0.5"
              )} />
            </div>
          </div>
        </div>

        {field.type === 'select' && (
          <div className="md:col-span-5 mt-6 p-6 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="space-y-1 flex-1">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Data Source Mode</Label>
                     <div className="flex gap-4 mt-1">
                        <select 
                          value={field.dataSource || "MANUAL"}
                          onChange={(e) => updateField(field.id, { dataSource: e.target.value as any })}
                          className="h-10 px-4 bg-white border border-gray-100 rounded-xl text-xs font-black text-black focus:ring-0 focus:border-[#ED1C24] transition-colors appearance-none min-w-[200px]"
                        >
                          <option value="MANUAL">Custom List (Manual)</option>
                          <option value="REGIONS">System: Regions Table</option>
                          <option value="MEMBERSHIP_TYPES">System: Membership Plans</option>
                          <option value="GENDER">System: Gender Options</option>
                        </select>
                        <p className="text-[9px] font-bold text-black/40 mt-3 italic">
                          {field.dataSource === 'REGIONS' ? "Pulls all active regions automatically." : 
                           field.dataSource === 'MEMBERSHIP_TYPES' ? "Pulls all defined membership tiers." :
                           field.dataSource === 'GENDER' ? "Uses standard male/female/other options." :
                           "Add manual labels and values for this dropdown."}
                        </p>
                     </div>
                  </div>
                  
                  {(field.dataSource === 'MANUAL' || !field.dataSource) && (
                    <Button 
                        onClick={() => {
                          const options = field.options || [];
                          updateField(field.id, { options: [...options, { label: "New Option", value: "" }] });
                        }}
                        className="h-10 bg-black hover:bg-[#ED1C24] text-white text-[10px] font-black uppercase tracking-widest px-6 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" /> Add Option
                    </Button>
                  )}
              </div>
              
              {(field.dataSource === 'MANUAL' || !field.dataSource) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(field.options || []).map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm group/opt">
                        <div className="flex-1 space-y-1">
                            <Label className="text-[8px] font-black uppercase tracking-widest text-black/30 ml-1">Label</Label>
                            <Input 
                              placeholder="Display Label" 
                              value={opt.label} 
                              onChange={(e) => {
                                const options = [...(field.options || [])];
                                options[idx].label = e.target.value;
                                updateField(field.id, { options });
                              }}
                              className="h-10 bg-gray-50/50 border-none text-xs font-black text-black ring-offset-white focus-visible:ring-1 focus-visible:ring-red-500/10"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label className="text-[8px] font-black uppercase tracking-widest text-black/30 ml-1">Value</Label>
                            <Input 
                              placeholder="Stored Value" 
                              value={opt.value} 
                              onChange={(e) => {
                                const options = [...(field.options || [])];
                                options[idx].value = e.target.value;
                                updateField(field.id, { options });
                              }}
                              className="h-10 bg-gray-50/50 border-none text-xs font-black text-[#ED1C24] ring-offset-white focus-visible:ring-1 focus-visible:ring-red-500/10 uppercase"
                            />
                        </div>
                        <button 
                          onClick={() => {
                            updateField(field.id, { options: field.options?.filter((_, i) => i !== idx) });
                          }}
                          className="mt-5 p-2.5 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                  ))}
                </div>
              ) : null}
          </div>
        )}
      </div>

      <button 
        onClick={() => removeField(field.id)}
        disabled={isCoreField(field.id)}
        className={cn(
          "p-2 transition-colors opacity-0 group-hover:opacity-100",
          isCoreField(field.id) ? "text-gray-100 cursor-not-allowed" : "text-gray-300 hover:text-red-500"
        )}
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </Reorder.Item>
  );
};

const DEFAULT_VOLUNTEER_FIELDS: FormField[] = [
  { id: "phone", label: "Phone Number", type: "tel", required: true, unique: true, placeholder: "Enter phone number", audience: "ALL" },
  { id: "firstName", label: "First Name", type: "text", required: true, unique: false, placeholder: "e.g. Sara", audience: "ALL" },
  { id: "fatherName", label: "Father Name", type: "text", required: true, unique: false, placeholder: "e.g. Belay", audience: "INDIVIDUAL" },
  { id: "grandfatherName", label: "Grandfather Name", type: "text", required: true, unique: false, placeholder: "e.g. Tadesse", audience: "INDIVIDUAL" },
  { id: "gender", label: "Gender", type: "select", required: true, unique: false, placeholder: "Select Gender", dataSource: "GENDER", audience: "INDIVIDUAL" },
  { id: "country", label: "Country", type: "select", required: true, unique: false, placeholder: "Select Country", dataSource: "COUNTRIES", audience: "ALL" },
  { id: "region", label: "Region", type: "select", required: true, unique: false, placeholder: "Select Region", dataSource: "REGIONS", audience: "ALL" },
  { id: "zone", label: "Zone", type: "text", required: true, unique: false, placeholder: "Enter Zone", audience: "ALL" },
  { id: "woreda", label: "Woreda", type: "text", required: false, unique: false, placeholder: "Enter Woreda", audience: "ALL" },
  { id: "kebele", label: "Kebele/House No.", type: "text", required: false, unique: false, placeholder: "Enter Kebele/House No.", audience: "ALL" },
  { id: "dateOfBirth", label: "Date of Birth (Eth)", type: "date", required: false, unique: false, placeholder: "DD/MM/YYYY (Ethiopian Calendar)", audience: "INDIVIDUAL" },
  { id: "email", label: "Email Address", type: "email", required: false, unique: false, placeholder: "sara@example.com", audience: "ALL" },
  { id: "occupation", label: "Occupation", type: "select", required: false, unique: false, placeholder: "Select Occupation", dataSource: "MANUAL", audience: "INDIVIDUAL", options: [
    { label: "Farmer", value: "Farmer" },
    { label: "Business Person", value: "Business Person" },
    { label: "Civil Servant", value: "Civil Servant" },
    { label: "House Wife", value: "House Wife" },
    { label: "Military", value: "Military" },
    { label: "NGO", value: "NGO" },
    { label: "Self Employed", value: "Self Employed" },
    { label: "Student", value: "Student" },
    { label: "Police", value: "Police" },
    { label: "Diplomat", value: "Diplomat" },
    { label: "Others", value: "Others" }
  ]},
  { id: "organizationName", label: "Organization Name", type: "text", required: false, unique: false, placeholder: "Enter Organization Name", audience: "CORPORATE" },
  { id: "organizationType", label: "Organization Type", type: "select", required: false, unique: false, placeholder: "Select Organization Type", dataSource: "MANUAL", audience: "CORPORATE", options: [
    { label: "Government", value: "Government" },
    { label: "Ngo", value: "Ngo" },
    { label: "Private", value: "Private" },
    { label: "Association", value: "Association" }
  ]},
  { id: "educationLevel", label: "Education Level", type: "select", required: false, unique: false, placeholder: "Select Education Level", dataSource: "MANUAL", audience: "INDIVIDUAL", options: [
    { label: "Below Primary School", value: "Below Primary School" },
    { label: "Primary School Completed", value: "Primary School Completed" },
    { label: "High School Completed", value: "High School Completed" },
    { label: "Degree", value: "Degree" },
    { label: "Masters", value: "Masters" },
    { label: "PHD", value: "PHD" }
  ]},
  { id: "area", label: "Area", type: "select", required: false, unique: false, placeholder: "Select Area", dataSource: "MANUAL", audience: "ALL", options: [
    { label: "URBAN", value: "URBAN" },
    { label: "RURAL", value: "RURAL" }
  ]},
  { id: "languages", label: "Languages", type: "text", required: false, unique: false, placeholder: "e.g. Amharic, English", audience: "ALL" },
  { id: "general", label: "General Classification", type: "select", required: false, unique: false, placeholder: "Select", dataSource: "MANUAL", audience: "ALL", options: [
    { label: "YES", value: "YES" },
    { label: "NO", value: "NO" }
  ]},
  { id: "youth", label: "Youth Classification", type: "select", required: false, unique: false, placeholder: "Select", dataSource: "MANUAL", audience: "ALL", options: [
    { label: "YES", value: "YES" },
    { label: "NO", value: "NO" }
  ]},
  { id: "professional", label: "Professional Classification", type: "select", required: false, unique: false, placeholder: "Select", dataSource: "MANUAL", audience: "ALL", options: [
    { label: "YES", value: "YES" },
    { label: "NO", value: "NO" }
  ]},
  { id: "leadership", label: "Leadership Classification", type: "select", required: false, unique: false, placeholder: "Select", dataSource: "MANUAL", audience: "ALL", options: [
    { label: "YES", value: "YES" },
    { label: "NO", value: "NO" }
  ]}
];

const DEFAULT_MEMBER_FIELDS: FormField[] = [
  { id: "phone", label: "Phone Number", type: "tel", required: true, unique: true, placeholder: "Enter phone number", audience: "ALL" },
  { id: "firstName", label: "First Name", type: "text", required: true, unique: false, placeholder: "e.g. Abebe", audience: "ALL" },
  { id: "fatherName", label: "Father Name", type: "text", required: true, unique: false, placeholder: "e.g. Kebede", audience: "INDIVIDUAL" },
  { id: "grandfatherName", label: "Grandfather Name", type: "text", required: true, unique: false, placeholder: "e.g. Tadesse", audience: "INDIVIDUAL" },
  { id: "gender", label: "Gender", type: "select", required: true, unique: false, placeholder: "Select Gender", dataSource: "GENDER", audience: "INDIVIDUAL" },
  { id: "country", label: "Country", type: "select", required: true, unique: false, placeholder: "Select Country", dataSource: "COUNTRIES", audience: "ALL" },
  { id: "region", label: "Region", type: "select", required: true, unique: false, placeholder: "Select Region", dataSource: "REGIONS", audience: "ALL" },
  { id: "zone", label: "Zone", type: "text", required: true, unique: false, placeholder: "Enter Zone", audience: "ALL" },
  { id: "woreda", label: "Woreda", type: "text", required: false, unique: false, placeholder: "Enter Woreda", audience: "ALL" },
  { id: "kebele", label: "Kebele/House No.", type: "text", required: false, unique: false, placeholder: "Enter Kebele/House No.", audience: "ALL" },
  { id: "dateOfBirth", label: "Date of Birth (Eth)", type: "date", required: false, unique: false, placeholder: "DD/MM/YYYY (Ethiopian Calendar)", audience: "INDIVIDUAL" },
  { id: "email", label: "Email Address", type: "email", required: false, unique: false, placeholder: "abebe@example.com", audience: "ALL" },
  { id: "occupation", label: "Occupation", type: "select", required: false, unique: false, placeholder: "Select Occupation", dataSource: "MANUAL", audience: "INDIVIDUAL", options: [
    { label: "Farmer", value: "Farmer" },
    { label: "Business Person", value: "Business Person" },
    { label: "Civil Servant", value: "Civil Servant" },
    { label: "House Wife", value: "House Wife" },
    { label: "Military", value: "Military" },
    { label: "NGO", value: "NGO" },
    { label: "Self Employed", value: "Self Employed" },
    { label: "Student", value: "Student" },
    { label: "Police", value: "Police" },
    { label: "Diplomat", value: "Diplomat" },
    { label: "Others", value: "Others" }
  ]},
  { id: "organizationName", label: "Organization Name", type: "text", required: false, unique: false, placeholder: "Enter Organization Name", audience: "CORPORATE" },
  { id: "educationLevel", label: "Education Level", type: "select", required: false, unique: false, placeholder: "Select Education Level", dataSource: "MANUAL", audience: "INDIVIDUAL", options: [
    { label: "Below Primary School", value: "Below Primary School" },
    { label: "Primary School Completed", value: "Primary School Completed" },
    { label: "High School Completed", value: "High School Completed" },
    { label: "Degree", value: "Degree" },
    { label: "Masters", value: "Masters" },
    { label: "PHD", value: "PHD" }
  ]},
  { id: "area", label: "Area", type: "select", required: false, unique: false, placeholder: "Select Area", dataSource: "MANUAL", audience: "ALL", options: [
    { label: "URBAN", value: "URBAN" },
    { label: "RURAL", value: "RURAL" }
  ]},
  { id: "languages", label: "Languages", type: "text", required: false, unique: false, placeholder: "e.g. Amharic, English", audience: "ALL" }
];

export default function FormConfigurationPage() {
  const [formType, setFormType] = useState<"MEMBER" | "VOLUNTEER">("MEMBER");
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [importingExcel, setImportingExcel] = useState(false);
  const [previewAudience, setPreviewAudience] = useState<"ALL" | "INDIVIDUAL" | "CORPORATE">("ALL");

  useEffect(() => {
    fetchConfig();
  }, [formType]);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/config/form?type=${formType}`);
      const data = JSON.parse(res.data.fields_json);
      if (Array.isArray(data) && data.length > 0) {
        setFields(data);
      } else {
        setFields(formType === "VOLUNTEER" ? DEFAULT_VOLUNTEER_FIELDS : DEFAULT_MEMBER_FIELDS);
      }
    } catch (err) {
      console.error("Failed to fetch form config:", err);
      setFields(formType === "VOLUNTEER" ? DEFAULT_VOLUNTEER_FIELDS : DEFAULT_MEMBER_FIELDS);
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    const newId = `field_${Date.now()}`;
    setFields([...fields, { 
      id: newId, 
      label: "New Field", 
      type: "text", 
      required: false, 
      unique: false,
      placeholder: "Enter value...",
      audience: "ALL"
    }]);
  };

  const isCoreField = (id: string) => {
    const coreIds = ["country", "region", "zone", "woreda", "kebele", "firstName", "fatherName", "grandfatherName", "email", "phone", "gender", "dateOfBirth"];
    return coreIds.includes(id);
  };

  const removeField = (id: string) => {
    if (isCoreField(id)) return;
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const importFieldsFromExcel = async (file?: File) => {
    if (!file) return;
    setImportingExcel(true);
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        toast.error("No worksheets found in the Excel file");
        return;
      }

      const rows: any[][] = [];
      worksheet.eachRow((row) => {
        const rowValues: any[] = [];
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          rowValues[colNumber - 1] = cell.value;
        });
        rows.push(rowValues);
      });

      const headerRowIndex = rows.findIndex(row => row.some(cell => typeof cell === "string" && cell.trim() !== ""));
      if (headerRowIndex === -1) {
        toast.error("No valid header row found");
        return;
      }

      const headerRowNumber = headerRowIndex + 1;
      const headerRow = rows[headerRowIndex];
      const rawHeaders = headerRow.map((cell, idx) => {
        if (typeof cell === "string" && cell.trim() !== "") return cell.trim();
        return `Column ${idx + 1}`;
      });

      const seenHeaders = new Map<string, number>();
      const uniqueHeaders = rawHeaders.map(header => {
        const base = header.trim();
        const seen = seenHeaders.get(base) || 0;
        seenHeaders.set(base, seen + 1);
        return seen === 0 ? base : `${base} ${seen + 1}`;
      });

      const generatedFields = uniqueHeaders.map((header, index) => {
        const idBase = header.toLowerCase().replace(/\s+/g, '_');
        const id = fields.some(field => field.id === idBase) ? `${idBase}_${Date.now()}_${index}` : idBase;

        return {
          id,
          label: header,
          type: "text",
          required: false,
          unique: false,
          placeholder: `Enter ${header}`,
          audience: "ALL"
        } satisfies FormField;
      });

      setFields(generatedFields);
      toast.success(`Loaded ${generatedFields.length} fields from ${file.name}`);
    } catch (err) {
      console.error("Failed to import Excel form fields:", err);
      toast.error("Failed to read Excel columns");
    } finally {
      setImportingExcel(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/config/form", {
        form_type: formType,
        fields_json: JSON.stringify(fields)
      });
      setSuccess(true);
      toast.success(`${formType.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())} form configuration saved successfully.`);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save config:", err);
      toast.error("Failed to save form configuration. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const filteredPreviewFields = fields.filter(field => {
    if (previewAudience === "ALL") return true;
    const aud = field.audience || "ALL";
    return aud === "ALL" || aud === previewAudience;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Settings2 className="h-3.5 w-3.5" /> Portal Configuration
          </div>
          <h1 className="text-4xl font-black text-black tracking-tighter">Form Designer</h1>
          <p className="text-gray-500 font-medium text-base">Customize dynamic registration fields for Individual and Corporate members.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="h-12 px-5 rounded-2xl border border-gray-200 bg-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
            {importingExcel ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 text-[#ED1C24]" />}
            Import Excel Columns
            <input
              type="file"
              accept=".xlsx"
              className="hidden"
              disabled={importingExcel || saving}
              onChange={(e) => importFieldsFromExcel(e.target.files?.[0])}
            />
          </label>

          <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
            <button 
              onClick={() => setFormType("MEMBER")}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                formType === "MEMBER" ? "bg-white text-black shadow-md" : "text-gray-500 hover:text-black"
              )}
            >
              <Users className="h-4 w-4" /> Members
            </button>
            <button 
              onClick={() => setFormType("VOLUNTEER")}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                formType === "VOLUNTEER" ? "bg-white text-black shadow-md" : "text-gray-500 hover:text-black"
              )}
            >
              <HandHeart className="h-4 w-4" /> Volunteers
            </button>
          </div>
        </div>
      </div>

      <div className="w-full grid lg:grid-cols-[1fr_420px] gap-6 items-start">
        
        {/* Designer Side */}
        <div className="space-y-4">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <h3 className="font-black text-black uppercase tracking-widest text-xs">Form Fields ({fields.length})</h3>
                <span className="text-[10px] font-bold text-gray-400">Drag to reorder • Configure audience per field</span>
              </div>
              <Button onClick={addField} size="sm" className="bg-[#ED1C24] hover:bg-black rounded-xl h-9 px-4 text-xs font-black">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Field
              </Button>
            </div>
            
            <div className="p-4">
              <Reorder.Group axis="y" values={fields} onReorder={setFields} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {fields.map((field) => (
                    <FieldItem 
                      key={field.id} 
                      field={field} 
                      updateField={updateField} 
                      removeField={removeField} 
                      isCoreField={isCoreField} 
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </div>
            
            <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-end">
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className={cn(
                        "h-12 rounded-xl px-10 font-black transition-all text-white shadow-xl flex items-center gap-2",
                        success ? "bg-green-500" : "bg-black hover:bg-[#ED1C24] shadow-red-500/10"
                    )}
                >
                    {saving ? "Saving Changes..." : success ? <><Check className="h-5 w-5" /> Saved Successfully</> : <><Save className="h-5 w-5" /> Save Configuration</>}
                </Button>
            </div>
          </div>
        </div>

        {/* Preview Pane */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden h-fit sticky top-24">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layout className="h-4 w-4 text-[#ED1C24]" />
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-[#ED1C24]">Real-time Preview</h3>
                </div>
              </div>

              {/* Preview Audience Switcher */}
              <div className="grid grid-cols-3 gap-1 bg-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewAudience("ALL")}
                  className={cn(
                    "py-1.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                    previewAudience === "ALL" ? "bg-white text-black shadow-sm" : "text-white/60 hover:text-white"
                  )}
                >
                  All Fields
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAudience("INDIVIDUAL")}
                  className={cn(
                    "py-1.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                    previewAudience === "INDIVIDUAL" ? "bg-[#ED1C24] text-white shadow-sm" : "text-white/60 hover:text-white"
                  )}
                >
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAudience("CORPORATE")}
                  className={cn(
                    "py-1.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                    previewAudience === "CORPORATE" ? "bg-purple-600 text-white shadow-sm" : "text-white/60 hover:text-white"
                  )}
                >
                  Corporate
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-0.5">
                    <h4 className="text-xl font-black tracking-tighter">
                      {previewAudience === "CORPORATE" ? "Corporate Registration" : 
                       previewAudience === "INDIVIDUAL" ? "Individual Registration" : "Full Form View"}
                    </h4>
                    <p className="text-gray-400 text-xs font-medium">
                      Showing {filteredPreviewFields.length} active fields for {previewAudience.toLowerCase()}.
                    </p>
                </div>
                
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {filteredPreviewFields.map(field => (
                    <div key={`prev_${field.id}`} className="space-y-1">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                              {field.id === "name" && previewAudience === "CORPORATE" ? "Organization Name" : 
                               field.id === "phone" && previewAudience === "CORPORATE" ? "Organization Mobile" : field.label}
                              {field.audience && field.audience !== "ALL" && (
                                <span className="text-[7px] px-1 py-0.2 rounded bg-white/10 text-white/70">
                                  {field.audience}
                                </span>
                              )}
                            </span>
                            {field.required && <span className="text-[8px] font-bold text-red-500">REQUIRED</span>}
                        </div>
                        <div className="h-9 w-full bg-white/5 border border-white/10 rounded-xl px-3 flex items-center text-xs text-white/40 font-medium overflow-hidden">
                            {field.id === "name" && previewAudience === "CORPORATE" ? "e.g. Commercial Bank of Ethiopia" :
                             field.id === "phone" && previewAudience === "CORPORATE" ? "0911..." : field.placeholder}
                        </div>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <div className="h-11 w-full bg-[#ED1C24] rounded-xl flex items-center justify-center font-black text-xs text-white shadow-lg shadow-red-500/20">
                      Sign Up & Continue <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
