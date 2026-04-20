export const REGIONS = [
  { id: 1, name: "Addis Ababa", value: "REGION_addis_ababa" },
  { id: 2, name: "Dire Dawa", value: "REGION_dire_dawa" },
  { id: 3, name: "Tigray", value: "REGION_tigray" },
  { id: 4, name: "Afar", value: "REGION_afar" },
  { id: 5, name: "Amhara", value: "REGION_amhara" },
  { id: 6, name: "Oromia", value: "REGION_oromia" },
  { id: 7, name: "Somali", value: "REGION_somali" },
  { id: 8, name: "Benishangul Gumuz", value: "REGION_benishangul_gumuz" },
  { id: 9, name: "SNNPR", value: "REGION_snnpr" },
  { id: 10, name: "Gambela", value: "REGION_gambela" },
  { id: 11, name: "Harari", value: "REGION_harari" },
  { id: 12, name: "Sidama", value: "REGION_sidama" },
  { id: 13, name: "South West", value: "REGION_south_west" },
  { id: 14, name: "Federal HQ", value: "REGION_federal_hq" },
];

export const REGION_MAP_VALUE_TO_ID: Record<string, number> = {
    "REGION_addis_ababa": 1,
    "REGION_dire_dawa": 2,
    "REGION_tigray": 3,
    "REGION_afar": 4,
    "REGION_amhara": 5,
    "REGION_oromia": 6,
    "REGION_somali": 7,
    "REGION_benishangul_gumuz": 8,
    "REGION_snnpr": 9,
    "REGION_gambela": 10,
    "REGION_harari": 11,
    "REGION_sidama": 12,
    "REGION_south_west": 13,
    "REGION_federal_hq": 14,
}

export const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

export const ETHIOPIA_LOCATION_DATA: Record<string, { zones: { id: string, name: string }[] }> = {
  "REGION_addis_ababa": {
    zones: [
      { id: "ZONE_aa_arada", name: "Arada" },
      { id: "ZONE_aa_kirkos", name: "Kirkos" },
      { id: "ZONE_aa_bole", name: "Bole" },
      { id: "ZONE_aa_yeka", name: "Yeka" },
      { id: "ZONE_aa_nifas_silk", name: "Nifas Silk" },
    ]
  },
  "REGION_amhara": {
    zones: [
      { id: "ZONE_am_north_gondar", name: "North Gondar" },
      { id: "ZONE_am_south_gondar", name: "South Gondar" },
      { id: "ZONE_am_east_gojjam", name: "East Gojjam" },
      { id: "ZONE_am_west_gojjam", name: "West Gojjam" },
    ]
  },
  "REGION_oromia": {
    zones: [
      { id: "ZONE_or_east_shewa", name: "East Shewa" },
      { id: "ZONE_or_west_shewa", name: "West Shewa" },
      { id: "ZONE_or_arssi", name: "Arssi" },
      { id: "ZONE_or_bale", name: "Bale" },
    ]
  },
  "REGION_tigray": {
    zones: [
      { id: "ZONE_tg_mekelle", name: "Mekelle" },
      { id: "ZONE_tg_central", name: "Central Tigray" },
    ]
  }
};

export const ZONE_WOREDA_DATA: Record<string, { id: string, name: string }[]> = {
    "ZONE_aa_arada": [
        { id: "WOREDA_aa_arada_01", name: "Woreda 01" },
        { id: "WOREDA_aa_arada_02", name: "Woreda 02" },
    ],
    "ZONE_aa_bole": [
        { id: "WOREDA_aa_bole_01", name: "Woreda 01" },
        { id: "WOREDA_aa_bole_02", name: "Woreda 02" },
    ],
    "ZONE_am_north_gondar": [
        { id: "WOREDA_am_ng_gondar", name: "Gondar Zuria" },
        { id: "WOREDA_am_ng_debarq", name: "Debarq" },
    ]
}
