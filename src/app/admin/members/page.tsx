"use client";

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
import { Search, Users, Plus, Filter, Download, FileText, Table as TableIcon, X, Upload, ArrowUpRight, CreditCard, Phone, Mail, MapPin } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

type Member = {
  id: string;
  first_name: string;
  father_name: string;
  grandfather_name?: string;
  email?: string;
  phone_number?: string;
  national_id?: string;
  gender?: string;
  region: any;
  status: string;
  ercs_id: string;
  membership_type?: string;
  metadata?: string;
  zone_id?: string;
  woreda_id?: string;
};

type Region = {
    id: number;
    name: string;
    code: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
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
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    setIsMounted(true);
    fetchRegions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchMembers();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [search, page, regionFilter, statusFilter, typeFilter, zoneFilter, woredaFilter, mainCategory]);

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

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const url = `/person?page=${page}&page_size=${pageSize}&search=${search}&region=${regionFilter}&status=${statusFilter}&type=${typeFilter}&zone=${zoneFilter}&woreda=${woredaFilter}&category=${mainCategory}`;
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

  const exportToCSV = () => {
    if (members.length === 0) {
        toast.error("No data to export");
        return;
    }

    const headers = ["ERCS ID", "First Name", "Father Name", "Region", "Type", "Status"];
    const rows = members.map(m => [
        m.ercs_id,
        m.first_name,
        m.father_name,
        regions.find(r => String(r.id) === String(m.region))?.name || String(m.region),
        m.membership_type || "N/A",
        m.status || "Active"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ercs_members_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    toast.success("CSV Report Generated");
  };
  
  const downloadTemplate = async () => {
    try {
        const ExcelJS = (await import("exceljs")).default;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Member Import");

        // Add headers
        const headers = [
            "First Name", 
            "Father Name", 
            "Grandfather Name", 
            "Email", 
            "Phone Number", 
            "National ID", 
            "Date of Birth (YYYY-MM-DD)", 
            "Gender", 
            "Region (Select from list)", 
            "Membership Type"
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

        // Add a helper sheet for data validation source
        const helperSheet = workbook.addWorksheet("HelperLists");
        // Hide helper sheet using state instead of option to ensure compatibility
        helperSheet.state = 'hidden';
        
        // Regions: Format as "ID - Name" so parseInt works automatically on import
        const regionOptions = regions.map(r => `${r.id} - ${r.name}`);
        if (regionOptions.length === 0) {
            // Fallback if regions not loaded
            [
                "1 - Addis Ababa", "2 - Dire Dawa", "3 - Tigray", "4 - Afar", 
                "5 - Amhara", "6 - Oromia", "7 - Somali", "8 - Benishangul-Gumuz", 
                "9 - SNNPR", "10 - Gambela", "11 - Harari", "12 - Sidama", 
                "13 - South West", "14 - Federal HQ"
            ].forEach((opt, i) => helperSheet.getCell(`A${i+1}`).value = opt);
        } else {
            regionOptions.forEach((opt, i) => helperSheet.getCell(`A${i+1}`).value = opt);
        }

        const membershipOptions = [
            "REGULAR", "INDIVIDUAL_LIFETIME", "FAMILY_LIFETIME", 
            "CORP_REGULAR", "CORP_HIGH", "CORP_SPECIAL", "YOUTH"
        ];
        membershipOptions.forEach((opt, i) => helperSheet.getCell(`B${i+1}`).value = opt);

        const genderOptions = ["MALE", "FEMALE"];
        genderOptions.forEach((opt, i) => helperSheet.getCell(`C${i+1}`).value = opt);

        // Apply column widths and formats
        worksheet.columns = [
            { width: 20 }, { width: 20 }, { width: 20 }, { width: 25 }, 
            { width: 20 }, { width: 15 }, { width: 25 }, { width: 12 }, 
            { width: 30 }, { width: 25 }
        ];

        // Ensure Date of Birth column (G) is treated as text to avoid Excel date auto-formatting issues
        worksheet.getColumn(7).numFmt = '@'; 

        // Apply Data Validation
        const rowCount = 500; // Apply to first 500 rows
        const regionCount = Math.max(regionOptions.length, 14);
        const membershipCount = membershipOptions.length;
        const genderCount = genderOptions.length;

        for (let i = 2; i <= rowCount; i++) {
            // Gender (Column H)
            worksheet.getCell(`H${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: [`'HelperLists'!$C$1:$C$${genderCount}`],
                showErrorMessage: true,
                errorTitle: 'Invalid Selection',
                error: 'Please select from the list.'
            };
            // Region (Column I)
            worksheet.getCell(`I${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: [`'HelperLists'!$A$1:$A$${regionCount}`],
                showErrorMessage: true,
                errorTitle: 'Invalid Selection',
                error: 'Please select from the list.'
            };
            // Membership Type (Column J)
            worksheet.getCell(`J${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: [`'HelperLists'!$B$1:$B$${membershipCount}`],
                showErrorMessage: true,
                errorTitle: 'Invalid Selection',
                error: 'Please select from the list.'
            };
        }

        // Add example row
        worksheet.addRow([
            "John", "Doe", "Smith", "john.doe@example.com", "251912345678", 
            "ID123456", "1990-01-01", "MALE", "1 - Addis Ababa", "REGULAR"
        ]);

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ercs_member_import_template.xlsx";
        link.click();
        
        toast.success("Excel Import Template Downloaded");
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
                    worksheet?.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return;
                        const firstName = row.getCell(1).text;
                        if (!firstName || firstName.trim() === "") return;

                        people.push({
                            first_name: firstName,
                            father_name: row.getCell(2).text,
                            grandfather_name: row.getCell(3).text,
                            email: row.getCell(4).text,
                            phone_number: String(row.getCell(5).text || ""),
                            national_id: String(row.getCell(6).text || ""),
                            date_of_birth: normalizeDate(row.getCell(7).value),
                            gender: row.getCell(8).text,
                            region: parseInt(row.getCell(9).text) || 1,
                            membership_type: row.getCell(10).text,
                            metadata: "{}" // Important: Prevents JSONB DB error
                        });
                    });

                    if (people.length === 0) {
                        toast.dismiss();
                        toast.error("No valid data found.");
                        return;
                    }

                    const res = await api.post("/person/bulk", people);
                    toast.dismiss();
                    const successCount = res.data.filter((r: any) => r.success).length;
                    const failCount = res.data.length - successCount;
                    if (failCount === 0) toast.success(`Imported all ${successCount} members.`);
                    else toast.warning(`Imported ${successCount}. ${failCount} failed.`);
                    fetchMembers();
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
                        region: parseInt(reg) || 1,
                        membership_type: typ,
                        metadata: "{}"
                    };
                });
                const res = await api.post("/person/bulk", people);
                toast.dismiss();
                const successCount = res.data.filter((r: any) => r.success).length;
                if (successCount === res.data.length) toast.success(`Imported all ${successCount} members.`);
                else toast.warning(`Partial success: ${successCount}/${res.data.length}`);
                fetchMembers();
            } catch (err) {
                toast.dismiss();
                toast.error("Bulk import failed.");
            }
        };
        reader.readAsText(file);
    }
    e.target.value = "";
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
                onClick={exportToCSV}
                variant="outline" 
                className="rounded-xl h-10 px-4 font-black border-gray-200 flex items-center gap-2 shadow-sm text-[10px] uppercase tracking-widest"
            >
                <TableIcon className="h-4 w-4" /> CSV
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
            <Button className="rounded-xl h-10 px-6 font-black shadow-xl shadow-red-500/10 flex items-center gap-2 bg-[#ED1C24] text-white text-[10px] uppercase tracking-widest">
                <Plus className="h-4 w-4" /> Add Member
            </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 print:hidden">
        <div className="flex w-full items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#ED1C24]" />
                <Input
                placeholder="Search Identity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 bg-white text-black border border-gray-200 rounded-xl font-black text-xs focus:ring-4 focus:ring-[#ED1C24]/10 transition-all shadow-sm"
                />
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

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.03)] overflow-hidden print:shadow-none print:border-none print:rounded-none">
        <Table>
          <TableHeader className="bg-gray-50/50 print:bg-transparent">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">ID</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Full Identity</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Region</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Category</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Status</TableHead>
              <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/40 text-right print:hidden">Audit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                     <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                     <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Syncing Registry...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                   <p className="text-sm font-bold text-gray-400">No members found matching your search.</p>
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id} className="hover:bg-[#ED1C24]/5 transition-colors border-gray-50">
                  <TableCell className="px-6 py-4 font-black text-black text-[11px]">{member.ercs_id}</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-xs">{member.first_name} {member.father_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-black text-[9px] uppercase tracking-wider text-gray-400">
                    {regions.find(r => String(r.id) === String(member.region))?.name || String(member.region)}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-[11px] text-gray-500">
                    {(member as any).membership_type || (member as any).membershipType || "REGULAR"}
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                        member.status === "ACTIVE" || !member.status
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : member.status === "INACTIVE"
                          ? "bg-gray-100 text-gray-500 border border-gray-200"
                          : member.status === "EXPIRED"
                          ? "bg-red-50 text-[#ED1C24] border border-red-200"
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      )}
                    >
                      {member.status || "ACTIVE"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right print:hidden">
                    <button 
                        onClick={() => { setSelectedMember(member); setShowModal(true); }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                        <ArrowUpRight className="h-4 w-4 ml-auto text-gray-300 group-hover:text-[#ED1C24] transition-colors" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Member Detail Modal */}
        {showModal && selectedMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100"
                >
                    <div className="p-8 border-b border-gray-50 flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[#ED1C24] uppercase tracking-widest">Member Audit Log</p>
                            <h2 className="text-2xl font-black tracking-tight text-black">
                                {selectedMember.first_name} {selectedMember.father_name} {selectedMember.grandfather_name}
                            </h2>
                            <p className="text-xs font-bold text-gray-400">{selectedMember.ercs_id}</p>
                        </div>
                        <button 
                            onClick={() => setShowModal(false)}
                            className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="p-8 grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Identity Details</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Users className="h-4 w-4 text-gray-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Gender</p>
                                            <p className="text-xs font-bold text-black">{selectedMember.gender || "Not Specified"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><FileText className="h-4 w-4 text-gray-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">National ID</p>
                                            <p className="text-xs font-bold text-black">{selectedMember.national_id || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><CreditCard className="h-4 w-4 text-gray-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Category</p>
                                            <p className="text-xs font-bold text-[#ED1C24]">
                                                {(selectedMember as any).membership_type || (selectedMember as any).membershipType || "REGULAR"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Contact & Location</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Phone className="h-4 w-4 text-gray-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Phone</p>
                                            <p className="text-xs font-bold text-black">{selectedMember.phone_number || "No Phone"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><Mail className="h-4 w-4 text-gray-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Email</p>
                                            <p className="text-xs font-bold text-black">{selectedMember.email || "No Email"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><MapPin className="h-4 w-4 text-gray-400" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Location Hierarchy</p>
                                            <p className="text-xs font-bold text-black">
                                                {regions.find(r => String(r.id) === String(selectedMember.region))?.name || "Unknown Region"}
                                                {((selectedMember as any).zone_id || (selectedMember as any).zoneId) && ` • ${(selectedMember as any).zone_id || (selectedMember as any).zoneId}`}
                                                {((selectedMember as any).woreda_id || (selectedMember as any).woredaId) && ` • ${(selectedMember as any).woreda_id || (selectedMember as any).woredaId}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">System Metadata</h4>
                            <pre className="text-[10px] font-mono text-gray-500 overflow-auto max-h-48">
                                {JSON.stringify(selectedMember, null, 2)}
                            </pre>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <Button className="flex-1 bg-black text-white rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest">
                                Print Audit Record
                            </Button>
                            <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest border-gray-200">
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}

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

      {/* Print-only Report Header */}
      <div className="hidden print:block mb-8">
          <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black">Member Registry Report</h1>
                <p className="text-gray-500 font-bold">Ethiopian Red Cross Society</p>
                <div className="mt-4 grid grid-cols-2 gap-x-12 gap-y-2 text-xs">
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Region:</span> {regions.find(r => String(r.id) === regionFilter)?.name || "All"}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Status:</span> {statusFilter || "All"}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Generated:</span> {isMounted ? new Date().toLocaleString() : ""}</div>
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Total Count:</span> {totalItems}</div>
                </div>
              </div>
              <div className="bg-ercs-red text-white p-4 font-black text-2xl">ERCS</div>
          </div>
      </div>
    </div>
  );
}

// Utility class for badge colors
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
