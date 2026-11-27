// Column definitions for the Excel imports. `required` here drives the red/grey colouring in
// the template AND the row checks, so the colours always match what is enforced.
import type { ImportColumn, RegionOption } from "./import-validation";
import type { ImportConfig } from "./excel-import";

const GENDER_SYNONYMS = { m: "male", f: "female", man: "male", woman: "female" };

export const MEMBERSHIP_TYPES = [
  "REGULAR",
  "INDIVIDUAL_LIFETIME",
  "FAMILY_LIFETIME",
  "CORP_REGULAR",
  "CORP_HIGH",
  "CORP_SPECIAL",
  "YOUTH",
];

function lockedNote(region: string, area?: { zone?: string; woreda?: string } | null): string {
  const where = [region, area?.zone && `${area.zone} zone`, area?.woreda].filter(Boolean).join(" / ");
  const columns = area?.zone || area?.woreda ? "There are no Region, Zone or Woreda columns." : "There is no Region column.";
  return `All members in this file are added to your area: ${where}. ${columns}`;
}

/**
 * @param lockedRegion when the admin may only add people to their own region the Region column
 *        is left out and every row goes to that region.
 * @param lockedArea names of the zone and/or woreda a zonal or woreda admin is limited to; the
 *        server puts every row there, so the file needs no column for it.
 */
export function memberImportConfig(
  regions: RegionOption[],
  lockedRegion?: RegionOption | null,
  lockedArea?: { zone?: string; woreda?: string } | null
): ImportConfig {
  const columns: ImportColumn[] = [
    { key: "firstName", label: "First Name", required: true, kind: "name", width: 20, help: "Given name. Letters only.", example: "Abebe" },
    { key: "fatherName", label: "Father Name", required: true, kind: "name", width: 20, help: "Father's name. Letters only.", example: "Kebede" },
    {
      key: "grandfatherName",
      label: "Grandfather Name",
      required: false,
      kind: "name",
      aliases: ["Grandfather", "Last Name"],
      width: 20,
      help: "Grandfather's name. You may leave this empty.",
      example: "Tadesse",
    },
    {
      key: "phone",
      label: "Phone Number",
      required: true,
      kind: "phone",
      aliases: ["Phone", "Mobile"],
      width: 20,
      help: "Mobile number: 0967123456, +251967123456 or 967123456. Format the cell as Text.",
      example: "0967123456",
    },
    { key: "email", label: "Email", required: false, kind: "email", width: 28, help: "Email address.", example: "abebe@example.com" },
    { key: "nationalId", label: "National ID", required: false, kind: "text", aliases: ["NationalID", "ID Number"], width: 18, help: "National ID / Fayda number.", example: "1234567890123456" },
    {
      key: "dob",
      label: "Date of Birth",
      required: false,
      kind: "date",
      aliases: ["Date of Birth (YYYY-MM-DD)", "DOB"],
      width: 18,
      help: "YYYY-MM-DD (or DD/MM/YYYY).",
      example: "1990-04-25",
    },
    {
      key: "gender",
      label: "Gender",
      required: false,
      kind: "list",
      options: ["MALE", "FEMALE"],
      synonyms: GENDER_SYNONYMS,
      width: 12,
      help: "MALE or FEMALE (pick from the dropdown).",
      example: "MALE",
    },
  ];
  if (!lockedRegion) {
    columns.push({
      key: "region",
      label: "Region",
      required: true,
      kind: "region",
      aliases: ["Region (Select from list)"],
      width: 30,
      help: "Pick the region from the dropdown list.",
      example: regions[0] ? `${regions[0].id} - ${regions[0].name}` : "1 - Addis Ababa",
    });
  }
  columns.push({
    key: "membershipType",
    label: "Membership Type",
    required: true,
    kind: "list",
    options: MEMBERSHIP_TYPES,
    aliases: ["Type"],
    width: 24,
    help: "Pick the membership type from the dropdown list.",
    example: "REGULAR",
  });

  return {
    sheetName: "Members",
    title: "Ethiopian Red Cross: Member import",
    columns,
    regions: lockedRegion ? undefined : regions,
    notes: lockedRegion ? [lockedNote(lockedRegion.name, lockedArea)] : undefined,
  };
}

const OCCUPATIONS = ["Farmer", "Business Person", "Civil Servant", "House Wife", "Military", "NGO", "Self Employed", "Student", "Police", "Diplomat", "Others"];
const ORG_TYPES = ["Government", "Ngo", "Private", "Association"];
const EDUCATION = ["Below Primary School", "Primary School Completed", "High School Completed", "Degree", "Masters", "PHD"];

export function volunteerImportConfig(): ImportConfig {
  const yesNo = (key: string, label: string): ImportColumn => ({
    key,
    label,
    required: false,
    kind: "yesno",
    width: 12,
    help: `YES if the volunteer takes part in "${label}" activities, otherwise NO or empty.`,
    example: "YES",
  });
  const columns: ImportColumn[] = [
    {
      key: "phone",
      label: "Phone Number",
      required: true,
      kind: "phone",
      aliases: ["Mobile", "Phone", "phone_number"],
      width: 20,
      help: "Mobile number: 0967123456, +251967123456 or 967123456. Format the cell as Text.",
      example: "0967123456",
    },
    { key: "firstName", label: "First Name", required: true, kind: "name", aliases: ["Name", "FirstName"], width: 20, help: "Given name. Letters only.", example: "Sara" },
    { key: "fatherName", label: "Father Name", required: true, kind: "name", aliases: ["FatherName", "Middle Name"], width: 20, help: "Father's name. Letters only.", example: "Belay" },
    {
      key: "grandfatherName",
      label: "Grandfather Name",
      required: false,
      kind: "name",
      aliases: ["Last Name", "GrandfatherName", "Grandfather"],
      width: 20,
      help: "Grandfather's name. You may leave this empty.",
      example: "Tadesse",
    },
    {
      key: "gender",
      label: "Gender",
      required: true,
      kind: "list",
      options: ["Male", "Female"],
      synonyms: GENDER_SYNONYMS,
      width: 12,
      help: "Male or Female (pick from the dropdown).",
      example: "Female",
    },
    { key: "dob", label: "Date of Birth", required: false, kind: "date", aliases: ["Date of Birth (Eth)", "DOB"], width: 18, help: "YYYY-MM-DD (or DD/MM/YYYY).", example: "1995-04-12" },
    { key: "registrationDate", label: "Registration Date", required: false, kind: "date", width: 18, help: "Date the volunteer joined, YYYY-MM-DD.", example: "2026-07-05" },
    { key: "occupation", label: "Occupation", required: false, kind: "list", options: OCCUPATIONS, aliases: ["Profession"], width: 20, help: "Pick from the dropdown list.", example: "NGO" },
    { key: "orgName", label: "Organization Name", required: false, kind: "text", aliases: ["OrganizationName"], width: 24, help: "Where the volunteer works or studies.", example: "ERCS" },
    { key: "orgType", label: "Organization Type", required: false, kind: "list", options: ORG_TYPES, aliases: ["OrganizationType"], width: 20, help: "Pick from the dropdown list.", example: "Ngo" },
    { key: "education", label: "Education Level", required: false, kind: "list", options: EDUCATION, aliases: ["EducationLevel"], width: 26, help: "Pick from the dropdown list.", example: "Degree" },
    { key: "area", label: "Area", required: false, kind: "list", options: ["URBAN", "RURAL"], width: 12, help: "URBAN or RURAL.", example: "URBAN" },
    { key: "languages", label: "Languages", required: false, kind: "text", width: 24, help: "Languages spoken, separated by commas.", example: "Amharic, English" },
    { key: "kebele", label: "Kebele", required: false, kind: "text", width: 26, help: "Kebele / house address.", example: "Kebele 03, House 405" },
    { key: "email", label: "Email", required: false, kind: "email", aliases: ["Email Address"], width: 28, help: "Email address.", example: "sara@example.com" },
    yesNo("general", "General"),
    yesNo("youth", "Youth"),
    yesNo("professional", "Professional"),
    yesNo("leadership", "Leadership"),
  ];
  return {
    sheetName: "Volunteers",
    title: "Ethiopian Red Cross: Volunteer import",
    columns,
    notes: ["The region is chosen on the Volunteers page before you upload, not in this file."],
  };
}
