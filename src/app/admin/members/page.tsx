"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users, Plus, Filter, Download, FileText, Table as TableIcon, X, Upload } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

type Member = {
  id: string;
  first_name: string;
  father_name: string;
  region_id: string;
  status: string;
  ercs_id: string;
  membership_type?: string;
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
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10;

  useEffect(() => {
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
        regions.find(r => String(r.id) === String(m.region_id))?.name || m.region_id,
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

        // Apply column widths
        worksheet.columns = [
            { width: 20 }, { width: 20 }, { width: 20 }, { width: 25 }, 
            { width: 20 }, { width: 15 }, { width: 25 }, { width: 12 }, 
            { width: 30 }, { width: 25 }
        ];

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

    if (file.name.endsWith('.xlsx')) {
        toast.loading("Parsing Excel and importing members...");
        try {
            const ExcelJS = (await import("exceljs")).default;
            const reader = new FileReader();
            reader.onload = async (event) => {
                const buffer = event.target?.result as ArrayBuffer;
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(buffer);
                const worksheet = workbook.getWorksheet(1);
                
                const people: any[] = [];
                worksheet?.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return; // Skip headers
                    
                    const firstName = row.getCell(1).text;
                    const fatherName = row.getCell(2).text;
                    const grandfatherName = row.getCell(3).text;
                    const email = row.getCell(4).text;
                    const phoneNumber = row.getCell(5).text;
                    const nationalId = row.getCell(6).text;
                    const dob = row.getCell(7).text;
                    const gender = row.getCell(8).text;
                    const regionRaw = row.getCell(9).text;
                    const type = row.getCell(10).text;

                    if (!firstName || firstName.trim() === "") return;

                    people.push({
                        first_name: firstName,
                        father_name: fatherName,
                        grandfather_name: grandfatherName,
                        email: email,
                        phone_number: String(phoneNumber || ""),
                        national_id: String(nationalId || ""),
                        date_of_birth: dob,
                        gender: gender,
                        region: parseInt(regionRaw) || 1,
                        membership_type: type
                    });
                });

                if (people.length === 0) {
                    toast.dismiss();
                    toast.error("No valid member data found in Excel.");
                    return;
                }

                try {
                    const res = await api.post("/person/bulk", people);
                    toast.dismiss();
                    const successCount = res.data.filter((r: any) => r.success).length;
                    const failCount = res.data.length - successCount;
                    
                    if (failCount === 0) {
                        toast.success(`Successfully imported all ${successCount} members!`);
                    } else {
                        toast.warning(`Imported ${successCount} members. ${failCount} rows failed.`);
                    }
                    fetchMembers();
                } catch (err) {
                    toast.dismiss();
                    toast.error("Failed to process bulk import. Check network connection.");
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to load Excel parser.");
        }
    } else {
        // Legacy CSV support
        toast.loading("Parsing CSV and importing members...");
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const rows = text.split("\n").slice(1).filter(r => r.trim());
            
            const people = rows.map(row => {
                const [firstName, fatherName, grandfatherName, email, phoneNumber, nationalId, dob, gender, region, type] = row.split(",").map(c => c.trim());
                return {
                    first_name: firstName,
                    father_name: fatherName,
                    grandfather_name: grandfatherName,
                    email: email,
                    phone_number: phoneNumber,
                    national_id: nationalId,
                    date_of_birth: dob,
                    gender: gender,
                    region: parseInt(region) || 1,
                    membership_type: type
                };
            });

            try {
                const res = await api.post("/person/bulk", people);
                toast.dismiss();
                const successCount = res.data.filter((r: any) => r.success).length;
                const failCount = res.data.length - successCount;
                
                if (failCount === 0) {
                    toast.success(`Successfully imported all ${successCount} members!`);
                } else {
                    toast.warning(`Imported ${successCount} members. ${failCount} rows failed.`);
                }
                fetchMembers();
            } catch (err) {
                toast.dismiss();
                toast.error("Failed to process bulk import. Check your connection.");
            }
        };
        reader.readAsText(file);
    }
    // Reset input
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
    <div className="space-y-10 print:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-[#ED1C24] rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Users className="h-3.5 w-3.5" /> Registry
          </div>
          <h1 className="text-5xl font-black text-black tracking-tighter text-balance">Member Directory</h1>
          <p className="text-gray-500 font-medium text-lg">Manage all registered members, hierarchy, and status across all regions.</p>
        </div>

        <div className="flex items-center gap-3">
            <Button 
                onClick={downloadTemplate}
                variant="outline" 
                className="rounded-2xl h-14 px-6 font-black border-gray-200 flex items-center gap-2 shadow-sm"
            >
                <Download className="h-5 w-5" /> Template
            </Button>
            <Button 
                onClick={exportToCSV}
                variant="outline" 
                className="rounded-2xl h-14 px-6 font-black border-gray-200 flex items-center gap-2 shadow-sm"
            >
                <TableIcon className="h-5 w-5" /> Export CSV
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
                    className="rounded-2xl h-14 px-6 font-black border-gray-200 flex items-center gap-2 shadow-sm"
                >
                    <Upload className="h-5 w-5" /> Import
                </Button>
            </div>
            <Button 
                onClick={exportToPDF}
                variant="outline" 
                className="rounded-2xl h-14 px-6 font-black border-gray-200 flex items-center gap-2 shadow-sm"
            >
                <FileText className="h-5 w-5" /> Export PDF
            </Button>
            <Button className="rounded-2xl h-14 px-8 font-black shadow-xl shadow-red-500/10 flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add New Member
            </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 print:hidden">
        <div className="flex w-full items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                placeholder="Search by name, ERCS ID, or Phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 pl-12 bg-black text-white border-none rounded-2xl font-bold text-lg focus:ring-2 focus:ring-[#ED1C24]/10 transition-all shadow-xl"
                />
            </div>

            <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "default" : "outline"}
                className={`h-14 px-8 rounded-2xl font-black transition-all flex items-center gap-2 ${showFilters ? 'bg-black text-white' : 'border-gray-200'}`}
            >
                <Filter className="h-5 w-5" /> 
                {showFilters ? 'Hide Filters' : 'Advanced Filters'}
            </Button>
        </div>

        {showFilters && (
            <div className="space-y-6 p-8 bg-gray-50 rounded-[32px] border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                {/* Master Category Row */}
                <div className="grid md:grid-cols-4 gap-6 pb-6 border-b border-gray-100">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-2">Category Group</label>
                        <select 
                            value={mainCategory}
                            onChange={(e) => { setMainCategory(e.target.value); setTypeFilter(""); }}
                            className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 font-bold text-sm focus:ring-2 focus:ring-[#ED1C24]/10 outline-none"
                        >
                            <option value="">All Categories</option>
                            <option value="INDIVIDUAL">Individual Member</option>
                            <option value="CORPORATE">Corporate Member</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Sub-Category / Type</label>
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            disabled={!mainCategory}
                            className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 font-bold text-sm focus:ring-2 focus:ring-[#ED1C24]/10 outline-none disabled:opacity-50"
                        >
                            <option value="">Choose Sub...</option>
                            {mainCategory === 'INDIVIDUAL' && (
                                <>
                                    <option value="ANNUAL">Annual Member</option>
                                    <option value="LIFE">Lifetime Supporter</option>
                                    <option value="YOUTH">Youth Member</option>
                                </>
                            )}
                            {mainCategory === 'CORPORATE' && (
                                <>
                                    <option value="SILVER">Silver Partner</option>
                                    <option value="GOLD">Gold Partner</option>
                                    <option value="PLATINUM">Platinum Partner</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Membership Status</label>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 font-bold text-sm focus:ring-2 focus:ring-[#ED1C24]/10 outline-none"
                        >
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="EXPIRED">Expired</option>
                            <option value="PENDING">Pending Approval</option>
                        </select>
                    </div>
                </div>

                {/* Regional Hierarchy Row */}
                <div className="grid md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Region</label>
                        <select 
                            value={regionFilter}
                            onChange={(e) => { setRegionFilter(e.target.value); setZoneFilter(""); setWoredaFilter(""); }}
                            className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 font-bold text-sm focus:ring-2 focus:ring-[#ED1C24]/10 outline-none"
                        >
                            <option value="">All Regions</option>
                            {regions.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Zone / Sub-City</label>
                        <select 
                            value={zoneFilter}
                            onChange={(e) => { setZoneFilter(e.target.value); setWoredaFilter(""); }}
                            disabled={!regionFilter}
                            className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 font-bold text-sm focus:ring-2 focus:ring-[#ED1C24]/10 outline-none disabled:opacity-50"
                        >
                            <option value="">Select Zone...</option>
                            {regionFilter === "1" && ( /* Addis Ababa Mock */
                                <>
                                    <option value="addis-ketema">Addis Ketema</option>
                                    <option value="arada">Arada</option>
                                    <option value="bole">Bole</option>
                                    <option value="kirkos">Kirkos</option>
                                </>
                            )}
                            {regionFilter && regionFilter !== "1" && (
                                <option value="default-zone">Zone 01</option>
                            )}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Woreda / Kebele</label>
                        <select 
                            value={woredaFilter}
                            onChange={(e) => setWoredaFilter(e.target.value)}
                            disabled={!zoneFilter}
                            className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 font-bold text-sm focus:ring-2 focus:ring-[#ED1C24]/10 outline-none disabled:opacity-50"
                        >
                            <option value="">Select Woreda...</option>
                            {zoneFilter === "arada" && (
                                <>
                                    <option value="woreda-01">Woreda 01</option>
                                    <option value="woreda-02">Woreda 02</option>
                                    <option value="woreda-03">Woreda 03</option>
                                </>
                            )}
                            {zoneFilter && zoneFilter !== "arada" && (
                                <option value="default-woreda">Woreda 01</option>
                            )}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 pb-0.5">
                        <Button 
                            onClick={resetFilters}
                            variant="ghost" 
                            className="h-12 flex-1 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#ED1C24] hover:bg-white border border-transparent hover:border-red-100"
                        >
                            <X className="h-4 w-4 mr-2" /> Reset All
                        </Button>
                    </div>
                </div>
            </div>
        )}
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden print:shadow-none print:border-none print:rounded-none">
        <Table>
          <TableHeader className="bg-gray-50/50 print:bg-transparent">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">ERCS ID</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Full Name</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Region</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Category</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black">Status</TableHead>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black text-right print:hidden">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                     <div className="h-10 w-10 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                     <p className="text-xs font-black uppercase tracking-widest text-gray-400">Syncing Registry...</p>
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
                <TableRow key={member.id} className="hover:bg-gray-50/50 transition-colors border-gray-50">
                  <TableCell className="px-8 py-6 font-black text-black text-xs">{member.ercs_id}</TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{member.first_name} {member.father_name}</span>
                        <span className="text-[10px] text-gray-400 font-medium tracking-tight">Reg ID: {member.id.split('-')[0]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 font-black text-[10px] uppercase tracking-wider text-gray-400">
                    {regions.find(r => String(r.id) === String(member.region_id))?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="px-8 py-6 font-bold text-xs text-gray-500">{member.membership_type || "N/A"}</TableCell>

                  <TableCell className="px-8 py-6">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                        member.status === "ACTIVE" || !member.status
                          ? "bg-[#ECFDF5] text-[#065F46] border border-[#10B981]/10"
                          : member.status === "INACTIVE"
                          ? "bg-gray-100 text-gray-500 border border-gray-200"
                          : member.status === "EXPIRED"
                          ? "bg-[#FEF2F2] text-[#ED1C24] border border-[#ED1C24]/10"
                          : "bg-[#FFFBEB] text-[#92400E] border border-[#F59E0B]/10"
                      )}
                    >
                      {member.status || "ACTIVE"}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right print:hidden">
                    <Button variant="ghost" className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-gray-50 underline-offset-4 shadow-sm border border-gray-100">
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between print:hidden">
           <p className="text-xs font-bold text-gray-400">
             Showing <span className="text-black font-black">{Math.max(0, (page-1)*pageSize + 1)}</span> to <span className="text-black font-black">{Math.min(page*pageSize, totalItems)}</span> of <span className="text-black font-black">{totalItems}</span> members
           </p>

           <div className="flex items-center gap-2">
             <Button 
               disabled={page === 1 || loading}
               onClick={() => setPage(page - 1)}
               variant="outline" 
               className="h-10 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest disabled:opacity-30 border-gray-200"
             >
               Previous
             </Button>
             <div className="flex items-center justify-center h-10 w-10 bg-white border border-gray-200 rounded-xl text-xs font-black text-black shadow-sm">
                {page}
             </div>
             <Button 
               disabled={page >= totalPages || loading}
               onClick={() => setPage(page + 1)}
               variant="outline" 
               className="h-10 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest disabled:opacity-30 border-gray-200"
             >
               Next
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
                    <div><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Generated:</span> {new Date().toLocaleString()}</div>
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
