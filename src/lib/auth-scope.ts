export interface UserScope {
  role: string;
  isSuperAdmin: boolean;
  isRegionalAdmin: boolean;
  isZonalAdmin: boolean;
  isWoredaAdmin: boolean;
  isBranchOfficer: boolean;
  regionId: string;
  regionNumber: number;
  zoneId: string;
  woredaId: string;
  branchId: string;
  regionName: string;
  scopeBadgeTitle: string;
  scopeBadgeScope: string;
}

export const REGION_NAMES: Record<string, string> = {
  "1": "Addis Ababa",
  "2": "Dire Dawa",
  "3": "Tigray",
  "4": "Afar",
  "5": "Amhara",
  "6": "Oromia",
  "7": "Somali",
  "8": "Benishangul Gumz",
  "9": "Central Ethiopia",
  "10": "Gambela",
  "11": "Harari",
  "12": "Sidama",
  "13": "South West Ethiopia",
  "14": "South Ethiopia",
};

export const SUPER_ADMIN_ONLY_MODULES = [
  "cms",
  "settings",
  "forms",
  "membership-plans",
];

export function getUserScope(): UserScope {
  if (typeof window === "undefined") {
    return {
      role: "SUPER_ADMIN",
      isSuperAdmin: true,
      isRegionalAdmin: false,
      isZonalAdmin: false,
      isWoredaAdmin: false,
      isBranchOfficer: false,
      regionId: "",
      regionNumber: 0,
      zoneId: "",
      woredaId: "",
      branchId: "",
      regionName: "All Regions",
      scopeBadgeTitle: "Super Admin",
      scopeBadgeScope: "SUPER ADMIN — ALL REGIONS",
    };
  }

  const rawRole = localStorage.getItem("user_role") || "SUPER_ADMIN";
  let role = rawRole;
  if (rawRole === "1" || rawRole === "ROLE_super_admin") role = "SUPER_ADMIN";
  else if (rawRole === "2" || rawRole === "ROLE_regional_admin") role = "REGIONAL_ADMIN";
  else if (rawRole === "3" || rawRole === "ROLE_zonal_admin" || rawRole === "ZONE_ADMIN" || rawRole === "ZONAL_ADMIN") role = "ZONE_ADMIN";
  else if (rawRole === "4" || rawRole === "ROLE_woreda_admin") role = "WOREDA_ADMIN";
  else if (rawRole === "7" || rawRole === "ROLE_branch_officer") role = "BRANCH_OFFICER";

  const isSuperAdmin = role === "SUPER_ADMIN";
  const isRegionalAdmin = role === "REGIONAL_ADMIN";
  const isZonalAdmin = role === "ZONE_ADMIN" || role === "ZONAL_ADMIN";
  const isWoredaAdmin = role === "WOREDA_ADMIN";
  const isBranchOfficer = role === "BRANCH_OFFICER";

  const rawRegion = localStorage.getItem("user_region") || "0";
  const regionNumber = Number(rawRegion) || 0;
  const regionId = regionNumber > 0 ? String(regionNumber) : "";
  const zoneId = localStorage.getItem("user_zone") || "";
  const woredaId = localStorage.getItem("user_woreda") || "";
  const branchId = localStorage.getItem("user_branch") || localStorage.getItem("user_branch_id") || "";

  const regionName = regionId ? (REGION_NAMES[regionId] || `Region ${regionId}`) : "All Regions";

  let scopeBadgeTitle = "Administrator";
  let scopeBadgeScope = "ADMIN — GENERAL";

  if (isSuperAdmin) {
    scopeBadgeTitle = "Super Admin";
    scopeBadgeScope = "SUPER ADMIN — ALL REGIONS";
  } else if (isRegionalAdmin) {
    scopeBadgeTitle = "Regional Admin";
    scopeBadgeScope = `REGIONAL ADMIN — ${regionName.toUpperCase()}`;
  } else if (isZonalAdmin) {
    scopeBadgeTitle = "Zone Admin";
    scopeBadgeScope = `ZONE ADMIN — ${regionName.toUpperCase()}${zoneId ? ` / ${zoneId}` : ""}`;
  } else if (isWoredaAdmin) {
    scopeBadgeTitle = "Woreda Admin";
    scopeBadgeScope = `WOREDA ADMIN — ${regionName.toUpperCase()}${woredaId ? ` / WOREDA ${woredaId}` : ""}`;
  } else if (isBranchOfficer) {
    scopeBadgeTitle = "Branch Officer";
    const cleanBranch = branchId ? branchId.replace(/^BRANCH_/, "").replace(/_/g, " ").toUpperCase() : "BRANCH";
    scopeBadgeScope = `BRANCH OFFICER — ${cleanBranch}`;
  }

  return {
    role,
    isSuperAdmin,
    isRegionalAdmin,
    isZonalAdmin,
    isWoredaAdmin,
    isBranchOfficer,
    regionId: isSuperAdmin ? "" : regionId,
    regionNumber: isSuperAdmin ? 0 : regionNumber,
    zoneId: isSuperAdmin ? "" : zoneId,
    woredaId: isSuperAdmin ? "" : woredaId,
    branchId: isSuperAdmin ? "" : branchId,
    regionName,
    scopeBadgeTitle,
    scopeBadgeScope,
  };
}
