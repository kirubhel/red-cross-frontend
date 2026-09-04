import ExcelJS from "exceljs";

const ERCS_RED = "FFED1C24";
const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: ERCS_RED }
};
const SUBHEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF3F4F6" }
};

export interface FinancialRecord {
  id: string;
  person_id?: string;
  amount: number;
  currency?: string;
  status: string;
  description?: string;
  created_at: string;
  email?: string;
  payment_method?: string;
}

export interface MemberRecord {
  ercs_id?: string;
  first_name: string;
  father_name?: string;
  grandfather_name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  region?: string | number;
  membership_type?: string;
  status?: string;
  created_at?: string;
}

export interface VolunteerRecord {
  id: string;
  first_name: string;
  father_name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  region?: string | number;
  role?: string;
  status?: string;
  hoursSpent?: number;
  created_at?: string;
}

const REGIONS: Record<string, string> = {
  "1": "Addis Ababa", "2": "Dire Dawa", "3": "Tigray", "4": "Afar",
  "5": "Amhara", "6": "Oromia", "7": "Somali", "8": "Benishangul Gumz",
  "9": "Central Ethiopia", "10": "Gambela", "11": "Harari", "12": "Sidama",
  "13": "South West Ethiopia", "14": "South Ethiopia"
};

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// -------------------------------------------------------------
// 1. FINANCIAL REPORT EXPORT
// -------------------------------------------------------------
export async function exportFinancialReport(
  invoices: FinancialRecord[],
  format: "xlsx" | "csv" = "xlsx"
) {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `ercs_financial_report_${dateStr}.${format}`;

  if (format === "csv") {
    const headers = ["Transaction ID", "Amount", "Currency", "Status", "Description", "Created Date"];
    const rows = invoices.map(inv => [
      inv.id,
      inv.amount ?? 0,
      inv.currency || "ETB",
      inv.status || "N/A",
      `"${(inv.description || "").replace(/"/g, '""')}"`,
      inv.created_at || ""
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename);
    return;
  }

  // ExcelJS formatted workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Ethiopian Red Cross Society";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Financial Overview", {
    views: [{ showGridLines: true }]
  });

  // Title Banner
  worksheet.mergeCells("A1:F1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "ETHIOPIAN RED CROSS SOCIETY — FINANCIAL REPORT";
  titleCell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 14 };
  titleCell.fill = HEADER_FILL;
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(1).height = 35;

  // Metadata Row
  worksheet.mergeCells("A2:F2");
  const metaCell = worksheet.getCell("A2");
  metaCell.value = `Generated On: ${new Date().toLocaleString()} | Total Transactions: ${invoices.length}`;
  metaCell.font = { italic: true, size: 10, color: { argb: "FF555555" } };
  metaCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(2).height = 20;

  // Financial KPI Summary
  const totalRevenue = invoices
    .filter(i => {
      const s = (i.status || "").toLowerCase();
      return s === "completed" || s === "success" || s === "paid";
    })
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const pendingAmount = invoices
    .filter(i => (i.status || "").toLowerCase() === "pending")
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  worksheet.addRow([]); // Row 3 empty
  const summaryRow = worksheet.addRow([
    "Total Completed Revenue",
    totalRevenue,
    "ETB",
    "Pending Volume",
    pendingAmount,
    "ETB"
  ]);
  summaryRow.font = { bold: true };
  summaryRow.fill = SUBHEADER_FILL;
  worksheet.addRow([]); // Row 5 empty

  // Table Headers
  const headerRow = worksheet.addRow([
    "Transaction ID",
    "Description",
    "Amount",
    "Currency",
    "Payment Status",
    "Transaction Date"
  ]);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.fill = HEADER_FILL;
  headerRow.height = 24;

  headerRow.eachCell(cell => {
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCCCCCC" } },
      left: { style: "thin", color: { argb: "FFCCCCCC" } },
      bottom: { style: "medium", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FFCCCCCC" } }
    };
  });

  // Table Data
  invoices.forEach((inv, index) => {
    const row = worksheet.addRow([
      inv.id || "N/A",
      inv.description || "Membership / Donation",
      Number(inv.amount) || 0,
      inv.currency || "ETB",
      (inv.status || "PENDING").toUpperCase(),
      inv.created_at ? new Date(inv.created_at).toLocaleDateString() : "N/A"
    ]);

    row.height = 20;
    if (index % 2 === 1) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF9FAFB" }
      };
    }
  });

  // Auto column widths
  worksheet.columns = [
    { key: "id", width: 28 },
    { key: "desc", width: 35 },
    { key: "amount", width: 16 },
    { key: "currency", width: 12 },
    { key: "status", width: 18 },
    { key: "date", width: 20 }
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  triggerDownload(blob, filename);
}

// -------------------------------------------------------------
// 2. REGISTERED MEMBERS REPORT EXPORT
// -------------------------------------------------------------
export async function exportMembersReport(
  members: MemberRecord[],
  format: "xlsx" | "csv" = "xlsx"
) {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `ercs_members_registry_${dateStr}.${format}`;

  if (format === "csv") {
    const headers = [
      "ERCS ID",
      "First Name",
      "Father Name",
      "Grandfather Name",
      "Email",
      "Phone",
      "Gender",
      "Region",
      "Membership Type",
      "Status",
      "Registration Date"
    ];
    const rows = members.map(m => [
      m.ercs_id || "N/A",
      m.first_name || "",
      m.father_name || "",
      m.grandfather_name || "",
      m.email || "",
      m.phone_number || "",
      m.gender || "",
      REGIONS[String(m.region)] || m.region || "",
      m.membership_type || "Regular",
      m.status || "Active",
      m.created_at || ""
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Registered Members", {
    views: [{ showGridLines: true }]
  });

  worksheet.mergeCells("A1:K1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "ETHIOPIAN RED CROSS SOCIETY — REGISTERED MEMBERS DIRECTORY";
  titleCell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 14 };
  titleCell.fill = HEADER_FILL;
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(1).height = 35;

  worksheet.mergeCells("A2:K2");
  const metaCell = worksheet.getCell("A2");
  metaCell.value = `Official Registry Export | Date: ${new Date().toLocaleDateString()} | Total Members: ${members.length}`;
  metaCell.font = { italic: true, size: 10, color: { argb: "FF555555" } };
  metaCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(2).height = 20;

  worksheet.addRow([]); // Row 3 empty

  const headerRow = worksheet.addRow([
    "ERCS ID",
    "First Name",
    "Father Name",
    "Grandfather Name",
    "Email Address",
    "Phone Number",
    "Gender",
    "Region",
    "Membership Type",
    "Status",
    "Joined Date"
  ]);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.fill = HEADER_FILL;
  headerRow.height = 24;

  members.forEach((m, idx) => {
    const row = worksheet.addRow([
      m.ercs_id || `ERCS-${10000 + idx}`,
      m.first_name || "",
      m.father_name || "",
      m.grandfather_name || "",
      m.email || "N/A",
      m.phone_number || "N/A",
      (m.gender || "MALE").toUpperCase(),
      REGIONS[String(m.region)] || m.region || "Addis Ababa",
      m.membership_type || "Regular",
      (m.status || "ACTIVE").toUpperCase(),
      m.created_at ? new Date(m.created_at).toLocaleDateString() : "N/A"
    ]);

    row.height = 20;
    if (idx % 2 === 1) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF9FAFB" }
      };
    }
  });

  worksheet.columns = [
    { width: 18 }, { width: 16 }, { width: 16 }, { width: 18 },
    { width: 26 }, { width: 18 }, { width: 12 }, { width: 20 },
    { width: 20 }, { width: 14 }, { width: 16 }
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  triggerDownload(blob, filename);
}

// -------------------------------------------------------------
// 3. REGISTERED VOLUNTEERS REPORT EXPORT
// -------------------------------------------------------------
export async function exportVolunteersReport(
  volunteers: VolunteerRecord[],
  format: "xlsx" | "csv" = "xlsx"
) {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `ercs_volunteers_roster_${dateStr}.${format}`;

  if (format === "csv") {
    const headers = [
      "Volunteer ID",
      "First Name",
      "Father Name",
      "Email",
      "Phone",
      "Gender",
      "Region",
      "Role",
      "Hours Spent",
      "Status",
      "Joined Date"
    ];
    const rows = volunteers.map(v => [
      v.id || "",
      v.first_name || "",
      v.father_name || "",
      v.email || "",
      v.phone_number || "",
      v.gender || "",
      REGIONS[String(v.region)] || v.region || "",
      v.role || "Volunteer",
      v.hoursSpent ?? 0,
      v.status || "Active",
      v.created_at || ""
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Volunteers Roster", {
    views: [{ showGridLines: true }]
  });

  worksheet.mergeCells("A1:J1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "ETHIOPIAN RED CROSS SOCIETY — VOLUNTEERS ROSTER";
  titleCell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 14 };
  titleCell.fill = HEADER_FILL;
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(1).height = 35;

  worksheet.mergeCells("A2:J2");
  const metaCell = worksheet.getCell("A2");
  metaCell.value = `Official Volunteer Roster | Exported: ${new Date().toLocaleString()} | Total Active: ${volunteers.length}`;
  metaCell.font = { italic: true, size: 10, color: { argb: "FF555555" } };
  metaCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(2).height = 20;

  worksheet.addRow([]);

  const headerRow = worksheet.addRow([
    "ID",
    "First Name",
    "Father Name",
    "Email Address",
    "Phone Number",
    "Gender",
    "Region",
    "Hours Contributed",
    "Status",
    "Joined Date"
  ]);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.fill = HEADER_FILL;
  headerRow.height = 24;

  volunteers.forEach((v, idx) => {
    const row = worksheet.addRow([
      v.id ? `VOL-${v.id.slice(0, 8)}` : `VOL-${20000 + idx}`,
      v.first_name || "",
      v.father_name || "",
      v.email || "N/A",
      v.phone_number || "N/A",
      (v.gender || "MALE").toUpperCase(),
      REGIONS[String(v.region)] || v.region || "Addis Ababa",
      v.hoursSpent || 0,
      (v.status || "ACTIVE").toUpperCase(),
      v.created_at ? new Date(v.created_at).toLocaleDateString() : "N/A"
    ]);

    row.height = 20;
    if (idx % 2 === 1) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF9FAFB" }
      };
    }
  });

  worksheet.columns = [
    { width: 18 }, { width: 16 }, { width: 16 }, { width: 26 },
    { width: 18 }, { width: 12 }, { width: 20 }, { width: 18 },
    { width: 14 }, { width: 16 }
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  triggerDownload(blob, filename);
}
