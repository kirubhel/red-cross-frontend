"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Users,
  Plus,
  Filter,
  Download,
  FileText,
  Table as TableIcon,
  X,
  Upload,
  ArrowUpRight,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Map as MapIcon,
  CheckSquare,
  Square,
  MinusSquare,
  Check,
  Copy,
  Calendar,
  Briefcase,
  GraduationCap,
  Building,
  Clock,
  ShieldCheck,
  Eye,
  Sparkles,
  UserCheck,
  Hash,
  Camera,
  ExternalLink,
  BadgeCheck,
  Heart
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { AddMemberModal } from "@/components/admin/AddMemberModal";
import { resolveRegionId } from "@/lib/constants";
import { GeographicMapReport } from "@/components/admin/GeographicMapReport";
import { getUserScope } from "@/lib/auth-scope";

type Member = {
  id: string;
  first_name: string;
  father_name: string;
  grandfather_name?: string;
  email?: string;
  phone_number?: string;
  national_id?: string;
  gender?: string;
  date_of_birth?: string;
  photo_url?: string;
  region: any;
  status: string;
  ercs_id: string;
  membership_type?: string;
  metadata?: string;
  zone_id?: string;
  woreda_id?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
};

const resolvePhotoUrl = (url?: string | null) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined" || trimmed === "N/A") return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:image/")) {
    return trimmed;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://member.redcrosseth.org/api/v1";
  const hostBase = apiBase.replace(/\/api\/v1\/?$/, "");
  return `${hostBase}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
};

const getMemberPhoto = (m: any): string | null => {
  if (!m) return null;
  let meta: Record<string, any> = {};
  try {
    meta = typeof m?.metadata === "string" ? JSON.parse(m.metadata || "{}") : (m?.metadata || {});
  } catch {
    meta = {};
  }
  const photo = m?.photo_url || m?.photoUrl || m?.photo || m?.avatar_url || m?.avatarUrl || m?.avatar || m?.image || meta?.photo_url || meta?.photoUrl || meta?.photo || meta?.avatar || meta?.image;
  return resolvePhotoUrl(photo);
};

type Region = {
    id: number;
    name: string;
    code: string;
};

type Zone = { id: string; region_id: number; name: string; code: string };
type Woreda = { id: string; zone_id: string; name: string; code: string };
type MembershipPlan = { id: string; name: string; short_code: string; is_active: boolean };

const DEFAULT_REGIONS: Region[] = [
  { id: 1, name: "Addis Ababa", code: "AA" },
  { id: 2, name: "Dire Dawa", code: "DD" },
  { id: 3, name: "Tigray", code: "TG" },
  { id: 4, name: "Afar", code: "AF" },
  { id: 5, name: "Amhara", code: "AM" },
  { id: 6, name: "Oromia", code: "OR" },
  { id: 7, name: "Somali", code: "SM" },
  { id: 8, name: "Benishangul Gumz", code: "BG" },
  { id: 9, name: "Central Ethiopia", code: "CE" },
  { id: 10, name: "Gambela", code: "GM" },
  { id: 11, name: "Harari", code: "HR" },
  { id: 12, name: "Sidama", code: "SD" },
  { id: 13, name: "South West Ethiopia", code: "SW" },
  { id: 14, name: "South Ethiopia", code: "SE" }
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [regions, setRegions] = useState<Region[]>(DEFAULT_REGIONS);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [mainCategory, setMainCategory] = useState<string>("");
  const [zoneFilter, setZoneFilter] = useState<string>("");
  const [woredaFilter, setWoredaFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Import Modal & Branch/Region selection states
  const [showImportModal, setShowImportModal] = useState(false);
  const [parsedMembers, setParsedMembers] = useState<any[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const [selectedImportRegion, setSelectedImportRegion] = useState<string>("from_file");
  const [selectedImportZone, setSelectedImportZone] = useState<string>("from_file");
  const [selectedImportWoreda, setSelectedImportWoreda] = useState<string>("from_file");
  const [selectedImportBranch, setSelectedImportBranch] = useState<string>("from_file");
  const [selectedImportPlan, setSelectedImportPlan] = useState<string>("from_file");
  const [importZones, setImportZones] = useState<Zone[]>([]);
  const [importWoredas, setImportWoredas] = useState<Woreda[]>([]);
  const [importBranches, setImportBranches] = useState<any[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [memberImportErrors, setMemberImportErrors] = useState<string[]>([]);
  const [submittingImport, setSubmittingImport] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10;


  useEffect(() => {
    setIsMounted(true);
    fetchRegions();
    fetchMembershipPlans();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [showModal]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchMembers();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [search, page, regionFilter, statusFilter, typeFilter, zoneFilter, woredaFilter, mainCategory]);

  const fetchRegions = async () => {
    try {
        const [res, branchRes] = await Promise.all([
          api.get("/system-settings"),
          api.get("/location/branches").catch(() => ({ data: { branches: [] } }))
        ]);
        if (res.data && res.data.settings && res.data.settings.all_regions) {
            const parsed = JSON.parse(res.data.settings.all_regions);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setRegions(parsed);
            }
        }
        if (res.data?.settings?.locations_hierarchy) {
          const hierarchy = JSON.parse(res.data.settings.locations_hierarchy);
          setImportZones(hierarchy.zones || []);
          setImportWoredas(hierarchy.woredas || []);
        }
        if (branchRes.data?.branches) {
          setImportBranches(branchRes.data.branches);
        }
    } catch (err) {
        console.error("Failed to fetch regions:", err);
    }
  };

  const fetchMembershipPlans = async () => {
    try {
      const res = await api.get("/config/membership");
      setMembershipPlans((res.data.plans || []).filter((plan: MembershipPlan) => plan.is_active !== false));
    } catch (err) {
      console.error("Failed to fetch membership plans:", err);
    }
  };

  const resetImportAssignments = () => {
    setSelectedImportRegion("from_file");
    setSelectedImportZone("from_file");
    setSelectedImportWoreda("from_file");
    setSelectedImportBranch("from_file");
    setSelectedImportPlan("from_file");
    setMemberImportErrors([]);
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const scope = getUserScope();
      let effectiveRegion = regionFilter;
      let effectiveZone = zoneFilter;
      let effectiveWoreda = woredaFilter;
      let effectiveBranch = typeof window !== 'undefined' ? (localStorage.getItem("user_branch") || localStorage.getItem("user_branch_id")) : null;

      if (!scope.isSuperAdmin) {
        if (scope.regionId) effectiveRegion = scope.regionId;
        if (scope.zoneId) effectiveZone = scope.zoneId;
        if (scope.woredaId) effectiveWoreda = scope.woredaId;
        if (scope.branchId) effectiveBranch = scope.branchId;
      }

      let url = `/person?page=${page}&page_size=${pageSize}&search=${search}&region=${effectiveRegion}&status=${statusFilter}&type=${typeFilter}&zone=${effectiveZone}&woreda=${effectiveWoreda}&category=${mainCategory}`;
      if (effectiveBranch) {
        url += `&branch_id=${effectiveBranch}`;
      }
      const res = await api.get(url);
      setMembers(res.data.people || []);
      setTotalItems(res.data.pagination?.total_items || 0);
      setTotalPages(res.data.pagination?.total_pages || 1);
    } catch (err) {
      console.error("Failed to fetch members:", err);
      toast.error("Failed to sync member directory");
    } finally {
      setLoading(false);
    }
  };

  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleSelectMember = (id: string) => {
    setSelectedMemberIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isAllCurrentPageSelected = members.length > 0 && members.every(m => selectedMemberIds.has(m.id));
  const isSomeCurrentPageSelected = members.some(m => selectedMemberIds.has(m.id)) && !isAllCurrentPageSelected;

  const toggleSelectAllCurrentPage = () => {
    if (isAllCurrentPageSelected) {
      setSelectedMemberIds(prev => {
        const next = new Set(prev);
        members.forEach(m => next.delete(m.id));
        return next;
      });
    } else {
      setSelectedMemberIds(prev => {
        const next = new Set(prev);
        members.forEach(m => next.add(m.id));
        return next;
      });
    }
  };

  const clearSelection = () => {
    setSelectedMemberIds(new Set());
  };

  const exportToCSV = (membersToExport?: Member[]) => {
    const list = membersToExport && membersToExport.length > 0 
      ? membersToExport 
      : (selectedMemberIds.size > 0 
          ? members.filter(m => selectedMemberIds.has(m.id)) 
          : members);

    if (list.length === 0) {
        toast.error("No member data to export");
        return;
    }

    const headers = [
      "ERCS ID",
      "First Name",
      "Father Name",
      "Grandfather Name",
      "Full Name",
      "Gender",
      "Phone Number",
      "Email",
      "National ID",
      "Region",
      "Zone",
      "Woreda",
      "Branch Office",
      "Membership Category",
      "Status",
      "Occupation",
      "Organization Name",
      "Education Level",
      "Kebele",
      "Area",
      "Languages",
      "Registration Date"
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const stringified = String(str).trim();
      return `"${stringified.replace(/"/g, '""')}"`;
    };

    const rows = list.map(m => {
      let meta: Record<string, any> = {};
      try {
        meta = typeof m.metadata === "string" ? JSON.parse(m.metadata || "{}") : (m.metadata || {});
      } catch {
        meta = {};
      }
      const regionName = (regions || DEFAULT_REGIONS).find(r => String(r.id) === String(m.region))?.name || String(m.region || "");
      const fullName = [m.first_name, m.father_name, m.grandfather_name].filter(Boolean).join(" ");
      
      return [
        escapeCsv(m.ercs_id || ""),
        escapeCsv(m.first_name || ""),
        escapeCsv(m.father_name || ""),
        escapeCsv(m.grandfather_name || ""),
        escapeCsv(fullName),
        escapeCsv(m.gender || ""),
        escapeCsv(m.phone_number || ""),
        escapeCsv(m.email || ""),
        escapeCsv(m.national_id || ""),
        escapeCsv(regionName),
        escapeCsv(m.zone_id || (m as any).zoneId || ""),
        escapeCsv(m.woreda_id || (m as any).woredaId || ""),
        escapeCsv((m as any).branch_id || ""),
        escapeCsv((m as any).membership_type || (m as any).membershipType || "REGULAR"),
        escapeCsv(m.status || "ACTIVE"),
        escapeCsv(meta.occupation || ""),
        escapeCsv(meta.organizationName || ""),
        escapeCsv(meta.educationLevel || ""),
        escapeCsv(meta.kebele || ""),
        escapeCsv(meta.area || ""),
        escapeCsv(meta.languages || ""),
        escapeCsv((m as any).created_at ? new Date((m as any).created_at).toLocaleDateString() : "")
      ];
    });

    const csvContent = [headers.map(escapeCsv), ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const isSelectedExport = selectedMemberIds.size > 0 && (!membersToExport || membersToExport.length === selectedMemberIds.size);
    link.setAttribute("download", `ercs_members_${isSelectedExport ? 'selected_' : ''}${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    toast.success(`Exported ${list.length} member record${list.length === 1 ? '' : 's'} to CSV`);
  };
  
  const downloadTemplate = async () => {
    try {
        const ExcelJS = (await import("exceljs")).default;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("ERCS Personal Membership Regist");

        // Add headers matching official template
        const headers = [
            "No.",
            "Mobile", 
            "Name", 
            "Father Name", 
            "Last Name", 
            "Gender", 
            "Date of Birth (Eth)", 
            "Registration Date", 
            "Occupation", 
            "Organization Name",
            "Education Level", 
            "Area", 
            "Languages", 
            "Kebele", 
            "Email"
        ];
        
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFED1C24' } // ERCS Red
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;

        // Apply Data Validation
        const rowCount = 500; // Apply to first 500 rows
        for (let i = 2; i <= rowCount; i++) {
            // Gender (Column F)
            worksheet.getCell(`F${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['"Male,Female"'],
                showErrorMessage: true,
                errorTitle: 'Invalid Selection',
                error: 'Please select Male or Female.'
            };
            // Occupation (Column I)
            worksheet.getCell(`I${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['"Farmer,Business Person,Civil Servant,House Wife,Military,NGO,Self Employed,Student,Police,Diplomat,Others"']
            };
            // Education Level (Column K)
            worksheet.getCell(`K${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['"Below Primary School,Primary School Completed,High School Completed,Degree,Masters,PHD"']
            };
            // Area (Column L)
            worksheet.getCell(`L${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['"URBAN,RURAL"']
            };
        }

        // Add example row
        worksheet.addRow([
            1, "0912345678", "Abebe", "Kebede", "Tadesse", "Male", 
            "01/01/1990", "16/10/2024", "Civil Servant", "ERCS", "Degree", "URBAN", "Amharic, English", "Kebele 03", "abebe@example.com"
        ]);

        worksheet.columns.forEach((column) => {
            let maxLen = 0;
            column.eachCell!({ includeEmpty: true }, (cell) => {
                const val = cell.value ? String(cell.value) : "";
                if (val.length > maxLen) maxLen = val.length;
            });
            column.width = Math.max(maxLen + 4, 15);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Membership Registration Template.xlsx";
        link.click();
        
        toast.success("Membership Registration Template Downloaded");
    } catch (err) {
        console.error("Template generation failed:", err);
        toast.error("Failed to generate Excel template.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const normalizeDate = (val: any) => {
      if (!val) return "";
      if (val instanceof Date) return val.toISOString().split('T')[0];
      const s = String(val).trim();
      if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(s)) {
        const [d, m, y] = s.split('-');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
        const [d, m, y] = s.split('/');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
      return s;
    };

    if (file.name.endsWith('.xlsx')) {
        toast.loading("Parsing Excel...");
        try {
            const ExcelJS = (await import("exceljs")).default;
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const buffer = event.target?.result as ArrayBuffer;
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.load(buffer);
                    const worksheet = workbook.getWorksheet(1);
                    
                    const people: any[] = [];
                    let headers: string[] = [];
                    worksheet?.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) {
                            headers = (row.values as any[]).slice(1).map(v => String(v || '').trim());
                            return;
                        }

                        const rowData: Record<string, any> = {};
                        headers.forEach((h, idx) => {
                            const val = row.getCell(idx + 1).value;
                            let strVal = "";
                            if (val instanceof Date) strVal = val.toISOString().split('T')[0];
                            else if (typeof val === 'object' && val !== null) {
                                if ('text' in val) strVal = String((val as any).text || '');
                                else if ('result' in val) strVal = String((val as any).result || '');
                            } else if (val !== undefined && val !== null) {
                                strVal = String(val).trim();
                            }
                            rowData[h] = strVal;
                        });

                        const getVal = (keys: string[], defaultIdx: number) => {
                            for (const k of keys) {
                                for (const h of headers) {
                                    if (h.toLowerCase() === k.toLowerCase()) {
                                        return rowData[h];
                                    }
                                }
                            }
                            return defaultIdx > 0 ? (row.getCell(defaultIdx).text || "") : "";
                        };

                        const firstName = getVal(["Name", "First Name", "FirstName"], 3) || row.getCell(1).text;
                        if (!firstName || firstName.trim() === "") return;

                        const fatherName = getVal(["Father Name", "FatherName", "Middle Name"], 4) || row.getCell(2).text;
                        const grandfatherName = getVal(["Last Name", "Grandfather Name", "GrandfatherName"], 5) || row.getCell(3).text;
                        const email = getVal(["Email", "Email Address"], 15) || row.getCell(4).text;
                        const phone = getVal(["Mobile", "Phone Number", "Phone"], 2) || row.getCell(5).text;
                        const gender = getVal(["Gender"], 6) || row.getCell(8).text;
                        const dob = getVal(["Date of Birth (Eth)", "Date of Birth (YYYY-MM-DD)", "Date of Birth", "DOB"], 7);
                        const rawRegion = getVal(["Region", "Region (Select from list)"], 9);
                        const regionVal = resolveRegionId(rawRegion, regions);
                        const membershipType = getVal(["Membership Type"], 10) || "REGULAR";

                        people.push({
                            first_name: firstName,
                            father_name: fatherName,
                            grandfather_name: grandfatherName,
                            email: email,
                            phone_number: String(phone || ""),
                            national_id: getVal(["National ID"], 6),
                            date_of_birth: normalizeDate(dob),
                            gender: gender,
                            region: regionVal,
                            zone_id: getVal(["Zone ID", "Zone", "zone_id"], 0),
                            woreda_id: getVal(["Woreda ID", "Woreda", "woreda_id"], 0),
                            branch_id: getVal(["Branch ID", "Branch", "Branch Office", "branch_id", "Branch Name"], 0),
                            membership_type: membershipType,
                            metadata: JSON.stringify({
                                occupation: getVal(["Occupation"], 9),
                                organizationName: getVal(["Organization Name"], 10),
                                educationLevel: getVal(["Education Level"], 11),
                                area: getVal(["Area"], 12),
                                languages: getVal(["Languages"], 13),
                                kebele: getVal(["Kebele"], 14)
                            })
                        });
                    });

                    if (people.length === 0) {
                        toast.dismiss();
                        toast.error("No valid data found.");
                        return;
                    }

                    toast.dismiss();
                    setParsedMembers(people);
                    setImportFileName(file.name);
                    resetImportAssignments();
                    setShowImportModal(true);
                    toast.success(`Parsed ${people.length} member rows`);
                } catch (err) {
                    toast.dismiss();
                    toast.error("Failed to process Excel data.");
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (err) {
            toast.dismiss();
            toast.error("Excel parser error.");
        }
    } else {
        toast.loading("Parsing CSV...");
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const rows = text.split("\n").slice(1).filter(r => r.trim());
                const people = rows.map(row => {
                    const [fn, fat, gfat, em, ph, ni, dob, gen, reg, typ] = row.split(",").map(c => c.trim());
                    return {
                        first_name: fn,
                        father_name: fat,
                        grandfather_name: gfat,
                        email: em,
                        phone_number: ph,
                        national_id: ni,
                        date_of_birth: dob,
                        gender: gen,
                        region: resolveRegionId(reg, regions),
                        membership_type: typ || "REGULAR",
                        metadata: "{}"
                    };
                });
                
                if (people.length === 0) {
                    toast.dismiss();
                    toast.error("No valid CSV rows found.");
                    return;
                }

                toast.dismiss();
                setParsedMembers(people);
                setImportFileName(file.name);
                resetImportAssignments();
                setShowImportModal(true);
                toast.success(`Parsed ${people.length} CSV rows`);
            } catch (err) {
                toast.dismiss();
                toast.error("Bulk import parsing failed.");
            }
        };
        reader.readAsText(file);
    }
    e.target.value = "";
  };

  const executeMemberImport = async () => {
    if (parsedMembers.length === 0) {
      toast.error("No valid member data to import");
      return;
    }
    const peopleWithRegion = parsedMembers.map((person) => {
        const targetRegion = selectedImportRegion === "from_file"
          ? resolveRegionId(person.region, regions)
          : parseInt(selectedImportRegion, 10);
        return {
          ...person,
          region: targetRegion,
          zone_id: selectedImportZone === "from_file" ? (person.zone_id || "") : selectedImportZone,
          woreda_id: selectedImportWoreda === "from_file" ? (person.woreda_id || "") : selectedImportWoreda,
          branch_id: selectedImportBranch === "from_file" ? (person.branch_id || "") : selectedImportBranch,
          membership_type: selectedImportPlan === "from_file" ? person.membership_type : selectedImportPlan
        };
      });

    const seenPhones = new Set<string>();
    const seenEmails = new Set<string>();
    const errors: string[] = [];
    peopleWithRegion.forEach((person, index) => {
      const rowErrors: string[] = [];
      const phone = String(person.phone_number || "").replace(/[^0-9+]/g, "");
      const email = String(person.email || "").trim().toLowerCase();
      if (!String(person.first_name || "").trim()) rowErrors.push("first name is required");
      if (phone && !/^\+?\d{7,15}$/.test(phone)) rowErrors.push("invalid phone number");
      if (phone && seenPhones.has(phone)) rowErrors.push("duplicate phone number in file");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) rowErrors.push("invalid email");
      if (email && seenEmails.has(email)) rowErrors.push("duplicate email in file");
      if (phone) seenPhones.add(phone);
      if (email) seenEmails.add(email);
      if (!regions.some(region => region.id === Number(person.region))) rowErrors.push("invalid region");
      if (person.zone_id && !importZones.some(zone => zone.id === person.zone_id && zone.region_id === Number(person.region))) rowErrors.push("zone does not belong to region");
      if (person.woreda_id && !importWoredas.some(woreda => woreda.id === person.woreda_id && woreda.zone_id === person.zone_id)) rowErrors.push("woreda/branch does not belong to zone");
      if (person.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(person.date_of_birth)) rowErrors.push("date must be YYYY-MM-DD");
      const plan = String(person.membership_type || "").toLowerCase();
      if (!plan) rowErrors.push("membership plan is required");
      else if (!membershipPlans.some(item => item.short_code.toLowerCase() === plan || item.name.toLowerCase() === plan)) rowErrors.push("membership plan is invalid or inactive");
      if (rowErrors.length) errors.push(`Row ${index + 2}: ${rowErrors.join(", ")}`);
    });
    setMemberImportErrors(errors);
    if (errors.length) {
      toast.error(`Fix ${errors.length} invalid member row${errors.length === 1 ? "" : "s"} before importing`);
      return;
    }

    setSubmittingImport(true);
    try {


      const res = await api.post("/person/bulk", peopleWithRegion);
      const successCount = res.data.filter((r: any) => r.success).length;
      const failCount = res.data.length - successCount;
      if (failCount === 0) {
        toast.success(`Successfully imported all ${successCount} members.`);
      } else {
        toast.warning(`Imported ${successCount} members. ${failCount} failed.`);
      }
      setShowImportModal(false);
      setParsedMembers([]);
      setMemberImportErrors([]);
      fetchMembers();
    } catch (err) {
      console.error("Failed member import:", err);
      toast.error("Failed to process member import.");
    } finally {
      setSubmittingImport(false);
    }
  };


  const exportToPDF = () => {
    // For a clean PDF without external heavy libs, we use the browser's print capability
    // with a dedicated report view. For actual PDF generation in background, 
    // jspdf would be used as: import { jsPDF } from "jspdf"; ...
    window.print();
    toast.info("Preparing PDF Report...");
  };

  const resetFilters = () => {
    setRegionFilter("");
    setZoneFilter("");
    setWoredaFilter("");
    setMainCategory("");
    setStatusFilter("");
    setTypeFilter("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-6 print:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
            <Users className="h-3 w-3" /> Registry
          </div>
          <h1 className="text-3xl font-black text-black tracking-tighter">Member Directory</h1>
          <p className="text-gray-500 font-medium text-sm">Manage hierarchy and status across all regions.</p>
        </div>

        <div className="flex items-center gap-2">
            <Button 
                onClick={downloadTemplate}
                variant="outline" 
                className="rounded-xl h-10 px-4 font-black border-gray-200 flex items-center gap-2 shadow-sm text-[10px] uppercase tracking-widest"
            >
                <Download className="h-4 w-4" /> Template
            </Button>
            <Button 
                onClick={() => exportToCSV()}
                variant="outline" 
                className={`rounded-xl h-10 px-4 font-black border-gray-200 flex items-center gap-2 shadow-sm text-[10px] uppercase tracking-widest transition-all ${
                  selectedMemberIds.size > 0 ? 'bg-[#ED1C24] text-white border-[#ED1C24] hover:bg-red-700' : ''
                }`}
            >
                <TableIcon className="h-4 w-4" /> 
                {selectedMemberIds.size > 0 ? `CSV (${selectedMemberIds.size} Selected)` : 'CSV'}
            </Button>
            <div className="relative">
                <Input 
                    type="file" 
                    accept=".csv,.xlsx" 
                    onChange={handleImport} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <Button 
                    variant="outline" 
                    className="rounded-xl h-10 px-4 font-black border-gray-200 flex items-center gap-2 shadow-sm text-[10px] uppercase tracking-widest"
                >
                    <Upload className="h-4 w-4" /> Import
                </Button>
            </div>
            <Button 
                onClick={exportToPDF}
                variant="outline" 
                className="rounded-xl h-10 px-4 font-black border-gray-200 flex items-center gap-2 shadow-sm text-[10px] uppercase tracking-widest"
            >
                <FileText className="h-4 w-4" /> PDF
            </Button>
            <Button 
                onClick={() => setShowAddMemberModal(true)}
                className="rounded-xl h-10 px-6 font-black shadow-xl shadow-red-500/10 flex items-center gap-2 bg-[#ED1C24] text-white text-[10px] uppercase tracking-widest"
            >
                <Plus className="h-4 w-4" /> Add Member
            </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 print:hidden">
        <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#ED1C24]" />
                    <Input
                    placeholder="Search Identity..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 pl-10 bg-white text-black border border-gray-200 rounded-xl font-black text-xs focus:ring-4 focus:ring-[#ED1C24]/10 transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-xs">
                    <button
                        onClick={() => setViewMode("table")}
                        className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-all ${viewMode === 'table' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'}`}
                    >
                        <TableIcon className="h-3.5 w-3.5" /> Table
                    </button>
                    <button
                        onClick={() => setViewMode("map")}
                        className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-all ${viewMode === 'map' ? 'bg-[#ED1C24] text-white shadow-xs' : 'text-gray-500 hover:text-black'}`}
                    >
                        <MapIcon className="h-3.5 w-3.5" /> Map View
                    </button>
                </div>
            </div>

            <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "default" : "outline"}
                className={`h-10 px-6 rounded-xl font-black transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest ${showFilters ? 'bg-white text-black border border-gray-200 shadow-sm' : 'border border-gray-200 bg-transparent text-gray-500 hover:bg-gray-50'}`}
            >
                <Filter className="h-4 w-4" /> 
                {showFilters ? 'Hide' : 'Filters'}
            </Button>
        </div>

        {/* Selected Members Bulk Action Banner */}
        {selectedMemberIds.size > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-900 text-white p-4 px-6 rounded-2xl shadow-xl border border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ED1C24] text-white font-black text-xs shadow-sm">
                {selectedMemberIds.size}
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-wider text-white">
                  {selectedMemberIds.size} Member{selectedMemberIds.size === 1 ? '' : 's'} Selected
                </p>
                <p className="text-[10px] text-gray-400 font-medium">
                  Apply mass actions or export selective records
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => exportToCSV()}
                className="h-9 px-4 rounded-xl font-black bg-[#ED1C24] hover:bg-red-700 text-white text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all"
              >
                <Download className="h-3.5 w-3.5" /> Export Selected ({selectedMemberIds.size}) to CSV
              </Button>
              <Button
                onClick={clearSelection}
                variant="ghost"
                className="h-9 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10"
              >
                <X className="h-3.5 w-3.5 mr-1" /> Deselect All
              </Button>
            </div>
          </div>
        )}

        {showFilters && (
            <div className="space-y-4 p-6 bg-gray-50 rounded-[28px] border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Master Category Row */}
                <div className="grid md:grid-cols-4 gap-4 pb-4 border-b border-gray-200/50">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Category</label>
                        <select 
                            value={mainCategory}
                            onChange={(e) => { setMainCategory(e.target.value); setTypeFilter(""); }}
                            className="w-full h-10 px-3 rounded-lg bg-white text-black border border-gray-200 font-black text-[10px] uppercase tracking-widest focus:border-[#ED1C24] transition-all outline-none appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-white text-black">All Groups</option>
                            <option value="INDIVIDUAL" className="bg-white text-black">Individual</option>
                            <option value="CORPORATE" className="bg-white text-black">Corporate</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Type</label>
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            disabled={!mainCategory}
                            className="w-full h-10 px-3 rounded-lg bg-white text-black border border-gray-200 font-black text-[10px] uppercase tracking-widest focus:border-[#ED1C24] transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                        >
                            <option value="">Sub-Type...</option>
                            {mainCategory === 'INDIVIDUAL' && (
                                <>
                                    <option value="ANNUAL">Annual</option>
                                    <option value="LIFE">Lifetime</option>
                                    <option value="YOUTH">Youth</option>
                                </>
                            )}
                            {mainCategory === 'CORPORATE' && (
                                <>
                                    <option value="SILVER">Silver</option>
                                    <option value="GOLD">Gold</option>
                                    <option value="PLATINUM">Platinum</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Status</label>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg bg-white text-black border border-gray-200 font-black text-[10px] uppercase tracking-widest focus:border-[#ED1C24] transition-all outline-none appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-white text-black">All Status</option>
                            <option value="ACTIVE" className="bg-white text-black">Active</option>
                            <option value="INACTIVE" className="bg-white text-black">Inactive</option>
                            <option value="EXPIRED" className="bg-white text-black">Expired</option>
                            <option value="PENDING" className="bg-white text-black">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Regional Hierarchy Row */}
                <div className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Region</label>
                        <select 
                            value={regionFilter}
                            onChange={(e) => { setRegionFilter(e.target.value); setZoneFilter(""); setWoredaFilter(""); }}
                            className="w-full h-10 px-3 rounded-lg bg-white text-black border border-gray-200 font-black text-[10px] uppercase tracking-widest focus:border-[#ED1C24] transition-all outline-none appearance-none cursor-pointer"
                        >
                             <option value="" className="bg-white text-black">All Regions</option>
                             {regions.map(r => (
                                 <option key={r.id} value={r.id} className="bg-white text-black">{r.name}</option>
                             ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Zone</label>
                        <select 
                            value={zoneFilter}
                            onChange={(e) => { setZoneFilter(e.target.value); setWoredaFilter(""); }}
                            disabled={!regionFilter}
                            className="w-full h-10 px-3 rounded-lg bg-white text-black border border-gray-200 font-black text-[10px] uppercase tracking-widest focus:border-[#ED1C24] transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                        >
                            <option value="">Select Zone...</option>
                            {regionFilter === "1" && ( 
                                <>
                                    <option value="bole">Bole</option>
                                    <option value="arada">Arada</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-black/40 ml-1">Woreda</label>
                        <select 
                            value={woredaFilter}
                            onChange={(e) => setWoredaFilter(e.target.value)}
                            disabled={!zoneFilter}
                            className="w-full h-10 px-3 rounded-lg bg-white text-black border border-gray-200 font-black text-[10px] uppercase tracking-widest focus:border-[#ED1C24] transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                        >
                            <option value="">Select...</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button 
                            onClick={resetFilters}
                            variant="ghost" 
                            className="h-10 flex-1 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest text-gray-400 hover:text-[#ED1C24] hover:bg-white transition-all"
                        >
                            <X className="h-3.5 w-3.5 mr-1" /> Reset
                        </Button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {viewMode === "map" ? (
        <GeographicMapReport
          items={members}
          title="Members Geographic Distribution"
          type="members"
          onSelectRegion={(regId) => {
            setRegionFilter(regId);
            setViewMode("table");
          }}
        />
      ) : (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.03)] overflow-hidden print:shadow-none print:border-none print:rounded-none">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/70 print:bg-transparent">
                <TableRow className="hover:bg-transparent border-gray-100">
                  <TableHead className="w-12 px-4 py-4 text-center print:hidden">
                    <input
                      type="checkbox"
                      checked={isAllCurrentPageSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeCurrentPageSelected;
                      }}
                      onChange={toggleSelectAllCurrentPage}
                      className="h-4 w-4 rounded text-[#ED1C24] focus:ring-[#ED1C24] border-gray-300 cursor-pointer accent-[#ED1C24]"
                      title="Select all on this page"
                    />
                  </TableHead>
                  <TableHead className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">ID / ERCS ID</TableHead>
                  <TableHead className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Member Details</TableHead>
                  <TableHead className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Contact</TableHead>
                  <TableHead className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Location</TableHead>
                  <TableHead className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Category / Plan</TableHead>
                  <TableHead className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Status</TableHead>
                  <TableHead className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Registered</TableHead>
                  <TableHead className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-black/40 text-right print:hidden">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                         <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                         <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Syncing Registry...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-64 text-center">
                       <p className="text-sm font-bold text-gray-400">No members found matching your search.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => {
                    const isSelected = selectedMemberIds.has(member.id);
                    const regionObj = (regions || DEFAULT_REGIONS).find(r => String(r.id) === String(member.region));
                    const initials = `${(member.first_name || '').charAt(0)}${(member.father_name || '').charAt(0)}`.toUpperCase() || "RC";
                    const rowPhoto = getMemberPhoto(member);
                    const formattedDate = (member as any).created_at 
                      ? new Date((member as any).created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—";

                    return (
                      <TableRow 
                        key={member.id} 
                        className={`transition-colors border-gray-50 cursor-pointer ${isSelected ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-gray-50/80'}`}
                        onClick={() => toggleSelectMember(member.id)}
                      >
                        <TableCell className="w-12 px-4 py-4 text-center print:hidden" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectMember(member.id)}
                            className="h-4 w-4 rounded text-[#ED1C24] focus:ring-[#ED1C24] border-gray-300 cursor-pointer accent-[#ED1C24]"
                          />
                        </TableCell>
                        <TableCell className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5 group">
                            <span className="font-mono font-black text-black text-xs tracking-tight bg-gray-100/80 px-2 py-1 rounded-lg border border-gray-200">
                              {member.ercs_id || "N/A"}
                            </span>
                            {member.ercs_id && (
                              <button
                                onClick={() => copyToClipboard(member.ercs_id, "ERCS ID")}
                                title="Copy ID"
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-500 transition-all"
                              >
                                {copiedText === "ERCS ID" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                              </button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl overflow-hidden bg-gradient-to-br from-red-50 to-red-100 text-[#ED1C24] font-black text-xs flex items-center justify-center border border-gray-200 shrink-0 shadow-xs relative">
                              {rowPhoto ? (
                                <img 
                                  src={rowPhoto} 
                                  alt={member.first_name} 
                                  className="h-full w-full object-cover object-center" 
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span>{initials}</span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-extrabold text-gray-900 text-xs">
                                {member.first_name} {member.father_name} {member.grandfather_name || ""}
                              </span>
                              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                {member.national_id && (
                                  <span className="text-[10px] font-semibold text-gray-400">
                                    ID: {member.national_id}
                                  </span>
                                )}
                                {member.gender && (
                                  <span className="text-[9px] font-bold uppercase text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                    {member.gender}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            {member.phone_number ? (
                              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                <Phone className="h-3 w-3 text-gray-400 shrink-0" />
                                {member.phone_number}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 italic">No phone</span>
                            )}
                            {member.email && (
                              <span className="text-[10px] text-gray-500 font-medium truncate max-w-[160px] flex items-center gap-1.5">
                                <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                                {member.email}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-gray-800">
                              <MapPin className="h-3 w-3 text-[#ED1C24] shrink-0" />
                              {regionObj ? regionObj.name : (member.region || "Unspecified")}
                            </span>
                            {((member as any).zone_id || (member as any).zoneId || (member as any).woreda_id || (member as any).woredaId) && (
                              <span className="text-[10px] font-semibold text-gray-400 pl-4">
                                {[(member as any).zone_id || (member as any).zoneId, (member as any).woreda_id || (member as any).woredaId].filter(Boolean).join(" • ")}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-[10px] font-black uppercase tracking-wider border border-gray-200">
                            <CreditCard className="h-3 w-3 mr-1 text-[#ED1C24]" />
                            {(member as any).membership_type || (member as any).membershipType || "REGULAR"}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border",
                              member.status === "ACTIVE" || !member.status
                                ? "bg-green-50 text-green-700 border-green-200"
                                : member.status === "INACTIVE"
                                ? "bg-gray-100 text-gray-600 border-gray-200"
                                : member.status === "EXPIRED"
                                ? "bg-red-50 text-[#ED1C24] border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            )}
                          >
                            <span className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              member.status === "ACTIVE" || !member.status
                                ? "bg-green-500"
                                : member.status === "INACTIVE"
                                ? "bg-gray-400"
                                : member.status === "EXPIRED"
                                ? "bg-red-500"
                                : "bg-amber-500"
                            )} />
                            {member.status || "ACTIVE"}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-gray-400 shrink-0" />
                            {formattedDate}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-right print:hidden" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => { setSelectedMember(member); setShowModal(true); }}
                              className="p-2 hover:bg-red-50 rounded-xl transition-all group flex items-center gap-1 text-gray-400 hover:text-[#ED1C24]"
                              title="View Audit Details"
                            >
                              <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:inline transition-all">Details</span>
                              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-[#ED1C24] transition-colors" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

        {/* Member Detail Modal */}
        {showModal && selectedMember && (() => {
          let meta: Record<string, any> = {};
          try {
            meta = typeof selectedMember.metadata === "string" 
              ? JSON.parse(selectedMember.metadata || "{}") 
              : (selectedMember.metadata || {});
          } catch {
            meta = {};
          }

          const memberPhoto = getMemberPhoto(selectedMember);
          const initials = `${(selectedMember.first_name || '').charAt(0)}${(selectedMember.father_name || '').charAt(0)}`.toUpperCase() || "RC";
          const regionObj = (regions || DEFAULT_REGIONS).find(r => String(r.id) === String(selectedMember.region));
          const regionName = regionObj ? regionObj.name : String(selectedMember.region || "Unspecified");
          
          const createdDate = (selectedMember as any).created_at 
            ? new Date((selectedMember as any).created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
            : "—";
          const updatedDate = (selectedMember as any).updated_at 
            ? new Date((selectedMember as any).updated_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
            : "—";
          
          const rawDob = selectedMember.date_of_birth || (selectedMember as any).dob || meta.date_of_birth || meta.dateOfBirth || meta.dob;
          let dobFormatted = "Not Specified";
          let age: number | null = null;
          if (rawDob) {
            dobFormatted = String(rawDob);
            const birthYear = parseInt(String(rawDob).split(/[-/]/)[0], 10);
            if (!isNaN(birthYear) && birthYear > 1900 && birthYear < 2030) {
              age = new Date().getFullYear() - birthYear;
            }
          }

          // Emergency Contacts
          const emergencyName = meta.emergency_contact_name || meta.emergencyContactName || meta.emergency_contact || meta.emergencyName;
          const emergencyPhone = meta.emergency_contact_phone || meta.emergencyContactPhone || meta.emergencyPhone;

          // Location details
          const zoneVal = selectedMember.zone_id || (selectedMember as any).zoneId || meta.zone || meta.zone_name || meta.zone_id;
          const woredaVal = selectedMember.woreda_id || (selectedMember as any).woredaId || meta.woreda || meta.woreda_name || meta.woreda_id;
          const kebeleVal = meta.kebele || meta.kebele_id || (selectedMember as any).kebele_id;
          const houseNo = meta.house_number || meta.house_no || meta.houseNo;
          const branchOffice = (selectedMember as any).branch_id || meta.branch || meta.branch_name || meta.branch_id;

          // Known meta keys to skip in dynamic custom attributes
          const standardMetaKeys = new Set([
            "occupation", "profession", "organizationName", "organization_name", "organization",
            "educationLevel", "education_level", "education", "languages", "skills", "area",
            "kebele", "kebele_id", "zone", "zone_id", "zone_name", "zoneId", "woreda", "woreda_id",
            "woreda_name", "woredaId", "branch", "branch_id", "branch_name", "house_number", "house_no",
            "houseNo", "emergency_contact_name", "emergencyContactName", "emergency_contact", "emergencyName",
            "emergency_contact_phone", "emergencyContactPhone", "emergencyPhone", "blood_type", "bloodType",
            "bio", "photo", "photo_url", "photoUrl", "avatar", "avatar_url", "avatarUrl", "image",
            "date_of_birth", "dateOfBirth", "dob", "gender", "national_id", "nationalId", "first_name",
            "father_name", "grandfather_name", "email", "phone_number"
          ]);

          const customAttributes = Object.entries(meta).filter(
            ([key, value]) => !standardMetaKeys.has(key) && value !== null && value !== undefined && value !== ""
          );

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[36px] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100"
              >
                {/* Modal Header with Member Photo & Status */}
                <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start gap-4 bg-gradient-to-r from-gray-50/90 via-white to-red-50/20 shrink-0">
                  <div className="flex items-start gap-5">
                    {/* Member Profile Photo */}
                    <div className="relative group shrink-0">
                      <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center shadow-md relative">
                        {memberPhoto ? (
                          <img 
                            src={memberPhoto} 
                            alt={selectedMember.first_name} 
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-[#ED1C24]">
                            <span className="text-xl sm:text-2xl font-black">{initials}</span>
                            <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">No Photo</span>
                          </div>
                        )}
                      </div>
                      <div 
                        className={`absolute -bottom-1.5 -right-1.5 p-1 rounded-full border-2 border-white shadow-sm ${memberPhoto ? 'bg-green-500' : 'bg-gray-400'}`} 
                        title={memberPhoto ? "Verified Profile Photo" : "No photo uploaded"}
                      >
                        {memberPhoto ? <Check className="h-3 w-3 text-white" /> : <Camera className="h-3 w-3 text-white" />}
                      </div>
                    </div>

                    {/* Header Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                          Member Audit Record
                        </span>
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest",
                          selectedMember.status === "ACTIVE" || !selectedMember.status
                            ? "bg-green-100 text-green-700"
                            : selectedMember.status === "INACTIVE"
                            ? "bg-gray-200 text-gray-700"
                            : selectedMember.status === "EXPIRED"
                            ? "bg-red-100 text-[#ED1C24]"
                            : "bg-amber-100 text-amber-700"
                        )}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {selectedMember.status || "ACTIVE"}
                        </span>
                        {memberPhoto ? (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <BadgeCheck className="h-3 w-3" /> Photo Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                            <Camera className="h-3 w-3 text-gray-400" /> Photo Missing
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                        {selectedMember.first_name} {selectedMember.father_name} {selectedMember.grandfather_name || ""}
                      </h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg border border-gray-200">
                          {selectedMember.ercs_id || "No ERCS ID"}
                        </span>
                        {selectedMember.ercs_id && (
                          <button
                            onClick={() => copyToClipboard(selectedMember.ercs_id, "ERCS ID")}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors flex items-center gap-1 text-[10px] font-bold"
                            title="Copy ERCS ID"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                        )}
                        <a
                          href={`/en/verify/${selectedMember.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#ED1C24] hover:underline bg-red-50 px-2 py-1 rounded-lg border border-red-100 ml-1"
                        >
                          <ExternalLink className="h-3 w-3" /> Public Verification
                        </a>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowModal(false)}
                    className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-gray-100 transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal Scrollable Content: All Datas visually displayed */}
                <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                  
                  {/* Grid 1: Personal Identity & Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Identity Details Card */}
                    <div className="bg-gray-50/70 p-5 rounded-[24px] border border-gray-100 space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
                        <Users className="h-4 w-4 text-[#ED1C24]" />
                        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          Personal & Identity Details
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Full Identity</p>
                          <p className="text-xs font-bold text-black mt-0.5">
                            {selectedMember.first_name} {selectedMember.father_name} {selectedMember.grandfather_name || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Gender</p>
                          <p className="text-xs font-bold text-black mt-0.5">{selectedMember.gender || "Not Specified"}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Date of Birth</p>
                          <p className="text-xs font-bold text-black mt-0.5">
                            {dobFormatted} {age !== null && `(${age} yrs)`}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">National / Kebele ID</p>
                          <p className="text-xs font-bold text-black mt-0.5">{selectedMember.national_id || meta.national_id || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Membership Plan</p>
                          <p className="text-xs font-extrabold text-[#ED1C24] mt-0.5">
                            {(selectedMember as any).membership_type || (selectedMember as any).membershipType || "REGULAR"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Blood Type</p>
                          <p className="text-xs font-bold text-black mt-0.5">{meta.blood_type || meta.bloodType || "N/A"}</p>
                        </div>
                      </div>
                      {meta.bio && (
                        <div className="pt-2 border-t border-gray-200/50">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Bio / Note</p>
                          <p className="text-xs text-gray-700 font-medium mt-0.5 italic">{meta.bio}</p>
                        </div>
                      )}
                    </div>

                    {/* Contact & Emergency Card */}
                    <div className="bg-gray-50/70 p-5 rounded-[24px] border border-gray-100 space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
                        <Phone className="h-4 w-4 text-[#ED1C24]" />
                        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          Contact & Emergency Info
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Phone Number</p>
                            <p className="text-xs font-bold text-black mt-0.5">
                              {selectedMember.phone_number ? (
                                <a href={`tel:${selectedMember.phone_number}`} className="hover:text-[#ED1C24] transition-colors">
                                  {selectedMember.phone_number}
                                </a>
                              ) : "No Phone"}
                            </p>
                          </div>
                          {selectedMember.phone_number && (
                            <button
                              onClick={() => copyToClipboard(selectedMember.phone_number!, "Phone Number")}
                              className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                              title="Copy Phone"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Email Address</p>
                            <p className="text-xs font-bold text-black mt-0.5">
                              {selectedMember.email ? (
                                <a href={`mailto:${selectedMember.email}`} className="hover:text-[#ED1C24] transition-colors">
                                  {selectedMember.email}
                                </a>
                              ) : "No Email"}
                            </p>
                          </div>
                          {selectedMember.email && (
                            <button
                              onClick={() => copyToClipboard(selectedMember.email!, "Email")}
                              className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                              title="Copy Email"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        {(emergencyName || emergencyPhone) && (
                          <div className="pt-2 border-t border-gray-200/50">
                            <p className="text-[9px] font-black text-red-600 uppercase tracking-wider flex items-center gap-1">
                              <Heart className="h-3 w-3" /> Emergency Contact
                            </p>
                            <p className="text-xs font-bold text-black mt-0.5">
                              {emergencyName || "Contact"} {emergencyPhone && `• ${emergencyPhone}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Grid 2: Location & Hierarchy Details */}
                  <div className="bg-gray-50/70 p-5 rounded-[24px] border border-gray-100 space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
                      <MapPin className="h-4 w-4 text-[#ED1C24]" />
                      <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        Geographic Hierarchy & Residence Location
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Regional Branch</p>
                        <p className="text-xs font-bold text-black mt-0.5">{regionName}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Zone / Subcity</p>
                        <p className="text-xs font-bold text-black mt-0.5">{zoneVal || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Woreda / District</p>
                        <p className="text-xs font-bold text-black mt-0.5">{woredaVal || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Kebele</p>
                        <p className="text-xs font-bold text-black mt-0.5">{kebeleVal || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">House No / Street</p>
                        <p className="text-xs font-bold text-black mt-0.5">{houseNo || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Area Settlement</p>
                        <p className="text-xs font-bold text-black mt-0.5">{meta.area || "N/A"}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Coordination Branch</p>
                        <p className="text-xs font-bold text-black mt-0.5">{branchOffice || "Main Branch"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Grid 3: Socio-Economic Profile */}
                  <div className="bg-gray-50/70 p-5 rounded-[24px] border border-gray-100 space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
                      <Briefcase className="h-4 w-4 text-[#ED1C24]" />
                      <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        Socio-Economic, Professional & Community Profile
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Occupation / Profession</p>
                        <p className="text-xs font-bold text-black mt-0.5">{meta.occupation || meta.profession || (selectedMember as any).profession || "Not Specified"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Organization / Employer</p>
                        <p className="text-xs font-bold text-black mt-0.5">{meta.organizationName || meta.organization_name || meta.organization || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Education Level</p>
                        <p className="text-xs font-bold text-black mt-0.5">{meta.educationLevel || meta.education_level || meta.education || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Languages Spoken</p>
                        <p className="text-xs font-bold text-black mt-0.5">{meta.languages || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Special Skills / Badges</p>
                        <p className="text-xs font-bold text-black mt-0.5">
                          {Array.isArray(meta.skills) ? meta.skills.join(", ") : (meta.skills || "N/A")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Registration Mode</p>
                        <p className="text-xs font-bold text-black mt-0.5">{meta.registration_mode || meta.channel || "Standard Registry"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Grid 4: Dynamic Extra Attributes (if any extra keys exist in metadata) */}
                  {customAttributes.length > 0 && (
                    <div className="bg-gray-50/70 p-5 rounded-[24px] border border-gray-100 space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
                        <Sparkles className="h-4 w-4 text-[#ED1C24]" />
                        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          Additional Member Attributes & Metadata
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {customAttributes.map(([key, val]) => (
                          <div key={key}>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                              {key.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs font-bold text-black mt-0.5 truncate">
                              {typeof val === "object" ? JSON.stringify(val) : String(val)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grid 5: System Audit Information */}
                  <div className="bg-gray-50/70 p-5 rounded-[24px] border border-gray-100 space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
                      <ShieldCheck className="h-4 w-4 text-[#ED1C24]" />
                      <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        System Record Security & Timestamps
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">System Record UUID</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-[11px] font-mono font-bold text-gray-700 truncate max-w-[180px]">
                            {selectedMember.id}
                          </p>
                          <button
                            onClick={() => copyToClipboard(selectedMember.id, "System ID")}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                            title="Copy UUID"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Registered Timestamp</p>
                        <p className="text-xs font-bold text-black mt-0.5">{createdDate}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Last Profile Updated</p>
                        <p className="text-xs font-bold text-black mt-0.5">{updatedDate}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-gray-50/90 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <Button 
                    onClick={() => exportToCSV([selectedMember])}
                    variant="outline" 
                    className="rounded-2xl h-11 px-5 font-black text-[10px] uppercase tracking-widest border-gray-200 bg-white hover:bg-gray-100 flex items-center gap-2 shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" /> Export Member CSV
                  </Button>
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => window.print()}
                      className="bg-black hover:bg-gray-800 text-white rounded-2xl h-11 px-5 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
                    >
                      <FileText className="h-3.5 w-3.5" /> Print Audit Record
                    </Button>
                    <Button 
                      onClick={() => setShowModal(false)}
                      variant="outline" 
                      className="rounded-2xl h-11 px-5 font-black text-[10px] uppercase tracking-widest border-gray-200 bg-white"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between print:hidden">
           <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">
             <span className="text-black">{totalItems}</span> Records Compiled
           </p>

           <div className="flex items-center gap-1">
             <Button 
               disabled={page === 1 || loading}
               onClick={() => setPage(page - 1)}
               variant="outline" 
               className="h-8 w-8 p-0 rounded-lg border-gray-200 bg-white"
             >
               <span className="rotate-180">➤</span>
             </Button>
             <div className="flex items-center justify-center h-8 px-3 bg-black rounded-lg text-[10px] font-black text-white">
                {page}
             </div>
             <Button 
               disabled={page >= totalPages || loading}
               onClick={() => setPage(page + 1)}
               variant="outline" 
               className="h-8 w-8 p-0 rounded-lg border-gray-200 bg-white"
             >
               <span>➤</span>
             </Button>
           </div>
        </div>
      </div>
      )}

      {/* Print-only Report Header */}
      <div className="hidden print:block mb-8">
          <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black">Member Registry Report</h1>
                <p className="text-gray-500 font-bold">Ethiopian Red Cross Society</p>
                <div className="mt-4 grid grid-cols-2 gap-x-12 gap-y-2 text-xs">
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Region:</span> {(regions || DEFAULT_REGIONS).find(r => String(r.id) === regionFilter)?.name || "All"}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Status:</span> {statusFilter || "All"}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Generated:</span> {isMounted ? new Date().toLocaleString() : ""}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Total Count:</span> {totalItems}</div>
                </div>
              </div>
              <div className="bg-ercs-red text-white p-4 font-black text-2xl">ERCS</div>
          </div>
      </div>
      
      {showAddMemberModal && (
        <AddMemberModal 
            onClose={() => setShowAddMemberModal(false)} 
            onSuccess={() => {
                setShowAddMemberModal(false);
                fetchMembers();
            }}
            regions={regions}
        />
      )}

      {/* Import Members - Branch / Region Prompt Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-6xl xl:max-w-7xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                  <Upload className="h-3 w-3" /> Member Import Prompt
                </div>
                <h2 className="text-xl font-black tracking-tight text-black">Assign Import Location & Plan</h2>
                <p className="text-xs font-bold text-gray-400">
                  File: <span className="text-black font-extrabold">{importFileName}</span> ({parsedMembers.length} records parsed)
                </p>
              </div>
              <button 
                onClick={() => { setShowImportModal(false); setParsedMembers([]); }}
                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-3 bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/80 block">
                    Target Branch & Membership Plan Assignment
                  </label>
                  <span className="text-[10px] font-semibold text-gray-500">
                    Applies to all {parsedMembers.length} imported members
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                      Target Regional Branch
                    </label>
                    <select
                      value={selectedImportRegion}
                      onChange={(e) => { setSelectedImportRegion(e.target.value); setSelectedImportZone("from_file"); setSelectedImportWoreda("from_file"); setSelectedImportBranch("from_file"); }}
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-black border border-gray-200 font-bold text-xs focus:ring-2 focus:ring-[#ED1C24]/20 focus:border-[#ED1C24] outline-none transition-all cursor-pointer shadow-sm"
                    >
                      <option value="from_file">📁 Use Region from File (Auto-mapped)</option>
                      {((regions && regions.length > 0) ? regions : DEFAULT_REGIONS).map((r) => (
                        <option key={r.id} value={r.id}>
                          🏛️ {r.name} (Region ID: {r.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                      Zone
                    </label>
                    <select 
                      value={selectedImportZone} 
                      disabled={selectedImportRegion === "from_file"} 
                      onChange={(e) => { setSelectedImportZone(e.target.value); setSelectedImportWoreda("from_file"); }} 
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-black border border-gray-200 font-bold text-xs disabled:opacity-50 disabled:bg-gray-100 shadow-sm"
                    >
                      <option value="from_file">Use Zone from file</option>
                      {importZones.filter(z => String(z.region_id) === selectedImportRegion).map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                      Woreda
                    </label>
                    <select 
                      value={selectedImportWoreda} 
                      disabled={selectedImportZone === "from_file"} 
                      onChange={(e) => setSelectedImportWoreda(e.target.value)} 
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-black border border-gray-200 font-bold text-xs disabled:opacity-50 disabled:bg-gray-100 shadow-sm"
                    >
                      <option value="from_file">Use Woreda from file</option>
                      {importWoredas.filter(w => w.zone_id === selectedImportZone).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                      Branch / Coordination Office
                    </label>
                    <select 
                      value={selectedImportBranch} 
                      onChange={(e) => setSelectedImportBranch(e.target.value)} 
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-black border border-gray-200 font-bold text-xs shadow-sm"
                    >
                      <option value="from_file">Use Branch from file</option>
                      {importBranches
                        .filter(b => selectedImportRegion === "from_file" || String(b.region_id) === selectedImportRegion)
                        .map(b => (
                          <option key={b.id} value={b.id}>
                            🏢 {b.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                      Membership Plan (Mass Assign)
                    </label>
                    <select 
                      value={selectedImportPlan} 
                      onChange={(e) => {
                        const plan = e.target.value;
                        setSelectedImportPlan(plan);
                        if (plan !== "from_file") setParsedMembers(current => current.map(person => ({ ...person, membership_type: plan })));
                      }} 
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-black border border-gray-200 font-bold text-xs shadow-sm"
                    >
                      <option value="from_file">Use each member's plan from file</option>
                      {membershipPlans.map(plan => <option key={plan.id} value={plan.short_code}>{plan.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {memberImportErrors.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 max-h-28 overflow-auto">
                  <p className="text-[10px] font-black uppercase text-red-700 mb-1">Validation issues ({memberImportErrors.length})</p>
                  {memberImportErrors.map(error => <p key={error} className="text-[10px] font-semibold text-red-600">{error}</p>)}
                </div>
              )}

              {/* Data Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Members File Preview ({Math.min(50, parsedMembers.length)} of {parsedMembers.length} records)
                  </p>
                  <span className="text-[10px] font-semibold text-gray-400">Scroll horizontally to view all columns &rarr;</span>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <div className="overflow-x-auto overflow-y-auto max-h-[360px]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-100/90 backdrop-blur-sm border-b border-gray-200 text-[9px] font-black uppercase text-gray-500 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 sticky left-0 bg-gray-100 z-20 whitespace-nowrap border-r border-gray-200"># Row</th>
                          <th className="px-4 py-3 whitespace-nowrap bg-red-50/60 text-[#ED1C24] border-r border-gray-200">Target Branch (Assigned)</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">Membership Plan</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">Full Name</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">Phone</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">Email</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">Gender</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">Date of Birth</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">National ID</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">Occupation</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">Organization</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">Education Level</th>
                          <th className="px-4 py-3 whitespace-nowrap border-r border-gray-200">Area / Kebele</th>
                          <th className="px-4 py-3 whitespace-nowrap">Languages</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                        {parsedMembers.slice(0, 50).map((pm, idx) => {
                          const effectiveRegionId = selectedImportRegion === "from_file" 
                            ? resolveRegionId(pm.region, regions) 
                            : parseInt(selectedImportRegion, 10);
                          const regionObj = (regions || DEFAULT_REGIONS).find(r => r.id === effectiveRegionId);

                          let meta: Record<string, any> = {};
                          try {
                            meta = typeof pm.metadata === "string" ? JSON.parse(pm.metadata || "{}") : (pm.metadata || {});
                          } catch {
                            meta = {};
                          }

                          return (
                            <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                              <td className="px-4 py-2.5 text-gray-400 font-mono whitespace-nowrap sticky left-0 bg-white shadow-[1px_0_0_0_#f3f4f6] z-1 border-r border-gray-100">
                                #{idx + 1}
                              </td>
                              <td className="px-4 py-2.5 font-bold text-[#ED1C24] whitespace-nowrap bg-red-50/20 border-r border-gray-100">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold">
                                  {regionObj ? regionObj.name : `Region ${effectiveRegionId}`}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 whitespace-nowrap border-r border-gray-100">
                                <select 
                                  value={pm.membership_type || ""} 
                                  onChange={(e) => setParsedMembers(current => current.map((person, personIndex) => personIndex === idx ? { ...person, membership_type: e.target.value } : person))} 
                                  className="h-8 min-w-32 px-2.5 rounded-lg border border-gray-200 bg-white font-bold text-[10px] focus:ring-1 focus:ring-[#ED1C24] outline-none shadow-sm cursor-pointer"
                                >
                                  <option value="">Select plan</option>
                                  {membershipPlans.map(plan => <option key={plan.id} value={plan.short_code}>{plan.name}</option>)}
                                </select>
                              </td>
                              <td className="px-4 py-2.5 font-bold text-black whitespace-nowrap border-r border-gray-100">
                                {pm.first_name} {pm.father_name} {pm.grandfather_name || ""}
                              </td>
                              <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap border-r border-gray-100">
                                {pm.phone_number || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap border-r border-gray-100">
                                {pm.email || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap border-r border-gray-100">
                                {pm.gender || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap border-r border-gray-100">
                                {pm.date_of_birth || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap border-r border-gray-100">
                                {pm.national_id || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap border-r border-gray-100">
                                {meta.occupation || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap border-r border-gray-100">
                                {meta.organizationName || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap border-r border-gray-100">
                                {meta.educationLevel || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap border-r border-gray-100">
                                {[meta.kebele, meta.area].filter(Boolean).join(" / ") || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">
                                {meta.languages || "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
              <Button
                variant="outline"
                disabled={submittingImport}
                onClick={() => { setShowImportModal(false); setParsedMembers([]); }}
                className="rounded-xl h-10 px-5 font-black text-xs border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={executeMemberImport}
                disabled={submittingImport || parsedMembers.length === 0}
                className="rounded-xl h-10 px-6 font-black text-xs bg-[#ED1C24] hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
              >
                {submittingImport ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Importing...
                  </span>
                ) : (
                  `Confirm & Import ${parsedMembers.length} Members`
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Utility class for badge colors
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
