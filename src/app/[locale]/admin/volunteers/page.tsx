"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
    HandHeart, 
    Plus, 
    Star, 
    Filter, 
    FileText, 
    Table as TableIcon, 
    X, 
    ArrowUpRight, 
    Phone, 
    Mail, 
    MapPin, 
    Calendar, 
    User,
    Briefcase,
    Home,
    Upload,
    Download,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Map as MapIcon
} from "lucide-react";

import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { resolveRegionId, getZoneName, getWoredaName } from "@/lib/constants";
import { GeographicMapReport } from "@/components/admin/GeographicMapReport";
import type { Cell, CellValue } from "exceljs";
import { getUserScope } from "@/lib/auth-scope";


type Volunteer = {
  id: string;
  person_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  region: string;
  country: string;
  address: string;
  gender: string;
  date_of_birth: string;
  hoursSpent: number;
  profession?: string;
  email?: string;
  zone_id?: string;
  woreda_id?: string;
  engagement_areas?: string[];
  skills?: string[];
  interests?: string[];
  status: "ACTIVE" | "INACTIVE" | "PENDING";
};

type Region = {
    id: number;
    name: string;
    code: string;
};

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

type ImportedCellValue = string | number | boolean | null;

type ImportedRow = {
  rowNumber: number;
  data: Record<string, ImportedCellValue>;
  importIssue?: string;
};

type ImportResult = {
  success: number;
  failed: number;
  errors: string[];
};

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const getImportValue = (row: ImportedRow, aliases: string[]) => {
  const aliasSet = new Set(aliases.map(normalizeHeader));
  const entry = Object.entries(row.data).find(([key]) => aliasSet.has(normalizeHeader(key)));
  if (!entry || entry[1] === null) return "";
  return String(entry[1]).trim();
};

const normalizeGender = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (["f", "female", "woman"].includes(normalized)) return "Female";
  if (["m", "male", "man"].includes(normalized)) return "Male";
  return value.trim();
};

const cellValueToText = (value: ImportedCellValue) => {
  if (value === null) return "";
  return String(value).trim();
};

const hasCellText = (value: CellValue): value is CellValue & { text: string } => {
  return typeof value === "object" && value !== null && "text" in value;
};

const hasFormulaResult = (value: CellValue): value is CellValue & { result: CellValue } => {
  return typeof value === "object" && value !== null && "result" in value;
};

const hasRichText = (value: CellValue): value is CellValue & { richText: { text?: string }[] } => {
  return typeof value === "object" && value !== null && "richText" in value && Array.isArray(value.richText);
};

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [importColumns, setImportColumns] = useState<string[]>([]);
  const [importRows, setImportRows] = useState<ImportedRow[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const [importRegion, setImportRegion] = useState("from_file");
  const [importZone, setImportZone] = useState("from_file");
  const [importWoreda, setImportWoreda] = useState("from_file");
  const [importBranch, setImportBranch] = useState("from_file");
  const [importZones, setImportZones] = useState<{ id: string; region_id: number; name: string }[]>([]);
  const [importWoredas, setImportWoredas] = useState<{ id: string; zone_id: string; name: string }[]>([]);
  const [importBranches, setImportBranches] = useState<any[]>([]);
  const [showImportPromptModal, setShowImportPromptModal] = useState(false);
  const [parsingImport, setParsingImport] = useState(false);
  const [submittingImport, setSubmittingImport] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importPage, setImportPage] = useState(1);


  // New Upgrade States
  const [occupationFilter, setOccupationFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState("");
  const [clearingRegistry, setClearingRegistry] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Volunteer Benefits State
  const [benefitsList, setBenefitsList] = useState<any[]>([]);
  const [loadingBenefits, setLoadingBenefits] = useState(false);
  const [showBenefitForm, setShowBenefitForm] = useState(false);
  const [benefitForm, setBenefitForm] = useState({
    benefit_type: "Safety Kit",
    item_name: "",
    quantity: 1,
    provided_date: new Date().toISOString().split("T")[0],
    remarks: ""
  });
  const [savingBenefit, setSavingBenefit] = useState(false);

  const fetchVolunteerBenefits = async (volPersonId: string) => {
    if (!volPersonId) return;
    setLoadingBenefits(true);
    try {
      const res = await api.get(`/volunteers/benefits?volunteer_id=${volPersonId}`);
      setBenefitsList(res.data.benefits || []);
    } catch (_) {
      setBenefitsList([]);
    } finally {
      setLoadingBenefits(false);
    }
  };

  const handleRecordBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteer || !benefitForm.item_name) return;
    setSavingBenefit(true);
    try {
      await api.post("/volunteers/benefits", {
        volunteer_id: selectedVolunteer.person_id || selectedVolunteer.id,
        benefit_type: benefitForm.benefit_type,
        item_name: benefitForm.item_name,
        quantity: Number(benefitForm.quantity) || 1,
        provided_date: benefitForm.provided_date,
        remarks: benefitForm.remarks
      });
      toast.success("Volunteer benefit / safety kit recorded successfully!");
      setShowBenefitForm(false);
      setBenefitForm({
        benefit_type: "Safety Kit",
        item_name: "",
        quantity: 1,
        provided_date: new Date().toISOString().split("T")[0],
        remarks: ""
      });
      fetchVolunteerBenefits(selectedVolunteer.person_id || selectedVolunteer.id);
    } catch (err) {
      toast.error("Failed to record benefit");
    } finally {
      setSavingBenefit(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (showModal && selectedVolunteer) {
      document.body.style.overflow = 'hidden';
      fetchVolunteerBenefits(selectedVolunteer.person_id || selectedVolunteer.id);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [showModal, selectedVolunteer]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, regionFilter, statusFilter, occupationFilter, areaFilter, classificationFilter]);

  // Fetch volunteers when page, page size, or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVolunteers();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, pageSize, search, regionFilter, statusFilter, occupationFilter, areaFilter, classificationFilter]);

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

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      let finalSearch = search;
      if (occupationFilter) finalSearch += ` occupation:${occupationFilter.replace(/\s+/g, '_')}`;
      if (areaFilter) finalSearch += ` area:${areaFilter}`;
      if (classificationFilter) finalSearch += ` class:${classificationFilter}`;

      const scope = getUserScope();
      let effectiveRegion = regionFilter;
      let userBranch = typeof window !== 'undefined' ? (localStorage.getItem("user_branch") || localStorage.getItem("user_branch_id")) : null;

      if (!scope.isSuperAdmin) {
        if (scope.regionId) effectiveRegion = scope.regionId;
        if (scope.branchId) userBranch = scope.branchId;
      }

      if (scope.isBranchOfficer && userBranch) {
        finalSearch += ` ${userBranch}`;
      }

      const url = `/volunteers?search=${encodeURIComponent(finalSearch)}&region=${effectiveRegion}&status=${statusFilter}&page=${currentPage}&page_size=${pageSize}`;
      const res = await api.get(url);
      setVolunteers(res.data.volunteers || []);
      setTotalPages(res.data.pagination?.total_pages || 1);
      setTotalItems(res.data.pagination?.total_items || 0);
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (volunteers.length === 0) {
        toast.error("No data to export");
        return;
    }

    const headers = ["Name", "Phone", "Region", "Country", "Address", "Hours Spent", "Status"];
    const rows = volunteers.map(v => [
        `${v.first_name} ${v.last_name}`,
        v.phone_number,
        v.region,
        v.country || "Ethiopia",
        v.address || "---",
        v.hoursSpent,
        v.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ercs_volunteers_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    toast.success("CSV Report Generated");
  };

  const exportToPDF = () => {
    window.print();
    toast.info("Preparing PDF Report...");
  };

  const handleApprove = async (personId: string) => {
    try {
        await api.put("/volunteers/status", { person_id: personId, status: "ACTIVE" });
        toast.success("Volunteer Approved");
        fetchVolunteers();
    } catch (err) {
        toast.error("Failed to approve volunteer");
    }
  };

  const downloadTemplate = async () => {
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("ERCS volunteers Regist");

      // Set up headers matching North Addis Ababa volunteers.xlsx template
      const headers = [
        "No.", "Mobile", "Name", "Father Name", "Last Name", "Gender", 
        "Date of Birth (Eth)", "Registration Date", "Occupation", 
        "Organization Name", "Organization Type", "Education Level", 
        "Area", "Languages", "Kebele", "Email", 
        "General", "Youth", "Professional", "Leadership"
      ];

      worksheet.addRow(headers);

      // Style headers
      const headerRow = worksheet.getRow(1);
      headerRow.height = 25;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFED1C24" } // ERCS Red
        };
        cell.font = {
          name: "Segoe UI",
          bold: true,
          color: { argb: "FFFFFFFF" },
          size: 11
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center"
        };
      });

      // Add Formula helper sheet matching official template
      const formulaSheet = workbook.addWorksheet("Formula");
      
      const occupations = ["Farmer", "Business Person", "Civil Servant", "House Wife", "Military", "NGO", "Self Employed", "Student", "Police", "Diplomat", "Others"];
      occupations.forEach((val, i) => { formulaSheet.getCell(`A${i+1}`).value = val; });

      const genders = ["Male", "Female"];
      genders.forEach((val, i) => { formulaSheet.getCell(`B${i+1}`).value = val; });

      const orgTypes = ["Government", "Ngo", "Private", "Association"];
      orgTypes.forEach((val, i) => { formulaSheet.getCell(`C${i+1}`).value = val; });

      const areas = ["URBAN", "RURAL"];
      areas.forEach((val, i) => { formulaSheet.getCell(`D${i+1}`).value = val; });

      const eduLevels = ["Below Primary School", "Primary School Completed", "High School Completed", "Degree", "Masters", "PHD"];
      eduLevels.forEach((val, i) => { formulaSheet.getCell(`E${i+1}`).value = val; });

      const classChoices = ["YES", "NO"];
      classChoices.forEach((val, i) => { formulaSheet.getCell(`F${i+1}`).value = val; });

      // Add sample rows (2-100) with data validation referencing Formula sheet
      const totalRows = 100;
      for (let i = 2; i <= totalRows; i++) {
        // Gender column (F)
        worksheet.getCell(`F${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ["'Formula'!$B$1:$B$2"]
        };

        // Occupation column (I)
        worksheet.getCell(`I${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ["'Formula'!$A$1:$A$11"]
        };

        // Organization Type column (K)
        worksheet.getCell(`K${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ["'Formula'!$C$1:$C$4"]
        };

        // Education Level column (L)
        worksheet.getCell(`L${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ["'Formula'!$E$1:$E$6"]
        };

        // Area column (M)
        worksheet.getCell(`M${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ["'Formula'!$D$1:$D$2"]
        };

        // Classifications: General (Q), Youth (R), Professional (S), Leadership (T)
        const classCols = ["Q", "R", "S", "T"];
        classCols.forEach((col) => {
          worksheet.getCell(`${col}${i}`).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: ["'Formula'!$F$1:$F$2"]
          };
        });
      }

      // Add dummy data for first row as help
      worksheet.addRow([
        1, "0939296961", "mengesha", "werkneh", "yrga", "Male", 
        "02/01/1990", "16/10/2024", "House Wife", "ERCS", "Government", 
        "Degree", "URBAN", "Amharic, English", "Kebele 20", "mengesha@example.com", 
        "YES", "NO", "YES", "NO"
      ]);

      // Set columns auto-width
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
      link.download = "North Addis Ababa volunteers.xlsx";
      link.click();
      toast.success("Excel Template downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate template");
    }
  };

  const handleClearRegistry = async () => {
    if (clearConfirmText !== "CLEAR") {
      toast.error("Please type 'CLEAR' to confirm");
      return;
    }
    setClearingRegistry(true);
    try {
      const res = await api.delete("/volunteers/clear");
      toast.success(res.data?.message || "Successfully cleared volunteer registry!");
      setVolunteers([]);
      setShowClearConfirm(false);
      setClearConfirmText("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to clear registry.");
    } finally {
      setClearingRegistry(false);
    }
  };

  const readExcelCell = (cell: Cell): ImportedCellValue => {
    const value = cell?.value;
    if (value === undefined || value === null || value === "") return null;
    if (value instanceof Date) return value.toISOString().split("T")[0];
    if (typeof value === "object") {
      if (hasCellText(value)) return String(value.text).trim() || null;
      if (hasFormulaResult(value)) return value.result === undefined || value.result === null ? null : String(value.result).trim();
      if (hasRichText(value)) {
        const text = value.richText.map((part) => part.text || "").join("").trim();
        return text || null;
      }
      return JSON.stringify(value);
    }
    if (typeof value === "string") return value.trim() || null;
    if (typeof value === "number" || typeof value === "boolean") return value;
    return String(value).trim() || null;
  };

  const handleImportFile = async (file?: File | null) => {
    if (!file) return;
    setParsingImport(true);
    setImportResult(null);

    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets.find(sheet => sheet.actualRowCount > 0);
      if (!worksheet) {
        toast.error("No worksheet data found");
        return;
      }

      let headerRowNumber = 1;
      let headers: string[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (headers.length > 0) return;
        const values = row.values as CellValue[];
        const candidateHeaders = values.slice(1).map((value, index) => {
          const raw = value === undefined || value === null ? "" : String(value).trim();
          return raw || `Column ${index + 1}`;
        });
        if (candidateHeaders.some(Boolean)) {
          headerRowNumber = rowNumber;
          headers = candidateHeaders;
        }
      });

      const seenHeaders = new Map<string, number>();
      const uniqueHeaders = headers.map((header, index) => {
        const base = header || `Column ${index + 1}`;
        const seen = seenHeaders.get(base) || 0;
        seenHeaders.set(base, seen + 1);
        return seen === 0 ? base : `${base} ${seen + 1}`;
      });

      const rows: ImportedRow[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber <= headerRowNumber) return;
        const data = uniqueHeaders.reduce<Record<string, ImportedCellValue>>((acc, header, index) => {
          acc[header] = readExcelCell(row.getCell(index + 1));
          return acc;
        }, {});
        const hasAnyValue = Object.values(data).some(value => value !== null && String(value).trim() !== "");
        if (hasAnyValue) rows.push({ rowNumber, data });
      });

      setImportColumns(uniqueHeaders);
      setImportRows(rows);
      setImportRegion("from_file");
      setImportZone("from_file");
      setImportWoreda("from_file");
      setImportFileName(file.name);
      setImportPage(1);
      setShowImportPromptModal(true);
      toast.success(`Parsed ${rows.length} volunteer rows`);
    } catch (err) {
      console.error("Failed to parse volunteer import:", err);
      toast.error("Failed to parse Excel file");
    } finally {
      setParsingImport(false);
    }
  };


  const downloadDefectiveWorkbook = async (failedRows: ImportedRow[]) => {
    if (failedRows.length === 0) return;

    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Defective Volunteers");
    const issueColumn = "Import Issue";

    worksheet.addRow(["Source Row", ...importColumns, issueColumn]);
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFB91C1C" },
    };

    failedRows.forEach((row) => {
      const issue = row.importIssue || "Unknown import issue";
      const addedRow = worksheet.addRow([
        row.rowNumber,
        ...importColumns.map((column) => row.data[column] ?? null),
        issue,
      ]);

      addedRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFE4E6" },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFFECACA" } },
          left: { style: "thin", color: { argb: "FFFECACA" } },
          bottom: { style: "thin", color: { argb: "FFFECACA" } },
          right: { style: "thin", color: { argb: "FFFECACA" } },
        };
      });

      const issueCell = addedRow.getCell(importColumns.length + 2);
      issueCell.note = issue;
      addedRow.getCell(1).note = issue;
    });

    worksheet.columns.forEach((column) => {
      column.width = Math.min(Math.max(Number(column.header?.toString().length || 12) + 4, 14), 36);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = importFileName.replace(/\.xlsx$/i, "") || "volunteer_import";
    link.href = url;
    link.download = `${safeName}_defects.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDOBForBackend = (dobStr: string): string => {
    if (!dobStr) return "";
    
    // Check if already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dobStr)) {
      return dobStr;
    }
    
    // Try parsing DD/MM/YYYY or DD-MM-YYYY
    const parts = dobStr.split(/[\/\-]/);
    if (parts.length === 3) {
      const part0 = parts[0].trim();
      const part1 = parts[1].trim();
      const part2 = parts[2].trim();
      
      // Check if it matches DD/MM/YYYY where YYYY is 4 digits
      if (part0.length <= 2 && part1.length <= 2 && part2.length === 4) {
        const day = part0.padStart(2, '0');
        const month = part1.padStart(2, '0');
        const year = part2;
        return `${year}-${month}-${day}`;
      }
      
      // Check if it matches YYYY/MM/DD
      if (part0.length === 4 && part1.length <= 2 && part2.length <= 2) {
        const year = part0;
        const month = part1.padStart(2, '0');
        const day = part2.padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    
    return dobStr;
  };

  const buildVolunteerPayload = (row: ImportedRow, index: number) => {
    const firstName = getImportValue(row, ["Name", "First Name", "FirstName"]);
    const fatherName = getImportValue(row, ["Father Name", "FatherName", "Middle Name", "Last Name"]);
    const grandfatherName = getImportValue(row, ["Last Name", "Grandfather Name", "GrandfatherName"]);
    const phoneNumber = getImportValue(row, ["Mobile", "Phone", "Phone Number", "phone_number"]);
    const email = getImportValue(row, ["Email", "Email Address"]);
    const gender = normalizeGender(getImportValue(row, ["Gender"]));
    const dateOfBirth = getImportValue(row, ["Date of Birth (Eth)", "Date of Birth", "DOB"]);
    const occupation = getImportValue(row, ["Occupation", "Profession"]);
    const kebele = getImportValue(row, ["Kebele"]);
    const area = getImportValue(row, ["Area"]);
    const languages = getImportValue(row, ["Languages"]);
    const educationLevel = getImportValue(row, ["Education Level", "EducationLevel"]);
    const orgName = getImportValue(row, ["Organization Name", "OrganizationName"]);
    const orgType = getImportValue(row, ["Organization Type", "OrganizationType"]);

    const engagementAreas = ["General", "Youth", "Professional", "Leadership"]
      .filter(column => {
        const val = cellValueToText(row.data[column]).toLowerCase();
        return val === "yes" || val === "1" || val === "true";
      });

    const interests = [];
    if (area) interests.push(`Area:${area.toUpperCase()}`);
    if (educationLevel) interests.push(`Education:${educationLevel}`);
    if (orgName) interests.push(`OrgName:${orgName}`);
    if (orgType) interests.push(`OrgType:${orgType}`);

    const metadataObj = {
      source: "volunteer_excel_import",
      file_name: importFileName,
      imported_at: new Date().toISOString(),
      source_row_number: row.rowNumber,
      nullable_columns: row.data,
      date_of_birth: formatDOBForBackend(dateOfBirth) || null,
      occupation: occupation || null,
      kebele: kebele || null,
      educationLevel: educationLevel || null,
      organizationName: orgName || null,
      organizationType: orgType || null,
      area: area || null,
      languages: languages || null,
    };

    const rawRegionInRow = getImportValue(row, ["Region", "Region (Select from list)", "Branch"]);
    const targetRegionId = importRegion === "from_file"
      ? resolveRegionId(rawRegionInRow, regions)
      : (Number(importRegion) || 1);


    return {
      first_name: firstName,
      father_name: fatherName,
      grandfather_name: grandfatherName,
      phone_number: phoneNumber,
      email,
      password: `ERCS@${phoneNumber.slice(-4) || String(index + 1).padStart(4, "0")}`,
      region: targetRegionId,
      zone_id: importZone === "from_file" ? getImportValue(row, ["Zone", "Zone ID", "zone_id"]) : importZone,
      woreda_id: importWoreda === "from_file" ? getImportValue(row, ["Woreda", "Woreda ID", "woreda_id"]) : importWoreda,
      branch_id: importBranch === "from_file" ? getImportValue(row, ["Branch ID", "Branch", "branch_id", "Branch Office", "Branch Name"]) : importBranch,
      role: 5,
      gender,
      date_of_birth: formatDOBForBackend(dateOfBirth),
      profession: occupation,
      address: kebele,
      country: "Ethiopia",
      engagement_areas: engagementAreas,
      skills: languages ? languages.split(",").map(item => item.trim()).filter(Boolean) : [],
      interests: interests,
      metadata: JSON.stringify(metadataObj),
    };
  };


  const submitImportedVolunteers = async () => {
    if (importRows.length === 0) {
      toast.error("Choose an Excel file before importing");
      return;
    }

    setSubmittingImport(true);
    const result: ImportResult = { success: 0, failed: 0, errors: [] };
    const failedRows: ImportedRow[] = [];
    const seenPhones = new Set<string>();
    const seenEmails = new Set<string>();

    for (const [index, row] of importRows.entries()) {
      const payload = buildVolunteerPayload(row, index);
      const rowIssues: string[] = [];
      const phone = payload.phone_number.replace(/[^0-9+]/g, "");
      const email = payload.email.trim().toLowerCase();
      if (!payload.first_name) rowIssues.push("first name is required");
      if (!phone) rowIssues.push("phone number is required");
      else if (!/^\+?\d{7,15}$/.test(phone)) rowIssues.push("invalid phone number");
      else if (seenPhones.has(phone)) rowIssues.push("duplicate phone number in file");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) rowIssues.push("invalid email");
      else if (email && seenEmails.has(email)) rowIssues.push("duplicate email in file");
      if (phone) seenPhones.add(phone);
      if (email) seenEmails.add(email);
      if (!regions.some(region => region.id === Number(payload.region))) rowIssues.push("invalid region");
      if (payload.zone_id && !importZones.some(zone => zone.id === payload.zone_id && zone.region_id === Number(payload.region))) rowIssues.push("zone does not belong to region");
      if (payload.woreda_id && !importWoredas.some(woreda => woreda.id === payload.woreda_id && woreda.zone_id === payload.zone_id)) rowIssues.push("woreda/branch does not belong to zone");
      if (payload.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date_of_birth)) rowIssues.push("date must be YYYY-MM-DD");
      if (payload.gender && !["Male", "Female"].includes(payload.gender)) rowIssues.push("gender must be Male or Female");

      if (rowIssues.length > 0) {
        const issue = rowIssues.join(", ");
        result.failed += 1;
        result.errors.push(`Row ${row.rowNumber}: ${issue}`);
        failedRows.push({ ...row, importIssue: issue });
        continue;
      }

      try {
        await api.post("/auth/register/volunteer", payload);
        result.success += 1;
      } catch (err: unknown) {
        result.failed += 1;
        const error = err as { response?: { data?: { message?: string } | string }, message?: string };
        const message = (typeof error.response?.data === "object" ? error.response.data.message : error.response?.data) || error.message || "Import failed";
        result.errors.push(`Row ${row.rowNumber}: ${message}`);
        failedRows.push({ ...row, importIssue: message });
      }
    }

    setImportResult(result);
    setImportRows(failedRows);
    setImportPage(1);
    setSubmittingImport(false);
    if (result.failed === 0) {
      toast.success(`Imported ${result.success} volunteers`);
    } else {
      toast.warning(`Imported ${result.success}, failed ${result.failed}`);
      try {
        await downloadDefectiveWorkbook(failedRows);
      } catch (err) {
        console.error("Failed to create defect workbook:", err);
        toast.error("Failed to download defect workbook");
      }
    }
    fetchVolunteers();
  };

  const getArea = (v: Volunteer) => v.interests?.find(i => i.startsWith("Area:"))?.replace("Area:", "") || "Not Specified";
  const getEducation = (v: Volunteer) => v.interests?.find(i => i.startsWith("Education:"))?.replace("Education:", "") || "Not Specified";
  const getEducationalBackground = (v: Volunteer) => {
    let meta: any = {};
    try {
      const rawMeta = (v as any).metadata;
      meta = typeof rawMeta === 'string' ? JSON.parse(rawMeta || '{}') : (rawMeta || {});
    } catch {
      meta = {};
    }
    return meta.educationalBackground || meta.educational_background || "Not Specified";
  };
  const getOrgName = (v: Volunteer) => v.interests?.find(i => i.startsWith("OrgName:"))?.replace("OrgName:", "") || "N/A";
  const getOrgType = (v: Volunteer) => v.interests?.find(i => i.startsWith("OrgType:"))?.replace("OrgType:", "") || "N/A";

  const filteredVolunteers = volunteers || [];

  return (
    <div className="space-y-10 print:p-0 text-black">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
            <HandHeart className="h-3 w-3" /> Volunteers System
          </div>
          <h1 className="text-3xl font-black text-black tracking-tighter">Volunteer Registry</h1>
          <p className="text-gray-500 font-medium text-sm">Manage all field volunteers, track hours, and coordinate field activities.</p>
        </div>

        <div className="flex items-center gap-2">
            <Button 
                onClick={downloadTemplate}
                variant="outline" 
                className="rounded-xl h-10 px-4 font-black border-gray-200 flex items-center gap-2 shadow-sm text-[10px] uppercase tracking-widest text-black"
            >
                <Download className="h-4 w-4" /> Template
            </Button>
            <Button 
                onClick={exportToCSV}
                variant="outline" 
                className="rounded-xl h-10 px-4 font-black border-gray-200 flex items-center gap-2 shadow-sm text-[10px] uppercase tracking-widest text-black"
            >
                <TableIcon className="h-4 w-4" /> CSV
            </Button>
            <div className="relative">
                <input 
                    type="file" 
                    accept=".xlsx,.csv" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImportFile(file);
                      e.target.value = "";
                    }} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    disabled={parsingImport || submittingImport}
                />
                <Button 
                    variant="outline" 
                    className="rounded-xl h-10 px-4 font-black border-gray-200 flex items-center gap-2 shadow-sm text-[10px] uppercase tracking-widest text-black"
                >
                    {parsingImport ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Import
                </Button>
            </div>
            <Button 
                onClick={exportToPDF}
                variant="outline" 
                className="rounded-xl h-10 px-4 font-black border-gray-200 flex items-center gap-2 shadow-sm text-[10px] uppercase tracking-widest text-black"
            >
                <FileText className="h-4 w-4" /> PDF
            </Button>
            <Link href="/admin/user-management?create=true">
              <Button className="rounded-xl h-10 px-6 font-black shadow-xl shadow-red-500/10 flex items-center gap-2 bg-[#ED1C24] hover:bg-red-700 text-white text-[10px] uppercase tracking-widest">
                  <Plus className="h-4 w-4" /> Add Volunteer
              </Button>
            </Link>
        </div>
      </div>


      <div className="flex flex-col gap-4 print:hidden">
        <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                    placeholder="Search volunteers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 pl-10 bg-white border border-gray-200 shadow-sm text-black rounded-xl font-bold text-sm"
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
                variant="outline"
                className={`h-10 px-6 rounded-xl font-black flex items-center gap-2 ${showFilters ? 'bg-black text-white' : 'border-gray-200'}`}
            >
                <Filter className="h-4 w-4" /> 
                {showFilters ? 'Hide Filters' : 'Advanced Filters'}
            </Button>
        </div>

        {showFilters && (
            <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location/Region</label>
                    <select 
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-gray-200 font-bold text-xs outline-none"
                    >
                        <option value="">All Regions</option>
                        {regions.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-gray-200 font-bold text-xs outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="PENDING">Pending</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Area</label>
                    <select 
                        value={areaFilter}
                        onChange={(e) => setAreaFilter(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-gray-200 font-bold text-xs outline-none"
                    >
                        <option value="">All Areas</option>
                        <option value="URBAN">Urban</option>
                        <option value="RURAL">Rural</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Classification</label>
                    <select 
                        value={classificationFilter}
                        onChange={(e) => setClassificationFilter(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-gray-200 font-bold text-xs outline-none"
                    >
                        <option value="">All Classifications</option>
                        <option value="General">General</option>
                        <option value="Youth">Youth</option>
                        <option value="Professional">Professional</option>
                        <option value="Leadership">Leadership</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Occupation</label>
                    <select 
                        value={occupationFilter}
                        onChange={(e) => setOccupationFilter(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-gray-200 font-bold text-xs outline-none"
                    >
                        <option value="">All Occupations</option>
                        <option value="Farmer">Farmer</option>
                        <option value="Business Person">Business Person</option>
                        <option value="Civil Servant">Civil Servant</option>
                        <option value="House Wife">House Wife</option>
                        <option value="Military">Military</option>
                        <option value="NGO">NGO</option>
                        <option value="Self Employed">Self Employed</option>
                        <option value="Student">Student</option>
                        <option value="Police">Police</option>
                        <option value="Diplomat">Diplomat</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 pb-0.5 md:col-span-3 justify-end">
                    <Button 
                        onClick={() => setShowClearConfirm(true)}
                        variant="ghost" 
                        className="h-10 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
                    >
                        <X className="h-3.5 w-3.5 mr-1" /> Clear Registry
                    </Button>
                    <Button 
                        onClick={() => { 
                            setRegionFilter(""); 
                            setStatusFilter(""); 
                            setSearch(""); 
                            setAreaFilter(""); 
                            setClassificationFilter(""); 
                            setOccupationFilter(""); 
                        }}
                        variant="ghost" 
                        className="h-10 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest text-gray-400 hover:text-[#ED1C24] hover:bg-white transition-all"
                    >
                        <X className="h-3.5 w-3.5 mr-1" /> Reset Filters
                    </Button>
                </div>
            </div>
        )}
      </div>

      {(importRows.length > 0 || importResult) && (
        <div className="print:hidden rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden p-5 space-y-4">

                {importRows.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-500">{importFileName}</span>
                        <span>{importRows.length} remaining rows</span>
                        <span>{importColumns.length} columns</span>
                    </div>
                )}

                {importResult && (
                    <div className={cn(
                        "rounded-xl border p-4 text-sm font-bold",
                        importResult.failed === 0 ? "bg-green-50 border-green-100 text-green-700" : "bg-amber-50 border-amber-100 text-amber-800"
                    )}>
                        <div className="flex items-center gap-2">
                            {importResult.failed === 0 ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <span>{importResult.success} imported, {importResult.failed} failed</span>
                        </div>
                        {importResult.errors.length > 0 && (
                            <div className="mt-3 max-h-28 overflow-y-auto space-y-1 text-xs">
                                {importResult.errors.slice(0, 20).map(error => (
                                    <p key={error}>{error}</p>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {importRows.length > 0 && (
                    <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="sticky left-0 bg-gray-50 px-3 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap border-b border-gray-100">Row</th>
                                        {importColumns.slice(0, 8).map(column => (
                                            <th key={column} className="px-3 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap border-b border-gray-100">
                                                {column}
                                            </th>
                                        ))}
                                        <th className="px-3 py-3 text-[9px] font-black uppercase tracking-widest text-red-600 whitespace-nowrap border-b border-gray-100">Issue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {importRows.slice((importPage - 1) * 10, importPage * 10).map(row => (
                                        <tr key={row.rowNumber} className={cn("border-t border-gray-50 transition-colors hover:bg-gray-50/50", row.importIssue && "bg-red-50/20 hover:bg-red-50/30")}>
                                            <td className={cn("sticky left-0 px-3 py-2 text-[10px] font-black border-r", row.importIssue ? "bg-red-100/80 text-red-600 border-red-200/50" : "bg-white text-gray-400 border-gray-100")}>{row.rowNumber}</td>
                                            {importColumns.slice(0, 8).map(column => (
                                                <td key={`${row.rowNumber}-${column}`} className={cn("px-3 py-2 text-xs font-bold whitespace-nowrap border-r", row.importIssue ? "bg-red-100/60 text-red-700 border-red-200/50" : "text-gray-600 border-gray-100")}>
                                                    {row.data[column] === null ? <span className="text-gray-300 italic">null</span> : String(row.data[column])}
                                                </td>
                                            ))}
                                            <td className={cn("px-3 py-2 text-xs font-black whitespace-nowrap", row.importIssue ? "bg-red-100/80 text-red-600" : "text-gray-400")}>
                                                {row.importIssue || "---"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Showing {((importPage - 1) * 10) + 1}-{Math.min(importPage * 10, importRows.length)} of {importRows.length} rows (Previewing first 8 data columns)
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                                    onClick={() => setImportPage(prev => Math.max(1, prev - 1))}
                                    disabled={importPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-[10px] font-black text-gray-500 px-1">
                                    Page {importPage} of {Math.ceil(importRows.length / 10)}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                                    onClick={() => setImportPage(prev => Math.min(Math.ceil(importRows.length / 10), prev + 1))}
                                    disabled={importPage >= Math.ceil(importRows.length / 10)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}


      {viewMode === "map" ? (
        <GeographicMapReport
          items={volunteers}
          title="Volunteers Geographic Distribution"
          type="volunteers"
          onSelectRegion={(regId) => {
            setRegionFilter(regId);
            setViewMode("table");
          }}
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden print:shadow-none print:border-none">
            <Table>
          <TableHeader className="bg-gray-50/50 print:bg-transparent">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Volunteer Identity</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Contact</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Location</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Address</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Contribution</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                   <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                         <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin"></div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Volunteers...</p>
                      </div>
                   </TableCell>
                </TableRow>
            ) : filteredVolunteers.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={6} className="h-32 text-center text-gray-400 font-bold italic text-xs">No volunteers found matching your criteria</TableCell>
                </TableRow>
            ) : (
                filteredVolunteers.map((v) => (
                    <TableRow key={v.id} className="hover:bg-gray-50/50 transition-colors border-gray-50 font-bold">
                    <TableCell className="px-6 py-4">
                        <span className="font-black text-black text-sm leading-tight uppercase tracking-tighter">{v.first_name} {v.last_name}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                        <span className="text-xs font-bold text-gray-500">{v.phone_number}</span>
                    </TableCell>
                    
                    <TableCell className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-md w-fit">
                                {regions.find(r => String(r.id) === String(v.region))?.name || v.region || 'N/A'}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter ml-1">{v.country || 'Ethiopia'}</span>
                        </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                        <span className="text-xs text-gray-500 truncate max-w-[150px] inline-block" title={v.address}>
                            {v.address || '---'}
                        </span>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                            <span className="font-black text-sm text-[#ED1C24]">{v.hoursSpent || 0} <span className="text-[9px] uppercase font-black opacity-50">Hrs</span></span>
                            {v.hoursSpent > 100 && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                        </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <span className={cn(
                                "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest",
                                v.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                            )}>
                                {v.status || "PENDING"}
                            </span>
                            <button 
                                onClick={() => { setSelectedVolunteer(v); setShowModal(true); }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            >
                                <ArrowUpRight className="h-4 w-4 ml-auto text-gray-300 group-hover:text-[#ED1C24] transition-colors" />
                            </button>
                            {v.status === "PENDING" && (
                                <Button 
                                    onClick={() => handleApprove(v.person_id || v.id)}
                                    className="h-7 px-3 bg-[#ED1C24] text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all"
                                >
                                    Approve
                                </Button>
                            )}
                        </div>
                    </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm print:hidden">
        <div className="text-xs font-bold text-gray-500">
          Showing <span className="font-black text-black">{totalItems > 0 ? ((currentPage - 1) * pageSize) + 1 : 0}</span> to{" "}
          <span className="font-black text-black">{Math.min(currentPage * pageSize, totalItems)}</span> of{" "}
          <span className="font-black text-black">{totalItems}</span> volunteers
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-black outline-none cursor-pointer hover:bg-gray-50"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest bg-white border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                })
                .map((p, idx, arr) => {
                  const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <div key={p} className="flex items-center">
                      {showEllipsisBefore && <span className="text-gray-400 text-xs px-1">...</span>}
                      <Button
                        variant={p === currentPage ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0 rounded-lg font-black text-xs transition-all",
                          p === currentPage
                            ? "bg-[#ED1C24] hover:bg-[#ED1C24]/90 text-white shadow-md shadow-red-500/10"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => setCurrentPage(p)}
                        disabled={loading}
                      >
                        {p}
                      </Button>
                    </div>
                  );
                })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest bg-white border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Volunteer Detail Modal */}
      {showModal && selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100"
            >
                <div className="p-6 border-b border-gray-50 flex justify-between items-start sticky top-0 bg-white/80 backdrop-blur-md z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest">Volunteer Profile Audit</p>
                        <h2 className="text-2xl font-black tracking-tight text-black">
                            {selectedVolunteer.first_name} {selectedVolunteer.last_name}
                        </h2>
                        <p className="text-xs font-bold text-gray-400">{selectedVolunteer.person_id || selectedVolunteer.id}</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(false)}
                        className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Identity & Bio</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><User className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Gender</p>
                                        <p className="text-xs font-bold text-black">{selectedVolunteer.gender || "Not Specified"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Calendar className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Date of Birth</p>
                                        <p className="text-xs font-bold text-black">{selectedVolunteer.date_of_birth || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Star className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Hours Contributed</p>
                                        <p className="text-xs font-bold text-[#ED1C24]">{selectedVolunteer.hoursSpent || 0} Total Hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Briefcase className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Profession</p>
                                        <p className="text-xs font-bold text-black">{selectedVolunteer.profession || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Contact & Location</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Phone className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Phone</p>
                                        <p className="text-xs font-bold text-black">{selectedVolunteer.phone_number || "No Phone"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><MapPin className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Region / Branch</p>
                                        <p className="text-xs font-bold text-black">
                                            {regions.find(r => String(r.id) === String(selectedVolunteer.region))?.name || "National HQ"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Mail className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Email Address</p>
                                        <p className="text-xs font-bold text-black">{selectedVolunteer.email || "No Email"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Home className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Address / Country</p>
                                        <p className="text-xs font-bold text-black">
                                            {selectedVolunteer.address || "---"} • {selectedVolunteer.country || "Ethiopia"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><MapPin className="h-4 w-4 text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Zone / Woreda</p>
                                        <p className="text-xs font-bold text-black">
                                            {getZoneName(selectedVolunteer.zone_id) || "---"} • {getWoredaName(selectedVolunteer.woreda_id, selectedVolunteer.zone_id) || "---"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <div className="mt-4 p-5 bg-gray-50 rounded-[24px] border border-gray-100">
                        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Expertise & Engagement</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Engagement Areas</p>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedVolunteer.engagement_areas || []).map((area: string) => (
                                        <span key={area} className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-black shadow-sm">
                                            {area}
                                        </span>
                                    ))}
                                    {(!selectedVolunteer?.engagement_areas || selectedVolunteer.engagement_areas.length === 0) && <p className="text-xs text-gray-400 font-bold italic">No areas selected</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Education Level</p>
                                    <p className="text-xs font-bold text-black">{getEducation(selectedVolunteer)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Educational Background</p>
                                    <p className="text-xs font-bold text-black">{getEducationalBackground(selectedVolunteer)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Geographic Area</p>
                                    <p className="text-xs font-bold text-black">{getArea(selectedVolunteer)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Organization</p>
                                    <p className="text-xs font-bold text-black">
                                        {getOrgName(selectedVolunteer) !== "N/A" ? `${getOrgName(selectedVolunteer)} (${getOrgType(selectedVolunteer)})` : "Not Specified"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Languages</p>
                                    <p className="text-xs font-bold text-black">{selectedVolunteer.skills?.join(", ") || "None Specified"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedVolunteer.skills || []).map((skill: string) => (
                                            <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-wider">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Interests</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedVolunteer.interests || []).map((interest: string) => (
                                            <span key={interest} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[9px] font-black uppercase tracking-wider">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Safety Kits & Volunteer Benefits Tracking */}
                    <div className="mt-4 p-5 bg-red-50/40 rounded-[24px] border border-red-100 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1.5">
                                    <HandHeart className="h-3.5 w-3.5" /> Safety Kits & Benefits Tracking
                                </h4>
                                <p className="text-[11px] text-gray-500 font-medium">Record safety equipment, kits, and benefits provided to this volunteer.</p>
                            </div>
                            <Button 
                                type="button" 
                                onClick={() => setShowBenefitForm(!showBenefitForm)}
                                className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider bg-[#ED1C24] hover:bg-black text-white rounded-xl shadow-xs"
                            >
                                <Plus className="h-3 w-3 mr-1" /> {showBenefitForm ? "Close Form" : "Record Benefit"}
                            </Button>
                        </div>

                        {showBenefitForm && (
                            <form onSubmit={handleRecordBenefit} className="bg-white p-4 rounded-2xl border border-red-100 space-y-3 shadow-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-600 uppercase">Benefit / Kit Type *</label>
                                        <select
                                            value={benefitForm.benefit_type}
                                            onChange={(e) => setBenefitForm({...benefitForm, benefit_type: e.target.value})}
                                            className="w-full h-8 bg-gray-50 border border-gray-200 rounded-lg px-2 text-xs font-bold text-black"
                                            required
                                        >
                                            <option value="Safety Kit">Safety Kit / PPE</option>
                                            <option value="First Aid Kit">First Aid Kit</option>
                                            <option value="Uniform / Vest">Red Cross Uniform / Vest</option>
                                            <option value="Boots & Raincoat">Heavy Duty Boots / Raincoat</option>
                                            <option value="Allowance / Stipend">Transport / Food Allowance</option>
                                            <option value="Insurance Coverage">Health & Accident Insurance</option>
                                            <option value="Certificate">Appreciation Certificate</option>
                                            <option value="Other">Other Benefit</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-600 uppercase">Item Name / Description *</label>
                                        <Input 
                                            placeholder="e.g. Standard ERCS Trauma First Aid Kit"
                                            value={benefitForm.item_name}
                                            onChange={(e) => setBenefitForm({...benefitForm, item_name: e.target.value})}
                                            className="h-8 bg-gray-50 border-gray-200 rounded-lg text-xs font-semibold text-black"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-600 uppercase">Quantity *</label>
                                        <Input 
                                            type="number"
                                            min={1}
                                            value={benefitForm.quantity}
                                            onChange={(e) => setBenefitForm({...benefitForm, quantity: Number(e.target.value)})}
                                            className="h-8 bg-gray-50 border-gray-200 rounded-lg text-xs font-semibold text-black"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-600 uppercase">Provided Date *</label>
                                        <Input 
                                            type="date"
                                            value={benefitForm.provided_date}
                                            onChange={(e) => setBenefitForm({...benefitForm, provided_date: e.target.value})}
                                            className="h-8 bg-gray-50 border-gray-200 rounded-lg text-xs font-semibold text-black"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-600 uppercase">Remarks / Notes (Optional)</label>
                                    <Input 
                                        placeholder="e.g. Issued for Flood Response Mission in Ward 4"
                                        value={benefitForm.remarks}
                                        onChange={(e) => setBenefitForm({...benefitForm, remarks: e.target.value})}
                                        className="h-8 bg-gray-50 border-gray-200 rounded-lg text-xs font-semibold text-black"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-1">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        onClick={() => setShowBenefitForm(false)}
                                        className="h-8 px-3 text-xs font-bold text-gray-500 rounded-lg"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={savingBenefit}
                                        className="h-8 px-4 bg-[#ED1C24] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
                                    >
                                        {savingBenefit ? "Saving..." : "Submit Record"}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Benefits History Table */}
                        <div className="space-y-2">
                            {loadingBenefits ? (
                                <div className="p-4 text-center text-xs text-gray-400 font-bold">Loading benefits records...</div>
                            ) : benefitsList.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1">
                                    {benefitsList.map((b: any) => (
                                        <div key={b.id} className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between text-xs shadow-2xs">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-black">{b.item_name}</span>
                                                    <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-[9px] font-black uppercase tracking-wider">
                                                        {b.benefit_type} (Qty: {b.quantity})
                                                    </span>
                                                </div>
                                                {b.remarks && <p className="text-[11px] text-gray-500">{b.remarks}</p>}
                                            </div>
                                            <div className="text-right shrink-0 pl-3">
                                                <span className="text-[10px] font-bold text-gray-400 block">{b.provided_date ? b.provided_date.split("T")[0] : ""}</span>
                                                <span className="text-[9px] font-bold text-emerald-600 uppercase">Recorded</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 font-bold italic bg-white p-3 rounded-xl border border-gray-100 text-center">
                                    No benefits or safety equipment recorded for this volunteer yet.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 p-5 bg-gray-50 rounded-[24px] border border-gray-100">
                        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Volunteer Status</h4>
                        <div className="flex items-center justify-between">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                selectedVolunteer.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                            )}>
                                {selectedVolunteer.status || "PENDING APPROVAL"}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        {selectedVolunteer.status === "PENDING" && (
                            <Button 
                                onClick={() => {
                                    handleApprove(selectedVolunteer.person_id || selectedVolunteer.id);
                                    setShowModal(false);
                                }}
                                className="flex-1 bg-[#ED1C24] text-white rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest"
                            >
                                Approve Volunteer
                            </Button>
                        )}
                        <Button 
                            onClick={() => setShowModal(false)}
                            variant="outline" 
                            className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest border-gray-200"
                        >
                            Close Profile
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
      )}

      {/* Clear Registry Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-md border border-gray-100 p-6 space-y-6"
            >
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4" /> Danger Zone
                    </p>
                    <h2 className="text-xl font-black tracking-tight text-black">
                        Clear Volunteer Registry
                    </h2>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        This operation is highly destructive and cannot be undone. It will delete all volunteers, profiles, deployments, and related user accounts from the database. People holding active memberships will NOT be deleted.
                    </p>
                    <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                        Please type <span className="font-black underline">CLEAR</span> below to authorize this deletion.
                    </p>
                </div>

                <div className="space-y-4">
                    <Input 
                        value={clearConfirmText}
                        onChange={(e) => setClearConfirmText(e.target.value)}
                        placeholder="Type CLEAR to confirm"
                        className="h-11 rounded-xl bg-gray-50 border-none font-bold text-sm text-black"
                    />

                    <div className="flex gap-3">
                        <Button 
                            onClick={handleClearRegistry}
                            disabled={clearConfirmText !== "CLEAR" || clearingRegistry}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            {clearingRegistry && <Loader2 className="h-4 w-4 animate-spin" />}
                            Execute Deletion
                        </Button>
                        <Button 
                            onClick={() => { setShowClearConfirm(false); setClearConfirmText(""); }}
                            variant="outline" 
                            className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest border-gray-200"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
      )}

      {/* Volunteer Import - Branch / Region Prompt Modal */}

      {showImportPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-6xl xl:max-w-7xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-red-100 text-[#ED1C24] rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                  <Upload className="h-3 w-3" /> Volunteer Import Prompt
                </div>
                <h2 className="text-xl font-black tracking-tight text-black">Assign Import Location</h2>
                <p className="text-xs font-bold text-gray-400">
                  File: <span className="text-black font-extrabold">{importFileName}</span> ({importRows.length} rows parsed, {importColumns.length} columns)
                </p>
              </div>
              <button 
                onClick={() => setShowImportPromptModal(false)}
                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-3 bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/80 block">
                    Target Branch & Location Assignment
                  </label>
                  <span className="text-[10px] font-semibold text-gray-500">
                    Applies to all {importRows.length} imported volunteers
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                      Target Regional Branch
                    </label>
                    <select
                      value={importRegion}
                      onChange={(e) => { setImportRegion(e.target.value); setImportZone("from_file"); setImportWoreda("from_file"); setImportBranch("from_file"); }}
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
                      value={importZone} 
                      disabled={importRegion === "from_file"} 
                      onChange={(e) => { setImportZone(e.target.value); setImportWoreda("from_file"); }} 
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-black border border-gray-200 font-bold text-xs disabled:opacity-50 disabled:bg-gray-100 shadow-sm"
                    >
                      <option value="from_file">Use Zone from file</option>
                      {importZones.filter(z => String(z.region_id) === importRegion).map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                      Woreda
                    </label>
                    <select 
                      value={importWoreda} 
                      disabled={importZone === "from_file"} 
                      onChange={(e) => setImportWoreda(e.target.value)} 
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-black border border-gray-200 font-bold text-xs disabled:opacity-50 disabled:bg-gray-100 shadow-sm"
                    >
                      <option value="from_file">Use Woreda from file</option>
                      {importWoredas.filter(w => w.zone_id === importZone).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                      Branch / Coordination Office
                    </label>
                    <select 
                      value={importBranch} 
                      onChange={(e) => setImportBranch(e.target.value)} 
                      className="w-full h-11 px-3.5 rounded-xl bg-white text-black border border-gray-200 font-bold text-xs shadow-sm"
                    >
                      <option value="from_file">Use Branch from file</option>
                      {importBranches
                        .filter(b => importRegion === "from_file" || String(b.region_id) === importRegion)
                        .map(b => (
                          <option key={b.id} value={b.id}>
                            🏢 {b.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    File Data Preview ({Math.min(50, importRows.length)} of {importRows.length} rows &bull; {importColumns.length} columns)
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
                          {importColumns.map((col) => (
                            <th key={col} className="px-4 py-3 whitespace-nowrap border-r border-gray-200 last:border-r-0">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                        {importRows.slice(0, 50).map((row, idx) => {
                          const rawRegionInRow = getImportValue(row, ["Region", "Region (Select from list)", "Branch"]);
                          const effectiveRegionId = importRegion === "from_file" 
                            ? resolveRegionId(rawRegionInRow, regions) 
                            : (Number(importRegion) || 1);

                          const regionObj = (regions || DEFAULT_REGIONS).find(r => r.id === effectiveRegionId);
                          return (
                            <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                              <td className="px-4 py-2.5 text-gray-400 font-mono whitespace-nowrap sticky left-0 bg-white shadow-[1px_0_0_0_#f3f4f6] z-1 border-r border-gray-100">
                                #{row.rowNumber}
                              </td>
                              <td className="px-4 py-2.5 font-bold text-[#ED1C24] whitespace-nowrap bg-red-50/20 border-r border-gray-100">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold">
                                  {regionObj ? regionObj.name : `Region ${effectiveRegionId}`}
                                </span>
                              </td>
                              {importColumns.map((col) => {
                                const val = cellValueToText(row.data[col]);
                                return (
                                  <td key={col} className="px-4 py-2.5 text-gray-700 whitespace-nowrap border-r border-gray-100 last:border-r-0">
                                    {val || <span className="text-gray-300">—</span>}
                                  </td>
                                );
                              })}
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
                onClick={() => setShowImportPromptModal(false)}
                className="rounded-xl h-10 px-5 font-black text-xs border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowImportPromptModal(false);
                  submitImportedVolunteers();
                }}
                disabled={submittingImport || importRows.length === 0}
                className="rounded-xl h-10 px-6 font-black text-xs bg-[#ED1C24] hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
              >
                {submittingImport ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  `Confirm & Upload ${importRows.length} Volunteers`
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Print-only Report Header */}

      <div className="hidden print:block mb-8">
          <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black">Volunteer Registry Report</h1>
                <p className="text-gray-500 font-bold text-lg">Ethiopian Red Cross Society</p>
                <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Region Scope:</span> {(regions || DEFAULT_REGIONS).find(r => String(r.id) === regionFilter)?.name || "All National Branches"}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Status Filter:</span> {statusFilter || "All Volunteers"}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Generated On:</span> {new Date().toLocaleString()}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Record Count:</span> {filteredVolunteers.length}</div>
                </div>
              </div>
              <div className="bg-[#ED1C24] text-white p-6 font-black text-3xl">ERCS</div>
          </div>
          <div className="mt-8 border-t-2 border-dashed border-gray-100 pt-4 text-[10px] font-black uppercase tracking-widest text-gray-300">
              Confidential Administrative Record • ERCS Humanitarian Management System
          </div>
      </div>
    </div>
  );
}
