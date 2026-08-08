export const REGIONS = [
  { id: 1, name: "Addis Ababa", value: "REGION_addis_ababa" },
  { id: 2, name: "Dire Dawa", value: "REGION_dire_dawa" },
  { id: 3, name: "Tigray", value: "REGION_tigray" },
  { id: 4, name: "Afar", value: "REGION_afar" },
  { id: 5, name: "Amhara", value: "REGION_amhara" },
  { id: 6, name: "Oromia", value: "REGION_oromia" },
  { id: 7, name: "Somali", value: "REGION_somali" },
  { id: 8, name: "Benishangul Gumz", value: "REGION_benishangul_gumz" },
  { id: 9, name: "Central Ethiopia", value: "REGION_central_ethiopia" },
  { id: 10, name: "Gambela", value: "REGION_gambela" },
  { id: 11, name: "Harari", value: "REGION_harari" },
  { id: 12, name: "Sidama", value: "REGION_sidama" },
  { id: 13, name: "South West Ethiopia", value: "REGION_south_west_ethiopia" },
  { id: 14, name: "South Ethiopia", value: "REGION_south_ethiopia" },
];

export const REGION_MAP_VALUE_TO_ID: Record<string, number> = {
    "REGION_addis_ababa": 1,
    "REGION_dire_dawa": 2,
    "REGION_tigray": 3,
    "REGION_afar": 4,
    "REGION_amhara": 5,
    "REGION_oromia": 6,
    "REGION_somali": 7,
    "REGION_benishangul_gumz": 8,
    "REGION_central_ethiopia": 9,
    "REGION_gambela": 10,
    "REGION_harari": 11,
    "REGION_sidama": 12,
    "REGION_south_west_ethiopia": 13,
    "REGION_south_ethiopia": 14,
};

export const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

export const ETHIOPIA_LOCATION_DATA: Record<string, { zones: { id: string, name: string }[] }> = {
  "REGION_addis_ababa": {
    zones: [
      { id: "ZONE_aa_arada", name: "Arada" },
      { id: "ZONE_aa_kirkos", name: "Kirkos" },
      { id: "ZONE_aa_bole", name: "Bole" },
      { id: "ZONE_aa_yeka", name: "Yeka" },
      { id: "ZONE_aa_nifas_silk", name: "Nifas Silk Lafto" },
      { id: "ZONE_aa_lideta", name: "Lideta" },
      { id: "ZONE_aa_gullele", name: "Gullele" },
      { id: "ZONE_aa_akaki_kality", name: "Akaki Kality" },
      { id: "ZONE_aa_kolfe_keranio", name: "Kolfe Keranio" },
      { id: "ZONE_aa_addis_ketema", name: "Addis Ketema" },
      { id: "ZONE_aa_lemi_kura", name: "Lemi Kura" },
    ]
  },
  "REGION_dire_dawa": {
    zones: [
      { id: "ZONE_dd_city", name: "Dire Dawa City" },
      { id: "ZONE_dd_gurgura", name: "Gurgura" },
    ]
  },
  "REGION_tigray": {
    zones: [
      { id: "ZONE_tg_mekelle", name: "Mekelle City" },
      { id: "ZONE_tg_central", name: "Central Tigray" },
      { id: "ZONE_tg_eastern", name: "Eastern Tigray" },
      { id: "ZONE_tg_north_western", name: "North Western Tigray" },
      { id: "ZONE_tg_southern", name: "Southern Tigray" },
      { id: "ZONE_tg_western", name: "Western Tigray" },
      { id: "ZONE_tg_south_eastern", name: "South Eastern Tigray" },
    ]
  },
  "REGION_afar": {
    zones: [
      { id: "ZONE_af_zone1", name: "Awsi Rasu (Zone 1)" },
      { id: "ZONE_af_zone2", name: "Kilbet Rasu (Zone 2)" },
      { id: "ZONE_af_zone3", name: "Gabi Rasu (Zone 3)" },
      { id: "ZONE_af_zone4", name: "Fantena Rasu (Zone 4)" },
      { id: "ZONE_af_zone5", name: "Hari Rasu (Zone 5)" },
    ]
  },
  "REGION_amhara": {
    zones: [
      { id: "ZONE_am_north_gondar", name: "North Gondar" },
      { id: "ZONE_am_south_gondar", name: "South Gondar" },
      { id: "ZONE_am_central_gondar", name: "Central Gondar" },
      { id: "ZONE_am_west_gondar", name: "West Gondar" },
      { id: "ZONE_am_east_gojjam", name: "East Gojjam" },
      { id: "ZONE_am_west_gojjam", name: "West Gojjam" },
      { id: "ZONE_am_awi", name: "Awi Zone" },
      { id: "ZONE_am_south_wollo", name: "South Wollo" },
      { id: "ZONE_am_north_wollo", name: "North Wollo" },
      { id: "ZONE_am_wag_hemra", name: "Wag Hemra" },
      { id: "ZONE_am_north_shewa", name: "North Shewa" },
      { id: "ZONE_am_oromia_special", name: "Oromia Special Zone" },
      { id: "ZONE_am_bahir_dar", name: "Bahir Dar City" },
    ]
  },
  "REGION_oromia": {
    zones: [
      { id: "ZONE_or_east_shewa", name: "East Shewa" },
      { id: "ZONE_or_west_shewa", name: "West Shewa" },
      { id: "ZONE_or_north_shewa", name: "North Shewa" },
      { id: "ZONE_or_arsi", name: "Arsi" },
      { id: "ZONE_or_west_arsi", name: "West Arsi" },
      { id: "ZONE_or_bale", name: "Bale" },
      { id: "ZONE_or_east_bale", name: "East Bale" },
      { id: "ZONE_or_guji", name: "Guji" },
      { id: "ZONE_or_west_guji", name: "West Guji" },
      { id: "ZONE_or_borena", name: "Borena" },
      { id: "ZONE_or_jimma", name: "Jimma" },
      { id: "ZONE_or_ilu_ababor", name: "Ilu Ababor" },
      { id: "ZONE_or_buno_bedele", name: "Buno Bedele" },
      { id: "ZONE_or_east_hararghe", name: "East Hararghe" },
      { id: "ZONE_or_west_hararghe", name: "West Hararghe" },
      { id: "ZONE_or_east_wollega", name: "East Wollega" },
      { id: "ZONE_or_west_wollega", name: "West Wollega" },
      { id: "ZONE_or_horo_guduru", name: "Horo Guduru Wollega" },
      { id: "ZONE_or_kelem_wollega", name: "Kelem Wollega" },
      { id: "ZONE_or_finfinne_special", name: "Finfinne Special Zone" },
      { id: "ZONE_or_adama", name: "Adama City" },
    ]
  },
  "REGION_somali": {
    zones: [
      { id: "ZONE_sm_sitti", name: "Sitti" },
      { id: "ZONE_sm_fafan", name: "Fafan" },
      { id: "ZONE_sm_jarar", name: "Jarar" },
      { id: "ZONE_sm_nogob", name: "Nogob" },
      { id: "ZONE_sm_erer", name: "Erer" },
      { id: "ZONE_sm_shabelle", name: "Shabelle" },
      { id: "ZONE_sm_korahe", name: "Korahe" },
      { id: "ZONE_sm_doollo", name: "Doollo" },
      { id: "ZONE_sm_liben", name: "Liben" },
      { id: "ZONE_sm_afder", name: "Afder" },
      { id: "ZONE_sm_daawa", name: "Daawa" },
      { id: "ZONE_sm_jijiga", name: "Jijiga City" },
    ]
  },
  "REGION_benishangul_gumz": {
    zones: [
      { id: "ZONE_bg_metekel", name: "Metekel" },
      { id: "ZONE_bg_asosa", name: "Asosa" },
      { id: "ZONE_bg_kamashi", name: "Kamashi" },
    ]
  },
  "REGION_central_ethiopia": {
    zones: [
      { id: "ZONE_ce_gurage", name: "Gurage" },
      { id: "ZONE_ce_silte", name: "Silte" },
      { id: "ZONE_ce_halaba", name: "Halaba" },
      { id: "ZONE_ce_hadiya", name: "Hadiya" },
      { id: "ZONE_ce_kembata", name: "Kembata Tembaro" },
      { id: "ZONE_ce_yem", name: "Yem" },
    ]
  },
  "REGION_gambela": {
    zones: [
      { id: "ZONE_gm_anywaa", name: "Anywaa" },
      { id: "ZONE_gm_nuer", name: "Nuer" },
      { id: "ZONE_gm_majang", name: "Majang" },
      { id: "ZONE_gm_city", name: "Gambela City" },
    ]
  },
  "REGION_harari": {
    zones: [
      { id: "ZONE_hr_city", name: "Harar City" },
      { id: "ZONE_hr_amir_nur", name: "Amir Nur" },
      { id: "ZONE_hr_abadir", name: "Abadir" },
      { id: "ZONE_hr_shenkor", name: "Shenkor" },
      { id: "ZONE_hr_sofi", name: "Sofi" },
      { id: "ZONE_hr_erer", name: "Erer" },
    ]
  },
  "REGION_sidama": {
    zones: [
      { id: "ZONE_sd_hawassa", name: "Hawassa City" },
      { id: "ZONE_sd_central", name: "Central Sidama" },
      { id: "ZONE_sd_eastern", name: "Eastern Sidama" },
      { id: "ZONE_sd_northern", name: "Northern Sidama" },
      { id: "ZONE_sd_southern", name: "Southern Sidama" },
    ]
  },
  "REGION_south_west_ethiopia": {
    zones: [
      { id: "ZONE_sw_keffa", name: "Keffa" },
      { id: "ZONE_sw_sheka", name: "Sheka" },
      { id: "ZONE_sw_bench_sheko", name: "Bench Sheko" },
      { id: "ZONE_sw_dawro", name: "Dawro" },
      { id: "ZONE_sw_west_omo", name: "West Omo" },
      { id: "ZONE_sw_konta", name: "Konta" },
    ]
  },
  "REGION_south_ethiopia": {
    zones: [
      { id: "ZONE_se_wolayita", name: "Wolayita" },
      { id: "ZONE_se_gamo", name: "Gamo" },
      { id: "ZONE_se_gofa", name: "Gofa" },
      { id: "ZONE_se_south_omo", name: "South Omo" },
      { id: "ZONE_se_gedeo", name: "Gedeo" },
      { id: "ZONE_se_konso", name: "Konso" },
      { id: "ZONE_se_derashe", name: "Derashe" },
      { id: "ZONE_se_burji", name: "Burji" },
      { id: "ZONE_se_basketo", name: "Basketo" },
      { id: "ZONE_se_amaro", name: "Amaro" },
    ]
  }
};

const makeStandardWoredas = (prefix: string, count = 7) => 
  Array.from({ length: count }, (_, i) => {
    const num = (i + 1).toString().padStart(2, "0");
    return { id: `WOREDA_${prefix}_${num}`, name: `Woreda ${num}` };
  });

export const ZONE_WOREDA_DATA: Record<string, { id: string, name: string }[]> = {
    // Addis Ababa Sub-Cities
    "ZONE_aa_arada": makeStandardWoredas("aa_arada", 10),
    "ZONE_aa_kirkos": makeStandardWoredas("aa_kirkos", 11),
    "ZONE_aa_bole": makeStandardWoredas("aa_bole", 14),
    "ZONE_aa_yeka": makeStandardWoredas("aa_yeka", 13),
    "ZONE_aa_nifas_silk": makeStandardWoredas("aa_ns", 15),
    "ZONE_aa_lideta": makeStandardWoredas("aa_lideta", 10),
    "ZONE_aa_gullele": makeStandardWoredas("aa_gullele", 10),
    "ZONE_aa_akaki_kality": makeStandardWoredas("aa_akaki", 13),
    "ZONE_aa_kolfe_keranio": makeStandardWoredas("aa_kolfe", 15),
    "ZONE_aa_addis_ketema": makeStandardWoredas("aa_addis_ketema", 10),
    "ZONE_aa_lemi_kura": makeStandardWoredas("aa_lemi_kura", 10),

    // Regional Zones with specific woredas
    "ZONE_am_north_gondar": [
        { id: "WOREDA_am_ng_gondar", name: "Gondar Zuria" },
        { id: "WOREDA_am_ng_debarq", name: "Debarq" },
        { id: "WOREDA_am_ng_dabat", name: "Dabat" },
        { id: "WOREDA_am_ng_sanja", name: "Sanja" },
        { id: "WOREDA_am_ng_05", name: "Woreda 05" },
        { id: "WOREDA_am_ng_06", name: "Woreda 06" },
        { id: "WOREDA_am_ng_07", name: "Woreda 07" },
    ],
    "ZONE_or_east_shewa": [
        { id: "WOREDA_or_es_adama", name: "Adama Zuria" },
        { id: "WOREDA_or_es_bishoftu", name: "Bishoftu" },
        { id: "WOREDA_or_es_mojo", name: "Mojo" },
        { id: "WOREDA_or_es_batu", name: "Batu (Ziway)" },
        { id: "WOREDA_or_es_05", name: "Woreda 05" },
        { id: "WOREDA_or_es_06", name: "Woreda 06" },
        { id: "WOREDA_or_es_07", name: "Woreda 07" },
    ],
    "ZONE_tg_mekelle": [
        { id: "WOREDA_tg_mk_kedamay", name: "Kedamay Weyane" },
        { id: "WOREDA_tg_mk_hadnet", name: "Hadnet" },
        { id: "WOREDA_tg_mk_hawelti", name: "Hawelti" },
        { id: "WOREDA_tg_mk_ayder", name: "Ayder" },
        { id: "WOREDA_tg_mk_05", name: "Woreda 05" },
        { id: "WOREDA_tg_mk_06", name: "Woreda 06" },
        { id: "WOREDA_tg_mk_07", name: "Woreda 07" },
    ]
};

export const getWoredasForZone = (zoneId: string) => {
  if (ZONE_WOREDA_DATA[zoneId] && ZONE_WOREDA_DATA[zoneId].length > 0) {
    return ZONE_WOREDA_DATA[zoneId];
  }
  // Default dynamic fallback: Woreda 01 through Woreda 07
  return makeStandardWoredas(zoneId.replace("ZONE_", "").toLowerCase(), 7);
};

export const REGION_NAME_TO_ID: Record<string, number> = {
  "addis ababa": 1, "aa": 1, "addis ababa branch": 1, "region_addis_ababa": 1,
  "dire dawa": 2, "dd": 2, "dire dawa branch": 2, "region_dire_dawa": 2,
  "tigray": 3, "tg": 3, "tigray branch": 3, "region_tigray": 3,
  "afar": 4, "af": 4, "afar branch": 4, "region_afar": 4,
  "amhara": 5, "am": 5, "amhara branch": 5, "region_amhara": 5,
  "oromia": 6, "or": 6, "oromia branch": 6, "region_oromia": 6,
  "somali": 7, "sm": 7, "somali branch": 7, "region_somali": 7,
  "benishangul gumz": 8, "benishangul": 8, "bg": 8, "benishangul gumz branch": 8, "region_benishangul_gumz": 8,
  "central ethiopia": 9, "ce": 9, "central ethiopia branch": 9, "region_central_ethiopia": 9,
  "gambela": 10, "gm": 10, "gambela branch": 10, "region_gambela": 10,
  "harari": 11, "hr": 11, "harari branch": 11, "region_harari": 11,
  "sidama": 12, "sd": 12, "sidama branch": 12, "region_sidama": 12,
  "south west ethiopia": 13, "sw": 13, "south west ethiopia branch": 13, "region_south_west_ethiopia": 13,
  "south ethiopia": 14, "se": 14, "south ethiopia branch": 14, "region_south_ethiopia": 14, "southern ethiopia": 14
};

export function resolveRegionId(
  val: any,
  dbRegions: { id: number; name: string; code?: string }[] = []
): number {
  if (val === undefined || val === null || val === "") {
    return dbRegions.length > 0 ? dbRegions[0].id : 1;
  }

  const num = parseInt(String(val).trim(), 10);
  if (!isNaN(num) && num > 0) {
    if (dbRegions.length === 0 || dbRegions.some(r => r.id === num)) {
      return num;
    }
  }

  const str = String(val).trim().toLowerCase();

  // Dynamically match against region records loaded from database
  if (dbRegions && dbRegions.length > 0) {
    const matched = dbRegions.find(r => {
      const nameLower = r.name.toLowerCase();
      const codeLower = (r.code || "").toLowerCase();
      return (
        nameLower === str ||
        (codeLower && codeLower === str) ||
        nameLower.includes(str) ||
        str.includes(nameLower)
      );
    });
    if (matched) return matched.id;
  }

  // Common alias mapping fallback
  if (REGION_NAME_TO_ID[str]) return REGION_NAME_TO_ID[str];

  return dbRegions && dbRegions.length > 0 ? dbRegions[0].id : 1;
}


