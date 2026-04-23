"use client";

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
  Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";

type FormField = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "number" | "date";
  required: boolean;
  unique: boolean;
  placeholder: string;
  options?: { label: string; value: string }[];
  dataSource?: string;
};

const FieldItem = ({ field, updateField, removeField, isCoreField }: { field: FormField, updateField: any, removeField: any, isCoreField: any }) => {
  const dragControls = useDragControls();

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

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Label</Label>
          <Input 
            value={field.label} 
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className="h-11 rounded-xl bg-gray-50 border-none font-bold text-sm text-black"
          />
        </div>

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

        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Placeholder</Label>
          <Input 
            value={field.placeholder} 
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            className="h-11 rounded-xl bg-gray-50 border-none font-bold text-sm text-black"
          />
        </div>

        <div className="flex flex-col justify-center gap-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Required</Label>
          <div 
            onClick={() => updateField(field.id, { required: !field.required })}
            className={cn(
              "w-12 h-6 rounded-full transition-all cursor-pointer relative",
              field.required ? "bg-[#ED1C24]" : "bg-gray-200"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
              field.required ? "left-7" : "left-1"
            )} />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-black ml-1">Unique</Label>
          <div 
            onClick={() => updateField(field.id, { unique: !field.unique })}
            className={cn(
              "w-12 h-6 rounded-full transition-all cursor-pointer relative",
              field.unique ? "bg-blue-600" : "bg-gray-200"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
              field.unique ? "left-7" : "left-1"
            )} />
          </div>
        </div>

        {field.type === 'select' && (
          <div className="md:col-span-4 mt-8 p-8 bg-gray-50/80 rounded-[32px] border border-gray-100 space-y-6 shadow-inner">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
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

export default function FormConfigurationPage() {
  const [formType, setFormType] = useState<"MEMBER" | "VOLUNTEER">("MEMBER");
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, [formType]);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/config/form?type=${formType}`);
      const data = JSON.parse(res.data.fields_json);
      setFields(data);
    } catch (err) {
      console.error("Failed to fetch form config:", err);
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
      placeholder: "Enter value..." 
    }]);
  };

  const isCoreField = (id: string) => {
    const coreIds = ["firstName", "fatherName", "grandfatherName", "email", "phone", "region"];
    return coreIds.includes(id);
  };

  const removeField = (id: string) => {
    if (isCoreField(id)) {
      toast.error("Core fields cannot be removed.");
      return;
    }
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Settings2 className="h-3.5 w-3.5" /> Portal Configuration
          </div>
          <h1 className="text-4xl font-black text-black tracking-tighter">Form Designer</h1>
          <p className="text-gray-500 font-medium text-base">Customize the registration flow for volunteers and members.</p>
        </div>

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

      <div className="w-full grid lg:grid-cols-[1fr_420px] gap-6 items-start">
        
        {/* Designer Side */}
        <div className="space-y-4">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-black text-black uppercase tracking-widest text-xs">Form Fields</h3>
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
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <Layout className="h-5 w-5 text-[#ED1C24]" />
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-[#ED1C24]">Real-time Preview</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                    <h4 className="text-2xl font-black tracking-tighter">Registration Page</h4>
                    <p className="text-gray-400 text-sm font-medium">This is how the {formType.toLowerCase()} will see it.</p>
                </div>
                
                <div className="space-y-4">
                  {fields.map(field => (
                    <div key={`prev_${field.id}`} className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{field.label}</span>
                            {field.required && <span className="text-[8px] font-bold text-red-500">REQUIRED</span>}
                        </div>
                        <div className="h-10 w-full bg-white/5 border border-white/10 rounded-xl px-4 flex items-center text-xs text-white/30 font-bold overflow-hidden">
                            {field.placeholder}
                        </div>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <div className="h-12 w-full bg-[#ED1C24] rounded-xl flex items-center justify-center font-black text-sm text-white shadow-lg shadow-red-500/20">
                      Sign Up <ChevronRight className="h-4 w-4 ml-1" />
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
