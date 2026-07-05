"use client";

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
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Cell, CellValue } from "exceljs";

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
  const [importRegion, setImportRegion] = useState("1");
  const [parsingImport, setParsingImport] = useState(false);
  const [submittingImport, setSubmittingImport] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // New Upgrade States
  const [occupationFilter, setOccupationFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState("");
  const [clearingRegistry, setClearingRegistry] = useState(false);

  useEffect(() => {
    fetchRegions();
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
        fetchVolunteers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, regionFilter, statusFilter]);

  const fetchRegions = async () => {
    try {
        const res = await api.get("/system-settings");
        if (res.data.settings && res.data.settings.all_regions) {
            setRegions(JSON.parse(res.data.settings.all_regions));
        }
    } catch (err) {
        console.error("Failed to fetch regions:", err);
    }
  };

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const url = `/volunteers?search=${search}&region=${regionFilter}&status=${statusFilter}`;
      const res = await api.get(url);
      setVolunteers(res.data.volunteers || []);
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
      const worksheet = workbook.addWorksheet("Volunteers Template");

      // Set up headers
      const headers = [
        "Mobile", "Name", "Father Name", "Last Name", "Gender", 
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

      // Add sample rows (2-100) with data validation
      const totalRows = 100;
      for (let i = 2; i <= totalRows; i++) {
        // Gender column (E)
        worksheet.getCell(`E${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ['"Male,Female"']
        };

        // Occupation column (H)
        worksheet.getCell(`H${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ['"Farmer,Business Person,Civil Servant,House Wife,Military,NGO,Self Employed,Student,Police,Diplomat,Others"']
        };

        // Organization Type column (J)
        worksheet.getCell(`J${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ['"Government,Ngo,Private,Association"']
        };

        // Education Level column (K)
        worksheet.getCell(`K${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ['"Below Primary School,Primary School Completed,High School Completed,Degree,Masters,PHD"']
        };

        // Area column (L)
        worksheet.getCell(`L${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ['"URBAN,RURAL"']
        };

        // Classifications: General (P), Youth (Q), Professional (R), Leadership (S)
        const classCols = ["P", "Q", "R", "S"];
        classCols.forEach((col) => {
          worksheet.getCell(`${col}${i}`).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: ['"YES,NO"']
          };
        });
      }

      // Add dummy data for first row as help
      worksheet.addRow([
        "+251911223344", "Sara", "Belay", "Tadesse", "Female", 
        "12/04/1995", "05/07/2026", "NGO", "ERCS", "Ngo", 
        "Degree", "URBAN", "Amharic, English", "Kebele 03, House 405", "sara@example.com", 
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
      link.download = "volunteer_registration_template.xlsx";
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
      setImportFileName(file.name);
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
      date_of_birth: dateOfBirth || null,
      occupation: occupation || null,
      kebele: kebele || null,
      educationLevel: educationLevel || null,
      organizationName: orgName || null,
      organizationType: orgType || null,
      area: area || null,
      languages: languages || null,
    };

    return {
      first_name: firstName,
      father_name: fatherName,
      grandfather_name: grandfatherName,
      phone_number: phoneNumber,
      email,
      password: `ERCS@${phoneNumber.slice(-4) || String(index + 1).padStart(4, "0")}`,
      region: Number(importRegion) || 1,
      role: 5,
      gender,
      date_of_birth: dateOfBirth,
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

    for (const [index, row] of importRows.entries()) {
      const payload = buildVolunteerPayload(row, index);
      if (!payload.first_name && !payload.phone_number) {
        const issue = "Missing name and phone";
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
  const getOrgName = (v: Volunteer) => v.interests?.find(i => i.startsWith("OrgName:"))?.replace("OrgName:", "") || "N/A";
  const getOrgType = (v: Volunteer) => v.interests?.find(i => i.startsWith("OrgType:"))?.replace("OrgType:", "") || "N/A";

  const filteredVolunteers = volunteers.filter(v => {
    if (occupationFilter && v.profession !== occupationFilter) return false;
    if (areaFilter && getArea(v).toUpperCase() !== areaFilter.toUpperCase()) return false;
    if (classificationFilter && !v.engagement_areas?.includes(classificationFilter)) return false;
    return true;
  });

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

        <div className="flex items-center gap-3">
            <Button 
                onClick={downloadTemplate}
                variant="outline" 
                className="rounded-xl h-10 px-6 font-black border-gray-200 flex items-center gap-2"
            >
                <Upload className="h-4 w-4 rotate-180" /> Download Template
            </Button>
            <Button 
                onClick={() => setShowClearConfirm(true)}
                variant="destructive" 
                className="rounded-xl h-10 px-6 font-black bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
                <X className="h-4 w-4" /> Clear Registry
            </Button>
            <Button 
                onClick={exportToCSV}
                variant="outline" 
                className="rounded-xl h-10 px-6 font-black border-gray-200"
            >
                <TableIcon className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button 
                onClick={exportToPDF}
                variant="outline" 
                className="rounded-xl h-10 px-6 font-black border-gray-200"
            >
                <FileText className="h-4 w-4 mr-2" /> Export PDF
            </Button>
            <Link href="/admin/user-management?create=true">
              <Button className="rounded-xl h-10 px-6 font-black shadow-lg shadow-red-500/10 flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Volunteer
              </Button>
            </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 print:hidden">
        <div className="flex w-full items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                placeholder="Search volunteers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 bg-white border border-gray-200 shadow-sm text-black rounded-xl font-bold text-sm"
                />
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

                <div className="flex items-end pb-0.5 md:col-span-3 justify-end">
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
                        className="h-10 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest text-gray-400"
                    >
                        <X className="h-3 w-3 mr-2" /> Reset Filters
                    </Button>
                </div>
            </div>
        )}
      </div>

      <div className="print:hidden rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Excel Import</p>
                <h2 className="text-lg font-black text-black tracking-tight">Import Volunteers</h2>
                <p className="text-xs font-bold text-gray-400 mt-1">
                    Successful rows are removed after upload; defective rows stay red with the issue attached.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <select
                    value={importRegion}
                    onChange={(e) => setImportRegion(e.target.value)}
                    className="h-10 min-w-[180px] rounded-xl border border-gray-200 bg-white px-3 text-xs font-black outline-none"
                >
                    {(regions.length > 0 ? regions : [{ id: 1, name: "Addis Ababa", code: "AA" }]).map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                </select>
                <label className="h-10 px-5 rounded-xl border border-gray-200 bg-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                    {parsingImport ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Choose Excel
                    <input
                        type="file"
                        accept=".xlsx"
                        className="hidden"
                        disabled={parsingImport || submittingImport}
                        onChange={(e) => handleImportFile(e.target.files?.[0])}
                    />
                </label>
                <Button
                    onClick={submitImportedVolunteers}
                    disabled={importRows.length === 0 || parsingImport || submittingImport}
                    className="h-10 px-5 rounded-xl font-black text-xs"
                >
                    {submittingImport ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload {importRows.length > 0 ? importRows.length : ""}
                </Button>
            </div>
        </div>

        {(importRows.length > 0 || importResult) && (
            <div className="p-5 space-y-4">
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
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="sticky left-0 bg-gray-50 px-3 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Row</th>
                                    {importColumns.map(column => (
                                        <th key={column} className="px-3 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">
                                            {column}
                                        </th>
                                    ))}
                                    <th className="px-3 py-3 text-[9px] font-black uppercase tracking-widest text-red-600 whitespace-nowrap">Issue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {importRows.slice(0, 8).map(row => (
                                    <tr key={row.rowNumber} className={cn("border-t border-gray-50", row.importIssue && "bg-red-50")}>
                                        <td className={cn("sticky left-0 px-3 py-2 text-[10px] font-black", row.importIssue ? "bg-red-50 text-red-500" : "bg-white text-gray-400")}>{row.rowNumber}</td>
                                        {importColumns.map(column => (
                                            <td key={`${row.rowNumber}-${column}`} className={cn("px-3 py-2 text-xs font-bold whitespace-nowrap", row.importIssue ? "text-red-700" : "text-gray-600")}>
                                                {row.data[column] === null ? <span className="text-gray-300 italic">null</span> : String(row.data[column])}
                                            </td>
                                        ))}
                                        <td className="px-3 py-2 text-xs font-black text-red-600 whitespace-nowrap">
                                            {row.importIssue || "---"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {importRows.length > 8 && (
                            <div className="px-3 py-2 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Showing first 8 rows for preview
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}
      </div>

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
                                            {selectedVolunteer.zone_id || "---"} • {selectedVolunteer.woreda_id || "---"}
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
                                    {(!selectedVolunteer.engagement_areas || selectedVolunteer.engagement_areas.length === 0) && <p className="text-xs text-gray-400 font-bold italic">No areas selected</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Education Level</p>
                                    <p className="text-xs font-bold text-black">{getEducation(selectedVolunteer)}</p>
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

      {/* Print-only Report Header */}
      <div className="hidden print:block mb-8">
          <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black">Volunteer Registry Report</h1>
                <p className="text-gray-500 font-bold text-lg">Ethiopian Red Cross Society</p>
                <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Region Scope:</span> {regions.find(r => String(r.id) === regionFilter)?.name || "All National Branches"}</div>
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
