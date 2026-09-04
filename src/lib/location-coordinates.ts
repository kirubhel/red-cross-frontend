// Generated location coordinates from open-admin-data Ethiopia administrative divisions

export interface GeoLocation {
  lat: number;
  lng: number;
  name: string;
  regionId?: number;
  zoneId?: string;
}

export const ETHIOPIA_CENTER: [number, number] = [9.145, 40.489673];
export const ETHIOPIA_BOUNDS: [[number, number], [number, number]] = [
  [3.3, 33.0],
  [15.0, 48.0],
];

export const REGION_COORDINATES: Record<string | number, GeoLocation> = {
  "3": {
    "lat": 13.4967,
    "lng": 39.4753,
    "name": "Tigray"
  },
  "tigray": {
    "lat": 13.4967,
    "lng": 39.4753,
    "name": "Tigray"
  },
  "4": {
    "lat": 11.7956,
    "lng": 40.9917,
    "name": "Afar"
  },
  "afar": {
    "lat": 11.7956,
    "lng": 40.9917,
    "name": "Afar"
  },
  "5": {
    "lat": 11.5742,
    "lng": 37.3614,
    "name": "Amhara"
  },
  "amhara": {
    "lat": 11.5742,
    "lng": 37.3614,
    "name": "Amhara"
  },
  "6": {
    "lat": 8.54,
    "lng": 39.27,
    "name": "Oromia"
  },
  "oromia": {
    "lat": 8.54,
    "lng": 39.27,
    "name": "Oromia"
  },
  "7": {
    "lat": 9.35,
    "lng": 42.8,
    "name": "Somali"
  },
  "somali": {
    "lat": 9.35,
    "lng": 42.8,
    "name": "Somali"
  },
  "8": {
    "lat": 10.0667,
    "lng": 34.5333,
    "name": "Benishangul-Gumuz"
  },
  "benishangul-gumuz": {
    "lat": 10.0667,
    "lng": 34.5333,
    "name": "Benishangul-Gumuz"
  },
  "9": {
    "lat": 7.55,
    "lng": 37.85,
    "name": "Central Ethiopia"
  },
  "central ethiopia": {
    "lat": 7.55,
    "lng": 37.85,
    "name": "Central Ethiopia"
  },
  "14": {
    "lat": 6.86,
    "lng": 37.76,
    "name": "South Ethiopia"
  },
  "south ethiopia": {
    "lat": 6.86,
    "lng": 37.76,
    "name": "South Ethiopia"
  },
  "13": {
    "lat": 7.2667,
    "lng": 36.2333,
    "name": "South West Ethiopia"
  },
  "south west ethiopia": {
    "lat": 7.2667,
    "lng": 36.2333,
    "name": "South West Ethiopia"
  },
  "10": {
    "lat": 7.25,
    "lng": 34.5833,
    "name": "Gambela"
  },
  "gambela": {
    "lat": 7.25,
    "lng": 34.5833,
    "name": "Gambela"
  },
  "11": {
    "lat": 9.3089,
    "lng": 42.1181,
    "name": "Harari"
  },
  "harari": {
    "lat": 9.3089,
    "lng": 42.1181,
    "name": "Harari"
  },
  "1": {
    "lat": 9.0301,
    "lng": 38.74,
    "name": "Addis Ababa"
  },
  "addis ababa": {
    "lat": 9.0301,
    "lng": 38.74,
    "name": "Addis Ababa"
  },
  "2": {
    "lat": 9.6,
    "lng": 41.85,
    "name": "Dire Dawa"
  },
  "dire dawa": {
    "lat": 9.6,
    "lng": 41.85,
    "name": "Dire Dawa"
  },
  "12": {
    "lat": 6.827,
    "lng": 38.472,
    "name": "Sidama"
  },
  "sidama": {
    "lat": 6.827,
    "lng": 38.472,
    "name": "Sidama"
  },
  "15": {
    "lat": 13.3,
    "lng": 37.5,
    "name": "Contested"
  },
  "contested": {
    "lat": 13.3,
    "lng": 37.5,
    "name": "Contested"
  }
};

export const ZONE_COORDINATES: Record<string, GeoLocation> = {
  "ZONE_north_western": {
    "lat": 14.235,
    "lng": 38.016,
    "name": "North Western",
    "regionId": 3
  },
  "north western": {
    "lat": 14.235,
    "lng": 38.016,
    "name": "North Western",
    "regionId": 3
  },
  "ZONE_central": {
    "lat": 6.747,
    "lng": 38.423,
    "name": "Central",
    "regionId": 12
  },
  "central": {
    "lat": 6.747,
    "lng": 38.423,
    "name": "Central",
    "regionId": 12
  },
  "ZONE_eastern": {
    "lat": 6.428,
    "lng": 38.923,
    "name": "Eastern",
    "regionId": 12
  },
  "eastern": {
    "lat": 6.428,
    "lng": 38.923,
    "name": "Eastern",
    "regionId": 12
  },
  "ZONE_southern": {
    "lat": 6.543,
    "lng": 38.453,
    "name": "Southern",
    "regionId": 12
  },
  "southern": {
    "lat": 6.543,
    "lng": 38.453,
    "name": "Southern",
    "regionId": 12
  },
  "ZONE_south_eastern": {
    "lat": 13.221,
    "lng": 39.426,
    "name": "South Eastern",
    "regionId": 3
  },
  "south eastern": {
    "lat": 13.221,
    "lng": 39.426,
    "name": "South Eastern",
    "regionId": 3
  },
  "ZONE_mekelle": {
    "lat": 13.476,
    "lng": 39.505,
    "name": "Mekelle",
    "regionId": 3
  },
  "mekelle": {
    "lat": 13.476,
    "lng": 39.505,
    "name": "Mekelle",
    "regionId": 3
  },
  "ZONE_awsi_zone_1": {
    "lat": 12.037,
    "lng": 41.163,
    "name": "Awsi /Zone 1",
    "regionId": 4
  },
  "awsi /zone 1": {
    "lat": 12.037,
    "lng": 41.163,
    "name": "Awsi /Zone 1",
    "regionId": 4
  },
  "ZONE_kilbati_zone_2": {
    "lat": 13.451,
    "lng": 40.649,
    "name": "Kilbati /Zone 2",
    "regionId": 4
  },
  "kilbati /zone 2": {
    "lat": 13.451,
    "lng": 40.649,
    "name": "Kilbati /Zone 2",
    "regionId": 4
  },
  "ZONE_gabi_zone_3": {
    "lat": 9.913,
    "lng": 40.702,
    "name": "Gabi /Zone 3",
    "regionId": 4
  },
  "gabi /zone 3": {
    "lat": 9.913,
    "lng": 40.702,
    "name": "Gabi /Zone 3",
    "regionId": 4
  },
  "ZONE_fanti_zone_4": {
    "lat": 12.327,
    "lng": 40.318,
    "name": "Fanti /Zone 4",
    "regionId": 4
  },
  "fanti /zone 4": {
    "lat": 12.327,
    "lng": 40.318,
    "name": "Fanti /Zone 4",
    "regionId": 4
  },
  "ZONE_hari_zone_5": {
    "lat": 10.413,
    "lng": 40.268,
    "name": "Hari /Zone 5",
    "regionId": 4
  },
  "hari /zone 5": {
    "lat": 10.413,
    "lng": 40.268,
    "name": "Hari /Zone 5",
    "regionId": 4
  },
  "ZONE_mahi_zone_6": {
    "lat": 10.88,
    "lng": 40.946,
    "name": "Mahi /Zone 6",
    "regionId": 4
  },
  "mahi /zone 6": {
    "lat": 10.88,
    "lng": 40.946,
    "name": "Mahi /Zone 6",
    "regionId": 4
  },
  "ZONE_north_gondar": {
    "lat": 13.236,
    "lng": 37.777,
    "name": "North Gondar",
    "regionId": 5
  },
  "north gondar": {
    "lat": 13.236,
    "lng": 37.777,
    "name": "North Gondar",
    "regionId": 5
  },
  "ZONE_south_gondar": {
    "lat": 11.757,
    "lng": 38.095,
    "name": "South Gondar",
    "regionId": 5
  },
  "south gondar": {
    "lat": 11.757,
    "lng": 38.095,
    "name": "South Gondar",
    "regionId": 5
  },
  "ZONE_north_wello": {
    "lat": 11.829,
    "lng": 38.837,
    "name": "North Wello",
    "regionId": 5
  },
  "north wello": {
    "lat": 11.829,
    "lng": 38.837,
    "name": "North Wello",
    "regionId": 5
  },
  "ZONE_south_wello": {
    "lat": 10.997,
    "lng": 39.208,
    "name": "South Wello",
    "regionId": 5
  },
  "south wello": {
    "lat": 10.997,
    "lng": 39.208,
    "name": "South Wello",
    "regionId": 5
  },
  "ZONE_north_shewa_am": {
    "lat": 9.803,
    "lng": 39.487,
    "name": "North Shewa (AM)",
    "regionId": 5
  },
  "north shewa (am)": {
    "lat": 9.803,
    "lng": 39.487,
    "name": "North Shewa (AM)",
    "regionId": 5
  },
  "ZONE_east_gojam": {
    "lat": 10.506,
    "lng": 37.931,
    "name": "East Gojam",
    "regionId": 5
  },
  "east gojam": {
    "lat": 10.506,
    "lng": 37.931,
    "name": "East Gojam",
    "regionId": 5
  },
  "ZONE_west_gojam": {
    "lat": 10.692,
    "lng": 37.212,
    "name": "West Gojam",
    "regionId": 5
  },
  "west gojam": {
    "lat": 10.692,
    "lng": 37.212,
    "name": "West Gojam",
    "regionId": 5
  },
  "ZONE_wag_hamra": {
    "lat": 12.721,
    "lng": 38.817,
    "name": "Wag Hamra",
    "regionId": 5
  },
  "wag hamra": {
    "lat": 12.721,
    "lng": 38.817,
    "name": "Wag Hamra",
    "regionId": 5
  },
  "ZONE_awi": {
    "lat": 11.016,
    "lng": 36.834,
    "name": "Awi",
    "regionId": 5
  },
  "awi": {
    "lat": 11.016,
    "lng": 36.834,
    "name": "Awi",
    "regionId": 5
  },
  "ZONE_oromo_nationality_administration": {
    "lat": 10.741,
    "lng": 40.011,
    "name": "Oromo Nationality Administration",
    "regionId": 5
  },
  "oromo nationality administration": {
    "lat": 10.741,
    "lng": 40.011,
    "name": "Oromo Nationality Administration",
    "regionId": 5
  },
  "ZONE_central_gondar": {
    "lat": 12.594,
    "lng": 37.329,
    "name": "Central Gondar",
    "regionId": 5
  },
  "central gondar": {
    "lat": 12.594,
    "lng": 37.329,
    "name": "Central Gondar",
    "regionId": 5
  },
  "ZONE_west_gondar": {
    "lat": 12.44,
    "lng": 36.158,
    "name": "West Gondar",
    "regionId": 5
  },
  "west gondar": {
    "lat": 12.44,
    "lng": 36.158,
    "name": "West Gondar",
    "regionId": 5
  },
  "ZONE_north_gojam": {
    "lat": 11.531,
    "lng": 36.876,
    "name": "North Gojam",
    "regionId": 5
  },
  "north gojam": {
    "lat": 11.531,
    "lng": 36.876,
    "name": "North Gojam",
    "regionId": 5
  },
  "ZONE_bahir_dar_town_admin": {
    "lat": 11.963,
    "lng": 37.289,
    "name": "Bahir Dar town Admin",
    "regionId": 5
  },
  "bahir dar town admin": {
    "lat": 11.963,
    "lng": 37.289,
    "name": "Bahir Dar town Admin",
    "regionId": 5
  },
  "ZONE_west_wellega": {
    "lat": 9.525,
    "lng": 35.197,
    "name": "West Wellega",
    "regionId": 6
  },
  "west wellega": {
    "lat": 9.525,
    "lng": 35.197,
    "name": "West Wellega",
    "regionId": 6
  },
  "ZONE_east_wellega": {
    "lat": 9.405,
    "lng": 36.617,
    "name": "East Wellega",
    "regionId": 6
  },
  "east wellega": {
    "lat": 9.405,
    "lng": 36.617,
    "name": "East Wellega",
    "regionId": 6
  },
  "ZONE_ilu_aba_bora": {
    "lat": 8.264,
    "lng": 35.481,
    "name": "Ilu Aba Bora",
    "regionId": 6
  },
  "ilu aba bora": {
    "lat": 8.264,
    "lng": 35.481,
    "name": "Ilu Aba Bora",
    "regionId": 6
  },
  "ZONE_jimma": {
    "lat": 7.673,
    "lng": 36.736,
    "name": "Jimma",
    "regionId": 6
  },
  "jimma": {
    "lat": 7.673,
    "lng": 36.736,
    "name": "Jimma",
    "regionId": 6
  },
  "ZONE_west_shewa": {
    "lat": 9.171,
    "lng": 37.842,
    "name": "West Shewa",
    "regionId": 6
  },
  "west shewa": {
    "lat": 9.171,
    "lng": 37.842,
    "name": "West Shewa",
    "regionId": 6
  },
  "ZONE_north_shewa_or": {
    "lat": 9.692,
    "lng": 38.717,
    "name": "North Shewa (OR)",
    "regionId": 6
  },
  "north shewa (or)": {
    "lat": 9.692,
    "lng": 38.717,
    "name": "North Shewa (OR)",
    "regionId": 6
  },
  "ZONE_east_shewa": {
    "lat": 8.502,
    "lng": 39.157,
    "name": "East Shewa",
    "regionId": 6
  },
  "east shewa": {
    "lat": 8.502,
    "lng": 39.157,
    "name": "East Shewa",
    "regionId": 6
  },
  "ZONE_arsi": {
    "lat": 7.937,
    "lng": 39.682,
    "name": "Arsi",
    "regionId": 6
  },
  "arsi": {
    "lat": 7.937,
    "lng": 39.682,
    "name": "Arsi",
    "regionId": 6
  },
  "ZONE_west_hararge": {
    "lat": 8.67,
    "lng": 40.773,
    "name": "West Hararge",
    "regionId": 6
  },
  "west hararge": {
    "lat": 8.67,
    "lng": 40.773,
    "name": "West Hararge",
    "regionId": 6
  },
  "ZONE_east_hararge": {
    "lat": 8.844,
    "lng": 42.003,
    "name": "East Hararge",
    "regionId": 6
  },
  "east hararge": {
    "lat": 8.844,
    "lng": 42.003,
    "name": "East Hararge",
    "regionId": 6
  },
  "ZONE_bale": {
    "lat": 6.609,
    "lng": 40.149,
    "name": "Bale",
    "regionId": 6
  },
  "bale": {
    "lat": 6.609,
    "lng": 40.149,
    "name": "Bale",
    "regionId": 6
  },
  "ZONE_borena": {
    "lat": 4.428,
    "lng": 37.982,
    "name": "Borena",
    "regionId": 6
  },
  "borena": {
    "lat": 4.428,
    "lng": 37.982,
    "name": "Borena",
    "regionId": 6
  },
  "ZONE_south_west_shewa": {
    "lat": 8.593,
    "lng": 38.172,
    "name": "South West Shewa",
    "regionId": 6
  },
  "south west shewa": {
    "lat": 8.593,
    "lng": 38.172,
    "name": "South West Shewa",
    "regionId": 6
  },
  "ZONE_guji": {
    "lat": 5.833,
    "lng": 38.934,
    "name": "Guji",
    "regionId": 6
  },
  "guji": {
    "lat": 5.833,
    "lng": 38.934,
    "name": "Guji",
    "regionId": 6
  },
  "ZONE_west_guji": {
    "lat": 5.575,
    "lng": 38.317,
    "name": "West Guji",
    "regionId": 6
  },
  "west guji": {
    "lat": 5.575,
    "lng": 38.317,
    "name": "West Guji",
    "regionId": 6
  },
  "ZONE_buno_bedele": {
    "lat": 8.486,
    "lng": 36.327,
    "name": "Buno Bedele",
    "regionId": 6
  },
  "buno bedele": {
    "lat": 8.486,
    "lng": 36.327,
    "name": "Buno Bedele",
    "regionId": 6
  },
  "ZONE_west_arsi": {
    "lat": 7.059,
    "lng": 38.98,
    "name": "West Arsi",
    "regionId": 6
  },
  "west arsi": {
    "lat": 7.059,
    "lng": 38.98,
    "name": "West Arsi",
    "regionId": 6
  },
  "ZONE_kelem_wellega": {
    "lat": 8.813,
    "lng": 34.783,
    "name": "Kelem Wellega",
    "regionId": 6
  },
  "kelem wellega": {
    "lat": 8.813,
    "lng": 34.783,
    "name": "Kelem Wellega",
    "regionId": 6
  },
  "ZONE_horo_gudru_wellega": {
    "lat": 9.71,
    "lng": 37.197,
    "name": "Horo Gudru Wellega",
    "regionId": 6
  },
  "horo gudru wellega": {
    "lat": 9.71,
    "lng": 37.197,
    "name": "Horo Gudru Wellega",
    "regionId": 6
  },
  "ZONE_shager_city": {
    "lat": 8.822,
    "lng": 38.759,
    "name": "Shager City",
    "regionId": 6
  },
  "shager city": {
    "lat": 8.822,
    "lng": 38.759,
    "name": "Shager City",
    "regionId": 6
  },
  "ZONE_east_bale": {
    "lat": 7.237,
    "lng": 41.257,
    "name": "East Bale",
    "regionId": 6
  },
  "east bale": {
    "lat": 7.237,
    "lng": 41.257,
    "name": "East Bale",
    "regionId": 6
  },
  "ZONE_east_borena": {
    "lat": 4.546,
    "lng": 39.023,
    "name": "East Borena",
    "regionId": 6
  },
  "east borena": {
    "lat": 4.546,
    "lng": 39.023,
    "name": "East Borena",
    "regionId": 6
  },
  "ZONE_siti": {
    "lat": 10.25,
    "lng": 41.834,
    "name": "Siti",
    "regionId": 7
  },
  "siti": {
    "lat": 10.25,
    "lng": 41.834,
    "name": "Siti",
    "regionId": 7
  },
  "ZONE_fafan": {
    "lat": 9.152,
    "lng": 43.237,
    "name": "Fafan",
    "regionId": 7
  },
  "fafan": {
    "lat": 9.152,
    "lng": 43.237,
    "name": "Fafan",
    "regionId": 7
  },
  "ZONE_jarar": {
    "lat": 8.131,
    "lng": 44.315,
    "name": "Jarar",
    "regionId": 7
  },
  "jarar": {
    "lat": 8.131,
    "lng": 44.315,
    "name": "Jarar",
    "regionId": 7
  },
  "ZONE_erer": {
    "lat": 7.875,
    "lng": 42.286,
    "name": "Erer",
    "regionId": 7
  },
  "erer": {
    "lat": 7.875,
    "lng": 42.286,
    "name": "Erer",
    "regionId": 7
  },
  "ZONE_korahe": {
    "lat": 6.447,
    "lng": 44.645,
    "name": "Korahe",
    "regionId": 7
  },
  "korahe": {
    "lat": 6.447,
    "lng": 44.645,
    "name": "Korahe",
    "regionId": 7
  },
  "ZONE_shabelle": {
    "lat": 5.801,
    "lng": 43.667,
    "name": "Shabelle",
    "regionId": 7
  },
  "shabelle": {
    "lat": 5.801,
    "lng": 43.667,
    "name": "Shabelle",
    "regionId": 7
  },
  "ZONE_doolo": {
    "lat": 7.237,
    "lng": 46.114,
    "name": "Doolo",
    "regionId": 7
  },
  "doolo": {
    "lat": 7.237,
    "lng": 46.114,
    "name": "Doolo",
    "regionId": 7
  },
  "ZONE_afder": {
    "lat": 5.322,
    "lng": 42.298,
    "name": "Afder",
    "regionId": 7
  },
  "afder": {
    "lat": 5.322,
    "lng": 42.298,
    "name": "Afder",
    "regionId": 7
  },
  "ZONE_liban": {
    "lat": 4.916,
    "lng": 40.914,
    "name": "Liban",
    "regionId": 7
  },
  "liban": {
    "lat": 4.916,
    "lng": 40.914,
    "name": "Liban",
    "regionId": 7
  },
  "ZONE_nogob": {
    "lat": 7.133,
    "lng": 42.985,
    "name": "Nogob",
    "regionId": 7
  },
  "nogob": {
    "lat": 7.133,
    "lng": 42.985,
    "name": "Nogob",
    "regionId": 7
  },
  "ZONE_daawa": {
    "lat": 4.214,
    "lng": 39.979,
    "name": "Daawa",
    "regionId": 7
  },
  "daawa": {
    "lat": 4.214,
    "lng": 39.979,
    "name": "Daawa",
    "regionId": 7
  },
  "ZONE_metekel": {
    "lat": 11.002,
    "lng": 35.769,
    "name": "Metekel",
    "regionId": 8
  },
  "metekel": {
    "lat": 11.002,
    "lng": 35.769,
    "name": "Metekel",
    "regionId": 8
  },
  "ZONE_assosa": {
    "lat": 10.225,
    "lng": 34.712,
    "name": "Assosa",
    "regionId": 8
  },
  "assosa": {
    "lat": 10.225,
    "lng": 34.712,
    "name": "Assosa",
    "regionId": 8
  },
  "ZONE_kamashi": {
    "lat": 9.664,
    "lng": 35.813,
    "name": "Kamashi",
    "regionId": 8
  },
  "kamashi": {
    "lat": 9.664,
    "lng": 35.813,
    "name": "Kamashi",
    "regionId": 8
  },
  "ZONE_mao_komo_special": {
    "lat": 9.356,
    "lng": 34.286,
    "name": "Mao-komo Special",
    "regionId": 8
  },
  "mao-komo special": {
    "lat": 9.356,
    "lng": 34.286,
    "name": "Mao-komo Special",
    "regionId": 8
  },
  "ZONE_kebena_special": {
    "lat": 8.322,
    "lng": 37.909,
    "name": "Kebena Special",
    "regionId": 9
  },
  "kebena special": {
    "lat": 8.322,
    "lng": 37.909,
    "name": "Kebena Special",
    "regionId": 9
  },
  "ZONE_guraghe": {
    "lat": 8.132,
    "lng": 37.902,
    "name": "Guraghe",
    "regionId": 9
  },
  "guraghe": {
    "lat": 8.132,
    "lng": 37.902,
    "name": "Guraghe",
    "regionId": 9
  },
  "ZONE_hadiya": {
    "lat": 7.564,
    "lng": 37.731,
    "name": "Hadiya",
    "regionId": 9
  },
  "hadiya": {
    "lat": 7.564,
    "lng": 37.731,
    "name": "Hadiya",
    "regionId": 9
  },
  "ZONE_kembata": {
    "lat": 7.294,
    "lng": 37.83,
    "name": "Kembata",
    "regionId": 9
  },
  "kembata": {
    "lat": 7.294,
    "lng": 37.83,
    "name": "Kembata",
    "regionId": 9
  },
  "ZONE_east_guraghe": {
    "lat": 8.167,
    "lng": 38.368,
    "name": "East Guraghe",
    "regionId": 9
  },
  "east guraghe": {
    "lat": 8.167,
    "lng": 38.368,
    "name": "East Guraghe",
    "regionId": 9
  },
  "ZONE_halaba": {
    "lat": 7.367,
    "lng": 38.198,
    "name": "Halaba",
    "regionId": 9
  },
  "halaba": {
    "lat": 7.367,
    "lng": 38.198,
    "name": "Halaba",
    "regionId": 9
  },
  "ZONE_siltie": {
    "lat": 7.808,
    "lng": 38.226,
    "name": "Siltie",
    "regionId": 9
  },
  "siltie": {
    "lat": 7.808,
    "lng": 38.226,
    "name": "Siltie",
    "regionId": 9
  },
  "ZONE_yem": {
    "lat": 7.813,
    "lng": 37.488,
    "name": "Yem",
    "regionId": 9
  },
  "yem": {
    "lat": 7.813,
    "lng": 37.488,
    "name": "Yem",
    "regionId": 9
  },
  "ZONE_mareko_special": {
    "lat": 7.995,
    "lng": 38.532,
    "name": "Mareko Special",
    "regionId": 9
  },
  "mareko special": {
    "lat": 7.995,
    "lng": 38.532,
    "name": "Mareko Special",
    "regionId": 9
  },
  "ZONE_tembaro_special": {
    "lat": 7.269,
    "lng": 37.487,
    "name": "Tembaro Special",
    "regionId": 9
  },
  "tembaro special": {
    "lat": 7.269,
    "lng": 37.487,
    "name": "Tembaro Special",
    "regionId": 9
  },
  "ZONE_wolayita": {
    "lat": 6.863,
    "lng": 37.724,
    "name": "Wolayita",
    "regionId": 14
  },
  "wolayita": {
    "lat": 6.863,
    "lng": 37.724,
    "name": "Wolayita",
    "regionId": 14
  },
  "ZONE_gamo": {
    "lat": 6.189,
    "lng": 37.429,
    "name": "Gamo",
    "regionId": 14
  },
  "gamo": {
    "lat": 6.189,
    "lng": 37.429,
    "name": "Gamo",
    "regionId": 14
  },
  "ZONE_gofa": {
    "lat": 6.368,
    "lng": 36.858,
    "name": "Gofa",
    "regionId": 14
  },
  "gofa": {
    "lat": 6.368,
    "lng": 36.858,
    "name": "Gofa",
    "regionId": 14
  },
  "ZONE_basketo": {
    "lat": 6.282,
    "lng": 36.56,
    "name": "Basketo",
    "regionId": 14
  },
  "basketo": {
    "lat": 6.282,
    "lng": 36.56,
    "name": "Basketo",
    "regionId": 14
  },
  "ZONE_ari": {
    "lat": 5.932,
    "lng": 36.527,
    "name": "Ari",
    "regionId": 14
  },
  "ari": {
    "lat": 5.932,
    "lng": 36.527,
    "name": "Ari",
    "regionId": 14
  },
  "ZONE_alle_special": {
    "lat": 5.568,
    "lng": 37.162,
    "name": "Alle Special",
    "regionId": 14
  },
  "alle special": {
    "lat": 5.568,
    "lng": 37.162,
    "name": "Alle Special",
    "regionId": 14
  },
  "ZONE_derashe": {
    "lat": 5.653,
    "lng": 37.377,
    "name": "Derashe",
    "regionId": 14
  },
  "derashe": {
    "lat": 5.653,
    "lng": 37.377,
    "name": "Derashe",
    "regionId": 14
  },
  "ZONE_kore": {
    "lat": 5.788,
    "lng": 37.815,
    "name": "Kore",
    "regionId": 14
  },
  "kore": {
    "lat": 5.788,
    "lng": 37.815,
    "name": "Kore",
    "regionId": 14
  },
  "ZONE_konso": {
    "lat": 5.355,
    "lng": 37.369,
    "name": "Konso",
    "regionId": 14
  },
  "konso": {
    "lat": 5.355,
    "lng": 37.369,
    "name": "Konso",
    "regionId": 14
  },
  "ZONE_burji": {
    "lat": 5.482,
    "lng": 37.777,
    "name": "Burji",
    "regionId": 14
  },
  "burji": {
    "lat": 5.482,
    "lng": 37.777,
    "name": "Burji",
    "regionId": 14
  },
  "ZONE_gedeo": {
    "lat": 6.144,
    "lng": 38.272,
    "name": "Gedeo",
    "regionId": 14
  },
  "gedeo": {
    "lat": 6.144,
    "lng": 38.272,
    "name": "Gedeo",
    "regionId": 14
  },
  "ZONE_south_omo": {
    "lat": 5.049,
    "lng": 36.413,
    "name": "South Omo",
    "regionId": 14
  },
  "south omo": {
    "lat": 5.049,
    "lng": 36.413,
    "name": "South Omo",
    "regionId": 14
  },
  "ZONE_sheka": {
    "lat": 7.538,
    "lng": 35.413,
    "name": "Sheka",
    "regionId": 13
  },
  "sheka": {
    "lat": 7.538,
    "lng": 35.413,
    "name": "Sheka",
    "regionId": 13
  },
  "ZONE_kefa": {
    "lat": 7.228,
    "lng": 36.078,
    "name": "Kefa",
    "regionId": 13
  },
  "kefa": {
    "lat": 7.228,
    "lng": 36.078,
    "name": "Kefa",
    "regionId": 13
  },
  "ZONE_bench_sheko": {
    "lat": 6.928,
    "lng": 35.363,
    "name": "Bench Sheko",
    "regionId": 13
  },
  "bench sheko": {
    "lat": 6.928,
    "lng": 35.363,
    "name": "Bench Sheko",
    "regionId": 13
  },
  "ZONE_dawuro": {
    "lat": 6.971,
    "lng": 37.1,
    "name": "Dawuro",
    "regionId": 13
  },
  "dawuro": {
    "lat": 6.971,
    "lng": 37.1,
    "name": "Dawuro",
    "regionId": 13
  },
  "ZONE_west_omo": {
    "lat": 6.146,
    "lng": 35.554,
    "name": "West Omo",
    "regionId": 13
  },
  "west omo": {
    "lat": 6.146,
    "lng": 35.554,
    "name": "West Omo",
    "regionId": 13
  },
  "ZONE_konta": {
    "lat": 6.871,
    "lng": 36.609,
    "name": "Konta",
    "regionId": 13
  },
  "konta": {
    "lat": 6.871,
    "lng": 36.609,
    "name": "Konta",
    "regionId": 13
  },
  "ZONE_nuwer": {
    "lat": 8.112,
    "lng": 33.263,
    "name": "Nuwer",
    "regionId": 10
  },
  "nuwer": {
    "lat": 8.112,
    "lng": 33.263,
    "name": "Nuwer",
    "regionId": 10
  },
  "ZONE_agnewak": {
    "lat": 7.548,
    "lng": 34.455,
    "name": "Agnewak",
    "regionId": 10
  },
  "agnewak": {
    "lat": 7.548,
    "lng": 34.455,
    "name": "Agnewak",
    "regionId": 10
  },
  "ZONE_majang": {
    "lat": 7.29,
    "lng": 35.128,
    "name": "Majang",
    "regionId": 10
  },
  "majang": {
    "lat": 7.29,
    "lng": 35.128,
    "name": "Majang",
    "regionId": 10
  },
  "ZONE_itang_special": {
    "lat": 8.346,
    "lng": 34.22,
    "name": "Itang Special",
    "regionId": 10
  },
  "itang special": {
    "lat": 8.346,
    "lng": 34.22,
    "name": "Itang Special",
    "regionId": 10
  },
  "ZONE_harari": {
    "lat": 9.29,
    "lng": 42.173,
    "name": "Harari",
    "regionId": 11
  },
  "harari": {
    "lat": 9.29,
    "lng": 42.173,
    "name": "Harari",
    "regionId": 11
  },
  "ZONE_region_14": {
    "lat": 8.98,
    "lng": 38.786,
    "name": "Region 14",
    "regionId": 1
  },
  "region 14": {
    "lat": 8.98,
    "lng": 38.786,
    "name": "Region 14",
    "regionId": 1
  },
  "ZONE_dire_dawa_urban": {
    "lat": 9.624,
    "lng": 41.836,
    "name": "Dire Dawa urban",
    "regionId": 2
  },
  "dire dawa urban": {
    "lat": 9.624,
    "lng": 41.836,
    "name": "Dire Dawa urban",
    "regionId": 2
  },
  "ZONE_dire_dawa_rural": {
    "lat": 9.562,
    "lng": 42.034,
    "name": "Dire Dawa rural",
    "regionId": 2
  },
  "dire dawa rural": {
    "lat": 9.562,
    "lng": 42.034,
    "name": "Dire Dawa rural",
    "regionId": 2
  },
  "ZONE_hawassa_town_admin": {
    "lat": 7.017,
    "lng": 38.491,
    "name": "Hawassa town Admin",
    "regionId": 12
  },
  "hawassa town admin": {
    "lat": 7.017,
    "lng": 38.491,
    "name": "Hawassa town Admin",
    "regionId": 12
  },
  "ZONE_northern": {
    "lat": 6.979,
    "lng": 38.26,
    "name": "Northern",
    "regionId": 12
  },
  "northern": {
    "lat": 6.979,
    "lng": 38.26,
    "name": "Northern",
    "regionId": 12
  },
  "ZONE_area_1": {
    "lat": 13.829,
    "lng": 37.098,
    "name": "Area 1",
    "regionId": 15
  },
  "area 1": {
    "lat": 13.829,
    "lng": 37.098,
    "name": "Area 1",
    "regionId": 15
  },
  "ZONE_area_2": {
    "lat": 13.637,
    "lng": 38.145,
    "name": "Area 2",
    "regionId": 15
  },
  "area 2": {
    "lat": 13.637,
    "lng": 38.145,
    "name": "Area 2",
    "regionId": 15
  },
  "ZONE_area_3": {
    "lat": 12.488,
    "lng": 39.527,
    "name": "Area 3",
    "regionId": 15
  },
  "area 3": {
    "lat": 12.488,
    "lng": 39.527,
    "name": "Area 3",
    "regionId": 15
  }
};

export const WOREDA_COORDINATES: Record<string, GeoLocation> = {
  "WOREDA_north_western_tahtay_adiyabo": {
    "lat": 14.307,
    "lng": 37.684,
    "name": "Tahtay Adiyabo",
    "zoneId": "ZONE_north_western"
  },
  "tahtay adiyabo": {
    "lat": 14.307,
    "lng": 37.684,
    "name": "Tahtay Adiyabo",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_zana": {
    "lat": 13.869,
    "lng": 38.438,
    "name": "Zana",
    "zoneId": "ZONE_north_western"
  },
  "zana": {
    "lat": 13.869,
    "lng": 38.438,
    "name": "Zana",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_tahtay_koraro": {
    "lat": 14.085,
    "lng": 38.314,
    "name": "Tahtay Koraro",
    "zoneId": "ZONE_north_western"
  },
  "tahtay koraro": {
    "lat": 14.085,
    "lng": 38.314,
    "name": "Tahtay Koraro",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_asgede": {
    "lat": 14.043,
    "lng": 37.908,
    "name": "Asgede",
    "zoneId": "ZONE_north_western"
  },
  "asgede": {
    "lat": 14.043,
    "lng": 37.908,
    "name": "Asgede",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_sheraro_town": {
    "lat": 14.408,
    "lng": 37.784,
    "name": "Sheraro town",
    "zoneId": "ZONE_north_western"
  },
  "sheraro town": {
    "lat": 14.408,
    "lng": 37.784,
    "name": "Sheraro town",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_shire_endaslasie_town": {
    "lat": 14.103,
    "lng": 38.286,
    "name": "Shire Endaslasie town",
    "zoneId": "ZONE_north_western"
  },
  "shire endaslasie town": {
    "lat": 14.103,
    "lng": 38.286,
    "name": "Shire Endaslasie town",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_laelay_koraro": {
    "lat": 14.16,
    "lng": 38.451,
    "name": "Laelay Koraro",
    "zoneId": "ZONE_north_western"
  },
  "laelay koraro": {
    "lat": 14.16,
    "lng": 38.451,
    "name": "Laelay Koraro",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_seyemti_adyabo": {
    "lat": 14.493,
    "lng": 38.224,
    "name": "Seyemti Adyabo",
    "zoneId": "ZONE_north_western"
  },
  "seyemti adyabo": {
    "lat": 14.493,
    "lng": 38.224,
    "name": "Seyemti Adyabo",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_adi_daero": {
    "lat": 14.275,
    "lng": 38.154,
    "name": "Adi Daero",
    "zoneId": "ZONE_north_western"
  },
  "adi daero": {
    "lat": 14.275,
    "lng": 38.154,
    "name": "Adi Daero",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_maekel_adiyabo": {
    "lat": 14.531,
    "lng": 38.026,
    "name": "Maekel Adiyabo",
    "zoneId": "ZONE_north_western"
  },
  "maekel adiyabo": {
    "lat": 14.531,
    "lng": 38.026,
    "name": "Maekel Adiyabo",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_tsimbla": {
    "lat": 13.861,
    "lng": 38.111,
    "name": "Tsimbla",
    "zoneId": "ZONE_north_western"
  },
  "tsimbla": {
    "lat": 13.861,
    "lng": 38.111,
    "name": "Tsimbla",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_north_western_endabaguna_town": {
    "lat": 13.944,
    "lng": 38.18,
    "name": "Endabaguna town",
    "zoneId": "ZONE_north_western"
  },
  "endabaguna town": {
    "lat": 13.944,
    "lng": 38.18,
    "name": "Endabaguna town",
    "zoneId": "ZONE_north_western"
  },
  "WOREDA_central_chila": {
    "lat": 14.31,
    "lng": 38.574,
    "name": "Chila",
    "zoneId": "ZONE_central"
  },
  "chila": {
    "lat": 14.31,
    "lng": 38.574,
    "name": "Chila",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_aheferom": {
    "lat": 14.321,
    "lng": 39.078,
    "name": "Aheferom",
    "zoneId": "ZONE_central"
  },
  "aheferom": {
    "lat": 14.321,
    "lng": 39.078,
    "name": "Aheferom",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_endaba_tsahma": {
    "lat": 13.991,
    "lng": 39.117,
    "name": "Endaba Tsahma",
    "zoneId": "ZONE_central"
  },
  "endaba tsahma": {
    "lat": 13.991,
    "lng": 39.117,
    "name": "Endaba Tsahma",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_adwa": {
    "lat": 14.175,
    "lng": 39.001,
    "name": "Adwa",
    "zoneId": "ZONE_central"
  },
  "adwa": {
    "lat": 14.175,
    "lng": 39.001,
    "name": "Adwa",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_laelay_maychew": {
    "lat": 14.156,
    "lng": 38.764,
    "name": "Laelay Maychew",
    "zoneId": "ZONE_central"
  },
  "laelay maychew": {
    "lat": 14.156,
    "lng": 38.764,
    "name": "Laelay Maychew",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_tahtay_maychew": {
    "lat": 14.074,
    "lng": 38.57,
    "name": "Tahtay Maychew",
    "zoneId": "ZONE_central"
  },
  "tahtay maychew": {
    "lat": 14.074,
    "lng": 38.57,
    "name": "Tahtay Maychew",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_adet": {
    "lat": 13.832,
    "lng": 38.62,
    "name": "Adet",
    "zoneId": "ZONE_central"
  },
  "adet": {
    "lat": 13.832,
    "lng": 38.62,
    "name": "Adet",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_kola_tembien": {
    "lat": 13.641,
    "lng": 38.774,
    "name": "Kola Tembien",
    "zoneId": "ZONE_central"
  },
  "kola tembien": {
    "lat": 13.641,
    "lng": 38.774,
    "name": "Kola Tembien",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_naeder": {
    "lat": 13.916,
    "lng": 38.793,
    "name": "Naeder",
    "zoneId": "ZONE_central"
  },
  "naeder": {
    "lat": 13.916,
    "lng": 38.793,
    "name": "Naeder",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_abergele_tg": {
    "lat": 13.364,
    "lng": 38.886,
    "name": "Abergele (TG)",
    "zoneId": "ZONE_central"
  },
  "abergele (tg)": {
    "lat": 13.364,
    "lng": 38.886,
    "name": "Abergele (TG)",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_abiy_adi_town": {
    "lat": 13.633,
    "lng": 38.993,
    "name": "Abiy Adi town",
    "zoneId": "ZONE_central"
  },
  "abiy adi town": {
    "lat": 13.633,
    "lng": 38.993,
    "name": "Abiy Adi town",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_adwa_town": {
    "lat": 14.167,
    "lng": 38.884,
    "name": "Adwa town",
    "zoneId": "ZONE_central"
  },
  "adwa town": {
    "lat": 14.167,
    "lng": 38.884,
    "name": "Adwa town",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_axum_town": {
    "lat": 14.122,
    "lng": 38.727,
    "name": "Axum town",
    "zoneId": "ZONE_central"
  },
  "axum town": {
    "lat": 14.122,
    "lng": 38.727,
    "name": "Axum town",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_rama_adi_arbaete": {
    "lat": 14.374,
    "lng": 38.766,
    "name": "Rama Adi Arbaete",
    "zoneId": "ZONE_central"
  },
  "rama adi arbaete": {
    "lat": 14.374,
    "lng": 38.766,
    "name": "Rama Adi Arbaete",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_ahsea": {
    "lat": 14.401,
    "lng": 38.94,
    "name": "Ahsea",
    "zoneId": "ZONE_central"
  },
  "ahsea": {
    "lat": 14.401,
    "lng": 38.94,
    "name": "Ahsea",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_egela": {
    "lat": 14.502,
    "lng": 39.111,
    "name": "Egela",
    "zoneId": "ZONE_central"
  },
  "egela": {
    "lat": 14.502,
    "lng": 39.111,
    "name": "Egela",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_hahayle": {
    "lat": 14.167,
    "lng": 39.118,
    "name": "Hahayle",
    "zoneId": "ZONE_central"
  },
  "hahayle": {
    "lat": 14.167,
    "lng": 39.118,
    "name": "Hahayle",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_endafelasi": {
    "lat": 13.919,
    "lng": 38.961,
    "name": "Endafelasi",
    "zoneId": "ZONE_central"
  },
  "endafelasi": {
    "lat": 13.919,
    "lng": 38.961,
    "name": "Endafelasi",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_emba_sieneti": {
    "lat": 14.052,
    "lng": 39.254,
    "name": "Emba Sieneti",
    "zoneId": "ZONE_central"
  },
  "emba sieneti": {
    "lat": 14.052,
    "lng": 39.254,
    "name": "Emba Sieneti",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_enticho_town": {
    "lat": 14.278,
    "lng": 39.149,
    "name": "Enticho town",
    "zoneId": "ZONE_central"
  },
  "enticho town": {
    "lat": 14.278,
    "lng": 39.149,
    "name": "Enticho town",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_keyhe_tekli": {
    "lat": 13.76,
    "lng": 39.035,
    "name": "Keyhe tekli",
    "zoneId": "ZONE_central"
  },
  "keyhe tekli": {
    "lat": 13.76,
    "lng": 39.035,
    "name": "Keyhe tekli",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_tanqua_melashe": {
    "lat": 13.536,
    "lng": 39.01,
    "name": "Tanqua Melashe",
    "zoneId": "ZONE_central"
  },
  "tanqua melashe": {
    "lat": 13.536,
    "lng": 39.01,
    "name": "Tanqua Melashe",
    "zoneId": "ZONE_central"
  },
  "WOREDA_eastern_gulo_mekeda": {
    "lat": 14.414,
    "lng": 39.4,
    "name": "Gulo Mekeda",
    "zoneId": "ZONE_eastern"
  },
  "gulo mekeda": {
    "lat": 14.414,
    "lng": 39.4,
    "name": "Gulo Mekeda",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_erob": {
    "lat": 14.491,
    "lng": 39.677,
    "name": "Erob",
    "zoneId": "ZONE_eastern"
  },
  "erob": {
    "lat": 14.491,
    "lng": 39.677,
    "name": "Erob",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_sebuha_saesie": {
    "lat": 14.266,
    "lng": 39.628,
    "name": "Sebuha Saesie",
    "zoneId": "ZONE_eastern"
  },
  "sebuha saesie": {
    "lat": 14.266,
    "lng": 39.628,
    "name": "Sebuha Saesie",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_ganta_afeshum": {
    "lat": 14.231,
    "lng": 39.423,
    "name": "Ganta Afeshum",
    "zoneId": "ZONE_eastern"
  },
  "ganta afeshum": {
    "lat": 14.231,
    "lng": 39.423,
    "name": "Ganta Afeshum",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_hawzen": {
    "lat": 14.001,
    "lng": 39.372,
    "name": "Hawzen",
    "zoneId": "ZONE_eastern"
  },
  "hawzen": {
    "lat": 14.001,
    "lng": 39.372,
    "name": "Hawzen",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_kilte_awulaelo": {
    "lat": 13.837,
    "lng": 39.532,
    "name": "Kilte Awulaelo",
    "zoneId": "ZONE_eastern"
  },
  "kilte awulaelo": {
    "lat": 13.837,
    "lng": 39.532,
    "name": "Kilte Awulaelo",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_atsbi": {
    "lat": 13.921,
    "lng": 39.749,
    "name": "Atsbi",
    "zoneId": "ZONE_eastern"
  },
  "atsbi": {
    "lat": 13.921,
    "lng": 39.749,
    "name": "Atsbi",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_adigrat_town": {
    "lat": 14.275,
    "lng": 39.466,
    "name": "Adigrat town",
    "zoneId": "ZONE_eastern"
  },
  "adigrat town": {
    "lat": 14.275,
    "lng": 39.466,
    "name": "Adigrat town",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_wukro_town": {
    "lat": 13.781,
    "lng": 39.591,
    "name": "Wukro town",
    "zoneId": "ZONE_eastern"
  },
  "wukro town": {
    "lat": 13.781,
    "lng": 39.591,
    "name": "Wukro town",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_bizet": {
    "lat": 14.269,
    "lng": 39.29,
    "name": "Bizet",
    "zoneId": "ZONE_eastern"
  },
  "bizet": {
    "lat": 14.269,
    "lng": 39.29,
    "name": "Bizet",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_edaga_hamus_town": {
    "lat": 14.186,
    "lng": 39.562,
    "name": "Edaga Hamus town",
    "zoneId": "ZONE_eastern"
  },
  "edaga hamus town": {
    "lat": 14.186,
    "lng": 39.562,
    "name": "Edaga Hamus town",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_hawzen_town": {
    "lat": 13.974,
    "lng": 39.43,
    "name": "Hawzen town",
    "zoneId": "ZONE_eastern"
  },
  "hawzen town": {
    "lat": 13.974,
    "lng": 39.43,
    "name": "Hawzen town",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_freweyni_town": {
    "lat": 14.054,
    "lng": 39.576,
    "name": "Freweyni town",
    "zoneId": "ZONE_eastern"
  },
  "freweyni town": {
    "lat": 14.054,
    "lng": 39.576,
    "name": "Freweyni town",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_tsaeda_emba": {
    "lat": 14.067,
    "lng": 39.646,
    "name": "Tsaeda Emba",
    "zoneId": "ZONE_eastern"
  },
  "tsaeda emba": {
    "lat": 14.067,
    "lng": 39.646,
    "name": "Tsaeda Emba",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_atsbi_town": {
    "lat": 13.868,
    "lng": 39.737,
    "name": "Atsbi town",
    "zoneId": "ZONE_eastern"
  },
  "atsbi town": {
    "lat": 13.868,
    "lng": 39.737,
    "name": "Atsbi town",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_agulae": {
    "lat": 13.677,
    "lng": 39.677,
    "name": "Agulae",
    "zoneId": "ZONE_eastern"
  },
  "agulae": {
    "lat": 13.677,
    "lng": 39.677,
    "name": "Agulae",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_geraleta": {
    "lat": 13.766,
    "lng": 39.304,
    "name": "Geraleta",
    "zoneId": "ZONE_eastern"
  },
  "geraleta": {
    "lat": 13.766,
    "lng": 39.304,
    "name": "Geraleta",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_zala_anbesa_town": {
    "lat": 14.525,
    "lng": 39.387,
    "name": "Zala Anbesa town",
    "zoneId": "ZONE_eastern"
  },
  "zala anbesa town": {
    "lat": 14.525,
    "lng": 39.387,
    "name": "Zala Anbesa town",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_southern_selewa": {
    "lat": 13.002,
    "lng": 39.332,
    "name": "Selewa",
    "zoneId": "ZONE_southern"
  },
  "selewa": {
    "lat": 13.002,
    "lng": 39.332,
    "name": "Selewa",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_bora_tg": {
    "lat": 12.883,
    "lng": 39.341,
    "name": "Bora (TG)",
    "zoneId": "ZONE_southern"
  },
  "bora (tg)": {
    "lat": 12.883,
    "lng": 39.341,
    "name": "Bora (TG)",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_neqsege": {
    "lat": 12.751,
    "lng": 39.346,
    "name": "Neqsege",
    "zoneId": "ZONE_southern"
  },
  "neqsege": {
    "lat": 12.751,
    "lng": 39.346,
    "name": "Neqsege",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_emba_alaje": {
    "lat": 12.934,
    "lng": 39.505,
    "name": "Emba Alaje",
    "zoneId": "ZONE_southern"
  },
  "emba alaje": {
    "lat": 12.934,
    "lng": 39.505,
    "name": "Emba Alaje",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_endamehoni": {
    "lat": 12.757,
    "lng": 39.491,
    "name": "Endamehoni",
    "zoneId": "ZONE_southern"
  },
  "endamehoni": {
    "lat": 12.757,
    "lng": 39.491,
    "name": "Endamehoni",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_raya_azebo": {
    "lat": 12.78,
    "lng": 39.738,
    "name": "Raya Azebo",
    "zoneId": "ZONE_southern"
  },
  "raya azebo": {
    "lat": 12.78,
    "lng": 39.738,
    "name": "Raya Azebo",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_maichew_town": {
    "lat": 12.785,
    "lng": 39.542,
    "name": "Maichew town",
    "zoneId": "ZONE_southern"
  },
  "maichew town": {
    "lat": 12.785,
    "lng": 39.542,
    "name": "Maichew town",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_mekhoni_town": {
    "lat": 12.796,
    "lng": 39.643,
    "name": "Mekhoni town",
    "zoneId": "ZONE_southern"
  },
  "mekhoni town": {
    "lat": 12.796,
    "lng": 39.643,
    "name": "Mekhoni town",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_south_eastern_saharti": {
    "lat": 13.378,
    "lng": 39.169,
    "name": "Saharti",
    "zoneId": "ZONE_south_eastern"
  },
  "saharti": {
    "lat": 13.378,
    "lng": 39.169,
    "name": "Saharti",
    "zoneId": "ZONE_south_eastern"
  },
  "WOREDA_south_eastern_enderta": {
    "lat": 13.493,
    "lng": 39.356,
    "name": "Enderta",
    "zoneId": "ZONE_south_eastern"
  },
  "enderta": {
    "lat": 13.493,
    "lng": 39.356,
    "name": "Enderta",
    "zoneId": "ZONE_south_eastern"
  },
  "WOREDA_south_eastern_hintalo": {
    "lat": 13.181,
    "lng": 39.422,
    "name": "Hintalo",
    "zoneId": "ZONE_south_eastern"
  },
  "hintalo": {
    "lat": 13.181,
    "lng": 39.422,
    "name": "Hintalo",
    "zoneId": "ZONE_south_eastern"
  },
  "WOREDA_south_eastern_degua_temben": {
    "lat": 13.519,
    "lng": 39.156,
    "name": "Degua Temben",
    "zoneId": "ZONE_south_eastern"
  },
  "degua temben": {
    "lat": 13.519,
    "lng": 39.156,
    "name": "Degua Temben",
    "zoneId": "ZONE_south_eastern"
  },
  "WOREDA_south_eastern_hagere_selam_town": {
    "lat": 13.64,
    "lng": 39.17,
    "name": "Hagere Selam town",
    "zoneId": "ZONE_south_eastern"
  },
  "hagere selam town": {
    "lat": 13.64,
    "lng": 39.17,
    "name": "Hagere Selam town",
    "zoneId": "ZONE_south_eastern"
  },
  "WOREDA_south_eastern_samre": {
    "lat": 13.114,
    "lng": 39.174,
    "name": "Samre",
    "zoneId": "ZONE_south_eastern"
  },
  "samre": {
    "lat": 13.114,
    "lng": 39.174,
    "name": "Samre",
    "zoneId": "ZONE_south_eastern"
  },
  "WOREDA_south_eastern_adigudom": {
    "lat": 13.244,
    "lng": 39.503,
    "name": "Adigudom",
    "zoneId": "ZONE_south_eastern"
  },
  "adigudom": {
    "lat": 13.244,
    "lng": 39.503,
    "name": "Adigudom",
    "zoneId": "ZONE_south_eastern"
  },
  "WOREDA_south_eastern_wajirat": {
    "lat": 13.047,
    "lng": 39.713,
    "name": "Wajirat",
    "zoneId": "ZONE_south_eastern"
  },
  "wajirat": {
    "lat": 13.047,
    "lng": 39.713,
    "name": "Wajirat",
    "zoneId": "ZONE_south_eastern"
  },
  "WOREDA_mekelle_kuiha_sub_city": {
    "lat": 13.45,
    "lng": 39.553,
    "name": "Kuiha Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "kuiha sub city": {
    "lat": 13.45,
    "lng": 39.553,
    "name": "Kuiha Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "WOREDA_mekelle_hadnet_sub_city": {
    "lat": 13.449,
    "lng": 39.44,
    "name": "Hadnet Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "hadnet sub city": {
    "lat": 13.449,
    "lng": 39.44,
    "name": "Hadnet Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "WOREDA_mekelle_ayder_sub_city": {
    "lat": 13.551,
    "lng": 39.467,
    "name": "Ayder Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "ayder sub city": {
    "lat": 13.551,
    "lng": 39.467,
    "name": "Ayder Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "WOREDA_mekelle_hawelti_sub_city": {
    "lat": 13.504,
    "lng": 39.445,
    "name": "Hawelti Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "hawelti sub city": {
    "lat": 13.504,
    "lng": 39.445,
    "name": "Hawelti Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "WOREDA_mekelle_adihaki_sub_city": {
    "lat": 13.479,
    "lng": 39.451,
    "name": "Adihaki Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "adihaki sub city": {
    "lat": 13.479,
    "lng": 39.451,
    "name": "Adihaki Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "WOREDA_mekelle_qedamay_weyane_sub_city": {
    "lat": 13.486,
    "lng": 39.481,
    "name": "Qedamay Weyane Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "qedamay weyane sub city": {
    "lat": 13.486,
    "lng": 39.481,
    "name": "Qedamay Weyane Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "WOREDA_mekelle_semen_sub_city": {
    "lat": 13.531,
    "lng": 39.512,
    "name": "Semen Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "semen sub city": {
    "lat": 13.531,
    "lng": 39.512,
    "name": "Semen Sub City",
    "zoneId": "ZONE_mekelle"
  },
  "WOREDA_awsi_zone_1_dubti": {
    "lat": 11.782,
    "lng": 41.151,
    "name": "Dubti",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "dubti": {
    "lat": 11.782,
    "lng": 41.151,
    "name": "Dubti",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_elidar": {
    "lat": 12.286,
    "lng": 41.742,
    "name": "Elidar",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "elidar": {
    "lat": 12.286,
    "lng": 41.742,
    "name": "Elidar",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_asayita": {
    "lat": 11.709,
    "lng": 41.35,
    "name": "Asayita",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "asayita": {
    "lat": 11.709,
    "lng": 41.35,
    "name": "Asayita",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_afambo": {
    "lat": 11.258,
    "lng": 41.655,
    "name": "Afambo",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "afambo": {
    "lat": 11.258,
    "lng": 41.655,
    "name": "Afambo",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_mile": {
    "lat": 11.521,
    "lng": 40.699,
    "name": "Mile",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "mile": {
    "lat": 11.521,
    "lng": 40.699,
    "name": "Mile",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_chifra": {
    "lat": 11.585,
    "lng": 40.227,
    "name": "Chifra",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "chifra": {
    "lat": 11.585,
    "lng": 40.227,
    "name": "Chifra",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_dubti_town": {
    "lat": 11.748,
    "lng": 41.08,
    "name": "Dubti town",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "dubti town": {
    "lat": 11.748,
    "lng": 41.08,
    "name": "Dubti town",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_kori": {
    "lat": 12.442,
    "lng": 40.98,
    "name": "Kori",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "kori": {
    "lat": 12.442,
    "lng": 40.98,
    "name": "Kori",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_adar": {
    "lat": 11.273,
    "lng": 40.437,
    "name": "Adar",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "adar": {
    "lat": 11.273,
    "lng": 40.437,
    "name": "Adar",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_asayita_town": {
    "lat": 11.612,
    "lng": 41.416,
    "name": "Asayita town",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "asayita town": {
    "lat": 11.612,
    "lng": 41.416,
    "name": "Asayita town",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_mile_town": {
    "lat": 11.422,
    "lng": 40.763,
    "name": "Mile town",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "mile town": {
    "lat": 11.422,
    "lng": 40.763,
    "name": "Mile town",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_chifra_town": {
    "lat": 11.607,
    "lng": 40.016,
    "name": "Chifra town",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "chifra town": {
    "lat": 11.607,
    "lng": 40.016,
    "name": "Chifra town",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_awsi_zone_1_samera_logiya_town": {
    "lat": 11.756,
    "lng": 40.975,
    "name": "Samera Logiya town",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "samera logiya town": {
    "lat": 11.756,
    "lng": 40.975,
    "name": "Samera Logiya town",
    "zoneId": "ZONE_awsi_zone_1"
  },
  "WOREDA_kilbati_zone_2_erebti": {
    "lat": 13.141,
    "lng": 40.149,
    "name": "Erebti",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "erebti": {
    "lat": 13.141,
    "lng": 40.149,
    "name": "Erebti",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "WOREDA_kilbati_zone_2_kunneba": {
    "lat": 14.053,
    "lng": 39.953,
    "name": "Kunneba",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "kunneba": {
    "lat": 14.053,
    "lng": 39.953,
    "name": "Kunneba",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "WOREDA_kilbati_zone_2_abaala": {
    "lat": 13.224,
    "lng": 39.89,
    "name": "Abaala",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "abaala": {
    "lat": 13.224,
    "lng": 39.89,
    "name": "Abaala",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "WOREDA_kilbati_zone_2_megale": {
    "lat": 12.682,
    "lng": 39.965,
    "name": "Megale",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "megale": {
    "lat": 12.682,
    "lng": 39.965,
    "name": "Megale",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "WOREDA_kilbati_zone_2_berahile": {
    "lat": 13.961,
    "lng": 40.181,
    "name": "Berahile",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "berahile": {
    "lat": 13.961,
    "lng": 40.181,
    "name": "Berahile",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "WOREDA_kilbati_zone_2_dalol": {
    "lat": 14.309,
    "lng": 40.139,
    "name": "Dalol",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "dalol": {
    "lat": 14.309,
    "lng": 40.139,
    "name": "Dalol",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "WOREDA_kilbati_zone_2_afdera": {
    "lat": 13.547,
    "lng": 40.716,
    "name": "Afdera",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "afdera": {
    "lat": 13.547,
    "lng": 40.716,
    "name": "Afdera",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "WOREDA_kilbati_zone_2_bidu": {
    "lat": 13.003,
    "lng": 41.38,
    "name": "Bidu",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "bidu": {
    "lat": 13.003,
    "lng": 41.38,
    "name": "Bidu",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "WOREDA_kilbati_zone_2_abaala_town": {
    "lat": 13.36,
    "lng": 39.791,
    "name": "Abaala town",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "abaala town": {
    "lat": 13.36,
    "lng": 39.791,
    "name": "Abaala town",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "WOREDA_kilbati_zone_2_wasama": {
    "lat": 13.5,
    "lng": 39.863,
    "name": "Wasama",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "wasama": {
    "lat": 13.5,
    "lng": 39.863,
    "name": "Wasama",
    "zoneId": "ZONE_kilbati_zone_2"
  },
  "WOREDA_gabi_zone_3_amibara": {
    "lat": 9.237,
    "lng": 40.259,
    "name": "Amibara",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "amibara": {
    "lat": 9.237,
    "lng": 40.259,
    "name": "Amibara",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_gabi_zone_3_awash_fantale": {
    "lat": 9.103,
    "lng": 40.019,
    "name": "Awash Fantale",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "awash fantale": {
    "lat": 9.103,
    "lng": 40.019,
    "name": "Awash Fantale",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_gabi_zone_3_gewane": {
    "lat": 10.166,
    "lng": 40.63,
    "name": "Gewane",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "gewane": {
    "lat": 10.166,
    "lng": 40.63,
    "name": "Gewane",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_gabi_zone_3_dulecha": {
    "lat": 9.486,
    "lng": 40.059,
    "name": "Dulecha",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "dulecha": {
    "lat": 9.486,
    "lng": 40.059,
    "name": "Dulecha",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_gabi_zone_3_gala_alu": {
    "lat": 9.823,
    "lng": 40.635,
    "name": "Gala'alu",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "gala'alu": {
    "lat": 9.823,
    "lng": 40.635,
    "name": "Gala'alu",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_gabi_zone_3_arguba": {
    "lat": 9.455,
    "lng": 39.905,
    "name": "Arguba",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "arguba": {
    "lat": 9.455,
    "lng": 39.905,
    "name": "Arguba",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_gabi_zone_3_hanruka": {
    "lat": 9.557,
    "lng": 40.459,
    "name": "Hanruka",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "hanruka": {
    "lat": 9.557,
    "lng": 40.459,
    "name": "Hanruka",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_gabi_zone_3_abida": {
    "lat": 10.132,
    "lng": 40.816,
    "name": "Abida",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "abida": {
    "lat": 10.132,
    "lng": 40.816,
    "name": "Abida",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_gabi_zone_3_borimodaytu": {
    "lat": 10.126,
    "lng": 40.469,
    "name": "Borimodaytu",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "borimodaytu": {
    "lat": 10.126,
    "lng": 40.469,
    "name": "Borimodaytu",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_gabi_zone_3_werer": {
    "lat": 9.313,
    "lng": 40.203,
    "name": "Werer",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "werer": {
    "lat": 9.313,
    "lng": 40.203,
    "name": "Werer",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_gabi_zone_3_awash_town": {
    "lat": 8.994,
    "lng": 40.147,
    "name": "Awash town",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "awash town": {
    "lat": 8.994,
    "lng": 40.147,
    "name": "Awash town",
    "zoneId": "ZONE_gabi_zone_3"
  },
  "WOREDA_fanti_zone_4_awra_af": {
    "lat": 12.049,
    "lng": 40.316,
    "name": "Awra (AF)",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "awra (af)": {
    "lat": 12.049,
    "lng": 40.316,
    "name": "Awra (AF)",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "WOREDA_fanti_zone_4_euwa": {
    "lat": 11.834,
    "lng": 40.171,
    "name": "Euwa",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "euwa": {
    "lat": 11.834,
    "lng": 40.171,
    "name": "Euwa",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "WOREDA_fanti_zone_4_teru": {
    "lat": 12.48,
    "lng": 40.292,
    "name": "Teru",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "teru": {
    "lat": 12.48,
    "lng": 40.292,
    "name": "Teru",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "WOREDA_fanti_zone_4_yalo": {
    "lat": 12.424,
    "lng": 39.942,
    "name": "Yalo",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "yalo": {
    "lat": 12.424,
    "lng": 39.942,
    "name": "Yalo",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "WOREDA_fanti_zone_4_gulina": {
    "lat": 12.181,
    "lng": 39.982,
    "name": "Gulina",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "gulina": {
    "lat": 12.181,
    "lng": 39.982,
    "name": "Gulina",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "WOREDA_fanti_zone_4_mabay": {
    "lat": 12.673,
    "lng": 40.624,
    "name": "Mabay",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "mabay": {
    "lat": 12.673,
    "lng": 40.624,
    "name": "Mabay",
    "zoneId": "ZONE_fanti_zone_4"
  },
  "WOREDA_hari_zone_5_telalek": {
    "lat": 10.975,
    "lng": 40.315,
    "name": "Telalek",
    "zoneId": "ZONE_hari_zone_5"
  },
  "telalek": {
    "lat": 10.975,
    "lng": 40.315,
    "name": "Telalek",
    "zoneId": "ZONE_hari_zone_5"
  },
  "WOREDA_hari_zone_5_samurobi": {
    "lat": 9.874,
    "lng": 40.145,
    "name": "Samurobi",
    "zoneId": "ZONE_hari_zone_5"
  },
  "samurobi": {
    "lat": 9.874,
    "lng": 40.145,
    "name": "Samurobi",
    "zoneId": "ZONE_hari_zone_5"
  },
  "WOREDA_hari_zone_5_dawe": {
    "lat": 10.731,
    "lng": 40.206,
    "name": "Dawe",
    "zoneId": "ZONE_hari_zone_5"
  },
  "dawe": {
    "lat": 10.731,
    "lng": 40.206,
    "name": "Dawe",
    "zoneId": "ZONE_hari_zone_5"
  },
  "WOREDA_hari_zone_5_dalefage": {
    "lat": 10.476,
    "lng": 40.459,
    "name": "Dalefage",
    "zoneId": "ZONE_hari_zone_5"
  },
  "dalefage": {
    "lat": 10.476,
    "lng": 40.459,
    "name": "Dalefage",
    "zoneId": "ZONE_hari_zone_5"
  },
  "WOREDA_hari_zone_5_hadelela": {
    "lat": 10.273,
    "lng": 40.283,
    "name": "Hadelela",
    "zoneId": "ZONE_hari_zone_5"
  },
  "hadelela": {
    "lat": 10.273,
    "lng": 40.283,
    "name": "Hadelela",
    "zoneId": "ZONE_hari_zone_5"
  },
  "WOREDA_mahi_zone_6_gerani": {
    "lat": 11.209,
    "lng": 41.322,
    "name": "Gerani",
    "zoneId": "ZONE_mahi_zone_6"
  },
  "gerani": {
    "lat": 11.209,
    "lng": 41.322,
    "name": "Gerani",
    "zoneId": "ZONE_mahi_zone_6"
  },
  "WOREDA_mahi_zone_6_kilalu": {
    "lat": 11.009,
    "lng": 40.981,
    "name": "Kilalu",
    "zoneId": "ZONE_mahi_zone_6"
  },
  "kilalu": {
    "lat": 11.009,
    "lng": 40.981,
    "name": "Kilalu",
    "zoneId": "ZONE_mahi_zone_6"
  },
  "WOREDA_mahi_zone_6_yangudi": {
    "lat": 10.807,
    "lng": 40.684,
    "name": "Yangudi",
    "zoneId": "ZONE_mahi_zone_6"
  },
  "yangudi": {
    "lat": 10.807,
    "lng": 40.684,
    "name": "Yangudi",
    "zoneId": "ZONE_mahi_zone_6"
  },
  "WOREDA_mahi_zone_6_sibaybi": {
    "lat": 10.443,
    "lng": 40.835,
    "name": "Sibaybi",
    "zoneId": "ZONE_mahi_zone_6"
  },
  "sibaybi": {
    "lat": 10.443,
    "lng": 40.835,
    "name": "Sibaybi",
    "zoneId": "ZONE_mahi_zone_6"
  },
  "WOREDA_north_gondar_addi_arekay": {
    "lat": 13.377,
    "lng": 37.979,
    "name": "Addi Arekay",
    "zoneId": "ZONE_north_gondar"
  },
  "addi arekay": {
    "lat": 13.377,
    "lng": 37.979,
    "name": "Addi Arekay",
    "zoneId": "ZONE_north_gondar"
  },
  "WOREDA_north_gondar_beyeda": {
    "lat": 13.24,
    "lng": 38.458,
    "name": "Beyeda",
    "zoneId": "ZONE_north_gondar"
  },
  "beyeda": {
    "lat": 13.24,
    "lng": 38.458,
    "name": "Beyeda",
    "zoneId": "ZONE_north_gondar"
  },
  "WOREDA_north_gondar_janamora": {
    "lat": 13.04,
    "lng": 38.2,
    "name": "Janamora",
    "zoneId": "ZONE_north_gondar"
  },
  "janamora": {
    "lat": 13.04,
    "lng": 38.2,
    "name": "Janamora",
    "zoneId": "ZONE_north_gondar"
  },
  "WOREDA_north_gondar_debark": {
    "lat": 13.231,
    "lng": 37.804,
    "name": "Debark",
    "zoneId": "ZONE_north_gondar"
  },
  "debark": {
    "lat": 13.231,
    "lng": 37.804,
    "name": "Debark",
    "zoneId": "ZONE_north_gondar"
  },
  "WOREDA_north_gondar_dabat": {
    "lat": 13.024,
    "lng": 37.687,
    "name": "Dabat",
    "zoneId": "ZONE_north_gondar"
  },
  "dabat": {
    "lat": 13.024,
    "lng": 37.687,
    "name": "Dabat",
    "zoneId": "ZONE_north_gondar"
  },
  "WOREDA_north_gondar_dabat_town": {
    "lat": 12.981,
    "lng": 37.763,
    "name": "Dabat town",
    "zoneId": "ZONE_north_gondar"
  },
  "dabat town": {
    "lat": 12.981,
    "lng": 37.763,
    "name": "Dabat town",
    "zoneId": "ZONE_north_gondar"
  },
  "WOREDA_north_gondar_telemt": {
    "lat": 13.453,
    "lng": 38.413,
    "name": "Telemt",
    "zoneId": "ZONE_north_gondar"
  },
  "telemt": {
    "lat": 13.453,
    "lng": 38.413,
    "name": "Telemt",
    "zoneId": "ZONE_north_gondar"
  },
  "WOREDA_north_gondar_debark_town": {
    "lat": 13.15,
    "lng": 37.898,
    "name": "Debark town",
    "zoneId": "ZONE_north_gondar"
  },
  "debark town": {
    "lat": 13.15,
    "lng": 37.898,
    "name": "Debark town",
    "zoneId": "ZONE_north_gondar"
  },
  "WOREDA_south_gondar_ebenat": {
    "lat": 12.244,
    "lng": 38.189,
    "name": "Ebenat",
    "zoneId": "ZONE_south_gondar"
  },
  "ebenat": {
    "lat": 12.244,
    "lng": 38.189,
    "name": "Ebenat",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_libokemekem": {
    "lat": 12.068,
    "lng": 37.692,
    "name": "Libokemekem",
    "zoneId": "ZONE_south_gondar"
  },
  "libokemekem": {
    "lat": 12.068,
    "lng": 37.692,
    "name": "Libokemekem",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_fogera": {
    "lat": 11.851,
    "lng": 37.693,
    "name": "Fogera",
    "zoneId": "ZONE_south_gondar"
  },
  "fogera": {
    "lat": 11.851,
    "lng": 37.693,
    "name": "Fogera",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_farta": {
    "lat": 11.755,
    "lng": 38.029,
    "name": "Farta",
    "zoneId": "ZONE_south_gondar"
  },
  "farta": {
    "lat": 11.755,
    "lng": 38.029,
    "name": "Farta",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_lay_gayint": {
    "lat": 11.853,
    "lng": 38.435,
    "name": "Lay Gayint",
    "zoneId": "ZONE_south_gondar"
  },
  "lay gayint": {
    "lat": 11.853,
    "lng": 38.435,
    "name": "Lay Gayint",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_tach_gayint": {
    "lat": 11.564,
    "lng": 38.562,
    "name": "Tach Gayint",
    "zoneId": "ZONE_south_gondar"
  },
  "tach gayint": {
    "lat": 11.564,
    "lng": 38.562,
    "name": "Tach Gayint",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_semada": {
    "lat": 11.296,
    "lng": 38.303,
    "name": "Semada",
    "zoneId": "ZONE_south_gondar"
  },
  "semada": {
    "lat": 11.296,
    "lng": 38.303,
    "name": "Semada",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_east_esite": {
    "lat": 11.494,
    "lng": 38.073,
    "name": "East Esite",
    "zoneId": "ZONE_south_gondar"
  },
  "east esite": {
    "lat": 11.494,
    "lng": 38.073,
    "name": "East Esite",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_dera_am": {
    "lat": 11.641,
    "lng": 37.65,
    "name": "Dera (AM)",
    "zoneId": "ZONE_south_gondar"
  },
  "dera (am)": {
    "lat": 11.641,
    "lng": 37.65,
    "name": "Dera (AM)",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_debre_tabor_town": {
    "lat": 11.863,
    "lng": 38.021,
    "name": "Debre Tabor town",
    "zoneId": "ZONE_south_gondar"
  },
  "debre tabor town": {
    "lat": 11.863,
    "lng": 38.021,
    "name": "Debre Tabor town",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_andabet_west_esite": {
    "lat": 11.373,
    "lng": 37.914,
    "name": "Andabet /West Esite",
    "zoneId": "ZONE_south_gondar"
  },
  "andabet /west esite": {
    "lat": 11.373,
    "lng": 37.914,
    "name": "Andabet /West Esite",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_guna_begemider": {
    "lat": 11.897,
    "lng": 38.241,
    "name": "Guna Begemider",
    "zoneId": "ZONE_south_gondar"
  },
  "guna begemider": {
    "lat": 11.897,
    "lng": 38.241,
    "name": "Guna Begemider",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_mena_meketewa": {
    "lat": 12.116,
    "lng": 38.322,
    "name": "Mena Meketewa",
    "zoneId": "ZONE_south_gondar"
  },
  "mena meketewa": {
    "lat": 12.116,
    "lng": 38.322,
    "name": "Mena Meketewa",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_sede_muja": {
    "lat": 11.397,
    "lng": 38.469,
    "name": "Sede Muja",
    "zoneId": "ZONE_south_gondar"
  },
  "sede muja": {
    "lat": 11.397,
    "lng": 38.469,
    "name": "Sede Muja",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_nefas_mewicha_town": {
    "lat": 11.733,
    "lng": 38.469,
    "name": "Nefas Mewicha town",
    "zoneId": "ZONE_south_gondar"
  },
  "nefas mewicha town": {
    "lat": 11.733,
    "lng": 38.469,
    "name": "Nefas Mewicha town",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_wegeda_town": {
    "lat": 11.399,
    "lng": 38.236,
    "name": "Wegeda town",
    "zoneId": "ZONE_south_gondar"
  },
  "wegeda town": {
    "lat": 11.399,
    "lng": 38.236,
    "name": "Wegeda town",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_ebenat_town": {
    "lat": 12.123,
    "lng": 38.049,
    "name": "Ebenat town",
    "zoneId": "ZONE_south_gondar"
  },
  "ebenat town": {
    "lat": 12.123,
    "lng": 38.049,
    "name": "Ebenat town",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_hamusit_town": {
    "lat": 11.783,
    "lng": 37.559,
    "name": "Hamusit town",
    "zoneId": "ZONE_south_gondar"
  },
  "hamusit town": {
    "lat": 11.783,
    "lng": 37.559,
    "name": "Hamusit town",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_woreta_town": {
    "lat": 11.923,
    "lng": 37.699,
    "name": "Woreta town",
    "zoneId": "ZONE_south_gondar"
  },
  "woreta town": {
    "lat": 11.923,
    "lng": 37.699,
    "name": "Woreta town",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_mekan_eyesuse": {
    "lat": 11.652,
    "lng": 38.074,
    "name": "Mekan Eyesuse",
    "zoneId": "ZONE_south_gondar"
  },
  "mekan eyesuse": {
    "lat": 11.652,
    "lng": 38.074,
    "name": "Mekan Eyesuse",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_south_gondar_adiss_zemen_town": {
    "lat": 12.123,
    "lng": 37.778,
    "name": "Adiss Zemen town",
    "zoneId": "ZONE_south_gondar"
  },
  "adiss zemen town": {
    "lat": 12.123,
    "lng": 37.778,
    "name": "Adiss Zemen town",
    "zoneId": "ZONE_south_gondar"
  },
  "WOREDA_north_wello_bugna": {
    "lat": 12.171,
    "lng": 38.717,
    "name": "Bugna",
    "zoneId": "ZONE_north_wello"
  },
  "bugna": {
    "lat": 12.171,
    "lng": 38.717,
    "name": "Bugna",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_raya_kobo": {
    "lat": 12.007,
    "lng": 39.624,
    "name": "Raya Kobo",
    "zoneId": "ZONE_north_wello"
  },
  "raya kobo": {
    "lat": 12.007,
    "lng": 39.624,
    "name": "Raya Kobo",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_gidan": {
    "lat": 12.056,
    "lng": 39.325,
    "name": "Gidan",
    "zoneId": "ZONE_north_wello"
  },
  "gidan": {
    "lat": 12.056,
    "lng": 39.325,
    "name": "Gidan",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_meket": {
    "lat": 11.842,
    "lng": 38.822,
    "name": "Meket",
    "zoneId": "ZONE_north_wello"
  },
  "meket": {
    "lat": 11.842,
    "lng": 38.822,
    "name": "Meket",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_wadla": {
    "lat": 11.624,
    "lng": 39.004,
    "name": "Wadla",
    "zoneId": "ZONE_north_wello"
  },
  "wadla": {
    "lat": 11.624,
    "lng": 39.004,
    "name": "Wadla",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_hara_town": {
    "lat": 11.841,
    "lng": 39.743,
    "name": "Hara town",
    "zoneId": "ZONE_north_wello"
  },
  "hara town": {
    "lat": 11.841,
    "lng": 39.743,
    "name": "Hara town",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_guba_lafto": {
    "lat": 11.783,
    "lng": 39.516,
    "name": "Guba Lafto",
    "zoneId": "ZONE_north_wello"
  },
  "guba lafto": {
    "lat": 11.783,
    "lng": 39.516,
    "name": "Guba Lafto",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_habru": {
    "lat": 11.671,
    "lng": 39.761,
    "name": "Habru",
    "zoneId": "ZONE_north_wello"
  },
  "habru": {
    "lat": 11.671,
    "lng": 39.761,
    "name": "Habru",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_woldiya_town": {
    "lat": 11.823,
    "lng": 39.594,
    "name": "Woldiya town",
    "zoneId": "ZONE_north_wello"
  },
  "woldiya town": {
    "lat": 11.823,
    "lng": 39.594,
    "name": "Woldiya town",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_lasta": {
    "lat": 11.992,
    "lng": 38.935,
    "name": "Lasta",
    "zoneId": "ZONE_north_wello"
  },
  "lasta": {
    "lat": 11.992,
    "lng": 38.935,
    "name": "Lasta",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_dawunt": {
    "lat": 11.474,
    "lng": 38.839,
    "name": "Dawunt",
    "zoneId": "ZONE_north_wello"
  },
  "dawunt": {
    "lat": 11.474,
    "lng": 38.839,
    "name": "Dawunt",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_gazo": {
    "lat": 11.822,
    "lng": 39.038,
    "name": "Gazo",
    "zoneId": "ZONE_north_wello"
  },
  "gazo": {
    "lat": 11.822,
    "lng": 39.038,
    "name": "Gazo",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_angot": {
    "lat": 11.841,
    "lng": 39.277,
    "name": "Angot",
    "zoneId": "ZONE_north_wello"
  },
  "angot": {
    "lat": 11.841,
    "lng": 39.277,
    "name": "Angot",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_filakit_town": {
    "lat": 11.763,
    "lng": 38.742,
    "name": "Filakit town",
    "zoneId": "ZONE_north_wello"
  },
  "filakit town": {
    "lat": 11.763,
    "lng": 38.742,
    "name": "Filakit town",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_gashena_town": {
    "lat": 11.668,
    "lng": 38.913,
    "name": "Gashena town",
    "zoneId": "ZONE_north_wello"
  },
  "gashena town": {
    "lat": 11.668,
    "lng": 38.913,
    "name": "Gashena town",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_mersa_town": {
    "lat": 11.664,
    "lng": 39.659,
    "name": "Mersa town",
    "zoneId": "ZONE_north_wello"
  },
  "mersa town": {
    "lat": 11.664,
    "lng": 39.659,
    "name": "Mersa town",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_lalibela_town": {
    "lat": 12.029,
    "lng": 39.046,
    "name": "Lalibela town",
    "zoneId": "ZONE_north_wello"
  },
  "lalibela town": {
    "lat": 12.029,
    "lng": 39.046,
    "name": "Lalibela town",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_north_wello_kobo_town": {
    "lat": 12.151,
    "lng": 39.634,
    "name": "Kobo town",
    "zoneId": "ZONE_north_wello"
  },
  "kobo town": {
    "lat": 12.151,
    "lng": 39.634,
    "name": "Kobo town",
    "zoneId": "ZONE_north_wello"
  },
  "WOREDA_south_wello_argoba": {
    "lat": 10.941,
    "lng": 39.97,
    "name": "Argoba",
    "zoneId": "ZONE_south_wello"
  },
  "argoba": {
    "lat": 10.941,
    "lng": 39.97,
    "name": "Argoba",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_tenta": {
    "lat": 11.225,
    "lng": 39.226,
    "name": "Tenta",
    "zoneId": "ZONE_south_wello"
  },
  "tenta": {
    "lat": 11.225,
    "lng": 39.226,
    "name": "Tenta",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_kutaber": {
    "lat": 11.28,
    "lng": 39.461,
    "name": "Kutaber",
    "zoneId": "ZONE_south_wello"
  },
  "kutaber": {
    "lat": 11.28,
    "lng": 39.461,
    "name": "Kutaber",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_ambasel": {
    "lat": 11.502,
    "lng": 39.495,
    "name": "Ambasel",
    "zoneId": "ZONE_south_wello"
  },
  "ambasel": {
    "lat": 11.502,
    "lng": 39.495,
    "name": "Ambasel",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_thehulederie": {
    "lat": 11.245,
    "lng": 39.733,
    "name": "Thehulederie",
    "zoneId": "ZONE_south_wello"
  },
  "thehulederie": {
    "lat": 11.245,
    "lng": 39.733,
    "name": "Thehulederie",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_delanta": {
    "lat": 11.527,
    "lng": 39.22,
    "name": "Delanta",
    "zoneId": "ZONE_south_wello"
  },
  "delanta": {
    "lat": 11.527,
    "lng": 39.22,
    "name": "Delanta",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_kalu": {
    "lat": 11.074,
    "lng": 39.835,
    "name": "Kalu",
    "zoneId": "ZONE_south_wello"
  },
  "kalu": {
    "lat": 11.074,
    "lng": 39.835,
    "name": "Kalu",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_albuko": {
    "lat": 10.814,
    "lng": 39.613,
    "name": "Albuko",
    "zoneId": "ZONE_south_wello"
  },
  "albuko": {
    "lat": 10.814,
    "lng": 39.613,
    "name": "Albuko",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_dessie_zuria": {
    "lat": 11.045,
    "lng": 39.474,
    "name": "Dessie Zuria",
    "zoneId": "ZONE_south_wello"
  },
  "dessie zuria": {
    "lat": 11.045,
    "lng": 39.474,
    "name": "Dessie Zuria",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_legambo": {
    "lat": 10.827,
    "lng": 39.042,
    "name": "Legambo",
    "zoneId": "ZONE_south_wello"
  },
  "legambo": {
    "lat": 10.827,
    "lng": 39.042,
    "name": "Legambo",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_sayint": {
    "lat": 11.099,
    "lng": 38.776,
    "name": "Sayint",
    "zoneId": "ZONE_south_wello"
  },
  "sayint": {
    "lat": 11.099,
    "lng": 38.776,
    "name": "Sayint",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_borena_debresina": {
    "lat": 10.75,
    "lng": 38.696,
    "name": "Borena /Debresina",
    "zoneId": "ZONE_south_wello"
  },
  "borena /debresina": {
    "lat": 10.75,
    "lng": 38.696,
    "name": "Borena /Debresina",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_kelela": {
    "lat": 10.541,
    "lng": 38.984,
    "name": "Kelela",
    "zoneId": "ZONE_south_wello"
  },
  "kelela": {
    "lat": 10.541,
    "lng": 38.984,
    "name": "Kelela",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_jama": {
    "lat": 10.444,
    "lng": 39.331,
    "name": "Jama",
    "zoneId": "ZONE_south_wello"
  },
  "jama": {
    "lat": 10.444,
    "lng": 39.331,
    "name": "Jama",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_were_ilu": {
    "lat": 10.696,
    "lng": 39.454,
    "name": "Were Ilu",
    "zoneId": "ZONE_south_wello"
  },
  "were ilu": {
    "lat": 10.696,
    "lng": 39.454,
    "name": "Were Ilu",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_wegde": {
    "lat": 10.534,
    "lng": 38.68,
    "name": "Wegde",
    "zoneId": "ZONE_south_wello"
  },
  "wegde": {
    "lat": 10.534,
    "lng": 38.68,
    "name": "Wegde",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_kombolcha_town": {
    "lat": 11.096,
    "lng": 39.721,
    "name": "Kombolcha town",
    "zoneId": "ZONE_south_wello"
  },
  "kombolcha town": {
    "lat": 11.096,
    "lng": 39.721,
    "name": "Kombolcha town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_dessie_town": {
    "lat": 11.142,
    "lng": 39.642,
    "name": "Dessie town",
    "zoneId": "ZONE_south_wello"
  },
  "dessie town": {
    "lat": 11.142,
    "lng": 39.642,
    "name": "Dessie town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_mehal_sayint": {
    "lat": 10.936,
    "lng": 38.642,
    "name": "Mehal Sayint",
    "zoneId": "ZONE_south_wello"
  },
  "mehal sayint": {
    "lat": 10.936,
    "lng": 38.642,
    "name": "Mehal Sayint",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_legehida": {
    "lat": 10.685,
    "lng": 39.258,
    "name": "Legehida",
    "zoneId": "ZONE_south_wello"
  },
  "legehida": {
    "lat": 10.685,
    "lng": 39.258,
    "name": "Legehida",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_mekdela": {
    "lat": 11.243,
    "lng": 38.934,
    "name": "Mekdela",
    "zoneId": "ZONE_south_wello"
  },
  "mekdela": {
    "lat": 11.243,
    "lng": 38.934,
    "name": "Mekdela",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_worebabu": {
    "lat": 11.447,
    "lng": 39.894,
    "name": "Worebabu",
    "zoneId": "ZONE_south_wello"
  },
  "worebabu": {
    "lat": 11.447,
    "lng": 39.894,
    "name": "Worebabu",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_wereilu_town": {
    "lat": 10.593,
    "lng": 39.437,
    "name": "Wereilu town",
    "zoneId": "ZONE_south_wello"
  },
  "wereilu town": {
    "lat": 10.593,
    "lng": 39.437,
    "name": "Wereilu town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_wegel_tena_town": {
    "lat": 11.592,
    "lng": 39.216,
    "name": "Wegel tena town",
    "zoneId": "ZONE_south_wello"
  },
  "wegel tena town": {
    "lat": 11.592,
    "lng": 39.216,
    "name": "Wegel tena town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_degolo_town": {
    "lat": 10.42,
    "lng": 39.259,
    "name": "Degolo town",
    "zoneId": "ZONE_south_wello"
  },
  "degolo town": {
    "lat": 10.42,
    "lng": 39.259,
    "name": "Degolo town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_kelala_town": {
    "lat": 10.587,
    "lng": 38.997,
    "name": "Kelala town",
    "zoneId": "ZONE_south_wello"
  },
  "kelala town": {
    "lat": 10.587,
    "lng": 38.997,
    "name": "Kelala town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_akeseta_town": {
    "lat": 10.869,
    "lng": 39.177,
    "name": "Akeseta town",
    "zoneId": "ZONE_south_wello"
  },
  "akeseta town": {
    "lat": 10.869,
    "lng": 39.177,
    "name": "Akeseta town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_gimeba_town": {
    "lat": 10.983,
    "lng": 39.269,
    "name": "Gimeba town",
    "zoneId": "ZONE_south_wello"
  },
  "gimeba town": {
    "lat": 10.983,
    "lng": 39.269,
    "name": "Gimeba town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_harbu_town": {
    "lat": 10.922,
    "lng": 39.783,
    "name": "Harbu town",
    "zoneId": "ZONE_south_wello"
  },
  "harbu town": {
    "lat": 10.922,
    "lng": 39.783,
    "name": "Harbu town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_wegedi_town": {
    "lat": 10.592,
    "lng": 38.764,
    "name": "Wegedi town",
    "zoneId": "ZONE_south_wello"
  },
  "wegedi town": {
    "lat": 10.592,
    "lng": 38.764,
    "name": "Wegedi town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_mekane_selam_town": {
    "lat": 10.753,
    "lng": 38.774,
    "name": "Mekane Selam town",
    "zoneId": "ZONE_south_wello"
  },
  "mekane selam town": {
    "lat": 10.753,
    "lng": 38.774,
    "name": "Mekane Selam town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_south_wello_hike_town": {
    "lat": 11.31,
    "lng": 39.678,
    "name": "Hike town",
    "zoneId": "ZONE_south_wello"
  },
  "hike town": {
    "lat": 11.31,
    "lng": 39.678,
    "name": "Hike town",
    "zoneId": "ZONE_south_wello"
  },
  "WOREDA_north_shewa_am_mida_woremo": {
    "lat": 10.246,
    "lng": 39.008,
    "name": "Mida Woremo",
    "zoneId": "ZONE_north_shewa_am"
  },
  "mida woremo": {
    "lat": 10.246,
    "lng": 39.008,
    "name": "Mida Woremo",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_merhabete": {
    "lat": 10.094,
    "lng": 39.124,
    "name": "Merhabete",
    "zoneId": "ZONE_north_shewa_am"
  },
  "merhabete": {
    "lat": 10.094,
    "lng": 39.124,
    "name": "Merhabete",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_ensaro": {
    "lat": 9.829,
    "lng": 38.907,
    "name": "Ensaro",
    "zoneId": "ZONE_north_shewa_am"
  },
  "ensaro": {
    "lat": 9.829,
    "lng": 38.907,
    "name": "Ensaro",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_moretna_jiru": {
    "lat": 9.943,
    "lng": 39.154,
    "name": "Moretna Jiru",
    "zoneId": "ZONE_north_shewa_am"
  },
  "moretna jiru": {
    "lat": 9.943,
    "lng": 39.154,
    "name": "Moretna Jiru",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_menze_gera_midir": {
    "lat": 10.393,
    "lng": 39.722,
    "name": "Menze Gera Midir",
    "zoneId": "ZONE_north_shewa_am"
  },
  "menze gera midir": {
    "lat": 10.393,
    "lng": 39.722,
    "name": "Menze Gera Midir",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_gishe_rabel": {
    "lat": 10.58,
    "lng": 39.601,
    "name": "Gishe Rabel",
    "zoneId": "ZONE_north_shewa_am"
  },
  "gishe rabel": {
    "lat": 10.58,
    "lng": 39.601,
    "name": "Gishe Rabel",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_antsokiya": {
    "lat": 10.602,
    "lng": 39.804,
    "name": "Antsokiya",
    "zoneId": "ZONE_north_shewa_am"
  },
  "antsokiya": {
    "lat": 10.602,
    "lng": 39.804,
    "name": "Antsokiya",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_eferatana_gidem": {
    "lat": 10.313,
    "lng": 39.886,
    "name": "Eferatana Gidem",
    "zoneId": "ZONE_north_shewa_am"
  },
  "eferatana gidem": {
    "lat": 10.313,
    "lng": 39.886,
    "name": "Eferatana Gidem",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_menze_mama_midir": {
    "lat": 10.074,
    "lng": 39.591,
    "name": "Menze Mama Midir",
    "zoneId": "ZONE_north_shewa_am"
  },
  "menze mama midir": {
    "lat": 10.074,
    "lng": 39.591,
    "name": "Menze Mama Midir",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_tarema_ber": {
    "lat": 9.865,
    "lng": 39.82,
    "name": "Tarema Ber",
    "zoneId": "ZONE_north_shewa_am"
  },
  "tarema ber": {
    "lat": 9.865,
    "lng": 39.82,
    "name": "Tarema Ber",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_mojan_wedera": {
    "lat": 9.928,
    "lng": 39.53,
    "name": "Mojan Wedera",
    "zoneId": "ZONE_north_shewa_am"
  },
  "mojan wedera": {
    "lat": 9.928,
    "lng": 39.53,
    "name": "Mojan Wedera",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_kewet": {
    "lat": 10.068,
    "lng": 39.823,
    "name": "Kewet",
    "zoneId": "ZONE_north_shewa_am"
  },
  "kewet": {
    "lat": 10.068,
    "lng": 39.823,
    "name": "Kewet",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_angolelana_tera": {
    "lat": 9.488,
    "lng": 39.545,
    "name": "Angolelana Tera",
    "zoneId": "ZONE_north_shewa_am"
  },
  "angolelana tera": {
    "lat": 9.488,
    "lng": 39.545,
    "name": "Angolelana Tera",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_assagirt": {
    "lat": 9.379,
    "lng": 39.624,
    "name": "Assagirt",
    "zoneId": "ZONE_north_shewa_am"
  },
  "assagirt": {
    "lat": 9.379,
    "lng": 39.624,
    "name": "Assagirt",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_ankober": {
    "lat": 9.558,
    "lng": 39.777,
    "name": "Ankober",
    "zoneId": "ZONE_north_shewa_am"
  },
  "ankober": {
    "lat": 9.558,
    "lng": 39.777,
    "name": "Ankober",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_hagere_mariam": {
    "lat": 9.189,
    "lng": 39.397,
    "name": "Hagere Mariam",
    "zoneId": "ZONE_north_shewa_am"
  },
  "hagere mariam": {
    "lat": 9.189,
    "lng": 39.397,
    "name": "Hagere Mariam",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_berehet": {
    "lat": 9.188,
    "lng": 39.685,
    "name": "Berehet",
    "zoneId": "ZONE_north_shewa_am"
  },
  "berehet": {
    "lat": 9.188,
    "lng": 39.685,
    "name": "Berehet",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_minjar_shenkora": {
    "lat": 8.92,
    "lng": 39.513,
    "name": "Minjar Shenkora",
    "zoneId": "ZONE_north_shewa_am"
  },
  "minjar shenkora": {
    "lat": 8.92,
    "lng": 39.513,
    "name": "Minjar Shenkora",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_basona_worena": {
    "lat": 9.731,
    "lng": 39.626,
    "name": "Basona Worena",
    "zoneId": "ZONE_north_shewa_am"
  },
  "basona worena": {
    "lat": 9.731,
    "lng": 39.626,
    "name": "Basona Worena",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_debre_berhan_town": {
    "lat": 9.664,
    "lng": 39.526,
    "name": "Debre Berhan town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "debre berhan town": {
    "lat": 9.664,
    "lng": 39.526,
    "name": "Debre Berhan town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_menze_keya_gabriel": {
    "lat": 10.182,
    "lng": 39.367,
    "name": "Menze Keya Gabriel",
    "zoneId": "ZONE_north_shewa_am"
  },
  "menze keya gabriel": {
    "lat": 10.182,
    "lng": 39.367,
    "name": "Menze Keya Gabriel",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_menze_lalo_midir": {
    "lat": 10.132,
    "lng": 39.515,
    "name": "Menze Lalo Midir",
    "zoneId": "ZONE_north_shewa_am"
  },
  "menze lalo midir": {
    "lat": 10.132,
    "lng": 39.515,
    "name": "Menze Lalo Midir",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_siya_debirna_wayu": {
    "lat": 9.769,
    "lng": 39.191,
    "name": "Siya Debirna Wayu",
    "zoneId": "ZONE_north_shewa_am"
  },
  "siya debirna wayu": {
    "lat": 9.769,
    "lng": 39.191,
    "name": "Siya Debirna Wayu",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_tulefa_town": {
    "lat": 9.242,
    "lng": 39.223,
    "name": "Tulefa town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "tulefa town": {
    "lat": 9.242,
    "lng": 39.223,
    "name": "Tulefa town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_arerti_town": {
    "lat": 8.928,
    "lng": 39.424,
    "name": "Arerti town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "arerti town": {
    "lat": 8.928,
    "lng": 39.424,
    "name": "Arerti town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_molale_town": {
    "lat": 10.121,
    "lng": 39.662,
    "name": "Molale town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "molale town": {
    "lat": 10.121,
    "lng": 39.662,
    "name": "Molale town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_debre_sina_town": {
    "lat": 9.848,
    "lng": 39.761,
    "name": "Debre Sina town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "debre sina town": {
    "lat": 9.848,
    "lng": 39.761,
    "name": "Debre Sina town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_enewari_town": {
    "lat": 9.893,
    "lng": 39.147,
    "name": "Enewari town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "enewari town": {
    "lat": 9.893,
    "lng": 39.147,
    "name": "Enewari town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_shoa_robit": {
    "lat": 10.007,
    "lng": 39.906,
    "name": "Shoa Robit",
    "zoneId": "ZONE_north_shewa_am"
  },
  "shoa robit": {
    "lat": 10.007,
    "lng": 39.906,
    "name": "Shoa Robit",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_mehal_meda_town": {
    "lat": 10.312,
    "lng": 39.659,
    "name": "Mehal Meda town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "mehal meda town": {
    "lat": 10.312,
    "lng": 39.659,
    "name": "Mehal Meda town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_ataye_town": {
    "lat": 10.354,
    "lng": 39.965,
    "name": "Ataye town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "ataye town": {
    "lat": 10.354,
    "lng": 39.965,
    "name": "Ataye town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_north_shewa_am_aleme_ketma_town": {
    "lat": 10.057,
    "lng": 38.998,
    "name": "Aleme Ketma town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "aleme ketma town": {
    "lat": 10.057,
    "lng": 38.998,
    "name": "Aleme Ketma town",
    "zoneId": "ZONE_north_shewa_am"
  },
  "WOREDA_east_gojam_bibugn": {
    "lat": 10.834,
    "lng": 37.754,
    "name": "Bibugn",
    "zoneId": "ZONE_east_gojam"
  },
  "bibugn": {
    "lat": 10.834,
    "lng": 37.754,
    "name": "Bibugn",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_hulet_ej_enese": {
    "lat": 10.897,
    "lng": 37.881,
    "name": "Hulet Ej Enese",
    "zoneId": "ZONE_east_gojam"
  },
  "hulet ej enese": {
    "lat": 10.897,
    "lng": 37.881,
    "name": "Hulet Ej Enese",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_goncha_siso_enebse": {
    "lat": 10.888,
    "lng": 38.135,
    "name": "Goncha Siso Enebse",
    "zoneId": "ZONE_east_gojam"
  },
  "goncha siso enebse": {
    "lat": 10.888,
    "lng": 38.135,
    "name": "Goncha Siso Enebse",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_enebse_sarmder": {
    "lat": 10.866,
    "lng": 38.393,
    "name": "Enebse Sarmder",
    "zoneId": "ZONE_east_gojam"
  },
  "enebse sarmder": {
    "lat": 10.866,
    "lng": 38.393,
    "name": "Enebse Sarmder",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_enarj_enawga": {
    "lat": 10.687,
    "lng": 38.218,
    "name": "Enarj Enawga",
    "zoneId": "ZONE_east_gojam"
  },
  "enarj enawga": {
    "lat": 10.687,
    "lng": 38.218,
    "name": "Enarj Enawga",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_enemay": {
    "lat": 10.506,
    "lng": 38.177,
    "name": "Enemay",
    "zoneId": "ZONE_east_gojam"
  },
  "enemay": {
    "lat": 10.506,
    "lng": 38.177,
    "name": "Enemay",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_debay_telatgen": {
    "lat": 10.544,
    "lng": 37.993,
    "name": "Debay Telatgen",
    "zoneId": "ZONE_east_gojam"
  },
  "debay telatgen": {
    "lat": 10.544,
    "lng": 37.993,
    "name": "Debay Telatgen",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_debre_elias": {
    "lat": 10.233,
    "lng": 37.322,
    "name": "Debre Elias",
    "zoneId": "ZONE_east_gojam"
  },
  "debre elias": {
    "lat": 10.233,
    "lng": 37.322,
    "name": "Debre Elias",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_michakel": {
    "lat": 10.493,
    "lng": 37.543,
    "name": "Michakel",
    "zoneId": "ZONE_east_gojam"
  },
  "michakel": {
    "lat": 10.493,
    "lng": 37.543,
    "name": "Michakel",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_guzamn": {
    "lat": 10.271,
    "lng": 37.635,
    "name": "Guzamn",
    "zoneId": "ZONE_east_gojam"
  },
  "guzamn": {
    "lat": 10.271,
    "lng": 37.635,
    "name": "Guzamn",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_baso_liben": {
    "lat": 10.028,
    "lng": 37.717,
    "name": "Baso Liben",
    "zoneId": "ZONE_east_gojam"
  },
  "baso liben": {
    "lat": 10.028,
    "lng": 37.717,
    "name": "Baso Liben",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_awabel": {
    "lat": 10.221,
    "lng": 38.001,
    "name": "Awabel",
    "zoneId": "ZONE_east_gojam"
  },
  "awabel": {
    "lat": 10.221,
    "lng": 38.001,
    "name": "Awabel",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_dejen": {
    "lat": 10.202,
    "lng": 38.178,
    "name": "Dejen",
    "zoneId": "ZONE_east_gojam"
  },
  "dejen": {
    "lat": 10.202,
    "lng": 38.178,
    "name": "Dejen",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_shebel_bernta": {
    "lat": 10.346,
    "lng": 38.372,
    "name": "Shebel Bernta",
    "zoneId": "ZONE_east_gojam"
  },
  "shebel bernta": {
    "lat": 10.346,
    "lng": 38.372,
    "name": "Shebel Bernta",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_debre_markos_town": {
    "lat": 10.327,
    "lng": 37.729,
    "name": "Debre Markos town",
    "zoneId": "ZONE_east_gojam"
  },
  "debre markos town": {
    "lat": 10.327,
    "lng": 37.729,
    "name": "Debre Markos town",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_senan": {
    "lat": 10.546,
    "lng": 37.769,
    "name": "Senan",
    "zoneId": "ZONE_east_gojam"
  },
  "senan": {
    "lat": 10.546,
    "lng": 37.769,
    "name": "Senan",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_aneded": {
    "lat": 10.182,
    "lng": 37.883,
    "name": "Aneded",
    "zoneId": "ZONE_east_gojam"
  },
  "aneded": {
    "lat": 10.182,
    "lng": 37.883,
    "name": "Aneded",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_amanuel_town": {
    "lat": 10.441,
    "lng": 37.566,
    "name": "Amanuel town",
    "zoneId": "ZONE_east_gojam"
  },
  "amanuel town": {
    "lat": 10.441,
    "lng": 37.566,
    "name": "Amanuel town",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_sedae": {
    "lat": 11.057,
    "lng": 38.194,
    "name": "Sedae",
    "zoneId": "ZONE_east_gojam"
  },
  "sedae": {
    "lat": 11.057,
    "lng": 38.194,
    "name": "Sedae",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_gundwoin_town": {
    "lat": 10.927,
    "lng": 38.087,
    "name": "Gundwoin town",
    "zoneId": "ZONE_east_gojam"
  },
  "gundwoin town": {
    "lat": 10.927,
    "lng": 38.087,
    "name": "Gundwoin town",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_debrework_town": {
    "lat": 10.656,
    "lng": 38.167,
    "name": "Debrework town",
    "zoneId": "ZONE_east_gojam"
  },
  "debrework town": {
    "lat": 10.656,
    "lng": 38.167,
    "name": "Debrework town",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_lumame_town": {
    "lat": 10.253,
    "lng": 37.938,
    "name": "Lumame town",
    "zoneId": "ZONE_east_gojam"
  },
  "lumame town": {
    "lat": 10.253,
    "lng": 37.938,
    "name": "Lumame town",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_merto_lemariyam_town": {
    "lat": 10.869,
    "lng": 38.27,
    "name": "Merto Lemariyam town",
    "zoneId": "ZONE_east_gojam"
  },
  "merto lemariyam town": {
    "lat": 10.869,
    "lng": 38.27,
    "name": "Merto Lemariyam town",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_mota_town": {
    "lat": 11.081,
    "lng": 37.877,
    "name": "Mota town",
    "zoneId": "ZONE_east_gojam"
  },
  "mota town": {
    "lat": 11.081,
    "lng": 37.877,
    "name": "Mota town",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_dejen_town": {
    "lat": 10.168,
    "lng": 38.146,
    "name": "Dejen town",
    "zoneId": "ZONE_east_gojam"
  },
  "dejen town": {
    "lat": 10.168,
    "lng": 38.146,
    "name": "Dejen town",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_east_gojam_bechena_town": {
    "lat": 10.453,
    "lng": 38.201,
    "name": "Bechena town",
    "zoneId": "ZONE_east_gojam"
  },
  "bechena town": {
    "lat": 10.453,
    "lng": 38.201,
    "name": "Bechena town",
    "zoneId": "ZONE_east_gojam"
  },
  "WOREDA_west_gojam_sekela": {
    "lat": 11.001,
    "lng": 37.209,
    "name": "Sekela",
    "zoneId": "ZONE_west_gojam"
  },
  "sekela": {
    "lat": 11.001,
    "lng": 37.209,
    "name": "Sekela",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_quarit": {
    "lat": 10.975,
    "lng": 37.442,
    "name": "Quarit",
    "zoneId": "ZONE_west_gojam"
  },
  "quarit": {
    "lat": 10.975,
    "lng": 37.442,
    "name": "Quarit",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_dega_damot": {
    "lat": 10.862,
    "lng": 37.615,
    "name": "Dega Damot",
    "zoneId": "ZONE_west_gojam"
  },
  "dega damot": {
    "lat": 10.862,
    "lng": 37.615,
    "name": "Dega Damot",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_dembecha": {
    "lat": 10.554,
    "lng": 37.376,
    "name": "Dembecha",
    "zoneId": "ZONE_west_gojam"
  },
  "dembecha": {
    "lat": 10.554,
    "lng": 37.376,
    "name": "Dembecha",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_jabi_tehnan": {
    "lat": 10.62,
    "lng": 37.297,
    "name": "Jabi Tehnan",
    "zoneId": "ZONE_west_gojam"
  },
  "jabi tehnan": {
    "lat": 10.62,
    "lng": 37.297,
    "name": "Jabi Tehnan",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_bure_am": {
    "lat": 10.542,
    "lng": 37.049,
    "name": "Bure (AM)",
    "zoneId": "ZONE_west_gojam"
  },
  "bure (am)": {
    "lat": 10.542,
    "lng": 37.049,
    "name": "Bure (AM)",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_wemberma": {
    "lat": 10.518,
    "lng": 36.889,
    "name": "Wemberma",
    "zoneId": "ZONE_west_gojam"
  },
  "wemberma": {
    "lat": 10.518,
    "lng": 36.889,
    "name": "Wemberma",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_finote_selam_town": {
    "lat": 10.685,
    "lng": 37.263,
    "name": "Finote Selam town",
    "zoneId": "ZONE_west_gojam"
  },
  "finote selam town": {
    "lat": 10.685,
    "lng": 37.263,
    "name": "Finote Selam town",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_shendi_town": {
    "lat": 10.641,
    "lng": 36.946,
    "name": "Shendi town",
    "zoneId": "ZONE_west_gojam"
  },
  "shendi town": {
    "lat": 10.641,
    "lng": 36.946,
    "name": "Shendi town",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_denbecha_town": {
    "lat": 10.566,
    "lng": 37.491,
    "name": "Denbecha town",
    "zoneId": "ZONE_west_gojam"
  },
  "denbecha town": {
    "lat": 10.566,
    "lng": 37.491,
    "name": "Denbecha town",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_jiga_town": {
    "lat": 10.675,
    "lng": 37.374,
    "name": "Jiga town",
    "zoneId": "ZONE_west_gojam"
  },
  "jiga town": {
    "lat": 10.675,
    "lng": 37.374,
    "name": "Jiga town",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_west_gojam_bure_town": {
    "lat": 10.706,
    "lng": 37.065,
    "name": "Bure town",
    "zoneId": "ZONE_west_gojam"
  },
  "bure town": {
    "lat": 10.706,
    "lng": 37.065,
    "name": "Bure town",
    "zoneId": "ZONE_west_gojam"
  },
  "WOREDA_wag_hamra_zequala": {
    "lat": 12.691,
    "lng": 38.576,
    "name": "Zequala",
    "zoneId": "ZONE_wag_hamra"
  },
  "zequala": {
    "lat": 12.691,
    "lng": 38.576,
    "name": "Zequala",
    "zoneId": "ZONE_wag_hamra"
  },
  "WOREDA_wag_hamra_sekota": {
    "lat": 12.666,
    "lng": 38.889,
    "name": "Sekota",
    "zoneId": "ZONE_wag_hamra"
  },
  "sekota": {
    "lat": 12.666,
    "lng": 38.889,
    "name": "Sekota",
    "zoneId": "ZONE_wag_hamra"
  },
  "WOREDA_wag_hamra_dehana": {
    "lat": 12.446,
    "lng": 38.548,
    "name": "Dehana",
    "zoneId": "ZONE_wag_hamra"
  },
  "dehana": {
    "lat": 12.446,
    "lng": 38.548,
    "name": "Dehana",
    "zoneId": "ZONE_wag_hamra"
  },
  "WOREDA_wag_hamra_gaz_gibla": {
    "lat": 12.337,
    "lng": 39.07,
    "name": "Gaz Gibla",
    "zoneId": "ZONE_wag_hamra"
  },
  "gaz gibla": {
    "lat": 12.337,
    "lng": 39.07,
    "name": "Gaz Gibla",
    "zoneId": "ZONE_wag_hamra"
  },
  "WOREDA_wag_hamra_abergele_am": {
    "lat": 13.077,
    "lng": 38.881,
    "name": "Abergele (AM)",
    "zoneId": "ZONE_wag_hamra"
  },
  "abergele (am)": {
    "lat": 13.077,
    "lng": 38.881,
    "name": "Abergele (AM)",
    "zoneId": "ZONE_wag_hamra"
  },
  "WOREDA_wag_hamra_sahila": {
    "lat": 12.936,
    "lng": 38.498,
    "name": "Sahila",
    "zoneId": "ZONE_wag_hamra"
  },
  "sahila": {
    "lat": 12.936,
    "lng": 38.498,
    "name": "Sahila",
    "zoneId": "ZONE_wag_hamra"
  },
  "WOREDA_wag_hamra_sekota_town": {
    "lat": 12.618,
    "lng": 39.036,
    "name": "Sekota town",
    "zoneId": "ZONE_wag_hamra"
  },
  "sekota town": {
    "lat": 12.618,
    "lng": 39.036,
    "name": "Sekota town",
    "zoneId": "ZONE_wag_hamra"
  },
  "WOREDA_wag_hamra_tsagbeji": {
    "lat": 12.77,
    "lng": 39.173,
    "name": "Tsagbeji",
    "zoneId": "ZONE_wag_hamra"
  },
  "tsagbeji": {
    "lat": 12.77,
    "lng": 39.173,
    "name": "Tsagbeji",
    "zoneId": "ZONE_wag_hamra"
  },
  "WOREDA_wag_hamra_amde_work_town": {
    "lat": 12.43,
    "lng": 38.716,
    "name": "Amde Work town",
    "zoneId": "ZONE_wag_hamra"
  },
  "amde work town": {
    "lat": 12.43,
    "lng": 38.716,
    "name": "Amde Work town",
    "zoneId": "ZONE_wag_hamra"
  },
  "WOREDA_awi_dangila": {
    "lat": 11.227,
    "lng": 36.771,
    "name": "Dangila",
    "zoneId": "ZONE_awi"
  },
  "dangila": {
    "lat": 11.227,
    "lng": 36.771,
    "name": "Dangila",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_banja": {
    "lat": 10.963,
    "lng": 37.009,
    "name": "Banja",
    "zoneId": "ZONE_awi"
  },
  "banja": {
    "lat": 10.963,
    "lng": 37.009,
    "name": "Banja",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_ankasha": {
    "lat": 10.845,
    "lng": 36.832,
    "name": "Ankasha",
    "zoneId": "ZONE_awi"
  },
  "ankasha": {
    "lat": 10.845,
    "lng": 36.832,
    "name": "Ankasha",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_guangua": {
    "lat": 10.826,
    "lng": 36.605,
    "name": "Guangua",
    "zoneId": "ZONE_awi"
  },
  "guangua": {
    "lat": 10.826,
    "lng": 36.605,
    "name": "Guangua",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_fagta_lakoma": {
    "lat": 11.096,
    "lng": 36.984,
    "name": "Fagta Lakoma",
    "zoneId": "ZONE_awi"
  },
  "fagta lakoma": {
    "lat": 11.096,
    "lng": 36.984,
    "name": "Fagta Lakoma",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_jawi": {
    "lat": 11.709,
    "lng": 36.407,
    "name": "Jawi",
    "zoneId": "ZONE_awi"
  },
  "jawi": {
    "lat": 11.709,
    "lng": 36.407,
    "name": "Jawi",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_guagusa_shikudad": {
    "lat": 10.805,
    "lng": 37.03,
    "name": "Guagusa Shikudad",
    "zoneId": "ZONE_awi"
  },
  "guagusa shikudad": {
    "lat": 10.805,
    "lng": 37.03,
    "name": "Guagusa Shikudad",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_ayehu_guwagusa": {
    "lat": 10.681,
    "lng": 36.752,
    "name": "Ayehu Guwagusa",
    "zoneId": "ZONE_awi"
  },
  "ayehu guwagusa": {
    "lat": 10.681,
    "lng": 36.752,
    "name": "Ayehu Guwagusa",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_agew_gimija_bet_town": {
    "lat": 10.85,
    "lng": 36.892,
    "name": "Agew Gimija Bet town",
    "zoneId": "ZONE_awi"
  },
  "agew gimija bet town": {
    "lat": 10.85,
    "lng": 36.892,
    "name": "Agew Gimija Bet town",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_adiss_kidame_town": {
    "lat": 11.08,
    "lng": 36.885,
    "name": "Adiss Kidame town",
    "zoneId": "ZONE_awi"
  },
  "adiss kidame town": {
    "lat": 11.08,
    "lng": 36.885,
    "name": "Adiss Kidame town",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_tilili_town": {
    "lat": 10.855,
    "lng": 37.021,
    "name": "Tilili town",
    "zoneId": "ZONE_awi"
  },
  "tilili town": {
    "lat": 10.855,
    "lng": 37.021,
    "name": "Tilili town",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_fendika_town": {
    "lat": 11.567,
    "lng": 36.489,
    "name": "Fendika town",
    "zoneId": "ZONE_awi"
  },
  "fendika town": {
    "lat": 11.567,
    "lng": 36.489,
    "name": "Fendika town",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_injibara_town": {
    "lat": 10.968,
    "lng": 36.926,
    "name": "Injibara town",
    "zoneId": "ZONE_awi"
  },
  "injibara town": {
    "lat": 10.968,
    "lng": 36.926,
    "name": "Injibara town",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_zigem_town": {
    "lat": 10.712,
    "lng": 36.492,
    "name": "Zigem town",
    "zoneId": "ZONE_awi"
  },
  "zigem town": {
    "lat": 10.712,
    "lng": 36.492,
    "name": "Zigem town",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_dangila_town": {
    "lat": 11.263,
    "lng": 36.846,
    "name": "Dangila town",
    "zoneId": "ZONE_awi"
  },
  "dangila town": {
    "lat": 11.263,
    "lng": 36.846,
    "name": "Dangila town",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_awi_chagni_town": {
    "lat": 10.958,
    "lng": 36.507,
    "name": "Chagni town",
    "zoneId": "ZONE_awi"
  },
  "chagni town": {
    "lat": 10.958,
    "lng": 36.507,
    "name": "Chagni town",
    "zoneId": "ZONE_awi"
  },
  "WOREDA_oromo_nationality_administration_dewa_cheffa": {
    "lat": 10.779,
    "lng": 39.847,
    "name": "Dewa Cheffa",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "dewa cheffa": {
    "lat": 10.779,
    "lng": 39.847,
    "name": "Dewa Cheffa",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "WOREDA_oromo_nationality_administration_bati": {
    "lat": 11.074,
    "lng": 40.121,
    "name": "Bati",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "bati": {
    "lat": 11.074,
    "lng": 40.121,
    "name": "Bati",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "WOREDA_oromo_nationality_administration_jilye_tumuga": {
    "lat": 10.26,
    "lng": 40.051,
    "name": "Jilye Tumuga",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "jilye tumuga": {
    "lat": 10.26,
    "lng": 40.051,
    "name": "Jilye Tumuga",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "WOREDA_oromo_nationality_administration_artuma_fursi": {
    "lat": 10.545,
    "lng": 40.011,
    "name": "Artuma Fursi",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "artuma fursi": {
    "lat": 10.545,
    "lng": 40.011,
    "name": "Artuma Fursi",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "WOREDA_oromo_nationality_administration_dewa_harewa": {
    "lat": 10.766,
    "lng": 40.046,
    "name": "Dewa Harewa",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "dewa harewa": {
    "lat": 10.766,
    "lng": 40.046,
    "name": "Dewa Harewa",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "WOREDA_oromo_nationality_administration_kemisie_town": {
    "lat": 10.718,
    "lng": 39.872,
    "name": "Kemisie town",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "kemisie town": {
    "lat": 10.718,
    "lng": 39.872,
    "name": "Kemisie town",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "WOREDA_oromo_nationality_administration_chef_robit_town": {
    "lat": 10.551,
    "lng": 39.934,
    "name": "Chef Robit town",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "chef robit town": {
    "lat": 10.551,
    "lng": 39.934,
    "name": "Chef Robit town",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "WOREDA_oromo_nationality_administration_senbete_town": {
    "lat": 10.318,
    "lng": 40.003,
    "name": "Senbete town",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "senbete town": {
    "lat": 10.318,
    "lng": 40.003,
    "name": "Senbete town",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "WOREDA_oromo_nationality_administration_bati_town": {
    "lat": 11.192,
    "lng": 40.015,
    "name": "Bati town",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "bati town": {
    "lat": 11.192,
    "lng": 40.015,
    "name": "Bati town",
    "zoneId": "ZONE_oromo_nationality_administration"
  },
  "WOREDA_central_gondar_amba_giorgis_town": {
    "lat": 12.77,
    "lng": 37.622,
    "name": "Amba Giorgis town",
    "zoneId": "ZONE_central_gondar"
  },
  "amba giorgis town": {
    "lat": 12.77,
    "lng": 37.622,
    "name": "Amba Giorgis town",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_shawra_town": {
    "lat": 11.932,
    "lng": 36.873,
    "name": "Shawra town",
    "zoneId": "ZONE_central_gondar"
  },
  "shawra town": {
    "lat": 11.932,
    "lng": 36.873,
    "name": "Shawra town",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_kolla_debba_town": {
    "lat": 12.426,
    "lng": 37.329,
    "name": "Kolla Debba town",
    "zoneId": "ZONE_central_gondar"
  },
  "kolla debba town": {
    "lat": 12.426,
    "lng": 37.329,
    "name": "Kolla Debba town",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_chilga_1": {
    "lat": 12.618,
    "lng": 37.042,
    "name": "Chilga 1",
    "zoneId": "ZONE_central_gondar"
  },
  "chilga 1": {
    "lat": 12.618,
    "lng": 37.042,
    "name": "Chilga 1",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_tegede": {
    "lat": 13.3,
    "lng": 37.016,
    "name": "Tegede",
    "zoneId": "ZONE_central_gondar"
  },
  "tegede": {
    "lat": 13.3,
    "lng": 37.016,
    "name": "Tegede",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_lay_armacho": {
    "lat": 12.766,
    "lng": 37.369,
    "name": "Lay Armacho",
    "zoneId": "ZONE_central_gondar"
  },
  "lay armacho": {
    "lat": 12.766,
    "lng": 37.369,
    "name": "Lay Armacho",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_wegera": {
    "lat": 12.782,
    "lng": 37.676,
    "name": "Wegera",
    "zoneId": "ZONE_central_gondar"
  },
  "wegera": {
    "lat": 12.782,
    "lng": 37.676,
    "name": "Wegera",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_gonder_zuria": {
    "lat": 12.345,
    "lng": 37.576,
    "name": "Gonder Zuria",
    "zoneId": "ZONE_central_gondar"
  },
  "gonder zuria": {
    "lat": 12.345,
    "lng": 37.576,
    "name": "Gonder Zuria",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_east_dembia": {
    "lat": 12.351,
    "lng": 37.375,
    "name": "East Dembia",
    "zoneId": "ZONE_central_gondar"
  },
  "east dembia": {
    "lat": 12.351,
    "lng": 37.375,
    "name": "East Dembia",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_chilga_2": {
    "lat": 12.42,
    "lng": 36.983,
    "name": "Chilga 2",
    "zoneId": "ZONE_central_gondar"
  },
  "chilga 2": {
    "lat": 12.42,
    "lng": 36.983,
    "name": "Chilga 2",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_alefa": {
    "lat": 11.939,
    "lng": 36.766,
    "name": "Alefa",
    "zoneId": "ZONE_central_gondar"
  },
  "alefa": {
    "lat": 11.939,
    "lng": 36.766,
    "name": "Alefa",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_west_belesa": {
    "lat": 12.494,
    "lng": 37.847,
    "name": "West Belesa",
    "zoneId": "ZONE_central_gondar"
  },
  "west belesa": {
    "lat": 12.494,
    "lng": 37.847,
    "name": "West Belesa",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_east_belesa": {
    "lat": 12.452,
    "lng": 38.059,
    "name": "East Belesa",
    "zoneId": "ZONE_central_gondar"
  },
  "east belesa": {
    "lat": 12.452,
    "lng": 38.059,
    "name": "East Belesa",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_gondar_town": {
    "lat": 12.576,
    "lng": 37.45,
    "name": "Gondar town",
    "zoneId": "ZONE_central_gondar"
  },
  "gondar town": {
    "lat": 12.576,
    "lng": 37.45,
    "name": "Gondar town",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_masero_denb_central_armacho": {
    "lat": 13.009,
    "lng": 36.941,
    "name": "Masero Denb /Central Armacho",
    "zoneId": "ZONE_central_gondar"
  },
  "masero denb /central armacho": {
    "lat": 13.009,
    "lng": 36.941,
    "name": "Masero Denb /Central Armacho",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_tach_armacho": {
    "lat": 13.053,
    "lng": 37.238,
    "name": "Tach Armacho",
    "zoneId": "ZONE_central_gondar"
  },
  "tach armacho": {
    "lat": 13.053,
    "lng": 37.238,
    "name": "Tach Armacho",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_takusa": {
    "lat": 12.222,
    "lng": 36.805,
    "name": "Takusa",
    "zoneId": "ZONE_central_gondar"
  },
  "takusa": {
    "lat": 12.222,
    "lng": 36.805,
    "name": "Takusa",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_kinfaz_begela": {
    "lat": 12.796,
    "lng": 38.076,
    "name": "Kinfaz Begela",
    "zoneId": "ZONE_central_gondar"
  },
  "kinfaz begela": {
    "lat": 12.796,
    "lng": 38.076,
    "name": "Kinfaz Begela",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_west_dembiya": {
    "lat": 12.299,
    "lng": 37.225,
    "name": "West Dembiya",
    "zoneId": "ZONE_central_gondar"
  },
  "west dembiya": {
    "lat": 12.299,
    "lng": 37.225,
    "name": "West Dembiya",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_central_gondar_aykel_town": {
    "lat": 12.55,
    "lng": 37.065,
    "name": "Aykel town",
    "zoneId": "ZONE_central_gondar"
  },
  "aykel town": {
    "lat": 12.55,
    "lng": 37.065,
    "name": "Aykel town",
    "zoneId": "ZONE_central_gondar"
  },
  "WOREDA_west_gondar_adagn_ager_chaqo": {
    "lat": 12.607,
    "lng": 36.788,
    "name": "Adagn Ager Chaqo",
    "zoneId": "ZONE_west_gondar"
  },
  "adagn ager chaqo": {
    "lat": 12.607,
    "lng": 36.788,
    "name": "Adagn Ager Chaqo",
    "zoneId": "ZONE_west_gondar"
  },
  "WOREDA_west_gondar_mirab_armacho": {
    "lat": 13.414,
    "lng": 36.396,
    "name": "Mirab Armacho",
    "zoneId": "ZONE_west_gondar"
  },
  "mirab armacho": {
    "lat": 13.414,
    "lng": 36.396,
    "name": "Mirab Armacho",
    "zoneId": "ZONE_west_gondar"
  },
  "WOREDA_west_gondar_metema": {
    "lat": 12.801,
    "lng": 36.55,
    "name": "Metema",
    "zoneId": "ZONE_west_gondar"
  },
  "metema": {
    "lat": 12.801,
    "lng": 36.55,
    "name": "Metema",
    "zoneId": "ZONE_west_gondar"
  },
  "WOREDA_west_gondar_quara": {
    "lat": 12.262,
    "lng": 35.88,
    "name": "Quara",
    "zoneId": "ZONE_west_gondar"
  },
  "quara": {
    "lat": 12.262,
    "lng": 35.88,
    "name": "Quara",
    "zoneId": "ZONE_west_gondar"
  },
  "WOREDA_west_gondar_midre_genet": {
    "lat": 13.696,
    "lng": 36.464,
    "name": "Midre Genet",
    "zoneId": "ZONE_west_gondar"
  },
  "midre genet": {
    "lat": 13.696,
    "lng": 36.464,
    "name": "Midre Genet",
    "zoneId": "ZONE_west_gondar"
  },
  "WOREDA_west_gondar_metema_yohanes_town": {
    "lat": 12.939,
    "lng": 36.167,
    "name": "Metema Yohanes town",
    "zoneId": "ZONE_west_gondar"
  },
  "metema yohanes town": {
    "lat": 12.939,
    "lng": 36.167,
    "name": "Metema Yohanes town",
    "zoneId": "ZONE_west_gondar"
  },
  "WOREDA_west_gondar_gendawuha_town": {
    "lat": 12.777,
    "lng": 36.408,
    "name": "Gendawuha town",
    "zoneId": "ZONE_west_gondar"
  },
  "gendawuha town": {
    "lat": 12.777,
    "lng": 36.408,
    "name": "Gendawuha town",
    "zoneId": "ZONE_west_gondar"
  },
  "WOREDA_north_gojam_semen_achefer": {
    "lat": 11.72,
    "lng": 36.965,
    "name": "Semen Achefer",
    "zoneId": "ZONE_north_gojam"
  },
  "semen achefer": {
    "lat": 11.72,
    "lng": 36.965,
    "name": "Semen Achefer",
    "zoneId": "ZONE_north_gojam"
  },
  "WOREDA_north_gojam_merawi_town": {
    "lat": 11.416,
    "lng": 37.16,
    "name": "Merawi town",
    "zoneId": "ZONE_north_gojam"
  },
  "merawi town": {
    "lat": 11.416,
    "lng": 37.16,
    "name": "Merawi town",
    "zoneId": "ZONE_north_gojam"
  },
  "WOREDA_north_gojam_yilmana_densa": {
    "lat": 11.229,
    "lng": 37.402,
    "name": "Yilmana Densa",
    "zoneId": "ZONE_north_gojam"
  },
  "yilmana densa": {
    "lat": 11.229,
    "lng": 37.402,
    "name": "Yilmana Densa",
    "zoneId": "ZONE_north_gojam"
  },
  "WOREDA_north_gojam_mecha": {
    "lat": 11.471,
    "lng": 37.08,
    "name": "Mecha",
    "zoneId": "ZONE_north_gojam"
  },
  "mecha": {
    "lat": 11.471,
    "lng": 37.08,
    "name": "Mecha",
    "zoneId": "ZONE_north_gojam"
  },
  "WOREDA_north_gojam_debub_achefer": {
    "lat": 11.476,
    "lng": 36.842,
    "name": "Debub Achefer",
    "zoneId": "ZONE_north_gojam"
  },
  "debub achefer": {
    "lat": 11.476,
    "lng": 36.842,
    "name": "Debub Achefer",
    "zoneId": "ZONE_north_gojam"
  },
  "WOREDA_north_gojam_debub_mecha": {
    "lat": 11.259,
    "lng": 37.179,
    "name": "Debub Mecha",
    "zoneId": "ZONE_north_gojam"
  },
  "debub mecha": {
    "lat": 11.259,
    "lng": 37.179,
    "name": "Debub Mecha",
    "zoneId": "ZONE_north_gojam"
  },
  "WOREDA_north_gojam_gonje": {
    "lat": 11.176,
    "lng": 37.67,
    "name": "Gonje",
    "zoneId": "ZONE_north_gojam"
  },
  "gonje": {
    "lat": 11.176,
    "lng": 37.67,
    "name": "Gonje",
    "zoneId": "ZONE_north_gojam"
  },
  "WOREDA_north_gojam_dure_bete": {
    "lat": 11.358,
    "lng": 36.953,
    "name": "Dure Bete",
    "zoneId": "ZONE_north_gojam"
  },
  "dure bete": {
    "lat": 11.358,
    "lng": 36.953,
    "name": "Dure Bete",
    "zoneId": "ZONE_north_gojam"
  },
  "WOREDA_north_gojam_adete_town": {
    "lat": 11.267,
    "lng": 37.49,
    "name": "Adete town",
    "zoneId": "ZONE_north_gojam"
  },
  "adete town": {
    "lat": 11.267,
    "lng": 37.49,
    "name": "Adete town",
    "zoneId": "ZONE_north_gojam"
  },
  "WOREDA_north_gojam_bahir_dar_zuria": {
    "lat": 11.668,
    "lng": 37.242,
    "name": "Bahir Dar Zuria",
    "zoneId": "ZONE_north_gojam"
  },
  "bahir dar zuria": {
    "lat": 11.668,
    "lng": 37.242,
    "name": "Bahir Dar Zuria",
    "zoneId": "ZONE_north_gojam"
  },
  "WOREDA_bahir_dar_town_admin_bahir_dar_town": {
    "lat": 11.594,
    "lng": 37.386,
    "name": "Bahir Dar town",
    "zoneId": "ZONE_bahir_dar_town_admin"
  },
  "bahir dar town": {
    "lat": 11.594,
    "lng": 37.386,
    "name": "Bahir Dar town",
    "zoneId": "ZONE_bahir_dar_town_admin"
  },
  "WOREDA_bahir_dar_town_admin_zege_town": {
    "lat": 11.699,
    "lng": 37.347,
    "name": "Zege town",
    "zoneId": "ZONE_bahir_dar_town_admin"
  },
  "zege town": {
    "lat": 11.699,
    "lng": 37.347,
    "name": "Zege town",
    "zoneId": "ZONE_bahir_dar_town_admin"
  },
  "WOREDA_bahir_dar_town_admin_deq": {
    "lat": 11.963,
    "lng": 37.289,
    "name": "Deq",
    "zoneId": "ZONE_bahir_dar_town_admin"
  },
  "deq": {
    "lat": 11.963,
    "lng": 37.289,
    "name": "Deq",
    "zoneId": "ZONE_bahir_dar_town_admin"
  },
  "WOREDA_bahir_dar_town_admin_meshenti_town": {
    "lat": 11.461,
    "lng": 37.266,
    "name": "Meshenti town",
    "zoneId": "ZONE_bahir_dar_town_admin"
  },
  "meshenti town": {
    "lat": 11.461,
    "lng": 37.266,
    "name": "Meshenti town",
    "zoneId": "ZONE_bahir_dar_town_admin"
  },
  "WOREDA_bahir_dar_town_admin_tis_abay_town": {
    "lat": 11.496,
    "lng": 37.568,
    "name": "Tis Abay town",
    "zoneId": "ZONE_bahir_dar_town_admin"
  },
  "tis abay town": {
    "lat": 11.496,
    "lng": 37.568,
    "name": "Tis Abay town",
    "zoneId": "ZONE_bahir_dar_town_admin"
  },
  "WOREDA_west_wellega_mana_sibu": {
    "lat": 9.758,
    "lng": 35.029,
    "name": "Mana Sibu",
    "zoneId": "ZONE_west_wellega"
  },
  "mana sibu": {
    "lat": 9.758,
    "lng": 35.029,
    "name": "Mana Sibu",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_nejo": {
    "lat": 9.567,
    "lng": 35.592,
    "name": "Nejo",
    "zoneId": "ZONE_west_wellega"
  },
  "nejo": {
    "lat": 9.567,
    "lng": 35.592,
    "name": "Nejo",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_gimbi": {
    "lat": 9.106,
    "lng": 35.971,
    "name": "Gimbi",
    "zoneId": "ZONE_west_wellega"
  },
  "gimbi": {
    "lat": 9.106,
    "lng": 35.971,
    "name": "Gimbi",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_lalo_asabi": {
    "lat": 9.205,
    "lng": 35.671,
    "name": "Lalo Asabi",
    "zoneId": "ZONE_west_wellega"
  },
  "lalo asabi": {
    "lat": 9.205,
    "lng": 35.671,
    "name": "Lalo Asabi",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_kiltu_kara": {
    "lat": 9.712,
    "lng": 35.278,
    "name": "Kiltu Kara",
    "zoneId": "ZONE_west_wellega"
  },
  "kiltu kara": {
    "lat": 9.712,
    "lng": 35.278,
    "name": "Kiltu Kara",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_boji_dirmeji": {
    "lat": 9.401,
    "lng": 35.634,
    "name": "Boji Dirmeji",
    "zoneId": "ZONE_west_wellega"
  },
  "boji dirmeji": {
    "lat": 9.401,
    "lng": 35.634,
    "name": "Boji Dirmeji",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_ayira": {
    "lat": 9.131,
    "lng": 35.312,
    "name": "Ayira",
    "zoneId": "ZONE_west_wellega"
  },
  "ayira": {
    "lat": 9.131,
    "lng": 35.312,
    "name": "Ayira",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_jarso_west_wellega": {
    "lat": 9.444,
    "lng": 35.325,
    "name": "Jarso (West Wellega)",
    "zoneId": "ZONE_west_wellega"
  },
  "jarso (west wellega)": {
    "lat": 9.444,
    "lng": 35.325,
    "name": "Jarso (West Wellega)",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_gudetu_kondole": {
    "lat": 9.397,
    "lng": 34.758,
    "name": "Gudetu Kondole",
    "zoneId": "ZONE_west_wellega"
  },
  "gudetu kondole": {
    "lat": 9.397,
    "lng": 34.758,
    "name": "Gudetu Kondole",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_boji_chekorsa": {
    "lat": 9.285,
    "lng": 35.506,
    "name": "Boji Chekorsa",
    "zoneId": "ZONE_west_wellega"
  },
  "boji chekorsa": {
    "lat": 9.285,
    "lng": 35.506,
    "name": "Boji Chekorsa",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_babo": {
    "lat": 9.446,
    "lng": 35.097,
    "name": "Babo",
    "zoneId": "ZONE_west_wellega"
  },
  "babo": {
    "lat": 9.446,
    "lng": 35.097,
    "name": "Babo",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_yubdo": {
    "lat": 8.974,
    "lng": 35.458,
    "name": "Yubdo",
    "zoneId": "ZONE_west_wellega"
  },
  "yubdo": {
    "lat": 8.974,
    "lng": 35.458,
    "name": "Yubdo",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_gaji": {
    "lat": 9.037,
    "lng": 35.596,
    "name": "Gaji",
    "zoneId": "ZONE_west_wellega"
  },
  "gaji": {
    "lat": 9.037,
    "lng": 35.596,
    "name": "Gaji",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_haru": {
    "lat": 8.981,
    "lng": 35.856,
    "name": "Haru",
    "zoneId": "ZONE_west_wellega"
  },
  "haru": {
    "lat": 8.981,
    "lng": 35.856,
    "name": "Haru",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_nole_kaba": {
    "lat": 8.805,
    "lng": 35.785,
    "name": "Nole Kaba",
    "zoneId": "ZONE_west_wellega"
  },
  "nole kaba": {
    "lat": 8.805,
    "lng": 35.785,
    "name": "Nole Kaba",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_begi": {
    "lat": 9.361,
    "lng": 34.52,
    "name": "Begi",
    "zoneId": "ZONE_west_wellega"
  },
  "begi": {
    "lat": 9.361,
    "lng": 34.52,
    "name": "Begi",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_homa": {
    "lat": 9.061,
    "lng": 35.713,
    "name": "Homa",
    "zoneId": "ZONE_west_wellega"
  },
  "homa": {
    "lat": 9.061,
    "lng": 35.713,
    "name": "Homa",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_sayo_nole": {
    "lat": 8.839,
    "lng": 35.582,
    "name": "Sayo Nole",
    "zoneId": "ZONE_west_wellega"
  },
  "sayo nole": {
    "lat": 8.839,
    "lng": 35.582,
    "name": "Sayo Nole",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_guliso": {
    "lat": 9.27,
    "lng": 35.318,
    "name": "Guliso",
    "zoneId": "ZONE_west_wellega"
  },
  "guliso": {
    "lat": 9.27,
    "lng": 35.318,
    "name": "Guliso",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_gimbi_town": {
    "lat": 9.174,
    "lng": 35.83,
    "name": "Gimbi town",
    "zoneId": "ZONE_west_wellega"
  },
  "gimbi town": {
    "lat": 9.174,
    "lng": 35.83,
    "name": "Gimbi town",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_leta_sibu": {
    "lat": 9.597,
    "lng": 35.347,
    "name": "Leta Sibu",
    "zoneId": "ZONE_west_wellega"
  },
  "leta sibu": {
    "lat": 9.597,
    "lng": 35.347,
    "name": "Leta Sibu",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_mendi_town": {
    "lat": 9.801,
    "lng": 35.102,
    "name": "Mendi town",
    "zoneId": "ZONE_west_wellega"
  },
  "mendi town": {
    "lat": 9.801,
    "lng": 35.102,
    "name": "Mendi town",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_west_wellega_nejo_town": {
    "lat": 9.502,
    "lng": 35.506,
    "name": "Nejo town",
    "zoneId": "ZONE_west_wellega"
  },
  "nejo town": {
    "lat": 9.502,
    "lng": 35.506,
    "name": "Nejo town",
    "zoneId": "ZONE_west_wellega"
  },
  "WOREDA_east_wellega_limu_or": {
    "lat": 9.715,
    "lng": 36.461,
    "name": "Limu (OR)",
    "zoneId": "ZONE_east_wellega"
  },
  "limu (or)": {
    "lat": 9.715,
    "lng": 36.461,
    "name": "Limu (OR)",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_ibantu": {
    "lat": 10.071,
    "lng": 36.445,
    "name": "Ibantu",
    "zoneId": "ZONE_east_wellega"
  },
  "ibantu": {
    "lat": 10.071,
    "lng": 36.445,
    "name": "Ibantu",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_gida_ayana": {
    "lat": 9.906,
    "lng": 36.646,
    "name": "Gida Ayana",
    "zoneId": "ZONE_east_wellega"
  },
  "gida ayana": {
    "lat": 9.906,
    "lng": 36.646,
    "name": "Gida Ayana",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_haro_limu": {
    "lat": 9.817,
    "lng": 36.254,
    "name": "Haro Limu",
    "zoneId": "ZONE_east_wellega"
  },
  "haro limu": {
    "lat": 9.817,
    "lng": 36.254,
    "name": "Haro Limu",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_boneya_boshe": {
    "lat": 8.916,
    "lng": 37.039,
    "name": "Boneya Boshe",
    "zoneId": "ZONE_east_wellega"
  },
  "boneya boshe": {
    "lat": 8.916,
    "lng": 37.039,
    "name": "Boneya Boshe",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_wayu_tuka": {
    "lat": 9.017,
    "lng": 36.624,
    "name": "Wayu Tuka",
    "zoneId": "ZONE_east_wellega"
  },
  "wayu tuka": {
    "lat": 9.017,
    "lng": 36.624,
    "name": "Wayu Tuka",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_bila_seyo": {
    "lat": 9.392,
    "lng": 36.934,
    "name": "Bila Seyo",
    "zoneId": "ZONE_east_wellega"
  },
  "bila seyo": {
    "lat": 9.392,
    "lng": 36.934,
    "name": "Bila Seyo",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_gobu_seyo": {
    "lat": 9.165,
    "lng": 36.976,
    "name": "Gobu Seyo",
    "zoneId": "ZONE_east_wellega"
  },
  "gobu seyo": {
    "lat": 9.165,
    "lng": 36.976,
    "name": "Gobu Seyo",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_sibu_sire": {
    "lat": 9.138,
    "lng": 36.887,
    "name": "Sibu Sire",
    "zoneId": "ZONE_east_wellega"
  },
  "sibu sire": {
    "lat": 9.138,
    "lng": 36.887,
    "name": "Sibu Sire",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_diga": {
    "lat": 9.049,
    "lng": 36.318,
    "name": "Diga",
    "zoneId": "ZONE_east_wellega"
  },
  "diga": {
    "lat": 9.049,
    "lng": 36.318,
    "name": "Diga",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_sasiga": {
    "lat": 9.228,
    "lng": 36.382,
    "name": "Sasiga",
    "zoneId": "ZONE_east_wellega"
  },
  "sasiga": {
    "lat": 9.228,
    "lng": 36.382,
    "name": "Sasiga",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_leka_dulecha": {
    "lat": 8.902,
    "lng": 36.465,
    "name": "Leka Dulecha",
    "zoneId": "ZONE_east_wellega"
  },
  "leka dulecha": {
    "lat": 8.902,
    "lng": 36.465,
    "name": "Leka Dulecha",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_guto_gida": {
    "lat": 9.197,
    "lng": 36.665,
    "name": "Guto Gida",
    "zoneId": "ZONE_east_wellega"
  },
  "guto gida": {
    "lat": 9.197,
    "lng": 36.665,
    "name": "Guto Gida",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_jimma_arjo": {
    "lat": 8.72,
    "lng": 36.463,
    "name": "Jimma Arjo",
    "zoneId": "ZONE_east_wellega"
  },
  "jimma arjo": {
    "lat": 8.72,
    "lng": 36.463,
    "name": "Jimma Arjo",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_nunu_kumba": {
    "lat": 8.713,
    "lng": 36.72,
    "name": "Nunu Kumba",
    "zoneId": "ZONE_east_wellega"
  },
  "nunu kumba": {
    "lat": 8.713,
    "lng": 36.72,
    "name": "Nunu Kumba",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_wama_hagalo": {
    "lat": 8.797,
    "lng": 36.892,
    "name": "Wama Hagalo",
    "zoneId": "ZONE_east_wellega"
  },
  "wama hagalo": {
    "lat": 8.797,
    "lng": 36.892,
    "name": "Wama Hagalo",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_kiremu": {
    "lat": 10.06,
    "lng": 36.81,
    "name": "Kiremu",
    "zoneId": "ZONE_east_wellega"
  },
  "kiremu": {
    "lat": 10.06,
    "lng": 36.81,
    "name": "Kiremu",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_east_wellega_nekemte_town": {
    "lat": 9.084,
    "lng": 36.547,
    "name": "Nekemte town",
    "zoneId": "ZONE_east_wellega"
  },
  "nekemte town": {
    "lat": 9.084,
    "lng": 36.547,
    "name": "Nekemte town",
    "zoneId": "ZONE_east_wellega"
  },
  "WOREDA_ilu_aba_bora_darimu": {
    "lat": 8.619,
    "lng": 35.378,
    "name": "Darimu",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "darimu": {
    "lat": 8.619,
    "lng": 35.378,
    "name": "Darimu",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_alge_sachi": {
    "lat": 8.594,
    "lng": 35.78,
    "name": "Alge Sachi",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "alge sachi": {
    "lat": 8.594,
    "lng": 35.78,
    "name": "Alge Sachi",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_yayu": {
    "lat": 8.272,
    "lng": 35.939,
    "name": "Yayu",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "yayu": {
    "lat": 8.272,
    "lng": 35.939,
    "name": "Yayu",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_metu_zuria": {
    "lat": 8.353,
    "lng": 35.422,
    "name": "Metu Zuria",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "metu zuria": {
    "lat": 8.353,
    "lng": 35.422,
    "name": "Metu Zuria",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_ale": {
    "lat": 8.122,
    "lng": 35.518,
    "name": "Ale",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "ale": {
    "lat": 8.122,
    "lng": 35.518,
    "name": "Ale",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_bure_or": {
    "lat": 8.328,
    "lng": 35.128,
    "name": "Bure (OR)",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "bure (or)": {
    "lat": 8.328,
    "lng": 35.128,
    "name": "Bure (OR)",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_sale_nono": {
    "lat": 7.889,
    "lng": 35.188,
    "name": "Sale Nono",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "sale nono": {
    "lat": 7.889,
    "lng": 35.188,
    "name": "Sale Nono",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_becho_ilu_aba_bora": {
    "lat": 8.091,
    "lng": 35.71,
    "name": "Becho (Ilu Aba Bora)",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "becho (ilu aba bora)": {
    "lat": 8.091,
    "lng": 35.71,
    "name": "Becho (Ilu Aba Bora)",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_bilo_nopha": {
    "lat": 8.43,
    "lng": 35.53,
    "name": "Bilo Nopha",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "bilo nopha": {
    "lat": 8.43,
    "lng": 35.53,
    "name": "Bilo Nopha",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_hurumu": {
    "lat": 8.147,
    "lng": 35.855,
    "name": "Hurumu",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "hurumu": {
    "lat": 8.147,
    "lng": 35.855,
    "name": "Hurumu",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_didu": {
    "lat": 7.937,
    "lng": 35.545,
    "name": "Didu",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "didu": {
    "lat": 7.937,
    "lng": 35.545,
    "name": "Didu",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_halu_huka": {
    "lat": 8.182,
    "lng": 35.348,
    "name": "Halu /Huka",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "halu /huka": {
    "lat": 8.182,
    "lng": 35.348,
    "name": "Halu /Huka",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_metu_town": {
    "lat": 8.307,
    "lng": 35.579,
    "name": "Metu town",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "metu town": {
    "lat": 8.307,
    "lng": 35.579,
    "name": "Metu town",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_ilu_aba_bora_dorani": {
    "lat": 8.449,
    "lng": 35.82,
    "name": "Dorani",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "dorani": {
    "lat": 8.449,
    "lng": 35.82,
    "name": "Dorani",
    "zoneId": "ZONE_ilu_aba_bora"
  },
  "WOREDA_jimma_limu_seka": {
    "lat": 8.4,
    "lng": 36.884,
    "name": "Limu Seka",
    "zoneId": "ZONE_jimma"
  },
  "limu seka": {
    "lat": 8.4,
    "lng": 36.884,
    "name": "Limu Seka",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_limu_kosa": {
    "lat": 8.028,
    "lng": 36.957,
    "name": "Limu Kosa",
    "zoneId": "ZONE_jimma"
  },
  "limu kosa": {
    "lat": 8.028,
    "lng": 36.957,
    "name": "Limu Kosa",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_sekoru": {
    "lat": 8.115,
    "lng": 37.508,
    "name": "Sekoru",
    "zoneId": "ZONE_jimma"
  },
  "sekoru": {
    "lat": 8.115,
    "lng": 37.508,
    "name": "Sekoru",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_tiro_afeta": {
    "lat": 7.96,
    "lng": 37.254,
    "name": "Tiro Afeta",
    "zoneId": "ZONE_jimma"
  },
  "tiro afeta": {
    "lat": 7.96,
    "lng": 37.254,
    "name": "Tiro Afeta",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_kersa_jimma": {
    "lat": 7.778,
    "lng": 37.033,
    "name": "Kersa (Jimma)",
    "zoneId": "ZONE_jimma"
  },
  "kersa (jimma)": {
    "lat": 7.778,
    "lng": 37.033,
    "name": "Kersa (Jimma)",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_mena_jimma": {
    "lat": 7.781,
    "lng": 36.76,
    "name": "Mena (Jimma)",
    "zoneId": "ZONE_jimma"
  },
  "mena (jimma)": {
    "lat": 7.781,
    "lng": 36.76,
    "name": "Mena (Jimma)",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_goma": {
    "lat": 7.81,
    "lng": 36.505,
    "name": "Goma",
    "zoneId": "ZONE_jimma"
  },
  "goma": {
    "lat": 7.81,
    "lng": 36.505,
    "name": "Goma",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_gera": {
    "lat": 7.697,
    "lng": 36.242,
    "name": "Gera",
    "zoneId": "ZONE_jimma"
  },
  "gera": {
    "lat": 7.697,
    "lng": 36.242,
    "name": "Gera",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_seka_chekorsa": {
    "lat": 7.537,
    "lng": 36.705,
    "name": "Seka Chekorsa",
    "zoneId": "ZONE_jimma"
  },
  "seka chekorsa": {
    "lat": 7.537,
    "lng": 36.705,
    "name": "Seka Chekorsa",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_dedo": {
    "lat": 7.439,
    "lng": 36.84,
    "name": "Dedo",
    "zoneId": "ZONE_jimma"
  },
  "dedo": {
    "lat": 7.439,
    "lng": 36.84,
    "name": "Dedo",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_omo_nada": {
    "lat": 7.637,
    "lng": 37.202,
    "name": "Omo Nada",
    "zoneId": "ZONE_jimma"
  },
  "omo nada": {
    "lat": 7.637,
    "lng": 37.202,
    "name": "Omo Nada",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_sigmo": {
    "lat": 7.923,
    "lng": 36.019,
    "name": "Sigmo",
    "zoneId": "ZONE_jimma"
  },
  "sigmo": {
    "lat": 7.923,
    "lng": 36.019,
    "name": "Sigmo",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_setema": {
    "lat": 8.064,
    "lng": 36.215,
    "name": "Setema",
    "zoneId": "ZONE_jimma"
  },
  "setema": {
    "lat": 8.064,
    "lng": 36.215,
    "name": "Setema",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_shebe_sambo": {
    "lat": 7.518,
    "lng": 36.462,
    "name": "Shebe Sambo",
    "zoneId": "ZONE_jimma"
  },
  "shebe sambo": {
    "lat": 7.518,
    "lng": 36.462,
    "name": "Shebe Sambo",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_chora_jimma": {
    "lat": 8.277,
    "lng": 37.082,
    "name": "Chora (Jimma)",
    "zoneId": "ZONE_jimma"
  },
  "chora (jimma)": {
    "lat": 8.277,
    "lng": 37.082,
    "name": "Chora (Jimma)",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_gumay": {
    "lat": 7.971,
    "lng": 36.431,
    "name": "Gumay",
    "zoneId": "ZONE_jimma"
  },
  "gumay": {
    "lat": 7.971,
    "lng": 36.431,
    "name": "Gumay",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_agaro_town": {
    "lat": 7.856,
    "lng": 36.597,
    "name": "Agaro town",
    "zoneId": "ZONE_jimma"
  },
  "agaro town": {
    "lat": 7.856,
    "lng": 36.597,
    "name": "Agaro town",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_jimma_town": {
    "lat": 7.664,
    "lng": 36.83,
    "name": "Jimma town",
    "zoneId": "ZONE_jimma"
  },
  "jimma town": {
    "lat": 7.664,
    "lng": 36.83,
    "name": "Jimma town",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_mancho": {
    "lat": 7.388,
    "lng": 37.039,
    "name": "Mancho",
    "zoneId": "ZONE_jimma"
  },
  "mancho": {
    "lat": 7.388,
    "lng": 37.039,
    "name": "Mancho",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_omo_beyam": {
    "lat": 7.452,
    "lng": 37.269,
    "name": "Omo Beyam",
    "zoneId": "ZONE_jimma"
  },
  "omo beyam": {
    "lat": 7.452,
    "lng": 37.269,
    "name": "Omo Beyam",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_botor_tolay": {
    "lat": 8.281,
    "lng": 37.327,
    "name": "Botor Tolay",
    "zoneId": "ZONE_jimma"
  },
  "botor tolay": {
    "lat": 8.281,
    "lng": 37.327,
    "name": "Botor Tolay",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_jimma_nono_benja": {
    "lat": 8.668,
    "lng": 37.089,
    "name": "Nono Benja",
    "zoneId": "ZONE_jimma"
  },
  "nono benja": {
    "lat": 8.668,
    "lng": 37.089,
    "name": "Nono Benja",
    "zoneId": "ZONE_jimma"
  },
  "WOREDA_west_shewa_illu_galan": {
    "lat": 8.97,
    "lng": 37.294,
    "name": "Illu Galan",
    "zoneId": "ZONE_west_shewa"
  },
  "illu galan": {
    "lat": 8.97,
    "lng": 37.294,
    "name": "Illu Galan",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_ginde_beret": {
    "lat": 9.637,
    "lng": 37.752,
    "name": "Ginde Beret",
    "zoneId": "ZONE_west_shewa"
  },
  "ginde beret": {
    "lat": 9.637,
    "lng": 37.752,
    "name": "Ginde Beret",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_jeldu": {
    "lat": 9.215,
    "lng": 38.182,
    "name": "Jeldu",
    "zoneId": "ZONE_west_shewa"
  },
  "jeldu": {
    "lat": 9.215,
    "lng": 38.182,
    "name": "Jeldu",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_ambo_zuria": {
    "lat": 9.045,
    "lng": 37.857,
    "name": "Ambo Zuria",
    "zoneId": "ZONE_west_shewa"
  },
  "ambo zuria": {
    "lat": 9.045,
    "lng": 37.857,
    "name": "Ambo Zuria",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_mida_kegn": {
    "lat": 9.201,
    "lng": 37.569,
    "name": "Mida Kegn",
    "zoneId": "ZONE_west_shewa"
  },
  "mida kegn": {
    "lat": 9.201,
    "lng": 37.569,
    "name": "Mida Kegn",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_cheliya": {
    "lat": 9.023,
    "lng": 37.458,
    "name": "Cheliya",
    "zoneId": "ZONE_west_shewa"
  },
  "cheliya": {
    "lat": 9.023,
    "lng": 37.458,
    "name": "Cheliya",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_bako_tibe": {
    "lat": 9.096,
    "lng": 37.154,
    "name": "Bako Tibe",
    "zoneId": "ZONE_west_shewa"
  },
  "bako tibe": {
    "lat": 9.096,
    "lng": 37.154,
    "name": "Bako Tibe",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_dano": {
    "lat": 8.755,
    "lng": 37.29,
    "name": "Dano",
    "zoneId": "ZONE_west_shewa"
  },
  "dano": {
    "lat": 8.755,
    "lng": 37.29,
    "name": "Dano",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_nono": {
    "lat": 8.522,
    "lng": 37.439,
    "name": "Nono",
    "zoneId": "ZONE_west_shewa"
  },
  "nono": {
    "lat": 8.522,
    "lng": 37.439,
    "name": "Nono",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_tikur_enchini": {
    "lat": 8.793,
    "lng": 37.644,
    "name": "Tikur Enchini",
    "zoneId": "ZONE_west_shewa"
  },
  "tikur enchini": {
    "lat": 8.793,
    "lng": 37.644,
    "name": "Tikur Enchini",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_dendi": {
    "lat": 8.972,
    "lng": 38.091,
    "name": "Dendi",
    "zoneId": "ZONE_west_shewa"
  },
  "dendi": {
    "lat": 8.972,
    "lng": 38.091,
    "name": "Dendi",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_ejere_addis_alem": {
    "lat": 9.068,
    "lng": 38.363,
    "name": "Ejere /Addis Alem",
    "zoneId": "ZONE_west_shewa"
  },
  "ejere /addis alem": {
    "lat": 9.068,
    "lng": 38.363,
    "name": "Ejere /Addis Alem",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_holeta_town": {
    "lat": 9.063,
    "lng": 38.499,
    "name": "Holeta town",
    "zoneId": "ZONE_west_shewa"
  },
  "holeta town": {
    "lat": 9.063,
    "lng": 38.499,
    "name": "Holeta town",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_adda_berga": {
    "lat": 9.428,
    "lng": 38.417,
    "name": "Adda Berga",
    "zoneId": "ZONE_west_shewa"
  },
  "adda berga": {
    "lat": 9.428,
    "lng": 38.417,
    "name": "Adda Berga",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_meta_robi": {
    "lat": 9.347,
    "lng": 38.235,
    "name": "Meta Robi",
    "zoneId": "ZONE_west_shewa"
  },
  "meta robi": {
    "lat": 9.347,
    "lng": 38.235,
    "name": "Meta Robi",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_ambo_town": {
    "lat": 8.979,
    "lng": 37.861,
    "name": "Ambo town",
    "zoneId": "ZONE_west_shewa"
  },
  "ambo town": {
    "lat": 8.979,
    "lng": 37.861,
    "name": "Ambo town",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_abuna_ginde_beret": {
    "lat": 9.668,
    "lng": 37.982,
    "name": "Abuna Ginde Beret",
    "zoneId": "ZONE_west_shewa"
  },
  "abuna ginde beret": {
    "lat": 9.668,
    "lng": 37.982,
    "name": "Abuna Ginde Beret",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_toke_kutaye": {
    "lat": 8.951,
    "lng": 37.717,
    "name": "Toke Kutaye",
    "zoneId": "ZONE_west_shewa"
  },
  "toke kutaye": {
    "lat": 8.951,
    "lng": 37.717,
    "name": "Toke Kutaye",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_jibat": {
    "lat": 8.715,
    "lng": 37.485,
    "name": "Jibat",
    "zoneId": "ZONE_west_shewa"
  },
  "jibat": {
    "lat": 8.715,
    "lng": 37.485,
    "name": "Jibat",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_ifata": {
    "lat": 9.181,
    "lng": 37.924,
    "name": "Ifata",
    "zoneId": "ZONE_west_shewa"
  },
  "ifata": {
    "lat": 9.181,
    "lng": 37.924,
    "name": "Ifata",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_welmera": {
    "lat": 9.163,
    "lng": 38.477,
    "name": "Welmera",
    "zoneId": "ZONE_west_shewa"
  },
  "welmera": {
    "lat": 9.163,
    "lng": 38.477,
    "name": "Welmera",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_ejersa_lafo": {
    "lat": 9.015,
    "lng": 38.255,
    "name": "Ejersa Lafo",
    "zoneId": "ZONE_west_shewa"
  },
  "ejersa lafo": {
    "lat": 9.015,
    "lng": 38.255,
    "name": "Ejersa Lafo",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_cobi": {
    "lat": 9.362,
    "lng": 37.862,
    "name": "Cobi",
    "zoneId": "ZONE_west_shewa"
  },
  "cobi": {
    "lat": 9.362,
    "lng": 37.862,
    "name": "Cobi",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_meta_walkite": {
    "lat": 9.577,
    "lng": 38.235,
    "name": "Meta Walkite",
    "zoneId": "ZONE_west_shewa"
  },
  "meta walkite": {
    "lat": 9.577,
    "lng": 38.235,
    "name": "Meta Walkite",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_west_shewa_liban_jawi": {
    "lat": 8.925,
    "lng": 37.521,
    "name": "Liban Jawi",
    "zoneId": "ZONE_west_shewa"
  },
  "liban jawi": {
    "lat": 8.925,
    "lng": 37.521,
    "name": "Liban Jawi",
    "zoneId": "ZONE_west_shewa"
  },
  "WOREDA_north_shewa_or_wara_jarso": {
    "lat": 9.954,
    "lng": 38.218,
    "name": "Wara Jarso",
    "zoneId": "ZONE_north_shewa_or"
  },
  "wara jarso": {
    "lat": 9.954,
    "lng": 38.218,
    "name": "Wara Jarso",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_dera_or": {
    "lat": 10.213,
    "lng": 38.633,
    "name": "Dera (OR)",
    "zoneId": "ZONE_north_shewa_or"
  },
  "dera (or)": {
    "lat": 10.213,
    "lng": 38.633,
    "name": "Dera (OR)",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_hidabu_abote": {
    "lat": 9.959,
    "lng": 38.516,
    "name": "Hidabu Abote",
    "zoneId": "ZONE_north_shewa_or"
  },
  "hidabu abote": {
    "lat": 9.959,
    "lng": 38.516,
    "name": "Hidabu Abote",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_kuyu": {
    "lat": 9.748,
    "lng": 38.305,
    "name": "Kuyu",
    "zoneId": "ZONE_north_shewa_or"
  },
  "kuyu": {
    "lat": 9.748,
    "lng": 38.305,
    "name": "Kuyu",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_degem": {
    "lat": 9.815,
    "lng": 38.601,
    "name": "Degem",
    "zoneId": "ZONE_north_shewa_or"
  },
  "degem": {
    "lat": 9.815,
    "lng": 38.601,
    "name": "Degem",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_gerar_jarso": {
    "lat": 9.834,
    "lng": 38.772,
    "name": "Gerar Jarso",
    "zoneId": "ZONE_north_shewa_or"
  },
  "gerar jarso": {
    "lat": 9.834,
    "lng": 38.772,
    "name": "Gerar Jarso",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_debre_libanos": {
    "lat": 9.66,
    "lng": 38.853,
    "name": "Debre Libanos",
    "zoneId": "ZONE_north_shewa_or"
  },
  "debre libanos": {
    "lat": 9.66,
    "lng": 38.853,
    "name": "Debre Libanos",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_wuchale": {
    "lat": 9.524,
    "lng": 38.775,
    "name": "Wuchale",
    "zoneId": "ZONE_north_shewa_or"
  },
  "wuchale": {
    "lat": 9.524,
    "lng": 38.775,
    "name": "Wuchale",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_abichugna_gne_a": {
    "lat": 9.609,
    "lng": 39.233,
    "name": "Abichugna Gne'a",
    "zoneId": "ZONE_north_shewa_or"
  },
  "abichugna gne'a": {
    "lat": 9.609,
    "lng": 39.233,
    "name": "Abichugna Gne'a",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_kimbibit": {
    "lat": 9.402,
    "lng": 39.229,
    "name": "Kimbibit",
    "zoneId": "ZONE_north_shewa_or"
  },
  "kimbibit": {
    "lat": 9.402,
    "lng": 39.229,
    "name": "Kimbibit",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_sheno_town": {
    "lat": 9.299,
    "lng": 39.253,
    "name": "Sheno town",
    "zoneId": "ZONE_north_shewa_or"
  },
  "sheno town": {
    "lat": 9.299,
    "lng": 39.253,
    "name": "Sheno town",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_fiche_town": {
    "lat": 9.788,
    "lng": 38.737,
    "name": "Fiche town",
    "zoneId": "ZONE_north_shewa_or"
  },
  "fiche town": {
    "lat": 9.788,
    "lng": 38.737,
    "name": "Fiche town",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_yaya_gulele": {
    "lat": 9.593,
    "lng": 38.622,
    "name": "Yaya Gulele",
    "zoneId": "ZONE_north_shewa_or"
  },
  "yaya gulele": {
    "lat": 9.593,
    "lng": 38.622,
    "name": "Yaya Gulele",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_jida": {
    "lat": 9.399,
    "lng": 39.003,
    "name": "Jida",
    "zoneId": "ZONE_north_shewa_or"
  },
  "jida": {
    "lat": 9.399,
    "lng": 39.003,
    "name": "Jida",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_garba_guracha": {
    "lat": 9.809,
    "lng": 38.416,
    "name": "Garba Guracha",
    "zoneId": "ZONE_north_shewa_or"
  },
  "garba guracha": {
    "lat": 9.809,
    "lng": 38.416,
    "name": "Garba Guracha",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_aleltu": {
    "lat": 9.213,
    "lng": 39.131,
    "name": "Aleltu",
    "zoneId": "ZONE_north_shewa_or"
  },
  "aleltu": {
    "lat": 9.213,
    "lng": 39.131,
    "name": "Aleltu",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_bereh": {
    "lat": 9.236,
    "lng": 38.921,
    "name": "Bereh",
    "zoneId": "ZONE_north_shewa_or"
  },
  "bereh": {
    "lat": 9.236,
    "lng": 38.921,
    "name": "Bereh",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_sululta_or": {
    "lat": 9.386,
    "lng": 38.863,
    "name": "Sululta (OR)",
    "zoneId": "ZONE_north_shewa_or"
  },
  "sululta (or)": {
    "lat": 9.386,
    "lng": 38.863,
    "name": "Sululta (OR)",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_chancho_town": {
    "lat": 9.299,
    "lng": 38.746,
    "name": "Chancho town",
    "zoneId": "ZONE_north_shewa_or"
  },
  "chancho town": {
    "lat": 9.299,
    "lng": 38.746,
    "name": "Chancho town",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_mulo": {
    "lat": 9.286,
    "lng": 38.574,
    "name": "Mulo",
    "zoneId": "ZONE_north_shewa_or"
  },
  "mulo": {
    "lat": 9.286,
    "lng": 38.574,
    "name": "Mulo",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_north_shewa_or_sendafa_town": {
    "lat": 9.159,
    "lng": 39.02,
    "name": "Sendafa town",
    "zoneId": "ZONE_north_shewa_or"
  },
  "sendafa town": {
    "lat": 9.159,
    "lng": 39.02,
    "name": "Sendafa town",
    "zoneId": "ZONE_north_shewa_or"
  },
  "WOREDA_east_shewa_fentale": {
    "lat": 8.919,
    "lng": 39.879,
    "name": "Fentale",
    "zoneId": "ZONE_east_shewa"
  },
  "fentale": {
    "lat": 8.919,
    "lng": 39.879,
    "name": "Fentale",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_boset": {
    "lat": 8.642,
    "lng": 39.545,
    "name": "Boset",
    "zoneId": "ZONE_east_shewa"
  },
  "boset": {
    "lat": 8.642,
    "lng": 39.545,
    "name": "Boset",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_adama": {
    "lat": 8.317,
    "lng": 39.213,
    "name": "Adama",
    "zoneId": "ZONE_east_shewa"
  },
  "adama": {
    "lat": 8.317,
    "lng": 39.213,
    "name": "Adama",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_lome_or": {
    "lat": 8.617,
    "lng": 39.209,
    "name": "Lome (OR)",
    "zoneId": "ZONE_east_shewa"
  },
  "lome (or)": {
    "lat": 8.617,
    "lng": 39.209,
    "name": "Lome (OR)",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_gimbichu": {
    "lat": 8.999,
    "lng": 39.188,
    "name": "Gimbichu",
    "zoneId": "ZONE_east_shewa"
  },
  "gimbichu": {
    "lat": 8.999,
    "lng": 39.188,
    "name": "Gimbichu",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_ada_a": {
    "lat": 8.843,
    "lng": 39.092,
    "name": "Ada'a",
    "zoneId": "ZONE_east_shewa"
  },
  "ada'a": {
    "lat": 8.843,
    "lng": 39.092,
    "name": "Ada'a",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_dugda": {
    "lat": 8.177,
    "lng": 38.765,
    "name": "Dugda",
    "zoneId": "ZONE_east_shewa"
  },
  "dugda": {
    "lat": 8.177,
    "lng": 38.765,
    "name": "Dugda",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_adama_tulu_jido_kombolcha": {
    "lat": 7.757,
    "lng": 38.659,
    "name": "Adama Tulu Jido Kombolcha",
    "zoneId": "ZONE_east_shewa"
  },
  "adama tulu jido kombolcha": {
    "lat": 7.757,
    "lng": 38.659,
    "name": "Adama Tulu Jido Kombolcha",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_bishoftu_town": {
    "lat": 8.756,
    "lng": 38.959,
    "name": "Bishoftu town",
    "zoneId": "ZONE_east_shewa"
  },
  "bishoftu town": {
    "lat": 8.756,
    "lng": 38.959,
    "name": "Bishoftu town",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_bora_or": {
    "lat": 8.314,
    "lng": 38.925,
    "name": "Bora (OR)",
    "zoneId": "ZONE_east_shewa"
  },
  "bora (or)": {
    "lat": 8.314,
    "lng": 38.925,
    "name": "Bora (OR)",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_liben_chukala": {
    "lat": 8.504,
    "lng": 38.889,
    "name": "Liben Chukala",
    "zoneId": "ZONE_east_shewa"
  },
  "liben chukala": {
    "lat": 8.504,
    "lng": 38.889,
    "name": "Liben Chukala",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_akaki": {
    "lat": 8.68,
    "lng": 38.768,
    "name": "Akaki",
    "zoneId": "ZONE_east_shewa"
  },
  "akaki": {
    "lat": 8.68,
    "lng": 38.768,
    "name": "Akaki",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_adama_town": {
    "lat": 8.491,
    "lng": 39.279,
    "name": "Adama town",
    "zoneId": "ZONE_east_shewa"
  },
  "adama town": {
    "lat": 8.491,
    "lng": 39.279,
    "name": "Adama town",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_mojo_town": {
    "lat": 8.589,
    "lng": 39.123,
    "name": "Mojo town",
    "zoneId": "ZONE_east_shewa"
  },
  "mojo town": {
    "lat": 8.589,
    "lng": 39.123,
    "name": "Mojo town",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_batu_town": {
    "lat": 7.924,
    "lng": 38.699,
    "name": "Batu town",
    "zoneId": "ZONE_east_shewa"
  },
  "batu town": {
    "lat": 7.924,
    "lng": 38.699,
    "name": "Batu town",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_east_shewa_metehara_town": {
    "lat": 8.898,
    "lng": 39.921,
    "name": "Metehara town",
    "zoneId": "ZONE_east_shewa"
  },
  "metehara town": {
    "lat": 8.898,
    "lng": 39.921,
    "name": "Metehara town",
    "zoneId": "ZONE_east_shewa"
  },
  "WOREDA_arsi_merti": {
    "lat": 8.529,
    "lng": 39.839,
    "name": "Merti",
    "zoneId": "ZONE_arsi"
  },
  "merti": {
    "lat": 8.529,
    "lng": 39.839,
    "name": "Merti",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_aseko": {
    "lat": 8.531,
    "lng": 40.06,
    "name": "Aseko",
    "zoneId": "ZONE_arsi"
  },
  "aseko": {
    "lat": 8.531,
    "lng": 40.06,
    "name": "Aseko",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_golocha": {
    "lat": 8.216,
    "lng": 40.156,
    "name": "Golocha",
    "zoneId": "ZONE_arsi"
  },
  "golocha": {
    "lat": 8.216,
    "lng": 40.156,
    "name": "Golocha",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_jeju": {
    "lat": 8.359,
    "lng": 39.657,
    "name": "Jeju",
    "zoneId": "ZONE_arsi"
  },
  "jeju": {
    "lat": 8.359,
    "lng": 39.657,
    "name": "Jeju",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_dodota": {
    "lat": 8.248,
    "lng": 39.297,
    "name": "Dodota",
    "zoneId": "ZONE_arsi"
  },
  "dodota": {
    "lat": 8.248,
    "lng": 39.297,
    "name": "Dodota",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_ziway_dugda": {
    "lat": 8.009,
    "lng": 38.975,
    "name": "Ziway Dugda",
    "zoneId": "ZONE_arsi"
  },
  "ziway dugda": {
    "lat": 8.009,
    "lng": 38.975,
    "name": "Ziway Dugda",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_hitosa": {
    "lat": 8.071,
    "lng": 39.243,
    "name": "Hitosa",
    "zoneId": "ZONE_arsi"
  },
  "hitosa": {
    "lat": 8.071,
    "lng": 39.243,
    "name": "Hitosa",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_sude": {
    "lat": 8.011,
    "lng": 39.81,
    "name": "Sude",
    "zoneId": "ZONE_arsi"
  },
  "sude": {
    "lat": 8.011,
    "lng": 39.81,
    "name": "Sude",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_chole": {
    "lat": 8.133,
    "lng": 39.901,
    "name": "Chole",
    "zoneId": "ZONE_arsi"
  },
  "chole": {
    "lat": 8.133,
    "lng": 39.901,
    "name": "Chole",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_amigna": {
    "lat": 7.958,
    "lng": 40.187,
    "name": "Amigna",
    "zoneId": "ZONE_arsi"
  },
  "amigna": {
    "lat": 7.958,
    "lng": 40.187,
    "name": "Amigna",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_seru": {
    "lat": 7.724,
    "lng": 40.346,
    "name": "Seru",
    "zoneId": "ZONE_arsi"
  },
  "seru": {
    "lat": 7.724,
    "lng": 40.346,
    "name": "Seru",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_robe": {
    "lat": 7.672,
    "lng": 39.8,
    "name": "Robe",
    "zoneId": "ZONE_arsi"
  },
  "robe": {
    "lat": 7.672,
    "lng": 39.8,
    "name": "Robe",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_tena": {
    "lat": 7.791,
    "lng": 39.505,
    "name": "Tena",
    "zoneId": "ZONE_arsi"
  },
  "tena": {
    "lat": 7.791,
    "lng": 39.505,
    "name": "Tena",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_shirka": {
    "lat": 7.571,
    "lng": 39.577,
    "name": "Shirka",
    "zoneId": "ZONE_arsi"
  },
  "shirka": {
    "lat": 7.571,
    "lng": 39.577,
    "name": "Shirka",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_degeluna_tijo": {
    "lat": 7.75,
    "lng": 39.307,
    "name": "Degeluna Tijo",
    "zoneId": "ZONE_arsi"
  },
  "degeluna tijo": {
    "lat": 7.75,
    "lng": 39.307,
    "name": "Degeluna Tijo",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_tiyo": {
    "lat": 7.861,
    "lng": 39.132,
    "name": "Tiyo",
    "zoneId": "ZONE_arsi"
  },
  "tiyo": {
    "lat": 7.861,
    "lng": 39.132,
    "name": "Tiyo",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_munessa": {
    "lat": 7.525,
    "lng": 38.983,
    "name": "Munessa",
    "zoneId": "ZONE_arsi"
  },
  "munessa": {
    "lat": 7.525,
    "lng": 38.983,
    "name": "Munessa",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_limu_bilbilo": {
    "lat": 7.43,
    "lng": 39.271,
    "name": "Limu Bilbilo",
    "zoneId": "ZONE_arsi"
  },
  "limu bilbilo": {
    "lat": 7.43,
    "lng": 39.271,
    "name": "Limu Bilbilo",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_guna": {
    "lat": 8.329,
    "lng": 39.913,
    "name": "Guna",
    "zoneId": "ZONE_arsi"
  },
  "guna": {
    "lat": 8.329,
    "lng": 39.913,
    "name": "Guna",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_sire": {
    "lat": 8.298,
    "lng": 39.502,
    "name": "Sire",
    "zoneId": "ZONE_arsi"
  },
  "sire": {
    "lat": 8.298,
    "lng": 39.502,
    "name": "Sire",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_lude_hitosa": {
    "lat": 8.097,
    "lng": 39.406,
    "name": "Lude Hitosa",
    "zoneId": "ZONE_arsi"
  },
  "lude hitosa": {
    "lat": 8.097,
    "lng": 39.406,
    "name": "Lude Hitosa",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_diksis": {
    "lat": 8.043,
    "lng": 39.563,
    "name": "Diksis",
    "zoneId": "ZONE_arsi"
  },
  "diksis": {
    "lat": 8.043,
    "lng": 39.563,
    "name": "Diksis",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_bele_gesgar": {
    "lat": 7.683,
    "lng": 39.976,
    "name": "Bele Gesgar",
    "zoneId": "ZONE_arsi"
  },
  "bele gesgar": {
    "lat": 7.683,
    "lng": 39.976,
    "name": "Bele Gesgar",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_inkolo_wabe": {
    "lat": 7.424,
    "lng": 39.447,
    "name": "Inkolo Wabe",
    "zoneId": "ZONE_arsi"
  },
  "inkolo wabe": {
    "lat": 7.424,
    "lng": 39.447,
    "name": "Inkolo Wabe",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_asela_town": {
    "lat": 7.937,
    "lng": 39.134,
    "name": "Asela town",
    "zoneId": "ZONE_arsi"
  },
  "asela town": {
    "lat": 7.937,
    "lng": 39.134,
    "name": "Asela town",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_shanan_kolu": {
    "lat": 8.45,
    "lng": 40.235,
    "name": "Shanan Kolu",
    "zoneId": "ZONE_arsi"
  },
  "shanan kolu": {
    "lat": 8.45,
    "lng": 40.235,
    "name": "Shanan Kolu",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_bokoji_town": {
    "lat": 7.529,
    "lng": 39.248,
    "name": "Bokoji town",
    "zoneId": "ZONE_arsi"
  },
  "bokoji town": {
    "lat": 7.529,
    "lng": 39.248,
    "name": "Bokoji town",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_arsi_dera_town": {
    "lat": 8.32,
    "lng": 39.316,
    "name": "Dera town",
    "zoneId": "ZONE_arsi"
  },
  "dera town": {
    "lat": 8.32,
    "lng": 39.316,
    "name": "Dera town",
    "zoneId": "ZONE_arsi"
  },
  "WOREDA_west_hararge_mieso": {
    "lat": 9.275,
    "lng": 40.685,
    "name": "Mieso",
    "zoneId": "ZONE_west_hararge"
  },
  "mieso": {
    "lat": 9.275,
    "lng": 40.685,
    "name": "Mieso",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_doba": {
    "lat": 9.327,
    "lng": 41.08,
    "name": "Doba",
    "zoneId": "ZONE_west_hararge"
  },
  "doba": {
    "lat": 9.327,
    "lng": 41.08,
    "name": "Doba",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_tulo_or": {
    "lat": 9.177,
    "lng": 41.123,
    "name": "Tulo (OR)",
    "zoneId": "ZONE_west_hararge"
  },
  "tulo (or)": {
    "lat": 9.177,
    "lng": 41.123,
    "name": "Tulo (OR)",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_mesela_shen_duggoo": {
    "lat": 8.987,
    "lng": 41.178,
    "name": "Mesela /Shen Duggoo",
    "zoneId": "ZONE_west_hararge"
  },
  "mesela /shen duggoo": {
    "lat": 8.987,
    "lng": 41.178,
    "name": "Mesela /Shen Duggoo",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_chiro_town": {
    "lat": 9.079,
    "lng": 40.867,
    "name": "Chiro town",
    "zoneId": "ZONE_west_hararge"
  },
  "chiro town": {
    "lat": 9.079,
    "lng": 40.867,
    "name": "Chiro town",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_anchar": {
    "lat": 8.714,
    "lng": 40.202,
    "name": "Anchar",
    "zoneId": "ZONE_west_hararge"
  },
  "anchar": {
    "lat": 8.714,
    "lng": 40.202,
    "name": "Anchar",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_goba_koricha": {
    "lat": 8.97,
    "lng": 40.612,
    "name": "Goba Koricha",
    "zoneId": "ZONE_west_hararge"
  },
  "goba koricha": {
    "lat": 8.97,
    "lng": 40.612,
    "name": "Goba Koricha",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_habro": {
    "lat": 8.754,
    "lng": 40.512,
    "name": "Habro",
    "zoneId": "ZONE_west_hararge"
  },
  "habro": {
    "lat": 8.754,
    "lng": 40.512,
    "name": "Habro",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_daro_lebu": {
    "lat": 8.465,
    "lng": 40.469,
    "name": "Daro Lebu",
    "zoneId": "ZONE_west_hararge"
  },
  "daro lebu": {
    "lat": 8.465,
    "lng": 40.469,
    "name": "Daro Lebu",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_boke": {
    "lat": 8.613,
    "lng": 40.748,
    "name": "Boke",
    "zoneId": "ZONE_west_hararge"
  },
  "boke": {
    "lat": 8.613,
    "lng": 40.748,
    "name": "Boke",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_kuni_oda_bultum": {
    "lat": 8.579,
    "lng": 41.123,
    "name": "Kuni /Oda Bultum",
    "zoneId": "ZONE_west_hararge"
  },
  "kuni /oda bultum": {
    "lat": 8.579,
    "lng": 41.123,
    "name": "Kuni /Oda Bultum",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_gemechis": {
    "lat": 8.858,
    "lng": 40.984,
    "name": "Gemechis",
    "zoneId": "ZONE_west_hararge"
  },
  "gemechis": {
    "lat": 8.858,
    "lng": 40.984,
    "name": "Gemechis",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_chiro_zuria": {
    "lat": 9.057,
    "lng": 40.739,
    "name": "Chiro Zuria",
    "zoneId": "ZONE_west_hararge"
  },
  "chiro zuria": {
    "lat": 9.057,
    "lng": 40.739,
    "name": "Chiro Zuria",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_bedesa_town": {
    "lat": 8.905,
    "lng": 40.775,
    "name": "Bedesa town",
    "zoneId": "ZONE_west_hararge"
  },
  "bedesa town": {
    "lat": 8.905,
    "lng": 40.775,
    "name": "Bedesa town",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_hawi_gudina": {
    "lat": 8.129,
    "lng": 40.705,
    "name": "Hawi Gudina",
    "zoneId": "ZONE_west_hararge"
  },
  "hawi gudina": {
    "lat": 8.129,
    "lng": 40.705,
    "name": "Hawi Gudina",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_gumbi_bordede": {
    "lat": 9.011,
    "lng": 40.365,
    "name": "Gumbi Bordede",
    "zoneId": "ZONE_west_hararge"
  },
  "gumbi bordede": {
    "lat": 9.011,
    "lng": 40.365,
    "name": "Gumbi Bordede",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_west_hararge_burqua_dhintu": {
    "lat": 8.306,
    "lng": 41.14,
    "name": "Burqua Dhintu",
    "zoneId": "ZONE_west_hararge"
  },
  "burqua dhintu": {
    "lat": 8.306,
    "lng": 41.14,
    "name": "Burqua Dhintu",
    "zoneId": "ZONE_west_hararge"
  },
  "WOREDA_east_hararge_babile_town": {
    "lat": 9.224,
    "lng": 42.333,
    "name": "Babile town",
    "zoneId": "ZONE_east_hararge"
  },
  "babile town": {
    "lat": 9.224,
    "lng": 42.333,
    "name": "Babile town",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_kombolcha": {
    "lat": 9.472,
    "lng": 42.153,
    "name": "Kombolcha",
    "zoneId": "ZONE_east_hararge"
  },
  "kombolcha": {
    "lat": 9.472,
    "lng": 42.153,
    "name": "Kombolcha",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_jarso_east_hararge": {
    "lat": 9.554,
    "lng": 42.291,
    "name": "Jarso (East Hararge)",
    "zoneId": "ZONE_east_hararge"
  },
  "jarso (east hararge)": {
    "lat": 9.554,
    "lng": 42.291,
    "name": "Jarso (East Hararge)",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_gursum_or": {
    "lat": 9.316,
    "lng": 42.448,
    "name": "Gursum (OR)",
    "zoneId": "ZONE_east_hararge"
  },
  "gursum (or)": {
    "lat": 9.316,
    "lng": 42.448,
    "name": "Gursum (OR)",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_babile_or": {
    "lat": 8.748,
    "lng": 42.571,
    "name": "Babile (OR)",
    "zoneId": "ZONE_east_hararge"
  },
  "babile (or)": {
    "lat": 8.748,
    "lng": 42.571,
    "name": "Babile (OR)",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_fedis": {
    "lat": 9.064,
    "lng": 42.127,
    "name": "Fedis",
    "zoneId": "ZONE_east_hararge"
  },
  "fedis": {
    "lat": 9.064,
    "lng": 42.127,
    "name": "Fedis",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_haro_maya": {
    "lat": 9.271,
    "lng": 41.973,
    "name": "Haro Maya",
    "zoneId": "ZONE_east_hararge"
  },
  "haro maya": {
    "lat": 9.271,
    "lng": 41.973,
    "name": "Haro Maya",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_kurfa_chele": {
    "lat": 9.23,
    "lng": 41.872,
    "name": "Kurfa Chele",
    "zoneId": "ZONE_east_hararge"
  },
  "kurfa chele": {
    "lat": 9.23,
    "lng": 41.872,
    "name": "Kurfa Chele",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_kersa_east_hararge": {
    "lat": 9.381,
    "lng": 41.8,
    "name": "Kersa (East Hararge)",
    "zoneId": "ZONE_east_hararge"
  },
  "kersa (east hararge)": {
    "lat": 9.381,
    "lng": 41.8,
    "name": "Kersa (East Hararge)",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_meta": {
    "lat": 9.404,
    "lng": 41.61,
    "name": "Meta",
    "zoneId": "ZONE_east_hararge"
  },
  "meta": {
    "lat": 9.404,
    "lng": 41.61,
    "name": "Meta",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_goro_gutu": {
    "lat": 9.407,
    "lng": 41.339,
    "name": "Goro Gutu",
    "zoneId": "ZONE_east_hararge"
  },
  "goro gutu": {
    "lat": 9.407,
    "lng": 41.339,
    "name": "Goro Gutu",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_deder": {
    "lat": 9.215,
    "lng": 41.437,
    "name": "Deder",
    "zoneId": "ZONE_east_hararge"
  },
  "deder": {
    "lat": 9.215,
    "lng": 41.437,
    "name": "Deder",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_melka_balo": {
    "lat": 8.897,
    "lng": 41.328,
    "name": "Melka Balo",
    "zoneId": "ZONE_east_hararge"
  },
  "melka balo": {
    "lat": 8.897,
    "lng": 41.328,
    "name": "Melka Balo",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_bedeno": {
    "lat": 9.064,
    "lng": 41.639,
    "name": "Bedeno",
    "zoneId": "ZONE_east_hararge"
  },
  "bedeno": {
    "lat": 9.064,
    "lng": 41.639,
    "name": "Bedeno",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_midhaga_tola": {
    "lat": 8.758,
    "lng": 42.206,
    "name": "Midhaga Tola",
    "zoneId": "ZONE_east_hararge"
  },
  "midhaga tola": {
    "lat": 8.758,
    "lng": 42.206,
    "name": "Midhaga Tola",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_chinaksen": {
    "lat": 9.599,
    "lng": 42.57,
    "name": "Chinaksen",
    "zoneId": "ZONE_east_hararge"
  },
  "chinaksen": {
    "lat": 9.599,
    "lng": 42.57,
    "name": "Chinaksen",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_girawa": {
    "lat": 9.029,
    "lng": 41.866,
    "name": "Girawa",
    "zoneId": "ZONE_east_hararge"
  },
  "girawa": {
    "lat": 9.029,
    "lng": 41.866,
    "name": "Girawa",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_golo_oda": {
    "lat": 8.758,
    "lng": 41.631,
    "name": "Golo Oda",
    "zoneId": "ZONE_east_hararge"
  },
  "golo oda": {
    "lat": 8.758,
    "lng": 41.631,
    "name": "Golo Oda",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_meyu_muleke": {
    "lat": 8.502,
    "lng": 41.883,
    "name": "Meyu Muleke",
    "zoneId": "ZONE_east_hararge"
  },
  "meyu muleke": {
    "lat": 8.502,
    "lng": 41.883,
    "name": "Meyu Muleke",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_maya_town": {
    "lat": 9.407,
    "lng": 42.003,
    "name": "Maya town",
    "zoneId": "ZONE_east_hararge"
  },
  "maya town": {
    "lat": 9.407,
    "lng": 42.003,
    "name": "Maya town",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_mekanisa_oromo": {
    "lat": 9.624,
    "lng": 42.847,
    "name": "Mekanisa Oromo",
    "zoneId": "ZONE_east_hararge"
  },
  "mekanisa oromo": {
    "lat": 9.624,
    "lng": 42.847,
    "name": "Mekanisa Oromo",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_goro_muti": {
    "lat": 9.216,
    "lng": 41.557,
    "name": "Goro Muti",
    "zoneId": "ZONE_east_hararge"
  },
  "goro muti": {
    "lat": 9.216,
    "lng": 41.557,
    "name": "Goro Muti",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_deder_town": {
    "lat": 9.309,
    "lng": 41.437,
    "name": "Deder town",
    "zoneId": "ZONE_east_hararge"
  },
  "deder town": {
    "lat": 9.309,
    "lng": 41.437,
    "name": "Deder town",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_east_hararge_kumbi": {
    "lat": 7.929,
    "lng": 41.718,
    "name": "Kumbi",
    "zoneId": "ZONE_east_hararge"
  },
  "kumbi": {
    "lat": 7.929,
    "lng": 41.718,
    "name": "Kumbi",
    "zoneId": "ZONE_east_hararge"
  },
  "WOREDA_bale_agarfa": {
    "lat": 7.319,
    "lng": 39.784,
    "name": "Agarfa",
    "zoneId": "ZONE_bale"
  },
  "agarfa": {
    "lat": 7.319,
    "lng": 39.784,
    "name": "Agarfa",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_gasera": {
    "lat": 7.382,
    "lng": 40.153,
    "name": "Gasera",
    "zoneId": "ZONE_bale"
  },
  "gasera": {
    "lat": 7.382,
    "lng": 40.153,
    "name": "Gasera",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_sinana": {
    "lat": 7.128,
    "lng": 40.129,
    "name": "Sinana",
    "zoneId": "ZONE_bale"
  },
  "sinana": {
    "lat": 7.128,
    "lng": 40.129,
    "name": "Sinana",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_goba_or": {
    "lat": 6.857,
    "lng": 39.897,
    "name": "Goba (OR)",
    "zoneId": "ZONE_bale"
  },
  "goba (or)": {
    "lat": 6.857,
    "lng": 39.897,
    "name": "Goba (OR)",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_harena_buluk": {
    "lat": 6.41,
    "lng": 39.542,
    "name": "Harena Buluk",
    "zoneId": "ZONE_bale"
  },
  "harena buluk": {
    "lat": 6.41,
    "lng": 39.542,
    "name": "Harena Buluk",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_mena_bale": {
    "lat": 6.267,
    "lng": 40.047,
    "name": "Mena (Bale)",
    "zoneId": "ZONE_bale"
  },
  "mena (bale)": {
    "lat": 6.267,
    "lng": 40.047,
    "name": "Mena (Bale)",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_berbere": {
    "lat": 6.712,
    "lng": 40.165,
    "name": "Berbere",
    "zoneId": "ZONE_bale"
  },
  "berbere": {
    "lat": 6.712,
    "lng": 40.165,
    "name": "Berbere",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_gura_damole": {
    "lat": 6.294,
    "lng": 40.573,
    "name": "Gura Damole",
    "zoneId": "ZONE_bale"
  },
  "gura damole": {
    "lat": 6.294,
    "lng": 40.573,
    "name": "Gura Damole",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_goro_bale": {
    "lat": 6.993,
    "lng": 40.493,
    "name": "Goro (Bale)",
    "zoneId": "ZONE_bale"
  },
  "goro (bale)": {
    "lat": 6.993,
    "lng": 40.493,
    "name": "Goro (Bale)",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_robe_town": {
    "lat": 7.125,
    "lng": 40.025,
    "name": "Robe town",
    "zoneId": "ZONE_bale"
  },
  "robe town": {
    "lat": 7.125,
    "lng": 40.025,
    "name": "Robe town",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_goba_town": {
    "lat": 7.024,
    "lng": 39.973,
    "name": "Goba town",
    "zoneId": "ZONE_bale"
  },
  "goba town": {
    "lat": 7.024,
    "lng": 39.973,
    "name": "Goba town",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_bale_dinsho": {
    "lat": 7.077,
    "lng": 39.771,
    "name": "Dinsho",
    "zoneId": "ZONE_bale"
  },
  "dinsho": {
    "lat": 7.077,
    "lng": 39.771,
    "name": "Dinsho",
    "zoneId": "ZONE_bale"
  },
  "WOREDA_borena_yabelo": {
    "lat": 4.773,
    "lng": 38.171,
    "name": "Yabelo",
    "zoneId": "ZONE_borena"
  },
  "yabelo": {
    "lat": 4.773,
    "lng": 38.171,
    "name": "Yabelo",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_borena_moyale_or": {
    "lat": 3.667,
    "lng": 39.124,
    "name": "Moyale (OR)",
    "zoneId": "ZONE_borena"
  },
  "moyale (or)": {
    "lat": 3.667,
    "lng": 39.124,
    "name": "Moyale (OR)",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_borena_dire": {
    "lat": 3.962,
    "lng": 38.217,
    "name": "Dire",
    "zoneId": "ZONE_borena"
  },
  "dire": {
    "lat": 3.962,
    "lng": 38.217,
    "name": "Dire",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_borena_teltale": {
    "lat": 4.744,
    "lng": 37.12,
    "name": "Teltale",
    "zoneId": "ZONE_borena"
  },
  "teltale": {
    "lat": 4.744,
    "lng": 37.12,
    "name": "Teltale",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_borena_miyo": {
    "lat": 3.843,
    "lng": 38.564,
    "name": "Miyo",
    "zoneId": "ZONE_borena"
  },
  "miyo": {
    "lat": 3.843,
    "lng": 38.564,
    "name": "Miyo",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_borena_dilo": {
    "lat": 4.199,
    "lng": 37.774,
    "name": "Dilo",
    "zoneId": "ZONE_borena"
  },
  "dilo": {
    "lat": 4.199,
    "lng": 37.774,
    "name": "Dilo",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_borena_gomole": {
    "lat": 5.171,
    "lng": 38.326,
    "name": "Gomole",
    "zoneId": "ZONE_borena"
  },
  "gomole": {
    "lat": 5.171,
    "lng": 38.326,
    "name": "Gomole",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_borena_guchi": {
    "lat": 3.946,
    "lng": 39.135,
    "name": "Guchi",
    "zoneId": "ZONE_borena"
  },
  "guchi": {
    "lat": 3.946,
    "lng": 39.135,
    "name": "Guchi",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_borena_dubluk": {
    "lat": 4.435,
    "lng": 38.137,
    "name": "Dubluk",
    "zoneId": "ZONE_borena"
  },
  "dubluk": {
    "lat": 4.435,
    "lng": 38.137,
    "name": "Dubluk",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_borena_elwaya": {
    "lat": 4.921,
    "lng": 37.722,
    "name": "Elwaya",
    "zoneId": "ZONE_borena"
  },
  "elwaya": {
    "lat": 4.921,
    "lng": 37.722,
    "name": "Elwaya",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_borena_yabelo_town": {
    "lat": 4.892,
    "lng": 38.106,
    "name": "Yabelo town",
    "zoneId": "ZONE_borena"
  },
  "yabelo town": {
    "lat": 4.892,
    "lng": 38.106,
    "name": "Yabelo town",
    "zoneId": "ZONE_borena"
  },
  "WOREDA_south_west_shewa_ameya": {
    "lat": 8.558,
    "lng": 37.695,
    "name": "Ameya",
    "zoneId": "ZONE_south_west_shewa"
  },
  "ameya": {
    "lat": 8.558,
    "lng": 37.695,
    "name": "Ameya",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_wenchi": {
    "lat": 8.672,
    "lng": 37.888,
    "name": "Wenchi",
    "zoneId": "ZONE_south_west_shewa"
  },
  "wenchi": {
    "lat": 8.672,
    "lng": 37.888,
    "name": "Wenchi",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_waliso": {
    "lat": 8.548,
    "lng": 38.039,
    "name": "Waliso",
    "zoneId": "ZONE_south_west_shewa"
  },
  "waliso": {
    "lat": 8.548,
    "lng": 38.039,
    "name": "Waliso",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_dawo": {
    "lat": 8.772,
    "lng": 38.109,
    "name": "Dawo",
    "zoneId": "ZONE_south_west_shewa"
  },
  "dawo": {
    "lat": 8.772,
    "lng": 38.109,
    "name": "Dawo",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_ilu": {
    "lat": 8.822,
    "lng": 38.335,
    "name": "Ilu",
    "zoneId": "ZONE_south_west_shewa"
  },
  "ilu": {
    "lat": 8.822,
    "lng": 38.335,
    "name": "Ilu",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_sebeta_hawas": {
    "lat": 8.752,
    "lng": 38.583,
    "name": "Sebeta Hawas",
    "zoneId": "ZONE_south_west_shewa"
  },
  "sebeta hawas": {
    "lat": 8.752,
    "lng": 38.583,
    "name": "Sebeta Hawas",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_kersana_malima": {
    "lat": 8.568,
    "lng": 38.519,
    "name": "Kersana Malima",
    "zoneId": "ZONE_south_west_shewa"
  },
  "kersana malima": {
    "lat": 8.568,
    "lng": 38.519,
    "name": "Kersana Malima",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_tole": {
    "lat": 8.621,
    "lng": 38.392,
    "name": "Tole",
    "zoneId": "ZONE_south_west_shewa"
  },
  "tole": {
    "lat": 8.621,
    "lng": 38.392,
    "name": "Tole",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_becho_sw_shewa": {
    "lat": 8.659,
    "lng": 38.245,
    "name": "Becho (SW Shewa)",
    "zoneId": "ZONE_south_west_shewa"
  },
  "becho (sw shewa)": {
    "lat": 8.659,
    "lng": 38.245,
    "name": "Becho (SW Shewa)",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_seden_sodo": {
    "lat": 8.426,
    "lng": 38.291,
    "name": "Seden Sodo",
    "zoneId": "ZONE_south_west_shewa"
  },
  "seden sodo": {
    "lat": 8.426,
    "lng": 38.291,
    "name": "Seden Sodo",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_woliso_town": {
    "lat": 8.542,
    "lng": 37.978,
    "name": "Woliso town",
    "zoneId": "ZONE_south_west_shewa"
  },
  "woliso town": {
    "lat": 8.542,
    "lng": 37.978,
    "name": "Woliso town",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_goro_sw_shewa": {
    "lat": 8.411,
    "lng": 37.853,
    "name": "Goro (SW Shewa)",
    "zoneId": "ZONE_south_west_shewa"
  },
  "goro (sw shewa)": {
    "lat": 8.411,
    "lng": 37.853,
    "name": "Goro (SW Shewa)",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_south_west_shewa_sodo_daci": {
    "lat": 8.479,
    "lng": 38.651,
    "name": "Sodo Daci",
    "zoneId": "ZONE_south_west_shewa"
  },
  "sodo daci": {
    "lat": 8.479,
    "lng": 38.651,
    "name": "Sodo Daci",
    "zoneId": "ZONE_south_west_shewa"
  },
  "WOREDA_guji_uraga": {
    "lat": 6.058,
    "lng": 38.622,
    "name": "Uraga",
    "zoneId": "ZONE_guji"
  },
  "uraga": {
    "lat": 6.058,
    "lng": 38.622,
    "name": "Uraga",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_bore": {
    "lat": 6.365,
    "lng": 38.619,
    "name": "Bore",
    "zoneId": "ZONE_guji"
  },
  "bore": {
    "lat": 6.365,
    "lng": 38.619,
    "name": "Bore",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_adola": {
    "lat": 5.913,
    "lng": 39.102,
    "name": "Adola",
    "zoneId": "ZONE_guji"
  },
  "adola": {
    "lat": 5.913,
    "lng": 39.102,
    "name": "Adola",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_wadera": {
    "lat": 5.846,
    "lng": 39.287,
    "name": "Wadera",
    "zoneId": "ZONE_guji"
  },
  "wadera": {
    "lat": 5.846,
    "lng": 39.287,
    "name": "Wadera",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_odo_shakiso": {
    "lat": 5.761,
    "lng": 38.818,
    "name": "Odo Shakiso",
    "zoneId": "ZONE_guji"
  },
  "odo shakiso": {
    "lat": 5.761,
    "lng": 38.818,
    "name": "Odo Shakiso",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_dama": {
    "lat": 6.261,
    "lng": 38.523,
    "name": "Dama",
    "zoneId": "ZONE_guji"
  },
  "dama": {
    "lat": 6.261,
    "lng": 38.523,
    "name": "Dama",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_arda_jila": {
    "lat": 6.087,
    "lng": 38.782,
    "name": "Arda Jila",
    "zoneId": "ZONE_guji"
  },
  "arda jila": {
    "lat": 6.087,
    "lng": 38.782,
    "name": "Arda Jila",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_girja_harenfema": {
    "lat": 6.137,
    "lng": 39.193,
    "name": "Girja /Harenfema",
    "zoneId": "ZONE_guji"
  },
  "girja /harenfema": {
    "lat": 6.137,
    "lng": 39.193,
    "name": "Girja /Harenfema",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_ana_sora": {
    "lat": 6.237,
    "lng": 38.783,
    "name": "Ana Sora",
    "zoneId": "ZONE_guji"
  },
  "ana sora": {
    "lat": 6.237,
    "lng": 38.783,
    "name": "Ana Sora",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_saba_boru": {
    "lat": 5.395,
    "lng": 39.059,
    "name": "Saba Boru",
    "zoneId": "ZONE_guji"
  },
  "saba boru": {
    "lat": 5.395,
    "lng": 39.059,
    "name": "Saba Boru",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_aga_wayu": {
    "lat": 5.489,
    "lng": 38.784,
    "name": "Aga Wayu",
    "zoneId": "ZONE_guji"
  },
  "aga wayu": {
    "lat": 5.489,
    "lng": 38.784,
    "name": "Aga Wayu",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_haro_walabu": {
    "lat": 6.114,
    "lng": 38.449,
    "name": "Haro Walabu",
    "zoneId": "ZONE_guji"
  },
  "haro walabu": {
    "lat": 6.114,
    "lng": 38.449,
    "name": "Haro Walabu",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_adola_town": {
    "lat": 5.883,
    "lng": 38.984,
    "name": "Adola town",
    "zoneId": "ZONE_guji"
  },
  "adola town": {
    "lat": 5.883,
    "lng": 38.984,
    "name": "Adola town",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_guji_shakiso_town": {
    "lat": 5.772,
    "lng": 38.911,
    "name": "Shakiso town",
    "zoneId": "ZONE_guji"
  },
  "shakiso town": {
    "lat": 5.772,
    "lng": 38.911,
    "name": "Shakiso town",
    "zoneId": "ZONE_guji"
  },
  "WOREDA_west_guji_bule_hora": {
    "lat": 5.649,
    "lng": 38.316,
    "name": "Bule Hora",
    "zoneId": "ZONE_west_guji"
  },
  "bule hora": {
    "lat": 5.649,
    "lng": 38.316,
    "name": "Bule Hora",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_west_guji_kercha": {
    "lat": 5.719,
    "lng": 38.43,
    "name": "Kercha",
    "zoneId": "ZONE_west_guji"
  },
  "kercha": {
    "lat": 5.719,
    "lng": 38.43,
    "name": "Kercha",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_west_guji_kercha_town": {
    "lat": 5.78,
    "lng": 38.411,
    "name": "Kercha town",
    "zoneId": "ZONE_west_guji"
  },
  "kercha town": {
    "lat": 5.78,
    "lng": 38.411,
    "name": "Kercha town",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_west_guji_hambela_wamena": {
    "lat": 6.012,
    "lng": 38.38,
    "name": "Hambela Wamena",
    "zoneId": "ZONE_west_guji"
  },
  "hambela wamena": {
    "lat": 6.012,
    "lng": 38.38,
    "name": "Hambela Wamena",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_west_guji_abaya": {
    "lat": 6.355,
    "lng": 38.017,
    "name": "Abaya",
    "zoneId": "ZONE_west_guji"
  },
  "abaya": {
    "lat": 6.355,
    "lng": 38.017,
    "name": "Abaya",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_west_guji_dugda_dawa": {
    "lat": 5.398,
    "lng": 38.127,
    "name": "Dugda Dawa",
    "zoneId": "ZONE_west_guji"
  },
  "dugda dawa": {
    "lat": 5.398,
    "lng": 38.127,
    "name": "Dugda Dawa",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_west_guji_gelana_west_guji": {
    "lat": 5.988,
    "lng": 38.004,
    "name": "Gelana (West Guji)",
    "zoneId": "ZONE_west_guji"
  },
  "gelana (west guji)": {
    "lat": 5.988,
    "lng": 38.004,
    "name": "Gelana (West Guji)",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_west_guji_melka_soda": {
    "lat": 5.413,
    "lng": 38.618,
    "name": "Melka Soda",
    "zoneId": "ZONE_west_guji"
  },
  "melka soda": {
    "lat": 5.413,
    "lng": 38.618,
    "name": "Melka Soda",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_west_guji_bule_hora_town": {
    "lat": 5.643,
    "lng": 38.233,
    "name": "Bule Hora town",
    "zoneId": "ZONE_west_guji"
  },
  "bule hora town": {
    "lat": 5.643,
    "lng": 38.233,
    "name": "Bule Hora town",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_west_guji_suro_berguda": {
    "lat": 5.555,
    "lng": 38.054,
    "name": "Suro Berguda",
    "zoneId": "ZONE_west_guji"
  },
  "suro berguda": {
    "lat": 5.555,
    "lng": 38.054,
    "name": "Suro Berguda",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_west_guji_birbirsa_kojowa": {
    "lat": 5.734,
    "lng": 38.57,
    "name": "Birbirsa Kojowa",
    "zoneId": "ZONE_west_guji"
  },
  "birbirsa kojowa": {
    "lat": 5.734,
    "lng": 38.57,
    "name": "Birbirsa Kojowa",
    "zoneId": "ZONE_west_guji"
  },
  "WOREDA_buno_bedele_chora_buno_bedele": {
    "lat": 8.391,
    "lng": 36.139,
    "name": "Chora (Buno Bedele)",
    "zoneId": "ZONE_buno_bedele"
  },
  "chora (buno bedele)": {
    "lat": 8.391,
    "lng": 36.139,
    "name": "Chora (Buno Bedele)",
    "zoneId": "ZONE_buno_bedele"
  },
  "WOREDA_buno_bedele_dega": {
    "lat": 8.597,
    "lng": 36.137,
    "name": "Dega",
    "zoneId": "ZONE_buno_bedele"
  },
  "dega": {
    "lat": 8.597,
    "lng": 36.137,
    "name": "Dega",
    "zoneId": "ZONE_buno_bedele"
  },
  "WOREDA_buno_bedele_dabo_hana": {
    "lat": 8.706,
    "lng": 36.289,
    "name": "Dabo Hana",
    "zoneId": "ZONE_buno_bedele"
  },
  "dabo hana": {
    "lat": 8.706,
    "lng": 36.289,
    "name": "Dabo Hana",
    "zoneId": "ZONE_buno_bedele"
  },
  "WOREDA_buno_bedele_gechi": {
    "lat": 8.364,
    "lng": 36.481,
    "name": "Gechi",
    "zoneId": "ZONE_buno_bedele"
  },
  "gechi": {
    "lat": 8.364,
    "lng": 36.481,
    "name": "Gechi",
    "zoneId": "ZONE_buno_bedele"
  },
  "WOREDA_buno_bedele_borecha": {
    "lat": 8.307,
    "lng": 36.652,
    "name": "Borecha",
    "zoneId": "ZONE_buno_bedele"
  },
  "borecha": {
    "lat": 8.307,
    "lng": 36.652,
    "name": "Borecha",
    "zoneId": "ZONE_buno_bedele"
  },
  "WOREDA_buno_bedele_dedesa": {
    "lat": 8.132,
    "lng": 36.539,
    "name": "Dedesa",
    "zoneId": "ZONE_buno_bedele"
  },
  "dedesa": {
    "lat": 8.132,
    "lng": 36.539,
    "name": "Dedesa",
    "zoneId": "ZONE_buno_bedele"
  },
  "WOREDA_buno_bedele_meko": {
    "lat": 8.737,
    "lng": 35.996,
    "name": "Meko",
    "zoneId": "ZONE_buno_bedele"
  },
  "meko": {
    "lat": 8.737,
    "lng": 35.996,
    "name": "Meko",
    "zoneId": "ZONE_buno_bedele"
  },
  "WOREDA_buno_bedele_bedele_town": {
    "lat": 8.452,
    "lng": 36.349,
    "name": "Bedele town",
    "zoneId": "ZONE_buno_bedele"
  },
  "bedele town": {
    "lat": 8.452,
    "lng": 36.349,
    "name": "Bedele town",
    "zoneId": "ZONE_buno_bedele"
  },
  "WOREDA_buno_bedele_bedele_zuria": {
    "lat": 8.497,
    "lng": 36.405,
    "name": "Bedele Zuria",
    "zoneId": "ZONE_buno_bedele"
  },
  "bedele zuria": {
    "lat": 8.497,
    "lng": 36.405,
    "name": "Bedele Zuria",
    "zoneId": "ZONE_buno_bedele"
  },
  "WOREDA_buno_bedele_chwaka": {
    "lat": 8.892,
    "lng": 36.134,
    "name": "Chwaka",
    "zoneId": "ZONE_buno_bedele"
  },
  "chwaka": {
    "lat": 8.892,
    "lng": 36.134,
    "name": "Chwaka",
    "zoneId": "ZONE_buno_bedele"
  },
  "WOREDA_west_arsi_dodola_town": {
    "lat": 6.979,
    "lng": 39.181,
    "name": "Dodola town",
    "zoneId": "ZONE_west_arsi"
  },
  "dodola town": {
    "lat": 6.979,
    "lng": 39.181,
    "name": "Dodola town",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_siraro": {
    "lat": 7.129,
    "lng": 38.19,
    "name": "Siraro",
    "zoneId": "ZONE_west_arsi"
  },
  "siraro": {
    "lat": 7.129,
    "lng": 38.19,
    "name": "Siraro",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_shala": {
    "lat": 7.351,
    "lng": 38.398,
    "name": "Shala",
    "zoneId": "ZONE_west_arsi"
  },
  "shala": {
    "lat": 7.351,
    "lng": 38.398,
    "name": "Shala",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_arsi_negele": {
    "lat": 7.452,
    "lng": 38.652,
    "name": "Arsi Negele",
    "zoneId": "ZONE_west_arsi"
  },
  "arsi negele": {
    "lat": 7.452,
    "lng": 38.652,
    "name": "Arsi Negele",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_kofele": {
    "lat": 7.021,
    "lng": 38.865,
    "name": "Kofele",
    "zoneId": "ZONE_west_arsi"
  },
  "kofele": {
    "lat": 7.021,
    "lng": 38.865,
    "name": "Kofele",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_kore": {
    "lat": 7.225,
    "lng": 38.93,
    "name": "Kore",
    "zoneId": "ZONE_west_arsi"
  },
  "kore": {
    "lat": 7.225,
    "lng": 38.93,
    "name": "Kore",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_gedeb_asasa": {
    "lat": 7.183,
    "lng": 39.172,
    "name": "Gedeb Asasa",
    "zoneId": "ZONE_west_arsi"
  },
  "gedeb asasa": {
    "lat": 7.183,
    "lng": 39.172,
    "name": "Gedeb Asasa",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_dodola": {
    "lat": 6.888,
    "lng": 39.152,
    "name": "Dodola",
    "zoneId": "ZONE_west_arsi"
  },
  "dodola": {
    "lat": 6.888,
    "lng": 39.152,
    "name": "Dodola",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_kokosa": {
    "lat": 6.791,
    "lng": 38.81,
    "name": "Kokosa",
    "zoneId": "ZONE_west_arsi"
  },
  "kokosa": {
    "lat": 6.791,
    "lng": 38.81,
    "name": "Kokosa",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_nenesebo": {
    "lat": 6.583,
    "lng": 39.206,
    "name": "Nenesebo",
    "zoneId": "ZONE_west_arsi"
  },
  "nenesebo": {
    "lat": 6.583,
    "lng": 39.206,
    "name": "Nenesebo",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_adaba": {
    "lat": 6.989,
    "lng": 39.53,
    "name": "Adaba",
    "zoneId": "ZONE_west_arsi"
  },
  "adaba": {
    "lat": 6.989,
    "lng": 39.53,
    "name": "Adaba",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_shashemene_town": {
    "lat": 7.185,
    "lng": 38.544,
    "name": "Shashemene town",
    "zoneId": "ZONE_west_arsi"
  },
  "shashemene town": {
    "lat": 7.185,
    "lng": 38.544,
    "name": "Shashemene town",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_shashemene": {
    "lat": 7.276,
    "lng": 38.523,
    "name": "Shashemene",
    "zoneId": "ZONE_west_arsi"
  },
  "shashemene": {
    "lat": 7.276,
    "lng": 38.523,
    "name": "Shashemene",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_kofele_town": {
    "lat": 7.073,
    "lng": 38.786,
    "name": "Kofele town",
    "zoneId": "ZONE_west_arsi"
  },
  "kofele town": {
    "lat": 7.073,
    "lng": 38.786,
    "name": "Kofele town",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_heban_arsi": {
    "lat": 7.558,
    "lng": 38.798,
    "name": "Heban Arsi",
    "zoneId": "ZONE_west_arsi"
  },
  "heban arsi": {
    "lat": 7.558,
    "lng": 38.798,
    "name": "Heban Arsi",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_wondo": {
    "lat": 7.079,
    "lng": 38.673,
    "name": "Wondo",
    "zoneId": "ZONE_west_arsi"
  },
  "wondo": {
    "lat": 7.079,
    "lng": 38.673,
    "name": "Wondo",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_west_arsi_arsi_negele_town": {
    "lat": 7.342,
    "lng": 38.672,
    "name": "Arsi Negele town",
    "zoneId": "ZONE_west_arsi"
  },
  "arsi negele town": {
    "lat": 7.342,
    "lng": 38.672,
    "name": "Arsi Negele town",
    "zoneId": "ZONE_west_arsi"
  },
  "WOREDA_kelem_wellega_hawa_galan": {
    "lat": 8.627,
    "lng": 34.992,
    "name": "Hawa Galan",
    "zoneId": "ZONE_kelem_wellega"
  },
  "hawa galan": {
    "lat": 8.627,
    "lng": 34.992,
    "name": "Hawa Galan",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_yama_logi_welel": {
    "lat": 8.807,
    "lng": 34.859,
    "name": "Yama Logi Welel",
    "zoneId": "ZONE_kelem_wellega"
  },
  "yama logi welel": {
    "lat": 8.807,
    "lng": 34.859,
    "name": "Yama Logi Welel",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_dale_wabera": {
    "lat": 9.025,
    "lng": 35.061,
    "name": "Dale Wabera",
    "zoneId": "ZONE_kelem_wellega"
  },
  "dale wabera": {
    "lat": 9.025,
    "lng": 35.061,
    "name": "Dale Wabera",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_gawo_kebe": {
    "lat": 9.148,
    "lng": 34.934,
    "name": "Gawo Kebe",
    "zoneId": "ZONE_kelem_wellega"
  },
  "gawo kebe": {
    "lat": 9.148,
    "lng": 34.934,
    "name": "Gawo Kebe",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_sayo": {
    "lat": 8.442,
    "lng": 34.821,
    "name": "Sayo",
    "zoneId": "ZONE_kelem_wellega"
  },
  "sayo": {
    "lat": 8.442,
    "lng": 34.821,
    "name": "Sayo",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_denbi_dollo_town": {
    "lat": 8.533,
    "lng": 34.801,
    "name": "Denbi Dollo town",
    "zoneId": "ZONE_kelem_wellega"
  },
  "denbi dollo town": {
    "lat": 8.533,
    "lng": 34.801,
    "name": "Denbi Dollo town",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_anfilo": {
    "lat": 8.603,
    "lng": 34.526,
    "name": "Anfilo",
    "zoneId": "ZONE_kelem_wellega"
  },
  "anfilo": {
    "lat": 8.603,
    "lng": 34.526,
    "name": "Anfilo",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_dale_sadi": {
    "lat": 8.931,
    "lng": 35.201,
    "name": "Dale Sadi",
    "zoneId": "ZONE_kelem_wellega"
  },
  "dale sadi": {
    "lat": 8.931,
    "lng": 35.201,
    "name": "Dale Sadi",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_gidami": {
    "lat": 8.853,
    "lng": 34.422,
    "name": "Gidami",
    "zoneId": "ZONE_kelem_wellega"
  },
  "gidami": {
    "lat": 8.853,
    "lng": 34.422,
    "name": "Gidami",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_jimma_horo": {
    "lat": 9.015,
    "lng": 34.758,
    "name": "Jimma Horo",
    "zoneId": "ZONE_kelem_wellega"
  },
  "jimma horo": {
    "lat": 9.015,
    "lng": 34.758,
    "name": "Jimma Horo",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_lalo_kile": {
    "lat": 8.863,
    "lng": 35.331,
    "name": "Lalo Kile",
    "zoneId": "ZONE_kelem_wellega"
  },
  "lalo kile": {
    "lat": 8.863,
    "lng": 35.331,
    "name": "Lalo Kile",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_kelem_wellega_sedi_chenka": {
    "lat": 8.796,
    "lng": 35.088,
    "name": "Sedi Chenka",
    "zoneId": "ZONE_kelem_wellega"
  },
  "sedi chenka": {
    "lat": 8.796,
    "lng": 35.088,
    "name": "Sedi Chenka",
    "zoneId": "ZONE_kelem_wellega"
  },
  "WOREDA_horo_gudru_wellega_horo": {
    "lat": 9.592,
    "lng": 37.15,
    "name": "Horo",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "horo": {
    "lat": 9.592,
    "lng": 37.15,
    "name": "Horo",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_shambu_town": {
    "lat": 9.568,
    "lng": 37.103,
    "name": "Shambu town",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "shambu town": {
    "lat": 9.568,
    "lng": 37.103,
    "name": "Shambu town",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_guduru": {
    "lat": 9.46,
    "lng": 37.541,
    "name": "Guduru",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "guduru": {
    "lat": 9.46,
    "lng": 37.541,
    "name": "Guduru",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_ababo": {
    "lat": 9.78,
    "lng": 37.549,
    "name": "Ababo",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "ababo": {
    "lat": 9.78,
    "lng": 37.549,
    "name": "Ababo",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_abay_chomen": {
    "lat": 9.634,
    "lng": 37.282,
    "name": "Abay Chomen",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "abay chomen": {
    "lat": 9.634,
    "lng": 37.282,
    "name": "Abay Chomen",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_jimma_genete": {
    "lat": 9.388,
    "lng": 37.142,
    "name": "Jimma Genete",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "jimma genete": {
    "lat": 9.388,
    "lng": 37.142,
    "name": "Jimma Genete",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_jimma_rare": {
    "lat": 9.252,
    "lng": 37.341,
    "name": "Jimma Rare",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "jimma rare": {
    "lat": 9.252,
    "lng": 37.341,
    "name": "Jimma Rare",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_jarte_jardega": {
    "lat": 9.904,
    "lng": 37.113,
    "name": "Jarte Jardega",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "jarte jardega": {
    "lat": 9.904,
    "lng": 37.113,
    "name": "Jarte Jardega",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_amuru": {
    "lat": 10.121,
    "lng": 37.008,
    "name": "Amuru",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "amuru": {
    "lat": 10.121,
    "lng": 37.008,
    "name": "Amuru",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_abe_dongoro": {
    "lat": 9.6,
    "lng": 36.835,
    "name": "Abe Dongoro",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "abe dongoro": {
    "lat": 9.6,
    "lng": 36.835,
    "name": "Abe Dongoro",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_choman_guduru": {
    "lat": 9.382,
    "lng": 37.326,
    "name": "Choman Guduru",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "choman guduru": {
    "lat": 9.382,
    "lng": 37.326,
    "name": "Choman Guduru",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_horo_buluk": {
    "lat": 9.699,
    "lng": 37.122,
    "name": "Horo Buluk",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "horo buluk": {
    "lat": 9.699,
    "lng": 37.122,
    "name": "Horo Buluk",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_horo_gudru_wellega_sulula_finca_a": {
    "lat": 9.815,
    "lng": 37.375,
    "name": "Sulula Finca'a",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "sulula finca'a": {
    "lat": 9.815,
    "lng": 37.375,
    "name": "Sulula Finca'a",
    "zoneId": "ZONE_horo_gudru_wellega"
  },
  "WOREDA_shager_city_burayu": {
    "lat": 9.079,
    "lng": 38.668,
    "name": "Burayu",
    "zoneId": "ZONE_shager_city"
  },
  "burayu": {
    "lat": 9.079,
    "lng": 38.668,
    "name": "Burayu",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_eka_tafo": {
    "lat": 9.113,
    "lng": 38.874,
    "name": "Eka Tafo",
    "zoneId": "ZONE_shager_city"
  },
  "eka tafo": {
    "lat": 9.113,
    "lng": 38.874,
    "name": "Eka Tafo",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_furi": {
    "lat": 8.949,
    "lng": 38.656,
    "name": "Furi",
    "zoneId": "ZONE_shager_city"
  },
  "furi": {
    "lat": 8.949,
    "lng": 38.656,
    "name": "Furi",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_galan": {
    "lat": 8.827,
    "lng": 38.74,
    "name": "Galan",
    "zoneId": "ZONE_shager_city"
  },
  "galan": {
    "lat": 8.827,
    "lng": 38.74,
    "name": "Galan",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_galan_gudo": {
    "lat": 8.853,
    "lng": 38.674,
    "name": "Galan Gudo",
    "zoneId": "ZONE_shager_city"
  },
  "galan gudo": {
    "lat": 8.853,
    "lng": 38.674,
    "name": "Galan Gudo",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_gefersa_guje": {
    "lat": 9.072,
    "lng": 38.592,
    "name": "Gefersa Guje",
    "zoneId": "ZONE_shager_city"
  },
  "gefersa guje": {
    "lat": 9.072,
    "lng": 38.592,
    "name": "Gefersa Guje",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_koye": {
    "lat": 8.896,
    "lng": 38.91,
    "name": "Koye",
    "zoneId": "ZONE_shager_city"
  },
  "koye": {
    "lat": 8.896,
    "lng": 38.91,
    "name": "Koye",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_kura_jida": {
    "lat": 9.046,
    "lng": 38.96,
    "name": "Kura Jida",
    "zoneId": "ZONE_shager_city"
  },
  "kura jida": {
    "lat": 9.046,
    "lng": 38.96,
    "name": "Kura Jida",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_mana_abichu": {
    "lat": 9.12,
    "lng": 38.683,
    "name": "Mana Abichu",
    "zoneId": "ZONE_shager_city"
  },
  "mana abichu": {
    "lat": 9.12,
    "lng": 38.683,
    "name": "Mana Abichu",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_melka_nonno": {
    "lat": 9.022,
    "lng": 38.639,
    "name": "Melka Nonno",
    "zoneId": "ZONE_shager_city"
  },
  "melka nonno": {
    "lat": 9.022,
    "lng": 38.639,
    "name": "Melka Nonno",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_sebeta": {
    "lat": 8.9,
    "lng": 38.58,
    "name": "Sebeta",
    "zoneId": "ZONE_shager_city"
  },
  "sebeta": {
    "lat": 8.9,
    "lng": 38.58,
    "name": "Sebeta",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_shager_city_sululta": {
    "lat": 9.164,
    "lng": 38.796,
    "name": "Sululta",
    "zoneId": "ZONE_shager_city"
  },
  "sululta": {
    "lat": 9.164,
    "lng": 38.796,
    "name": "Sululta",
    "zoneId": "ZONE_shager_city"
  },
  "WOREDA_east_bale_gololcha_bale": {
    "lat": 7.539,
    "lng": 40.61,
    "name": "Gololcha Bale",
    "zoneId": "ZONE_east_bale"
  },
  "gololcha bale": {
    "lat": 7.539,
    "lng": 40.61,
    "name": "Gololcha Bale",
    "zoneId": "ZONE_east_bale"
  },
  "WOREDA_east_bale_lege_hida": {
    "lat": 7.866,
    "lng": 41.406,
    "name": "Lege Hida",
    "zoneId": "ZONE_east_bale"
  },
  "lege hida": {
    "lat": 7.866,
    "lng": 41.406,
    "name": "Lege Hida",
    "zoneId": "ZONE_east_bale"
  },
  "WOREDA_east_bale_ginir": {
    "lat": 6.992,
    "lng": 40.893,
    "name": "Ginir",
    "zoneId": "ZONE_east_bale"
  },
  "ginir": {
    "lat": 6.992,
    "lng": 40.893,
    "name": "Ginir",
    "zoneId": "ZONE_east_bale"
  },
  "WOREDA_east_bale_rayitu": {
    "lat": 6.8,
    "lng": 41.463,
    "name": "Rayitu",
    "zoneId": "ZONE_east_bale"
  },
  "rayitu": {
    "lat": 6.8,
    "lng": 41.463,
    "name": "Rayitu",
    "zoneId": "ZONE_east_bale"
  },
  "WOREDA_east_bale_seweyna": {
    "lat": 7.259,
    "lng": 41.481,
    "name": "Seweyna",
    "zoneId": "ZONE_east_bale"
  },
  "seweyna": {
    "lat": 7.259,
    "lng": 41.481,
    "name": "Seweyna",
    "zoneId": "ZONE_east_bale"
  },
  "WOREDA_east_bale_dawe_ketchen": {
    "lat": 6.653,
    "lng": 40.827,
    "name": "Dawe Ketchen",
    "zoneId": "ZONE_east_bale"
  },
  "dawe ketchen": {
    "lat": 6.653,
    "lng": 40.827,
    "name": "Dawe Ketchen",
    "zoneId": "ZONE_east_bale"
  },
  "WOREDA_east_bale_ginir_town": {
    "lat": 7.138,
    "lng": 40.733,
    "name": "Ginir town",
    "zoneId": "ZONE_east_bale"
  },
  "ginir town": {
    "lat": 7.138,
    "lng": 40.733,
    "name": "Ginir town",
    "zoneId": "ZONE_east_bale"
  },
  "WOREDA_east_borena_negele_town": {
    "lat": 5.338,
    "lng": 39.584,
    "name": "Negele town",
    "zoneId": "ZONE_east_borena"
  },
  "negele town": {
    "lat": 5.338,
    "lng": 39.584,
    "name": "Negele town",
    "zoneId": "ZONE_east_borena"
  },
  "WOREDA_east_borena_liben": {
    "lat": 5.282,
    "lng": 39.64,
    "name": "Liben",
    "zoneId": "ZONE_east_borena"
  },
  "liben": {
    "lat": 5.282,
    "lng": 39.64,
    "name": "Liben",
    "zoneId": "ZONE_east_borena"
  },
  "WOREDA_east_borena_meda_welabu": {
    "lat": 5.607,
    "lng": 40.231,
    "name": "Meda Welabu",
    "zoneId": "ZONE_east_borena"
  },
  "meda welabu": {
    "lat": 5.607,
    "lng": 40.231,
    "name": "Meda Welabu",
    "zoneId": "ZONE_east_borena"
  },
  "WOREDA_east_borena_west_welabu": {
    "lat": 6.035,
    "lng": 39.466,
    "name": "West Welabu",
    "zoneId": "ZONE_east_borena"
  },
  "west welabu": {
    "lat": 6.035,
    "lng": 39.466,
    "name": "West Welabu",
    "zoneId": "ZONE_east_borena"
  },
  "WOREDA_east_borena_gora_dola": {
    "lat": 5.528,
    "lng": 39.42,
    "name": "Gora Dola",
    "zoneId": "ZONE_east_borena"
  },
  "gora dola": {
    "lat": 5.528,
    "lng": 39.42,
    "name": "Gora Dola",
    "zoneId": "ZONE_east_borena"
  },
  "WOREDA_east_borena_gumi_idalo": {
    "lat": 4.929,
    "lng": 39.547,
    "name": "Gumi Idalo",
    "zoneId": "ZONE_east_borena"
  },
  "gumi idalo": {
    "lat": 4.929,
    "lng": 39.547,
    "name": "Gumi Idalo",
    "zoneId": "ZONE_east_borena"
  },
  "WOREDA_east_borena_arero": {
    "lat": 4.848,
    "lng": 38.867,
    "name": "Arero",
    "zoneId": "ZONE_east_borena"
  },
  "arero": {
    "lat": 4.848,
    "lng": 38.867,
    "name": "Arero",
    "zoneId": "ZONE_east_borena"
  },
  "WOREDA_east_borena_wachile": {
    "lat": 4.485,
    "lng": 39.407,
    "name": "Wachile",
    "zoneId": "ZONE_east_borena"
  },
  "wachile": {
    "lat": 4.485,
    "lng": 39.407,
    "name": "Wachile",
    "zoneId": "ZONE_east_borena"
  },
  "WOREDA_east_borena_dhas": {
    "lat": 4.18,
    "lng": 38.927,
    "name": "Dhas",
    "zoneId": "ZONE_east_borena"
  },
  "dhas": {
    "lat": 4.18,
    "lng": 38.927,
    "name": "Dhas",
    "zoneId": "ZONE_east_borena"
  },
  "WOREDA_siti_ayisha": {
    "lat": 10.689,
    "lng": 42.505,
    "name": "Ayisha",
    "zoneId": "ZONE_siti"
  },
  "ayisha": {
    "lat": 10.689,
    "lng": 42.505,
    "name": "Ayisha",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_siti_dembel": {
    "lat": 9.916,
    "lng": 42.496,
    "name": "Dembel",
    "zoneId": "ZONE_siti"
  },
  "dembel": {
    "lat": 9.916,
    "lng": 42.496,
    "name": "Dembel",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_siti_shinile": {
    "lat": 9.935,
    "lng": 41.882,
    "name": "Shinile",
    "zoneId": "ZONE_siti"
  },
  "shinile": {
    "lat": 9.935,
    "lng": 41.882,
    "name": "Shinile",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_siti_erer_sm": {
    "lat": 9.903,
    "lng": 41.414,
    "name": "Erer (SM)",
    "zoneId": "ZONE_siti"
  },
  "erer (sm)": {
    "lat": 9.903,
    "lng": 41.414,
    "name": "Erer (SM)",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_siti_afdem": {
    "lat": 9.74,
    "lng": 40.981,
    "name": "Afdem",
    "zoneId": "ZONE_siti"
  },
  "afdem": {
    "lat": 9.74,
    "lng": 40.981,
    "name": "Afdem",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_siti_hadhagala": {
    "lat": 10.408,
    "lng": 42.167,
    "name": "Hadhagala",
    "zoneId": "ZONE_siti"
  },
  "hadhagala": {
    "lat": 10.408,
    "lng": 42.167,
    "name": "Hadhagala",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_siti_miesso": {
    "lat": 9.47,
    "lng": 40.938,
    "name": "Miesso",
    "zoneId": "ZONE_siti"
  },
  "miesso": {
    "lat": 9.47,
    "lng": 40.938,
    "name": "Miesso",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_siti_daymeed": {
    "lat": 9.558,
    "lng": 40.777,
    "name": "Daymeed",
    "zoneId": "ZONE_siti"
  },
  "daymeed": {
    "lat": 9.558,
    "lng": 40.777,
    "name": "Daymeed",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_siti_dhunyar": {
    "lat": 10.482,
    "lng": 41.211,
    "name": "Dhunyar",
    "zoneId": "ZONE_siti"
  },
  "dhunyar": {
    "lat": 10.482,
    "lng": 41.211,
    "name": "Dhunyar",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_siti_gota_biki": {
    "lat": 9.69,
    "lng": 41.178,
    "name": "Gota-Biki",
    "zoneId": "ZONE_siti"
  },
  "gota-biki": {
    "lat": 9.69,
    "lng": 41.178,
    "name": "Gota-Biki",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_siti_gablalu": {
    "lat": 10.639,
    "lng": 41.649,
    "name": "Gablalu",
    "zoneId": "ZONE_siti"
  },
  "gablalu": {
    "lat": 10.639,
    "lng": 41.649,
    "name": "Gablalu",
    "zoneId": "ZONE_siti"
  },
  "WOREDA_fafan_gursum_sm": {
    "lat": 9.202,
    "lng": 42.634,
    "name": "Gursum (SM)",
    "zoneId": "ZONE_fafan"
  },
  "gursum (sm)": {
    "lat": 9.202,
    "lng": 42.634,
    "name": "Gursum (SM)",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_babile_sm": {
    "lat": 8.492,
    "lng": 42.353,
    "name": "Babile (SM)",
    "zoneId": "ZONE_fafan"
  },
  "babile (sm)": {
    "lat": 8.492,
    "lng": 42.353,
    "name": "Babile (SM)",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_shabeeley": {
    "lat": 9.134,
    "lng": 42.817,
    "name": "Shabeeley",
    "zoneId": "ZONE_fafan"
  },
  "shabeeley": {
    "lat": 9.134,
    "lng": 42.817,
    "name": "Shabeeley",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_aw_bare": {
    "lat": 9.603,
    "lng": 43.129,
    "name": "Aw-Bare",
    "zoneId": "ZONE_fafan"
  },
  "aw-bare": {
    "lat": 9.603,
    "lng": 43.129,
    "name": "Aw-Bare",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_kebribeyah": {
    "lat": 9.17,
    "lng": 43.385,
    "name": "Kebribeyah",
    "zoneId": "ZONE_fafan"
  },
  "kebribeyah": {
    "lat": 9.17,
    "lng": 43.385,
    "name": "Kebribeyah",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_harshin": {
    "lat": 8.905,
    "lng": 43.772,
    "name": "Harshin",
    "zoneId": "ZONE_fafan"
  },
  "harshin": {
    "lat": 8.905,
    "lng": 43.772,
    "name": "Harshin",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_tuliguled": {
    "lat": 9.467,
    "lng": 42.765,
    "name": "Tuliguled",
    "zoneId": "ZONE_fafan"
  },
  "tuliguled": {
    "lat": 9.467,
    "lng": 42.765,
    "name": "Tuliguled",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_goljano": {
    "lat": 8.271,
    "lng": 42.811,
    "name": "Goljano",
    "zoneId": "ZONE_fafan"
  },
  "goljano": {
    "lat": 8.271,
    "lng": 42.811,
    "name": "Goljano",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_jigjiga_town": {
    "lat": 9.368,
    "lng": 42.814,
    "name": "Jigjiga town",
    "zoneId": "ZONE_fafan"
  },
  "jigjiga town": {
    "lat": 9.368,
    "lng": 42.814,
    "name": "Jigjiga town",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_wajale_town": {
    "lat": 9.558,
    "lng": 43.322,
    "name": "Wajale town",
    "zoneId": "ZONE_fafan"
  },
  "wajale town": {
    "lat": 9.558,
    "lng": 43.322,
    "name": "Wajale town",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_kebribayah_town": {
    "lat": 9.096,
    "lng": 43.181,
    "name": "Kebribayah town",
    "zoneId": "ZONE_fafan"
  },
  "kebribayah town": {
    "lat": 9.096,
    "lng": 43.181,
    "name": "Kebribayah town",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_koran_mulla": {
    "lat": 8.693,
    "lng": 43.066,
    "name": "Koran /Mulla",
    "zoneId": "ZONE_fafan"
  },
  "koran /mulla": {
    "lat": 8.693,
    "lng": 43.066,
    "name": "Koran /Mulla",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_haroreys": {
    "lat": 9.372,
    "lng": 43.031,
    "name": "Haroreys",
    "zoneId": "ZONE_fafan"
  },
  "haroreys": {
    "lat": 9.372,
    "lng": 43.031,
    "name": "Haroreys",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_fafan_harawo": {
    "lat": 9.966,
    "lng": 42.923,
    "name": "Harawo",
    "zoneId": "ZONE_fafan"
  },
  "harawo": {
    "lat": 9.966,
    "lng": 42.923,
    "name": "Harawo",
    "zoneId": "ZONE_fafan"
  },
  "WOREDA_jarar_degehamedo": {
    "lat": 8.058,
    "lng": 43.032,
    "name": "Degehamedo",
    "zoneId": "ZONE_jarar"
  },
  "degehamedo": {
    "lat": 8.058,
    "lng": 43.032,
    "name": "Degehamedo",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_degehabur": {
    "lat": 7.993,
    "lng": 43.583,
    "name": "Degehabur",
    "zoneId": "ZONE_jarar"
  },
  "degehabur": {
    "lat": 7.993,
    "lng": 43.583,
    "name": "Degehabur",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_aware": {
    "lat": 8.071,
    "lng": 44.166,
    "name": "Aware",
    "zoneId": "ZONE_jarar"
  },
  "aware": {
    "lat": 8.071,
    "lng": 44.166,
    "name": "Aware",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_gashamo": {
    "lat": 8.152,
    "lng": 45.319,
    "name": "Gashamo",
    "zoneId": "ZONE_jarar"
  },
  "gashamo": {
    "lat": 8.152,
    "lng": 45.319,
    "name": "Gashamo",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_gunagado": {
    "lat": 7.687,
    "lng": 44.167,
    "name": "Gunagado",
    "zoneId": "ZONE_jarar"
  },
  "gunagado": {
    "lat": 7.687,
    "lng": 44.167,
    "name": "Gunagado",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_bilcil_bur": {
    "lat": 8.381,
    "lng": 43.298,
    "name": "Bilcil-Bur",
    "zoneId": "ZONE_jarar"
  },
  "bilcil-bur": {
    "lat": 8.381,
    "lng": 43.298,
    "name": "Bilcil-Bur",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_degahabur_town": {
    "lat": 8.226,
    "lng": 43.551,
    "name": "Degahabur town",
    "zoneId": "ZONE_jarar"
  },
  "degahabur town": {
    "lat": 8.226,
    "lng": 43.551,
    "name": "Degahabur town",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_yocale": {
    "lat": 8.424,
    "lng": 43.81,
    "name": "Yocale",
    "zoneId": "ZONE_jarar"
  },
  "yocale": {
    "lat": 8.424,
    "lng": 43.81,
    "name": "Yocale",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_daror": {
    "lat": 8.429,
    "lng": 44.475,
    "name": "Daror",
    "zoneId": "ZONE_jarar"
  },
  "daror": {
    "lat": 8.429,
    "lng": 44.475,
    "name": "Daror",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_burqod": {
    "lat": 7.61,
    "lng": 43.617,
    "name": "Burqod",
    "zoneId": "ZONE_jarar"
  },
  "burqod": {
    "lat": 7.61,
    "lng": 43.617,
    "name": "Burqod",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_ararso": {
    "lat": 8.701,
    "lng": 43.379,
    "name": "Ararso",
    "zoneId": "ZONE_jarar"
  },
  "ararso": {
    "lat": 8.701,
    "lng": 43.379,
    "name": "Ararso",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_jarar_dig": {
    "lat": 7.687,
    "lng": 44.497,
    "name": "Dig",
    "zoneId": "ZONE_jarar"
  },
  "dig": {
    "lat": 7.687,
    "lng": 44.497,
    "name": "Dig",
    "zoneId": "ZONE_jarar"
  },
  "WOREDA_erer_fik": {
    "lat": 8.156,
    "lng": 42.305,
    "name": "Fik",
    "zoneId": "ZONE_erer"
  },
  "fik": {
    "lat": 8.156,
    "lng": 42.305,
    "name": "Fik",
    "zoneId": "ZONE_erer"
  },
  "WOREDA_erer_salahad": {
    "lat": 7.12,
    "lng": 42.224,
    "name": "Salahad",
    "zoneId": "ZONE_erer"
  },
  "salahad": {
    "lat": 7.12,
    "lng": 42.224,
    "name": "Salahad",
    "zoneId": "ZONE_erer"
  },
  "WOREDA_erer_hamero": {
    "lat": 7.635,
    "lng": 42.302,
    "name": "Hamero",
    "zoneId": "ZONE_erer"
  },
  "hamero": {
    "lat": 7.635,
    "lng": 42.302,
    "name": "Hamero",
    "zoneId": "ZONE_erer"
  },
  "WOREDA_erer_lagahida": {
    "lat": 7.428,
    "lng": 42.037,
    "name": "Lagahida",
    "zoneId": "ZONE_erer"
  },
  "lagahida": {
    "lat": 7.428,
    "lng": 42.037,
    "name": "Lagahida",
    "zoneId": "ZONE_erer"
  },
  "WOREDA_erer_meyumuluka": {
    "lat": 8.265,
    "lng": 42.06,
    "name": "Meyumuluka",
    "zoneId": "ZONE_erer"
  },
  "meyumuluka": {
    "lat": 8.265,
    "lng": 42.06,
    "name": "Meyumuluka",
    "zoneId": "ZONE_erer"
  },
  "WOREDA_erer_qubi": {
    "lat": 7.722,
    "lng": 41.97,
    "name": "Qubi",
    "zoneId": "ZONE_erer"
  },
  "qubi": {
    "lat": 7.722,
    "lng": 41.97,
    "name": "Qubi",
    "zoneId": "ZONE_erer"
  },
  "WOREDA_erer_yahob": {
    "lat": 7.854,
    "lng": 42.573,
    "name": "Yahob",
    "zoneId": "ZONE_erer"
  },
  "yahob": {
    "lat": 7.854,
    "lng": 42.573,
    "name": "Yahob",
    "zoneId": "ZONE_erer"
  },
  "WOREDA_erer_wangey": {
    "lat": 7.444,
    "lng": 42.204,
    "name": "Wangey",
    "zoneId": "ZONE_erer"
  },
  "wangey": {
    "lat": 7.444,
    "lng": 42.204,
    "name": "Wangey",
    "zoneId": "ZONE_erer"
  },
  "WOREDA_korahe_shaygosh": {
    "lat": 7.364,
    "lng": 44.054,
    "name": "Shaygosh",
    "zoneId": "ZONE_korahe"
  },
  "shaygosh": {
    "lat": 7.364,
    "lng": 44.054,
    "name": "Shaygosh",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_korahe_kebridehar": {
    "lat": 6.657,
    "lng": 44.088,
    "name": "Kebridehar",
    "zoneId": "ZONE_korahe"
  },
  "kebridehar": {
    "lat": 6.657,
    "lng": 44.088,
    "name": "Kebridehar",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_korahe_shilabo": {
    "lat": 5.956,
    "lng": 45.218,
    "name": "Shilabo",
    "zoneId": "ZONE_korahe"
  },
  "shilabo": {
    "lat": 5.956,
    "lng": 45.218,
    "name": "Shilabo",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_korahe_debeweyin": {
    "lat": 6.071,
    "lng": 44.39,
    "name": "Debeweyin",
    "zoneId": "ZONE_korahe"
  },
  "debeweyin": {
    "lat": 6.071,
    "lng": 44.39,
    "name": "Debeweyin",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_korahe_marsin": {
    "lat": 7.364,
    "lng": 44.655,
    "name": "Marsin",
    "zoneId": "ZONE_korahe"
  },
  "marsin": {
    "lat": 7.364,
    "lng": 44.655,
    "name": "Marsin",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_korahe_kebridehar_town": {
    "lat": 6.733,
    "lng": 44.276,
    "name": "Kebridehar town",
    "zoneId": "ZONE_korahe"
  },
  "kebridehar town": {
    "lat": 6.733,
    "lng": 44.276,
    "name": "Kebridehar town",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_korahe_goglo": {
    "lat": 6.838,
    "lng": 44.627,
    "name": "Goglo",
    "zoneId": "ZONE_korahe"
  },
  "goglo": {
    "lat": 6.838,
    "lng": 44.627,
    "name": "Goglo",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_korahe_lasdhankayre": {
    "lat": 6.57,
    "lng": 43.897,
    "name": "Lasdhankayre",
    "zoneId": "ZONE_korahe"
  },
  "lasdhankayre": {
    "lat": 6.57,
    "lng": 43.897,
    "name": "Lasdhankayre",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_korahe_higloley": {
    "lat": 5.735,
    "lng": 44.572,
    "name": "Higloley",
    "zoneId": "ZONE_korahe"
  },
  "higloley": {
    "lat": 5.735,
    "lng": 44.572,
    "name": "Higloley",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_korahe_el_ogaden": {
    "lat": 6.396,
    "lng": 44.475,
    "name": "El-Ogaden",
    "zoneId": "ZONE_korahe"
  },
  "el-ogaden": {
    "lat": 6.396,
    "lng": 44.475,
    "name": "El-Ogaden",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_korahe_bodaley": {
    "lat": 7.023,
    "lng": 43.928,
    "name": "Bodaley",
    "zoneId": "ZONE_korahe"
  },
  "bodaley": {
    "lat": 7.023,
    "lng": 43.928,
    "name": "Bodaley",
    "zoneId": "ZONE_korahe"
  },
  "WOREDA_shabelle_east_imi": {
    "lat": 6.657,
    "lng": 42.308,
    "name": "East Imi",
    "zoneId": "ZONE_shabelle"
  },
  "east imi": {
    "lat": 6.657,
    "lng": 42.308,
    "name": "East Imi",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_shabelle_adadle": {
    "lat": 5.491,
    "lng": 43.48,
    "name": "Adadle",
    "zoneId": "ZONE_shabelle"
  },
  "adadle": {
    "lat": 5.491,
    "lng": 43.48,
    "name": "Adadle",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_shabelle_danan": {
    "lat": 6.581,
    "lng": 43.486,
    "name": "Danan",
    "zoneId": "ZONE_shabelle"
  },
  "danan": {
    "lat": 6.581,
    "lng": 43.486,
    "name": "Danan",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_shabelle_gode": {
    "lat": 5.904,
    "lng": 43.783,
    "name": "Gode",
    "zoneId": "ZONE_shabelle"
  },
  "gode": {
    "lat": 5.904,
    "lng": 43.783,
    "name": "Gode",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_shabelle_kelafo": {
    "lat": 5.362,
    "lng": 44.152,
    "name": "Kelafo",
    "zoneId": "ZONE_shabelle"
  },
  "kelafo": {
    "lat": 5.362,
    "lng": 44.152,
    "name": "Kelafo",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_shabelle_mustahil": {
    "lat": 5.198,
    "lng": 44.651,
    "name": "Mustahil",
    "zoneId": "ZONE_shabelle"
  },
  "mustahil": {
    "lat": 5.198,
    "lng": 44.651,
    "name": "Mustahil",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_shabelle_ferfer": {
    "lat": 5.216,
    "lng": 45.035,
    "name": "Ferfer",
    "zoneId": "ZONE_shabelle"
  },
  "ferfer": {
    "lat": 5.216,
    "lng": 45.035,
    "name": "Ferfer",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_shabelle_berocano": {
    "lat": 6.182,
    "lng": 43.197,
    "name": "Berocano",
    "zoneId": "ZONE_shabelle"
  },
  "berocano": {
    "lat": 6.182,
    "lng": 43.197,
    "name": "Berocano",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_shabelle_godey_town": {
    "lat": 5.951,
    "lng": 43.556,
    "name": "Godey town",
    "zoneId": "ZONE_shabelle"
  },
  "godey town": {
    "lat": 5.951,
    "lng": 43.556,
    "name": "Godey town",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_shabelle_elale": {
    "lat": 6.156,
    "lng": 43.94,
    "name": "Elale",
    "zoneId": "ZONE_shabelle"
  },
  "elale": {
    "lat": 6.156,
    "lng": 43.94,
    "name": "Elale",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_shabelle_aba_korow": {
    "lat": 6.473,
    "lng": 42.692,
    "name": "Aba-Korow",
    "zoneId": "ZONE_shabelle"
  },
  "aba-korow": {
    "lat": 6.473,
    "lng": 42.692,
    "name": "Aba-Korow",
    "zoneId": "ZONE_shabelle"
  },
  "WOREDA_doolo_danod": {
    "lat": 7.911,
    "lng": 46.038,
    "name": "Danod",
    "zoneId": "ZONE_doolo"
  },
  "danod": {
    "lat": 7.911,
    "lng": 46.038,
    "name": "Danod",
    "zoneId": "ZONE_doolo"
  },
  "WOREDA_doolo_bokh": {
    "lat": 7.645,
    "lng": 46.651,
    "name": "Bokh",
    "zoneId": "ZONE_doolo"
  },
  "bokh": {
    "lat": 7.645,
    "lng": 46.651,
    "name": "Bokh",
    "zoneId": "ZONE_doolo"
  },
  "WOREDA_doolo_galadi": {
    "lat": 6.994,
    "lng": 46.291,
    "name": "Galadi",
    "zoneId": "ZONE_doolo"
  },
  "galadi": {
    "lat": 6.994,
    "lng": 46.291,
    "name": "Galadi",
    "zoneId": "ZONE_doolo"
  },
  "WOREDA_doolo_warder": {
    "lat": 6.863,
    "lng": 45.556,
    "name": "Warder",
    "zoneId": "ZONE_doolo"
  },
  "warder": {
    "lat": 6.863,
    "lng": 45.556,
    "name": "Warder",
    "zoneId": "ZONE_doolo"
  },
  "WOREDA_doolo_daratole": {
    "lat": 7.285,
    "lng": 45.351,
    "name": "Daratole",
    "zoneId": "ZONE_doolo"
  },
  "daratole": {
    "lat": 7.285,
    "lng": 45.351,
    "name": "Daratole",
    "zoneId": "ZONE_doolo"
  },
  "WOREDA_doolo_lehel_yucub": {
    "lat": 6.585,
    "lng": 45.164,
    "name": "Lehel-Yucub",
    "zoneId": "ZONE_doolo"
  },
  "lehel-yucub": {
    "lat": 6.585,
    "lng": 45.164,
    "name": "Lehel-Yucub",
    "zoneId": "ZONE_doolo"
  },
  "WOREDA_doolo_galhamur": {
    "lat": 7.732,
    "lng": 47.339,
    "name": "Galhamur",
    "zoneId": "ZONE_doolo"
  },
  "galhamur": {
    "lat": 7.732,
    "lng": 47.339,
    "name": "Galhamur",
    "zoneId": "ZONE_doolo"
  },
  "WOREDA_afder_charati": {
    "lat": 5.298,
    "lng": 41.678,
    "name": "Charati",
    "zoneId": "ZONE_afder"
  },
  "charati": {
    "lat": 5.298,
    "lng": 41.678,
    "name": "Charati",
    "zoneId": "ZONE_afder"
  },
  "WOREDA_afder_elkare_serer": {
    "lat": 5.951,
    "lng": 42.079,
    "name": "Elkare /Serer",
    "zoneId": "ZONE_afder"
  },
  "elkare /serer": {
    "lat": 5.951,
    "lng": 42.079,
    "name": "Elkare /Serer",
    "zoneId": "ZONE_afder"
  },
  "WOREDA_afder_west_imi": {
    "lat": 6.24,
    "lng": 42.286,
    "name": "West Imi",
    "zoneId": "ZONE_afder"
  },
  "west imi": {
    "lat": 6.24,
    "lng": 42.286,
    "name": "West Imi",
    "zoneId": "ZONE_afder"
  },
  "WOREDA_afder_hargele": {
    "lat": 5.31,
    "lng": 42.464,
    "name": "Hargele",
    "zoneId": "ZONE_afder"
  },
  "hargele": {
    "lat": 5.31,
    "lng": 42.464,
    "name": "Hargele",
    "zoneId": "ZONE_afder"
  },
  "WOREDA_afder_barey": {
    "lat": 4.702,
    "lng": 42.699,
    "name": "Barey",
    "zoneId": "ZONE_afder"
  },
  "barey": {
    "lat": 4.702,
    "lng": 42.699,
    "name": "Barey",
    "zoneId": "ZONE_afder"
  },
  "WOREDA_afder_dolobay": {
    "lat": 4.488,
    "lng": 42.099,
    "name": "Dolobay",
    "zoneId": "ZONE_afder"
  },
  "dolobay": {
    "lat": 4.488,
    "lng": 42.099,
    "name": "Dolobay",
    "zoneId": "ZONE_afder"
  },
  "WOREDA_afder_raso": {
    "lat": 6.509,
    "lng": 41.904,
    "name": "Raso",
    "zoneId": "ZONE_afder"
  },
  "raso": {
    "lat": 6.509,
    "lng": 41.904,
    "name": "Raso",
    "zoneId": "ZONE_afder"
  },
  "WOREDA_afder_kohle_qoxle": {
    "lat": 5.309,
    "lng": 43.126,
    "name": "Kohle /Qoxle",
    "zoneId": "ZONE_afder"
  },
  "kohle /qoxle": {
    "lat": 5.309,
    "lng": 43.126,
    "name": "Kohle /Qoxle",
    "zoneId": "ZONE_afder"
  },
  "WOREDA_afder_god_god": {
    "lat": 4.858,
    "lng": 43.242,
    "name": "God-God",
    "zoneId": "ZONE_afder"
  },
  "god-god": {
    "lat": 4.858,
    "lng": 43.242,
    "name": "God-God",
    "zoneId": "ZONE_afder"
  },
  "WOREDA_liban_filtu": {
    "lat": 5.029,
    "lng": 40.901,
    "name": "Filtu",
    "zoneId": "ZONE_liban"
  },
  "filtu": {
    "lat": 5.029,
    "lng": 40.901,
    "name": "Filtu",
    "zoneId": "ZONE_liban"
  },
  "WOREDA_liban_dolo_ado": {
    "lat": 4.163,
    "lng": 41.658,
    "name": "Dolo Ado",
    "zoneId": "ZONE_liban"
  },
  "dolo ado": {
    "lat": 4.163,
    "lng": 41.658,
    "name": "Dolo Ado",
    "zoneId": "ZONE_liban"
  },
  "WOREDA_liban_goro_baqaqsa": {
    "lat": 6.161,
    "lng": 41.324,
    "name": "Goro Baqaqsa",
    "zoneId": "ZONE_liban"
  },
  "goro baqaqsa": {
    "lat": 6.161,
    "lng": 41.324,
    "name": "Goro Baqaqsa",
    "zoneId": "ZONE_liban"
  },
  "WOREDA_liban_guradamole": {
    "lat": 6.091,
    "lng": 41.014,
    "name": "Guradamole",
    "zoneId": "ZONE_liban"
  },
  "guradamole": {
    "lat": 6.091,
    "lng": 41.014,
    "name": "Guradamole",
    "zoneId": "ZONE_liban"
  },
  "WOREDA_liban_deka_suftu": {
    "lat": 5.047,
    "lng": 40.116,
    "name": "Deka Suftu",
    "zoneId": "ZONE_liban"
  },
  "deka suftu": {
    "lat": 5.047,
    "lng": 40.116,
    "name": "Deka Suftu",
    "zoneId": "ZONE_liban"
  },
  "WOREDA_liban_bokolmayo": {
    "lat": 4.416,
    "lng": 41.301,
    "name": "Bokolmayo",
    "zoneId": "ZONE_liban"
  },
  "bokolmayo": {
    "lat": 4.416,
    "lng": 41.301,
    "name": "Bokolmayo",
    "zoneId": "ZONE_liban"
  },
  "WOREDA_nogob_ayun": {
    "lat": 7.119,
    "lng": 42.399,
    "name": "Ayun",
    "zoneId": "ZONE_nogob"
  },
  "ayun": {
    "lat": 7.119,
    "lng": 42.399,
    "name": "Ayun",
    "zoneId": "ZONE_nogob"
  },
  "WOREDA_nogob_elwayne": {
    "lat": 6.562,
    "lng": 43.056,
    "name": "Elwayne",
    "zoneId": "ZONE_nogob"
  },
  "elwayne": {
    "lat": 6.562,
    "lng": 43.056,
    "name": "Elwayne",
    "zoneId": "ZONE_nogob"
  },
  "WOREDA_nogob_garbo": {
    "lat": 7.318,
    "lng": 43.206,
    "name": "Garbo",
    "zoneId": "ZONE_nogob"
  },
  "garbo": {
    "lat": 7.318,
    "lng": 43.206,
    "name": "Garbo",
    "zoneId": "ZONE_nogob"
  },
  "WOREDA_nogob_sagag": {
    "lat": 7.632,
    "lng": 42.909,
    "name": "Sagag",
    "zoneId": "ZONE_nogob"
  },
  "sagag": {
    "lat": 7.632,
    "lng": 42.909,
    "name": "Sagag",
    "zoneId": "ZONE_nogob"
  },
  "WOREDA_nogob_dihun": {
    "lat": 7.1,
    "lng": 42.699,
    "name": "Dihun",
    "zoneId": "ZONE_nogob"
  },
  "dihun": {
    "lat": 7.1,
    "lng": 42.699,
    "name": "Dihun",
    "zoneId": "ZONE_nogob"
  },
  "WOREDA_nogob_horshagah": {
    "lat": 6.949,
    "lng": 43.432,
    "name": "Horshagah",
    "zoneId": "ZONE_nogob"
  },
  "horshagah": {
    "lat": 6.949,
    "lng": 43.432,
    "name": "Horshagah",
    "zoneId": "ZONE_nogob"
  },
  "WOREDA_nogob_hararey": {
    "lat": 6.928,
    "lng": 42.989,
    "name": "Hararey",
    "zoneId": "ZONE_nogob"
  },
  "hararey": {
    "lat": 6.928,
    "lng": 42.989,
    "name": "Hararey",
    "zoneId": "ZONE_nogob"
  },
  "WOREDA_daawa_moyale_sm": {
    "lat": 4.069,
    "lng": 39.634,
    "name": "Moyale (SM)",
    "zoneId": "ZONE_daawa"
  },
  "moyale (sm)": {
    "lat": 4.069,
    "lng": 39.634,
    "name": "Moyale (SM)",
    "zoneId": "ZONE_daawa"
  },
  "WOREDA_daawa_hudet": {
    "lat": 4.378,
    "lng": 39.731,
    "name": "Hudet",
    "zoneId": "ZONE_daawa"
  },
  "hudet": {
    "lat": 4.378,
    "lng": 39.731,
    "name": "Hudet",
    "zoneId": "ZONE_daawa"
  },
  "WOREDA_daawa_mubarek": {
    "lat": 4.394,
    "lng": 40.217,
    "name": "Mubarek",
    "zoneId": "ZONE_daawa"
  },
  "mubarek": {
    "lat": 4.394,
    "lng": 40.217,
    "name": "Mubarek",
    "zoneId": "ZONE_daawa"
  },
  "WOREDA_daawa_qada_duma": {
    "lat": 3.752,
    "lng": 39.631,
    "name": "Qada Duma",
    "zoneId": "ZONE_daawa"
  },
  "qada duma": {
    "lat": 3.752,
    "lng": 39.631,
    "name": "Qada Duma",
    "zoneId": "ZONE_daawa"
  },
  "WOREDA_metekel_gilgel_beles_town": {
    "lat": 11.153,
    "lng": 36.341,
    "name": "Gilgel Beles town",
    "zoneId": "ZONE_metekel"
  },
  "gilgel beles town": {
    "lat": 11.153,
    "lng": 36.341,
    "name": "Gilgel Beles town",
    "zoneId": "ZONE_metekel"
  },
  "WOREDA_metekel_dangur": {
    "lat": 11.372,
    "lng": 36.025,
    "name": "Dangur",
    "zoneId": "ZONE_metekel"
  },
  "dangur": {
    "lat": 11.372,
    "lng": 36.025,
    "name": "Dangur",
    "zoneId": "ZONE_metekel"
  },
  "WOREDA_metekel_guba": {
    "lat": 11.497,
    "lng": 35.456,
    "name": "Guba",
    "zoneId": "ZONE_metekel"
  },
  "guba": {
    "lat": 11.497,
    "lng": 35.456,
    "name": "Guba",
    "zoneId": "ZONE_metekel"
  },
  "WOREDA_metekel_wembera": {
    "lat": 10.606,
    "lng": 35.552,
    "name": "Wembera",
    "zoneId": "ZONE_metekel"
  },
  "wembera": {
    "lat": 10.606,
    "lng": 35.552,
    "name": "Wembera",
    "zoneId": "ZONE_metekel"
  },
  "WOREDA_metekel_mandura": {
    "lat": 11.02,
    "lng": 36.279,
    "name": "Mandura",
    "zoneId": "ZONE_metekel"
  },
  "mandura": {
    "lat": 11.02,
    "lng": 36.279,
    "name": "Mandura",
    "zoneId": "ZONE_metekel"
  },
  "WOREDA_metekel_dibate": {
    "lat": 10.467,
    "lng": 36.214,
    "name": "Dibate",
    "zoneId": "ZONE_metekel"
  },
  "dibate": {
    "lat": 10.467,
    "lng": 36.214,
    "name": "Dibate",
    "zoneId": "ZONE_metekel"
  },
  "WOREDA_metekel_pawe": {
    "lat": 11.298,
    "lng": 36.409,
    "name": "Pawe",
    "zoneId": "ZONE_metekel"
  },
  "pawe": {
    "lat": 11.298,
    "lng": 36.409,
    "name": "Pawe",
    "zoneId": "ZONE_metekel"
  },
  "WOREDA_metekel_bulen": {
    "lat": 10.608,
    "lng": 35.957,
    "name": "Bulen",
    "zoneId": "ZONE_metekel"
  },
  "bulen": {
    "lat": 10.608,
    "lng": 35.957,
    "name": "Bulen",
    "zoneId": "ZONE_metekel"
  },
  "WOREDA_assosa_menge": {
    "lat": 10.393,
    "lng": 34.842,
    "name": "Menge",
    "zoneId": "ZONE_assosa"
  },
  "menge": {
    "lat": 10.393,
    "lng": 34.842,
    "name": "Menge",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_assosa_kurmuk": {
    "lat": 10.568,
    "lng": 34.459,
    "name": "Kurmuk",
    "zoneId": "ZONE_assosa"
  },
  "kurmuk": {
    "lat": 10.568,
    "lng": 34.459,
    "name": "Kurmuk",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_assosa_abrahmo": {
    "lat": 9.931,
    "lng": 34.401,
    "name": "Abrahmo",
    "zoneId": "ZONE_assosa"
  },
  "abrahmo": {
    "lat": 9.931,
    "lng": 34.401,
    "name": "Abrahmo",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_assosa_sherkole": {
    "lat": 10.617,
    "lng": 34.808,
    "name": "Sherkole",
    "zoneId": "ZONE_assosa"
  },
  "sherkole": {
    "lat": 10.617,
    "lng": 34.808,
    "name": "Sherkole",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_assosa_bambasi": {
    "lat": 9.767,
    "lng": 34.661,
    "name": "Bambasi",
    "zoneId": "ZONE_assosa"
  },
  "bambasi": {
    "lat": 9.767,
    "lng": 34.661,
    "name": "Bambasi",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_assosa_bilidigilu": {
    "lat": 10.129,
    "lng": 35.114,
    "name": "Bilidigilu",
    "zoneId": "ZONE_assosa"
  },
  "bilidigilu": {
    "lat": 10.129,
    "lng": 35.114,
    "name": "Bilidigilu",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_assosa_homosha": {
    "lat": 10.314,
    "lng": 34.574,
    "name": "Homosha",
    "zoneId": "ZONE_assosa"
  },
  "homosha": {
    "lat": 10.314,
    "lng": 34.574,
    "name": "Homosha",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_assosa_undulu": {
    "lat": 10.215,
    "lng": 34.917,
    "name": "Undulu",
    "zoneId": "ZONE_assosa"
  },
  "undulu": {
    "lat": 10.215,
    "lng": 34.917,
    "name": "Undulu",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_assosa_assosa_town_admin": {
    "lat": 10.057,
    "lng": 34.54,
    "name": "Assosa town Admin",
    "zoneId": "ZONE_assosa"
  },
  "assosa town admin": {
    "lat": 10.057,
    "lng": 34.54,
    "name": "Assosa town Admin",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_assosa_bambasi_town": {
    "lat": 9.758,
    "lng": 34.731,
    "name": "Bambasi town",
    "zoneId": "ZONE_assosa"
  },
  "bambasi town": {
    "lat": 9.758,
    "lng": 34.731,
    "name": "Bambasi town",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_assosa_ura": {
    "lat": 10.105,
    "lng": 34.653,
    "name": "Ura",
    "zoneId": "ZONE_assosa"
  },
  "ura": {
    "lat": 10.105,
    "lng": 34.653,
    "name": "Ura",
    "zoneId": "ZONE_assosa"
  },
  "WOREDA_kamashi_kamashi_town": {
    "lat": 9.517,
    "lng": 35.858,
    "name": "Kamashi town",
    "zoneId": "ZONE_kamashi"
  },
  "kamashi town": {
    "lat": 9.517,
    "lng": 35.858,
    "name": "Kamashi town",
    "zoneId": "ZONE_kamashi"
  },
  "WOREDA_kamashi_zayi": {
    "lat": 9.957,
    "lng": 35.935,
    "name": "Zayi",
    "zoneId": "ZONE_kamashi"
  },
  "zayi": {
    "lat": 9.957,
    "lng": 35.935,
    "name": "Zayi",
    "zoneId": "ZONE_kamashi"
  },
  "WOREDA_kamashi_sedal": {
    "lat": 10.569,
    "lng": 35.078,
    "name": "Sedal",
    "zoneId": "ZONE_kamashi"
  },
  "sedal": {
    "lat": 10.569,
    "lng": 35.078,
    "name": "Sedal",
    "zoneId": "ZONE_kamashi"
  },
  "WOREDA_kamashi_kamashi": {
    "lat": 9.478,
    "lng": 35.91,
    "name": "Kamashi",
    "zoneId": "ZONE_kamashi"
  },
  "kamashi": {
    "lat": 9.478,
    "lng": 35.91,
    "name": "Kamashi",
    "zoneId": "ZONE_kamashi"
  },
  "WOREDA_kamashi_dembe": {
    "lat": 9.8,
    "lng": 35.65,
    "name": "Dembe",
    "zoneId": "ZONE_kamashi"
  },
  "dembe": {
    "lat": 9.8,
    "lng": 35.65,
    "name": "Dembe",
    "zoneId": "ZONE_kamashi"
  },
  "WOREDA_kamashi_mezniga": {
    "lat": 9.421,
    "lng": 36.375,
    "name": "Mezniga",
    "zoneId": "ZONE_kamashi"
  },
  "mezniga": {
    "lat": 9.421,
    "lng": 36.375,
    "name": "Mezniga",
    "zoneId": "ZONE_kamashi"
  },
  "WOREDA_mao_komo_special_mao_komo_special": {
    "lat": 9.356,
    "lng": 34.286,
    "name": "Mao-komo Special",
    "zoneId": "ZONE_mao_komo_special"
  },
  "mao-komo special": {
    "lat": 9.356,
    "lng": 34.286,
    "name": "Mao-komo Special",
    "zoneId": "ZONE_mao_komo_special"
  },
  "WOREDA_kebena_special_kebena_special": {
    "lat": 8.322,
    "lng": 37.909,
    "name": "Kebena Special",
    "zoneId": "ZONE_kebena_special"
  },
  "kebena special": {
    "lat": 8.322,
    "lng": 37.909,
    "name": "Kebena Special",
    "zoneId": "ZONE_kebena_special"
  },
  "WOREDA_guraghe_abeshege": {
    "lat": 8.292,
    "lng": 37.615,
    "name": "Abeshege",
    "zoneId": "ZONE_guraghe"
  },
  "abeshege": {
    "lat": 8.292,
    "lng": 37.615,
    "name": "Abeshege",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_ezha": {
    "lat": 8.144,
    "lng": 38.036,
    "name": "Ezha",
    "zoneId": "ZONE_guraghe"
  },
  "ezha": {
    "lat": 8.144,
    "lng": 38.036,
    "name": "Ezha",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_gedebano_gutazer_welene": {
    "lat": 8.319,
    "lng": 38.195,
    "name": "Gedebano Gutazer Welene",
    "zoneId": "ZONE_guraghe"
  },
  "gedebano gutazer welene": {
    "lat": 8.319,
    "lng": 38.195,
    "name": "Gedebano Gutazer Welene",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_endiguagn": {
    "lat": 7.825,
    "lng": 37.856,
    "name": "Endiguagn",
    "zoneId": "ZONE_guraghe"
  },
  "endiguagn": {
    "lat": 7.825,
    "lng": 37.856,
    "name": "Endiguagn",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_gumer": {
    "lat": 7.987,
    "lng": 38.073,
    "name": "Gumer",
    "zoneId": "ZONE_guraghe"
  },
  "gumer": {
    "lat": 7.987,
    "lng": 38.073,
    "name": "Gumer",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_cheha": {
    "lat": 8.186,
    "lng": 37.717,
    "name": "Cheha",
    "zoneId": "ZONE_guraghe"
  },
  "cheha": {
    "lat": 8.186,
    "lng": 37.717,
    "name": "Cheha",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_enemor_ener": {
    "lat": 8.069,
    "lng": 37.759,
    "name": "Enemor Ener",
    "zoneId": "ZONE_guraghe"
  },
  "enemor ener": {
    "lat": 8.069,
    "lng": 37.759,
    "name": "Enemor Ener",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_muhur_na_aklil": {
    "lat": 8.184,
    "lng": 38.19,
    "name": "Muhur Na Aklil",
    "zoneId": "ZONE_guraghe"
  },
  "muhur na aklil": {
    "lat": 8.184,
    "lng": 38.19,
    "name": "Muhur Na Aklil",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_geta": {
    "lat": 7.927,
    "lng": 37.962,
    "name": "Geta",
    "zoneId": "ZONE_guraghe"
  },
  "geta": {
    "lat": 7.927,
    "lng": 37.962,
    "name": "Geta",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_welkite_town": {
    "lat": 8.289,
    "lng": 37.787,
    "name": "Welkite town",
    "zoneId": "ZONE_guraghe"
  },
  "welkite town": {
    "lat": 8.289,
    "lng": 37.787,
    "name": "Welkite town",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_emdebir_town": {
    "lat": 8.122,
    "lng": 37.924,
    "name": "Emdebir town",
    "zoneId": "ZONE_guraghe"
  },
  "emdebir town": {
    "lat": 8.122,
    "lng": 37.924,
    "name": "Emdebir town",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_guraghe_enor_ener": {
    "lat": 7.927,
    "lng": 37.756,
    "name": "Enor Ener",
    "zoneId": "ZONE_guraghe"
  },
  "enor ener": {
    "lat": 7.927,
    "lng": 37.756,
    "name": "Enor Ener",
    "zoneId": "ZONE_guraghe"
  },
  "WOREDA_hadiya_misha": {
    "lat": 7.676,
    "lng": 37.813,
    "name": "Misha",
    "zoneId": "ZONE_hadiya"
  },
  "misha": {
    "lat": 7.676,
    "lng": 37.813,
    "name": "Misha",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_gombora": {
    "lat": 7.586,
    "lng": 37.621,
    "name": "Gombora",
    "zoneId": "ZONE_hadiya"
  },
  "gombora": {
    "lat": 7.586,
    "lng": 37.621,
    "name": "Gombora",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_lemmo": {
    "lat": 7.535,
    "lng": 37.914,
    "name": "Lemmo",
    "zoneId": "ZONE_hadiya"
  },
  "lemmo": {
    "lat": 7.535,
    "lng": 37.914,
    "name": "Lemmo",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_shashogo": {
    "lat": 7.5,
    "lng": 38.034,
    "name": "Shashogo",
    "zoneId": "ZONE_hadiya"
  },
  "shashogo": {
    "lat": 7.5,
    "lng": 38.034,
    "name": "Shashogo",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_misrak_badawacho": {
    "lat": 7.209,
    "lng": 38.047,
    "name": "Misrak Badawacho",
    "zoneId": "ZONE_hadiya"
  },
  "misrak badawacho": {
    "lat": 7.209,
    "lng": 38.047,
    "name": "Misrak Badawacho",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_soro": {
    "lat": 7.499,
    "lng": 37.494,
    "name": "Soro",
    "zoneId": "ZONE_hadiya"
  },
  "soro": {
    "lat": 7.499,
    "lng": 37.494,
    "name": "Soro",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_duna": {
    "lat": 7.34,
    "lng": 37.663,
    "name": "Duna",
    "zoneId": "ZONE_hadiya"
  },
  "duna": {
    "lat": 7.34,
    "lng": 37.663,
    "name": "Duna",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_analemmo": {
    "lat": 7.637,
    "lng": 37.985,
    "name": "Analemmo",
    "zoneId": "ZONE_hadiya"
  },
  "analemmo": {
    "lat": 7.637,
    "lng": 37.985,
    "name": "Analemmo",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_mirab_badowach": {
    "lat": 7.134,
    "lng": 37.816,
    "name": "Mirab Badowach",
    "zoneId": "ZONE_hadiya"
  },
  "mirab badowach": {
    "lat": 7.134,
    "lng": 37.816,
    "name": "Mirab Badowach",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_gibe": {
    "lat": 7.741,
    "lng": 37.668,
    "name": "Gibe",
    "zoneId": "ZONE_hadiya"
  },
  "gibe": {
    "lat": 7.741,
    "lng": 37.668,
    "name": "Gibe",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_hosaena_town": {
    "lat": 7.543,
    "lng": 37.846,
    "name": "Hosaena town",
    "zoneId": "ZONE_hadiya"
  },
  "hosaena town": {
    "lat": 7.543,
    "lng": 37.846,
    "name": "Hosaena town",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_shone_town": {
    "lat": 7.139,
    "lng": 37.955,
    "name": "Shone town",
    "zoneId": "ZONE_hadiya"
  },
  "shone town": {
    "lat": 7.139,
    "lng": 37.955,
    "name": "Shone town",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_gimbichu_town": {
    "lat": 7.448,
    "lng": 37.625,
    "name": "Gimbichu town",
    "zoneId": "ZONE_hadiya"
  },
  "gimbichu town": {
    "lat": 7.448,
    "lng": 37.625,
    "name": "Gimbichu town",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_jajura_town": {
    "lat": 7.459,
    "lng": 37.691,
    "name": "Jajura town",
    "zoneId": "ZONE_hadiya"
  },
  "jajura town": {
    "lat": 7.459,
    "lng": 37.691,
    "name": "Jajura town",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_ameka": {
    "lat": 7.789,
    "lng": 37.788,
    "name": "Ameka",
    "zoneId": "ZONE_hadiya"
  },
  "ameka": {
    "lat": 7.789,
    "lng": 37.788,
    "name": "Ameka",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_siraro_badawacho": {
    "lat": 7.114,
    "lng": 38.039,
    "name": "Siraro Badawacho",
    "zoneId": "ZONE_hadiya"
  },
  "siraro badawacho": {
    "lat": 7.114,
    "lng": 38.039,
    "name": "Siraro Badawacho",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_hadiya_mirab_soro": {
    "lat": 7.381,
    "lng": 37.462,
    "name": "Mirab Soro",
    "zoneId": "ZONE_hadiya"
  },
  "mirab soro": {
    "lat": 7.381,
    "lng": 37.462,
    "name": "Mirab Soro",
    "zoneId": "ZONE_hadiya"
  },
  "WOREDA_kembata_angacha": {
    "lat": 7.359,
    "lng": 37.861,
    "name": "Angacha",
    "zoneId": "ZONE_kembata"
  },
  "angacha": {
    "lat": 7.359,
    "lng": 37.861,
    "name": "Angacha",
    "zoneId": "ZONE_kembata"
  },
  "WOREDA_kembata_kediada_gambela": {
    "lat": 7.254,
    "lng": 37.927,
    "name": "Kediada Gambela",
    "zoneId": "ZONE_kembata"
  },
  "kediada gambela": {
    "lat": 7.254,
    "lng": 37.927,
    "name": "Kediada Gambela",
    "zoneId": "ZONE_kembata"
  },
  "WOREDA_kembata_kacha_bira": {
    "lat": 7.236,
    "lng": 37.742,
    "name": "Kacha Bira",
    "zoneId": "ZONE_kembata"
  },
  "kacha bira": {
    "lat": 7.236,
    "lng": 37.742,
    "name": "Kacha Bira",
    "zoneId": "ZONE_kembata"
  },
  "WOREDA_kembata_hadero_tunto": {
    "lat": 7.236,
    "lng": 37.656,
    "name": "Hadero Tunto",
    "zoneId": "ZONE_kembata"
  },
  "hadero tunto": {
    "lat": 7.236,
    "lng": 37.656,
    "name": "Hadero Tunto",
    "zoneId": "ZONE_kembata"
  },
  "WOREDA_kembata_doyogena": {
    "lat": 7.387,
    "lng": 37.806,
    "name": "Doyogena",
    "zoneId": "ZONE_kembata"
  },
  "doyogena": {
    "lat": 7.387,
    "lng": 37.806,
    "name": "Doyogena",
    "zoneId": "ZONE_kembata"
  },
  "WOREDA_kembata_damboya": {
    "lat": 7.358,
    "lng": 37.957,
    "name": "Damboya",
    "zoneId": "ZONE_kembata"
  },
  "damboya": {
    "lat": 7.358,
    "lng": 37.957,
    "name": "Damboya",
    "zoneId": "ZONE_kembata"
  },
  "WOREDA_kembata_durame_town": {
    "lat": 7.242,
    "lng": 37.897,
    "name": "Durame town",
    "zoneId": "ZONE_kembata"
  },
  "durame town": {
    "lat": 7.242,
    "lng": 37.897,
    "name": "Durame town",
    "zoneId": "ZONE_kembata"
  },
  "WOREDA_kembata_adilo": {
    "lat": 7.239,
    "lng": 37.977,
    "name": "Adilo",
    "zoneId": "ZONE_kembata"
  },
  "adilo": {
    "lat": 7.239,
    "lng": 37.977,
    "name": "Adilo",
    "zoneId": "ZONE_kembata"
  },
  "WOREDA_kembata_shinshincho_town": {
    "lat": 7.204,
    "lng": 37.777,
    "name": "Shinshincho town",
    "zoneId": "ZONE_kembata"
  },
  "shinshincho town": {
    "lat": 7.204,
    "lng": 37.777,
    "name": "Shinshincho town",
    "zoneId": "ZONE_kembata"
  },
  "WOREDA_kembata_hadero_town": {
    "lat": 7.193,
    "lng": 37.663,
    "name": "Hadero town",
    "zoneId": "ZONE_kembata"
  },
  "hadero town": {
    "lat": 7.193,
    "lng": 37.663,
    "name": "Hadero town",
    "zoneId": "ZONE_kembata"
  },
  "WOREDA_east_guraghe_butajira_town": {
    "lat": 8.119,
    "lng": 38.385,
    "name": "Butajira town",
    "zoneId": "ZONE_east_guraghe"
  },
  "butajira town": {
    "lat": 8.119,
    "lng": 38.385,
    "name": "Butajira town",
    "zoneId": "ZONE_east_guraghe"
  },
  "WOREDA_east_guraghe_bui_town": {
    "lat": 8.322,
    "lng": 38.552,
    "name": "Bui town",
    "zoneId": "ZONE_east_guraghe"
  },
  "bui town": {
    "lat": 8.322,
    "lng": 38.552,
    "name": "Bui town",
    "zoneId": "ZONE_east_guraghe"
  },
  "WOREDA_east_guraghe_sodo": {
    "lat": 8.371,
    "lng": 38.503,
    "name": "Sodo",
    "zoneId": "ZONE_east_guraghe"
  },
  "sodo": {
    "lat": 8.371,
    "lng": 38.503,
    "name": "Sodo",
    "zoneId": "ZONE_east_guraghe"
  },
  "WOREDA_east_guraghe_meskan": {
    "lat": 8.144,
    "lng": 38.317,
    "name": "Meskan",
    "zoneId": "ZONE_east_guraghe"
  },
  "meskan": {
    "lat": 8.144,
    "lng": 38.317,
    "name": "Meskan",
    "zoneId": "ZONE_east_guraghe"
  },
  "WOREDA_east_guraghe_misrak_meskan": {
    "lat": 8.104,
    "lng": 38.488,
    "name": "Misrak Meskan",
    "zoneId": "ZONE_east_guraghe"
  },
  "misrak meskan": {
    "lat": 8.104,
    "lng": 38.488,
    "name": "Misrak Meskan",
    "zoneId": "ZONE_east_guraghe"
  },
  "WOREDA_east_guraghe_debub_sodo": {
    "lat": 8.178,
    "lng": 38.54,
    "name": "Debub Sodo",
    "zoneId": "ZONE_east_guraghe"
  },
  "debub sodo": {
    "lat": 8.178,
    "lng": 38.54,
    "name": "Debub Sodo",
    "zoneId": "ZONE_east_guraghe"
  },
  "WOREDA_halaba_kulito_town": {
    "lat": 7.308,
    "lng": 38.087,
    "name": "Kulito town",
    "zoneId": "ZONE_halaba"
  },
  "kulito town": {
    "lat": 7.308,
    "lng": 38.087,
    "name": "Kulito town",
    "zoneId": "ZONE_halaba"
  },
  "WOREDA_halaba_wera": {
    "lat": 7.322,
    "lng": 38.132,
    "name": "Wera",
    "zoneId": "ZONE_halaba"
  },
  "wera": {
    "lat": 7.322,
    "lng": 38.132,
    "name": "Wera",
    "zoneId": "ZONE_halaba"
  },
  "WOREDA_halaba_atote_ulo": {
    "lat": 7.339,
    "lng": 38.211,
    "name": "Atote Ulo",
    "zoneId": "ZONE_halaba"
  },
  "atote ulo": {
    "lat": 7.339,
    "lng": 38.211,
    "name": "Atote Ulo",
    "zoneId": "ZONE_halaba"
  },
  "WOREDA_halaba_wera_djo": {
    "lat": 7.521,
    "lng": 38.308,
    "name": "Wera Djo",
    "zoneId": "ZONE_halaba"
  },
  "wera djo": {
    "lat": 7.521,
    "lng": 38.308,
    "name": "Wera Djo",
    "zoneId": "ZONE_halaba"
  },
  "WOREDA_siltie_alicho_woriro": {
    "lat": 7.994,
    "lng": 38.179,
    "name": "Alicho Woriro",
    "zoneId": "ZONE_siltie"
  },
  "alicho woriro": {
    "lat": 7.994,
    "lng": 38.179,
    "name": "Alicho Woriro",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_siltie": {
    "lat": 7.946,
    "lng": 38.271,
    "name": "Siltie",
    "zoneId": "ZONE_siltie"
  },
  "siltie": {
    "lat": 7.946,
    "lng": 38.271,
    "name": "Siltie",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_lanfero": {
    "lat": 7.815,
    "lng": 38.425,
    "name": "Lanfero",
    "zoneId": "ZONE_siltie"
  },
  "lanfero": {
    "lat": 7.815,
    "lng": 38.425,
    "name": "Lanfero",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_mierab_azenet_berbere": {
    "lat": 7.768,
    "lng": 37.932,
    "name": "Mierab Azenet Berbere",
    "zoneId": "ZONE_siltie"
  },
  "mierab azenet berbere": {
    "lat": 7.768,
    "lng": 37.932,
    "name": "Mierab Azenet Berbere",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_dalocha": {
    "lat": 7.765,
    "lng": 38.28,
    "name": "Dalocha",
    "zoneId": "ZONE_siltie"
  },
  "dalocha": {
    "lat": 7.765,
    "lng": 38.28,
    "name": "Dalocha",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_sankura": {
    "lat": 7.547,
    "lng": 38.169,
    "name": "Sankura",
    "zoneId": "ZONE_siltie"
  },
  "sankura": {
    "lat": 7.547,
    "lng": 38.169,
    "name": "Sankura",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_misrak_azenet_berbere": {
    "lat": 7.8,
    "lng": 38.024,
    "name": "Misrak Azenet Berbere",
    "zoneId": "ZONE_siltie"
  },
  "misrak azenet berbere": {
    "lat": 7.8,
    "lng": 38.024,
    "name": "Misrak Azenet Berbere",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_wulbareg": {
    "lat": 7.734,
    "lng": 38.128,
    "name": "Wulbareg",
    "zoneId": "ZONE_siltie"
  },
  "wulbareg": {
    "lat": 7.734,
    "lng": 38.128,
    "name": "Wulbareg",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_tora_town": {
    "lat": 7.889,
    "lng": 38.421,
    "name": "Tora town",
    "zoneId": "ZONE_siltie"
  },
  "tora town": {
    "lat": 7.889,
    "lng": 38.421,
    "name": "Tora town",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_worabe_town": {
    "lat": 7.855,
    "lng": 38.199,
    "name": "Worabe town",
    "zoneId": "ZONE_siltie"
  },
  "worabe town": {
    "lat": 7.855,
    "lng": 38.199,
    "name": "Worabe town",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_kibet_town": {
    "lat": 8.019,
    "lng": 38.327,
    "name": "Kibet town",
    "zoneId": "ZONE_siltie"
  },
  "kibet town": {
    "lat": 8.019,
    "lng": 38.327,
    "name": "Kibet town",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_mito": {
    "lat": 7.726,
    "lng": 38.403,
    "name": "Mito",
    "zoneId": "ZONE_siltie"
  },
  "mito": {
    "lat": 7.726,
    "lng": 38.403,
    "name": "Mito",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_siltie_misrak_siltie": {
    "lat": 7.961,
    "lng": 38.382,
    "name": "Misrak Siltie",
    "zoneId": "ZONE_siltie"
  },
  "misrak siltie": {
    "lat": 7.961,
    "lng": 38.382,
    "name": "Misrak Siltie",
    "zoneId": "ZONE_siltie"
  },
  "WOREDA_yem_saja_town": {
    "lat": 7.971,
    "lng": 37.438,
    "name": "Saja town",
    "zoneId": "ZONE_yem"
  },
  "saja town": {
    "lat": 7.971,
    "lng": 37.438,
    "name": "Saja town",
    "zoneId": "ZONE_yem"
  },
  "WOREDA_yem_fofa": {
    "lat": 7.85,
    "lng": 37.52,
    "name": "Fofa",
    "zoneId": "ZONE_yem"
  },
  "fofa": {
    "lat": 7.85,
    "lng": 37.52,
    "name": "Fofa",
    "zoneId": "ZONE_yem"
  },
  "WOREDA_yem_deri_saja_zuria": {
    "lat": 7.982,
    "lng": 37.494,
    "name": "Deri Saja zuria",
    "zoneId": "ZONE_yem"
  },
  "deri saja zuria": {
    "lat": 7.982,
    "lng": 37.494,
    "name": "Deri Saja zuria",
    "zoneId": "ZONE_yem"
  },
  "WOREDA_yem_toba": {
    "lat": 7.79,
    "lng": 37.493,
    "name": "Toba",
    "zoneId": "ZONE_yem"
  },
  "toba": {
    "lat": 7.79,
    "lng": 37.493,
    "name": "Toba",
    "zoneId": "ZONE_yem"
  },
  "WOREDA_mareko_special_mareko_special": {
    "lat": 7.995,
    "lng": 38.532,
    "name": "Mareko Special",
    "zoneId": "ZONE_mareko_special"
  },
  "mareko special": {
    "lat": 7.995,
    "lng": 38.532,
    "name": "Mareko Special",
    "zoneId": "ZONE_mareko_special"
  },
  "WOREDA_tembaro_special_tembaro_special": {
    "lat": 7.269,
    "lng": 37.487,
    "name": "Tembaro Special",
    "zoneId": "ZONE_tembaro_special"
  },
  "tembaro special": {
    "lat": 7.269,
    "lng": 37.487,
    "name": "Tembaro Special",
    "zoneId": "ZONE_tembaro_special"
  },
  "WOREDA_wolayita_boloso_sore": {
    "lat": 7.09,
    "lng": 37.673,
    "name": "Boloso Sore",
    "zoneId": "ZONE_wolayita"
  },
  "boloso sore": {
    "lat": 7.09,
    "lng": 37.673,
    "name": "Boloso Sore",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_damot_gale": {
    "lat": 7.015,
    "lng": 37.934,
    "name": "Damot Gale",
    "zoneId": "ZONE_wolayita"
  },
  "damot gale": {
    "lat": 7.015,
    "lng": 37.934,
    "name": "Damot Gale",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_damot_woide": {
    "lat": 6.892,
    "lng": 37.93,
    "name": "Damot Woide",
    "zoneId": "ZONE_wolayita"
  },
  "damot woide": {
    "lat": 6.892,
    "lng": 37.93,
    "name": "Damot Woide",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_humbo": {
    "lat": 6.686,
    "lng": 37.718,
    "name": "Humbo",
    "zoneId": "ZONE_wolayita"
  },
  "humbo": {
    "lat": 6.686,
    "lng": 37.718,
    "name": "Humbo",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_sodo_zuria": {
    "lat": 6.781,
    "lng": 37.664,
    "name": "Sodo Zuria",
    "zoneId": "ZONE_wolayita"
  },
  "sodo zuria": {
    "lat": 6.781,
    "lng": 37.664,
    "name": "Sodo Zuria",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_kindo_koyesha": {
    "lat": 6.931,
    "lng": 37.458,
    "name": "Kindo Koyesha",
    "zoneId": "ZONE_wolayita"
  },
  "kindo koyesha": {
    "lat": 6.931,
    "lng": 37.458,
    "name": "Kindo Koyesha",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_ofa": {
    "lat": 6.669,
    "lng": 37.531,
    "name": "Ofa",
    "zoneId": "ZONE_wolayita"
  },
  "ofa": {
    "lat": 6.669,
    "lng": 37.531,
    "name": "Ofa",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_boloso_bombe": {
    "lat": 7.108,
    "lng": 37.553,
    "name": "Boloso Bombe",
    "zoneId": "ZONE_wolayita"
  },
  "boloso bombe": {
    "lat": 7.108,
    "lng": 37.553,
    "name": "Boloso Bombe",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_damot_sore": {
    "lat": 6.885,
    "lng": 37.652,
    "name": "Damot Sore",
    "zoneId": "ZONE_wolayita"
  },
  "damot sore": {
    "lat": 6.885,
    "lng": 37.652,
    "name": "Damot Sore",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_kindo_daddaye": {
    "lat": 6.78,
    "lng": 37.329,
    "name": "Kindo Daddaye",
    "zoneId": "ZONE_wolayita"
  },
  "kindo daddaye": {
    "lat": 6.78,
    "lng": 37.329,
    "name": "Kindo Daddaye",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_damot_pullasa": {
    "lat": 7.047,
    "lng": 37.86,
    "name": "Damot Pullasa",
    "zoneId": "ZONE_wolayita"
  },
  "damot pullasa": {
    "lat": 7.047,
    "lng": 37.86,
    "name": "Damot Pullasa",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_duguna_fango": {
    "lat": 6.921,
    "lng": 38.05,
    "name": "Duguna Fango",
    "zoneId": "ZONE_wolayita"
  },
  "duguna fango": {
    "lat": 6.921,
    "lng": 38.05,
    "name": "Duguna Fango",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_sodo_town": {
    "lat": 6.857,
    "lng": 37.759,
    "name": "Sodo town",
    "zoneId": "ZONE_wolayita"
  },
  "sodo town": {
    "lat": 6.857,
    "lng": 37.759,
    "name": "Sodo town",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_areka_town": {
    "lat": 7.066,
    "lng": 37.706,
    "name": "Areka town",
    "zoneId": "ZONE_wolayita"
  },
  "areka town": {
    "lat": 7.066,
    "lng": 37.706,
    "name": "Areka town",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_boditi_town": {
    "lat": 6.953,
    "lng": 37.862,
    "name": "Boditi town",
    "zoneId": "ZONE_wolayita"
  },
  "boditi town": {
    "lat": 6.953,
    "lng": 37.862,
    "name": "Boditi town",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_tebela_town": {
    "lat": 6.703,
    "lng": 37.772,
    "name": "Tebela town",
    "zoneId": "ZONE_wolayita"
  },
  "tebela town": {
    "lat": 6.703,
    "lng": 37.772,
    "name": "Tebela town",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_gesuba_town": {
    "lat": 6.727,
    "lng": 37.551,
    "name": "Gesuba town",
    "zoneId": "ZONE_wolayita"
  },
  "gesuba town": {
    "lat": 6.727,
    "lng": 37.551,
    "name": "Gesuba town",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_gununo_hamus_town": {
    "lat": 6.927,
    "lng": 37.655,
    "name": "Gununo Hamus town",
    "zoneId": "ZONE_wolayita"
  },
  "gununo hamus town": {
    "lat": 6.927,
    "lng": 37.655,
    "name": "Gununo Hamus town",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_hobicha_abaya": {
    "lat": 6.705,
    "lng": 37.952,
    "name": "Hobicha Abaya",
    "zoneId": "ZONE_wolayita"
  },
  "hobicha abaya": {
    "lat": 6.705,
    "lng": 37.952,
    "name": "Hobicha Abaya",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_kawo_koyesha": {
    "lat": 6.759,
    "lng": 37.44,
    "name": "Kawo Koyesha",
    "zoneId": "ZONE_wolayita"
  },
  "kawo koyesha": {
    "lat": 6.759,
    "lng": 37.44,
    "name": "Kawo Koyesha",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_abela_abaya": {
    "lat": 6.647,
    "lng": 37.846,
    "name": "Abela Abaya",
    "zoneId": "ZONE_wolayita"
  },
  "abela abaya": {
    "lat": 6.647,
    "lng": 37.846,
    "name": "Abela Abaya",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_bayera_koyesha": {
    "lat": 6.814,
    "lng": 37.615,
    "name": "Bayera Koyesha",
    "zoneId": "ZONE_wolayita"
  },
  "bayera koyesha": {
    "lat": 6.814,
    "lng": 37.615,
    "name": "Bayera Koyesha",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_wolayita_bale_awassa_town": {
    "lat": 6.912,
    "lng": 37.545,
    "name": "Bale Awassa town",
    "zoneId": "ZONE_wolayita"
  },
  "bale awassa town": {
    "lat": 6.912,
    "lng": 37.545,
    "name": "Bale Awassa town",
    "zoneId": "ZONE_wolayita"
  },
  "WOREDA_gamo_arba_minch_town": {
    "lat": 6.051,
    "lng": 37.564,
    "name": "Arba Minch town",
    "zoneId": "ZONE_gamo"
  },
  "arba minch town": {
    "lat": 6.051,
    "lng": 37.564,
    "name": "Arba Minch town",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_arba_minch_zuria": {
    "lat": 5.913,
    "lng": 37.552,
    "name": "Arba Minch Zuria",
    "zoneId": "ZONE_gamo"
  },
  "arba minch zuria": {
    "lat": 5.913,
    "lng": 37.552,
    "name": "Arba Minch Zuria",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_birbir_town": {
    "lat": 6.295,
    "lng": 37.77,
    "name": "Birbir town",
    "zoneId": "ZONE_gamo"
  },
  "birbir town": {
    "lat": 6.295,
    "lng": 37.77,
    "name": "Birbir town",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_bonke": {
    "lat": 6.122,
    "lng": 37.335,
    "name": "Bonke",
    "zoneId": "ZONE_gamo"
  },
  "bonke": {
    "lat": 6.122,
    "lng": 37.335,
    "name": "Bonke",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_boreda": {
    "lat": 6.529,
    "lng": 37.657,
    "name": "Boreda",
    "zoneId": "ZONE_gamo"
  },
  "boreda": {
    "lat": 6.529,
    "lng": 37.657,
    "name": "Boreda",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_chencha_town": {
    "lat": 6.244,
    "lng": 37.578,
    "name": "Chencha town",
    "zoneId": "ZONE_gamo"
  },
  "chencha town": {
    "lat": 6.244,
    "lng": 37.578,
    "name": "Chencha town",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_chencha_zuriya": {
    "lat": 6.222,
    "lng": 37.509,
    "name": "Chencha Zuriya",
    "zoneId": "ZONE_gamo"
  },
  "chencha zuriya": {
    "lat": 6.222,
    "lng": 37.509,
    "name": "Chencha Zuriya",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_daramalo": {
    "lat": 6.29,
    "lng": 37.297,
    "name": "Daramalo",
    "zoneId": "ZONE_gamo"
  },
  "daramalo": {
    "lat": 6.29,
    "lng": 37.297,
    "name": "Daramalo",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_dita": {
    "lat": 6.337,
    "lng": 37.502,
    "name": "Dita",
    "zoneId": "ZONE_gamo"
  },
  "dita": {
    "lat": 6.337,
    "lng": 37.502,
    "name": "Dita",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_gacho_baba": {
    "lat": 6.085,
    "lng": 37.426,
    "name": "Gacho Baba",
    "zoneId": "ZONE_gamo"
  },
  "gacho baba": {
    "lat": 6.085,
    "lng": 37.426,
    "name": "Gacho Baba",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_garda_marta": {
    "lat": 5.862,
    "lng": 37.076,
    "name": "Garda Marta",
    "zoneId": "ZONE_gamo"
  },
  "garda marta": {
    "lat": 5.862,
    "lng": 37.076,
    "name": "Garda Marta",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_geressie": {
    "lat": 5.877,
    "lng": 37.252,
    "name": "Geressie",
    "zoneId": "ZONE_gamo"
  },
  "geressie": {
    "lat": 5.877,
    "lng": 37.252,
    "name": "Geressie",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_geressie_town": {
    "lat": 5.915,
    "lng": 37.307,
    "name": "Geressie town",
    "zoneId": "ZONE_gamo"
  },
  "geressie town": {
    "lat": 5.915,
    "lng": 37.307,
    "name": "Geressie town",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_kemba_town": {
    "lat": 6.056,
    "lng": 37.173,
    "name": "Kemba town",
    "zoneId": "ZONE_gamo"
  },
  "kemba town": {
    "lat": 6.056,
    "lng": 37.173,
    "name": "Kemba town",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_kemba_zuria": {
    "lat": 6.108,
    "lng": 37.183,
    "name": "Kemba Zuria",
    "zoneId": "ZONE_gamo"
  },
  "kemba zuria": {
    "lat": 6.108,
    "lng": 37.183,
    "name": "Kemba Zuria",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_kogota_ezo": {
    "lat": 6.37,
    "lng": 37.577,
    "name": "Kogota /Ezo",
    "zoneId": "ZONE_gamo"
  },
  "kogota /ezo": {
    "lat": 6.37,
    "lng": 37.577,
    "name": "Kogota /Ezo",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_kucha": {
    "lat": 6.511,
    "lng": 37.385,
    "name": "Kucha",
    "zoneId": "ZONE_gamo"
  },
  "kucha": {
    "lat": 6.511,
    "lng": 37.385,
    "name": "Kucha",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_kucha_alpha": {
    "lat": 6.588,
    "lng": 37.25,
    "name": "Kucha Alpha",
    "zoneId": "ZONE_gamo"
  },
  "kucha alpha": {
    "lat": 6.588,
    "lng": 37.25,
    "name": "Kucha Alpha",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_mirab_abaya": {
    "lat": 6.318,
    "lng": 37.735,
    "name": "Mirab Abaya",
    "zoneId": "ZONE_gamo"
  },
  "mirab abaya": {
    "lat": 6.318,
    "lng": 37.735,
    "name": "Mirab Abaya",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gamo_selamber_town": {
    "lat": 6.474,
    "lng": 37.458,
    "name": "Selamber town",
    "zoneId": "ZONE_gamo"
  },
  "selamber town": {
    "lat": 6.474,
    "lng": 37.458,
    "name": "Selamber town",
    "zoneId": "ZONE_gamo"
  },
  "WOREDA_gofa_beto_town": {
    "lat": 6.057,
    "lng": 36.887,
    "name": "Beto town",
    "zoneId": "ZONE_gofa"
  },
  "beto town": {
    "lat": 6.057,
    "lng": 36.887,
    "name": "Beto town",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_gofa_buleqi_town": {
    "lat": 6.276,
    "lng": 36.812,
    "name": "Buleqi town",
    "zoneId": "ZONE_gofa"
  },
  "buleqi town": {
    "lat": 6.276,
    "lng": 36.812,
    "name": "Buleqi town",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_gofa_denba_gofa": {
    "lat": 6.464,
    "lng": 37.012,
    "name": "Denba Gofa",
    "zoneId": "ZONE_gofa"
  },
  "denba gofa": {
    "lat": 6.464,
    "lng": 37.012,
    "name": "Denba Gofa",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_gofa_gezei_gofa": {
    "lat": 6.359,
    "lng": 36.807,
    "name": "Gezei Gofa",
    "zoneId": "ZONE_gofa"
  },
  "gezei gofa": {
    "lat": 6.359,
    "lng": 36.807,
    "name": "Gezei Gofa",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_gofa_laha_town": {
    "lat": 6.468,
    "lng": 36.586,
    "name": "Laha town",
    "zoneId": "ZONE_gofa"
  },
  "laha town": {
    "lat": 6.468,
    "lng": 36.586,
    "name": "Laha town",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_gofa_melekoza": {
    "lat": 6.515,
    "lng": 36.683,
    "name": "Melekoza",
    "zoneId": "ZONE_gofa"
  },
  "melekoza": {
    "lat": 6.515,
    "lng": 36.683,
    "name": "Melekoza",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_gofa_melo_gada": {
    "lat": 6.601,
    "lng": 36.836,
    "name": "Melo Gada",
    "zoneId": "ZONE_gofa"
  },
  "melo gada": {
    "lat": 6.601,
    "lng": 36.836,
    "name": "Melo Gada",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_gofa_o_yida": {
    "lat": 6.194,
    "lng": 36.816,
    "name": "O'yida",
    "zoneId": "ZONE_gofa"
  },
  "o'yida": {
    "lat": 6.194,
    "lng": 36.816,
    "name": "O'yida",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_gofa_sawla_town": {
    "lat": 6.294,
    "lng": 36.891,
    "name": "Sawla town",
    "zoneId": "ZONE_gofa"
  },
  "sawla town": {
    "lat": 6.294,
    "lng": 36.891,
    "name": "Sawla town",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_gofa_uba_debre_tsehay": {
    "lat": 6.027,
    "lng": 36.787,
    "name": "Uba Debre Tsehay",
    "zoneId": "ZONE_gofa"
  },
  "uba debre tsehay": {
    "lat": 6.027,
    "lng": 36.787,
    "name": "Uba Debre Tsehay",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_gofa_zala": {
    "lat": 6.291,
    "lng": 37.084,
    "name": "Zala",
    "zoneId": "ZONE_gofa"
  },
  "zala": {
    "lat": 6.291,
    "lng": 37.084,
    "name": "Zala",
    "zoneId": "ZONE_gofa"
  },
  "WOREDA_basketo_basketo_special": {
    "lat": 6.282,
    "lng": 36.56,
    "name": "Basketo Special",
    "zoneId": "ZONE_basketo"
  },
  "basketo special": {
    "lat": 6.282,
    "lng": 36.56,
    "name": "Basketo Special",
    "zoneId": "ZONE_basketo"
  },
  "WOREDA_basketo_laska_town": {
    "lat": 6.299,
    "lng": 36.623,
    "name": "Laska town",
    "zoneId": "ZONE_basketo"
  },
  "laska town": {
    "lat": 6.299,
    "lng": 36.623,
    "name": "Laska town",
    "zoneId": "ZONE_basketo"
  },
  "WOREDA_ari_baka_dawula": {
    "lat": 5.776,
    "lng": 36.628,
    "name": "Baka Dawula",
    "zoneId": "ZONE_ari"
  },
  "baka dawula": {
    "lat": 5.776,
    "lng": 36.628,
    "name": "Baka Dawula",
    "zoneId": "ZONE_ari"
  },
  "WOREDA_ari_gelila_town": {
    "lat": 6.18,
    "lng": 36.658,
    "name": "Gelila town",
    "zoneId": "ZONE_ari"
  },
  "gelila town": {
    "lat": 6.18,
    "lng": 36.658,
    "name": "Gelila town",
    "zoneId": "ZONE_ari"
  },
  "WOREDA_ari_jinka_town": {
    "lat": 5.771,
    "lng": 36.569,
    "name": "Jinka town",
    "zoneId": "ZONE_ari"
  },
  "jinka town": {
    "lat": 5.771,
    "lng": 36.569,
    "name": "Jinka town",
    "zoneId": "ZONE_ari"
  },
  "WOREDA_ari_north_ari": {
    "lat": 6.174,
    "lng": 36.59,
    "name": "North Ari",
    "zoneId": "ZONE_ari"
  },
  "north ari": {
    "lat": 6.174,
    "lng": 36.59,
    "name": "North Ari",
    "zoneId": "ZONE_ari"
  },
  "WOREDA_ari_south_ari": {
    "lat": 5.901,
    "lng": 36.488,
    "name": "South Ari",
    "zoneId": "ZONE_ari"
  },
  "south ari": {
    "lat": 5.901,
    "lng": 36.488,
    "name": "South Ari",
    "zoneId": "ZONE_ari"
  },
  "WOREDA_ari_wub_ari": {
    "lat": 6.06,
    "lng": 36.622,
    "name": "Wub Ari",
    "zoneId": "ZONE_ari"
  },
  "wub ari": {
    "lat": 6.06,
    "lng": 36.622,
    "name": "Wub Ari",
    "zoneId": "ZONE_ari"
  },
  "WOREDA_alle_special_alle_special": {
    "lat": 5.568,
    "lng": 37.162,
    "name": "Alle Special",
    "zoneId": "ZONE_alle_special"
  },
  "alle special": {
    "lat": 5.568,
    "lng": 37.162,
    "name": "Alle Special",
    "zoneId": "ZONE_alle_special"
  },
  "WOREDA_derashe_derashe": {
    "lat": 5.614,
    "lng": 37.45,
    "name": "Derashe",
    "zoneId": "ZONE_derashe"
  },
  "derashe": {
    "lat": 5.614,
    "lng": 37.45,
    "name": "Derashe",
    "zoneId": "ZONE_derashe"
  },
  "WOREDA_derashe_gidole_town": {
    "lat": 5.646,
    "lng": 37.367,
    "name": "Gidole town",
    "zoneId": "ZONE_derashe"
  },
  "gidole town": {
    "lat": 5.646,
    "lng": 37.367,
    "name": "Gidole town",
    "zoneId": "ZONE_derashe"
  },
  "WOREDA_kore_amaro": {
    "lat": 5.788,
    "lng": 37.815,
    "name": "Amaro",
    "zoneId": "ZONE_kore"
  },
  "amaro": {
    "lat": 5.788,
    "lng": 37.815,
    "name": "Amaro",
    "zoneId": "ZONE_kore"
  },
  "WOREDA_kore_kele_town": {
    "lat": 5.833,
    "lng": 37.895,
    "name": "Kele town",
    "zoneId": "ZONE_kore"
  },
  "kele town": {
    "lat": 5.833,
    "lng": 37.895,
    "name": "Kele town",
    "zoneId": "ZONE_kore"
  },
  "WOREDA_konso_kena": {
    "lat": 5.247,
    "lng": 37.348,
    "name": "Kena",
    "zoneId": "ZONE_konso"
  },
  "kena": {
    "lat": 5.247,
    "lng": 37.348,
    "name": "Kena",
    "zoneId": "ZONE_konso"
  },
  "WOREDA_konso_karat_zuria": {
    "lat": 5.313,
    "lng": 37.561,
    "name": "Karat Zuria",
    "zoneId": "ZONE_konso"
  },
  "karat zuria": {
    "lat": 5.313,
    "lng": 37.561,
    "name": "Karat Zuria",
    "zoneId": "ZONE_konso"
  },
  "WOREDA_konso_karat_town": {
    "lat": 5.336,
    "lng": 37.442,
    "name": "Karat town",
    "zoneId": "ZONE_konso"
  },
  "karat town": {
    "lat": 5.336,
    "lng": 37.442,
    "name": "Karat town",
    "zoneId": "ZONE_konso"
  },
  "WOREDA_konso_segen_zuria": {
    "lat": 5.496,
    "lng": 37.559,
    "name": "Segen Zuria",
    "zoneId": "ZONE_konso"
  },
  "segen zuria": {
    "lat": 5.496,
    "lng": 37.559,
    "name": "Segen Zuria",
    "zoneId": "ZONE_konso"
  },
  "WOREDA_konso_kolme": {
    "lat": 5.305,
    "lng": 37.158,
    "name": "Kolme",
    "zoneId": "ZONE_konso"
  },
  "kolme": {
    "lat": 5.305,
    "lng": 37.158,
    "name": "Kolme",
    "zoneId": "ZONE_konso"
  },
  "WOREDA_burji_burji": {
    "lat": 5.482,
    "lng": 37.777,
    "name": "Burji",
    "zoneId": "ZONE_burji"
  },
  "burji": {
    "lat": 5.482,
    "lng": 37.777,
    "name": "Burji",
    "zoneId": "ZONE_burji"
  },
  "WOREDA_gedeo_wenago": {
    "lat": 6.282,
    "lng": 38.258,
    "name": "Wenago",
    "zoneId": "ZONE_gedeo"
  },
  "wenago": {
    "lat": 6.282,
    "lng": 38.258,
    "name": "Wenago",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_yirgachefe": {
    "lat": 6.168,
    "lng": 38.244,
    "name": "Yirgachefe",
    "zoneId": "ZONE_gedeo"
  },
  "yirgachefe": {
    "lat": 6.168,
    "lng": 38.244,
    "name": "Yirgachefe",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_kochere": {
    "lat": 6.045,
    "lng": 38.164,
    "name": "Kochere",
    "zoneId": "ZONE_gedeo"
  },
  "kochere": {
    "lat": 6.045,
    "lng": 38.164,
    "name": "Kochere",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_bule": {
    "lat": 6.284,
    "lng": 38.394,
    "name": "Bule",
    "zoneId": "ZONE_gedeo"
  },
  "bule": {
    "lat": 6.284,
    "lng": 38.394,
    "name": "Bule",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_dila_zuria": {
    "lat": 6.354,
    "lng": 38.342,
    "name": "Dila Zuria",
    "zoneId": "ZONE_gedeo"
  },
  "dila zuria": {
    "lat": 6.354,
    "lng": 38.342,
    "name": "Dila Zuria",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_gedeb": {
    "lat": 5.921,
    "lng": 38.345,
    "name": "Gedeb",
    "zoneId": "ZONE_gedeo"
  },
  "gedeb": {
    "lat": 5.921,
    "lng": 38.345,
    "name": "Gedeb",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_rape": {
    "lat": 6.186,
    "lng": 38.338,
    "name": "Rape",
    "zoneId": "ZONE_gedeo"
  },
  "rape": {
    "lat": 6.186,
    "lng": 38.338,
    "name": "Rape",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_churso": {
    "lat": 6.064,
    "lng": 38.269,
    "name": "Churso",
    "zoneId": "ZONE_gedeo"
  },
  "churso": {
    "lat": 6.064,
    "lng": 38.269,
    "name": "Churso",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_dila_town": {
    "lat": 6.41,
    "lng": 38.301,
    "name": "Dila town",
    "zoneId": "ZONE_gedeo"
  },
  "dila town": {
    "lat": 6.41,
    "lng": 38.301,
    "name": "Dila town",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_gedeb_town": {
    "lat": 5.898,
    "lng": 38.242,
    "name": "Gedeb town",
    "zoneId": "ZONE_gedeo"
  },
  "gedeb town": {
    "lat": 5.898,
    "lng": 38.242,
    "name": "Gedeb town",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_yirgachefe_town": {
    "lat": 6.159,
    "lng": 38.204,
    "name": "Yirgachefe town",
    "zoneId": "ZONE_gedeo"
  },
  "yirgachefe town": {
    "lat": 6.159,
    "lng": 38.204,
    "name": "Yirgachefe town",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_chelelektu_town": {
    "lat": 6.006,
    "lng": 38.154,
    "name": "Chelelektu town",
    "zoneId": "ZONE_gedeo"
  },
  "chelelektu town": {
    "lat": 6.006,
    "lng": 38.154,
    "name": "Chelelektu town",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_gedeo_wonago_town": {
    "lat": 6.318,
    "lng": 38.258,
    "name": "Wonago town",
    "zoneId": "ZONE_gedeo"
  },
  "wonago town": {
    "lat": 6.318,
    "lng": 38.258,
    "name": "Wonago town",
    "zoneId": "ZONE_gedeo"
  },
  "WOREDA_south_omo_bena_tsemay": {
    "lat": 5.451,
    "lng": 36.666,
    "name": "Bena Tsemay",
    "zoneId": "ZONE_south_omo"
  },
  "bena tsemay": {
    "lat": 5.451,
    "lng": 36.666,
    "name": "Bena Tsemay",
    "zoneId": "ZONE_south_omo"
  },
  "WOREDA_south_omo_dasenech_kuraz": {
    "lat": 4.685,
    "lng": 36.091,
    "name": "Dasenech /Kuraz",
    "zoneId": "ZONE_south_omo"
  },
  "dasenech /kuraz": {
    "lat": 4.685,
    "lng": 36.091,
    "name": "Dasenech /Kuraz",
    "zoneId": "ZONE_south_omo"
  },
  "WOREDA_south_omo_hamer": {
    "lat": 5.077,
    "lng": 36.338,
    "name": "Hamer",
    "zoneId": "ZONE_south_omo"
  },
  "hamer": {
    "lat": 5.077,
    "lng": 36.338,
    "name": "Hamer",
    "zoneId": "ZONE_south_omo"
  },
  "WOREDA_south_omo_malie": {
    "lat": 5.763,
    "lng": 36.881,
    "name": "Malie",
    "zoneId": "ZONE_south_omo"
  },
  "malie": {
    "lat": 5.763,
    "lng": 36.881,
    "name": "Malie",
    "zoneId": "ZONE_south_omo"
  },
  "WOREDA_south_omo_nyngatom": {
    "lat": 5.127,
    "lng": 35.993,
    "name": "Nyngatom",
    "zoneId": "ZONE_south_omo"
  },
  "nyngatom": {
    "lat": 5.127,
    "lng": 35.993,
    "name": "Nyngatom",
    "zoneId": "ZONE_south_omo"
  },
  "WOREDA_south_omo_salamago": {
    "lat": 5.951,
    "lng": 36.165,
    "name": "Salamago",
    "zoneId": "ZONE_south_omo"
  },
  "salamago": {
    "lat": 5.951,
    "lng": 36.165,
    "name": "Salamago",
    "zoneId": "ZONE_south_omo"
  },
  "WOREDA_south_omo_turmi_town": {
    "lat": 4.968,
    "lng": 36.486,
    "name": "Turmi town",
    "zoneId": "ZONE_south_omo"
  },
  "turmi town": {
    "lat": 4.968,
    "lng": 36.486,
    "name": "Turmi town",
    "zoneId": "ZONE_south_omo"
  },
  "WOREDA_sheka_anderacha": {
    "lat": 7.726,
    "lng": 35.524,
    "name": "Anderacha",
    "zoneId": "ZONE_sheka"
  },
  "anderacha": {
    "lat": 7.726,
    "lng": 35.524,
    "name": "Anderacha",
    "zoneId": "ZONE_sheka"
  },
  "WOREDA_sheka_masha": {
    "lat": 7.556,
    "lng": 35.34,
    "name": "Masha",
    "zoneId": "ZONE_sheka"
  },
  "masha": {
    "lat": 7.556,
    "lng": 35.34,
    "name": "Masha",
    "zoneId": "ZONE_sheka"
  },
  "WOREDA_sheka_yeki": {
    "lat": 7.248,
    "lng": 35.472,
    "name": "Yeki",
    "zoneId": "ZONE_sheka"
  },
  "yeki": {
    "lat": 7.248,
    "lng": 35.472,
    "name": "Yeki",
    "zoneId": "ZONE_sheka"
  },
  "WOREDA_sheka_tepi": {
    "lat": 7.196,
    "lng": 35.421,
    "name": "Tepi",
    "zoneId": "ZONE_sheka"
  },
  "tepi": {
    "lat": 7.196,
    "lng": 35.421,
    "name": "Tepi",
    "zoneId": "ZONE_sheka"
  },
  "WOREDA_sheka_masha_town": {
    "lat": 7.735,
    "lng": 35.475,
    "name": "Masha town",
    "zoneId": "ZONE_sheka"
  },
  "masha town": {
    "lat": 7.735,
    "lng": 35.475,
    "name": "Masha town",
    "zoneId": "ZONE_sheka"
  },
  "WOREDA_kefa_saylem": {
    "lat": 7.807,
    "lng": 35.79,
    "name": "Saylem",
    "zoneId": "ZONE_kefa"
  },
  "saylem": {
    "lat": 7.807,
    "lng": 35.79,
    "name": "Saylem",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_gesha": {
    "lat": 7.632,
    "lng": 35.688,
    "name": "Gesha",
    "zoneId": "ZONE_kefa"
  },
  "gesha": {
    "lat": 7.632,
    "lng": 35.688,
    "name": "Gesha",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_gewata": {
    "lat": 7.556,
    "lng": 35.98,
    "name": "Gewata",
    "zoneId": "ZONE_kefa"
  },
  "gewata": {
    "lat": 7.556,
    "lng": 35.98,
    "name": "Gewata",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_gimbo": {
    "lat": 7.359,
    "lng": 36.228,
    "name": "Gimbo",
    "zoneId": "ZONE_kefa"
  },
  "gimbo": {
    "lat": 7.359,
    "lng": 36.228,
    "name": "Gimbo",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_adiyio": {
    "lat": 7.262,
    "lng": 36.552,
    "name": "Adiyio",
    "zoneId": "ZONE_kefa"
  },
  "adiyio": {
    "lat": 7.262,
    "lng": 36.552,
    "name": "Adiyio",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_tullo": {
    "lat": 7.098,
    "lng": 36.457,
    "name": "Tullo",
    "zoneId": "ZONE_kefa"
  },
  "tullo": {
    "lat": 7.098,
    "lng": 36.457,
    "name": "Tullo",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_cheta": {
    "lat": 6.911,
    "lng": 36.367,
    "name": "Cheta",
    "zoneId": "ZONE_kefa"
  },
  "cheta": {
    "lat": 6.911,
    "lng": 36.367,
    "name": "Cheta",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_decha": {
    "lat": 7.128,
    "lng": 36.146,
    "name": "Decha",
    "zoneId": "ZONE_kefa"
  },
  "decha": {
    "lat": 7.128,
    "lng": 36.146,
    "name": "Decha",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_chena": {
    "lat": 7.11,
    "lng": 35.815,
    "name": "Chena",
    "zoneId": "ZONE_kefa"
  },
  "chena": {
    "lat": 7.11,
    "lng": 35.815,
    "name": "Chena",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_bita": {
    "lat": 7.372,
    "lng": 35.674,
    "name": "Bita",
    "zoneId": "ZONE_kefa"
  },
  "bita": {
    "lat": 7.372,
    "lng": 35.674,
    "name": "Bita",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_bonga_town": {
    "lat": 7.263,
    "lng": 36.245,
    "name": "Bonga town",
    "zoneId": "ZONE_kefa"
  },
  "bonga town": {
    "lat": 7.263,
    "lng": 36.245,
    "name": "Bonga town",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_goba_sw": {
    "lat": 6.675,
    "lng": 36.179,
    "name": "Goba (SW)",
    "zoneId": "ZONE_kefa"
  },
  "goba (sw)": {
    "lat": 6.675,
    "lng": 36.179,
    "name": "Goba (SW)",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_shisho_ande": {
    "lat": 7.341,
    "lng": 35.935,
    "name": "Shisho Ande",
    "zoneId": "ZONE_kefa"
  },
  "shisho ande": {
    "lat": 7.341,
    "lng": 35.935,
    "name": "Shisho Ande",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_wacha_town": {
    "lat": 7.154,
    "lng": 35.817,
    "name": "Wacha town",
    "zoneId": "ZONE_kefa"
  },
  "wacha town": {
    "lat": 7.154,
    "lng": 35.817,
    "name": "Wacha town",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_deka_town": {
    "lat": 7.591,
    "lng": 35.757,
    "name": "Deka town",
    "zoneId": "ZONE_kefa"
  },
  "deka town": {
    "lat": 7.591,
    "lng": 35.757,
    "name": "Deka town",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_awurada_town": {
    "lat": 7.247,
    "lng": 36.126,
    "name": "Awurada town",
    "zoneId": "ZONE_kefa"
  },
  "awurada town": {
    "lat": 7.247,
    "lng": 36.126,
    "name": "Awurada town",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_kefa_shishinda_town": {
    "lat": 7.212,
    "lng": 35.899,
    "name": "Shishinda town",
    "zoneId": "ZONE_kefa"
  },
  "shishinda town": {
    "lat": 7.212,
    "lng": 35.899,
    "name": "Shishinda town",
    "zoneId": "ZONE_kefa"
  },
  "WOREDA_bench_sheko_sheko": {
    "lat": 7.093,
    "lng": 35.545,
    "name": "Sheko",
    "zoneId": "ZONE_bench_sheko"
  },
  "sheko": {
    "lat": 7.093,
    "lng": 35.545,
    "name": "Sheko",
    "zoneId": "ZONE_bench_sheko"
  },
  "WOREDA_bench_sheko_gurafereda": {
    "lat": 6.898,
    "lng": 35.173,
    "name": "Gurafereda",
    "zoneId": "ZONE_bench_sheko"
  },
  "gurafereda": {
    "lat": 6.898,
    "lng": 35.173,
    "name": "Gurafereda",
    "zoneId": "ZONE_bench_sheko"
  },
  "WOREDA_bench_sheko_debub_bench": {
    "lat": 6.869,
    "lng": 35.517,
    "name": "Debub Bench",
    "zoneId": "ZONE_bench_sheko"
  },
  "debub bench": {
    "lat": 6.869,
    "lng": 35.517,
    "name": "Debub Bench",
    "zoneId": "ZONE_bench_sheko"
  },
  "WOREDA_bench_sheko_shay_bench": {
    "lat": 6.903,
    "lng": 35.752,
    "name": "Shay Bench",
    "zoneId": "ZONE_bench_sheko"
  },
  "shay bench": {
    "lat": 6.903,
    "lng": 35.752,
    "name": "Shay Bench",
    "zoneId": "ZONE_bench_sheko"
  },
  "WOREDA_bench_sheko_semen_bench": {
    "lat": 7.033,
    "lng": 35.641,
    "name": "Semen Bench",
    "zoneId": "ZONE_bench_sheko"
  },
  "semen bench": {
    "lat": 7.033,
    "lng": 35.641,
    "name": "Semen Bench",
    "zoneId": "ZONE_bench_sheko"
  },
  "WOREDA_bench_sheko_gidi_bench": {
    "lat": 7.15,
    "lng": 35.657,
    "name": "Gidi Bench",
    "zoneId": "ZONE_bench_sheko"
  },
  "gidi bench": {
    "lat": 7.15,
    "lng": 35.657,
    "name": "Gidi Bench",
    "zoneId": "ZONE_bench_sheko"
  },
  "WOREDA_bench_sheko_mizan_aman_town": {
    "lat": 6.951,
    "lng": 35.552,
    "name": "Mizan Aman town",
    "zoneId": "ZONE_bench_sheko"
  },
  "mizan aman town": {
    "lat": 6.951,
    "lng": 35.552,
    "name": "Mizan Aman town",
    "zoneId": "ZONE_bench_sheko"
  },
  "WOREDA_bench_sheko_size_town": {
    "lat": 6.957,
    "lng": 35.77,
    "name": "Size town",
    "zoneId": "ZONE_bench_sheko"
  },
  "size town": {
    "lat": 6.957,
    "lng": 35.77,
    "name": "Size town",
    "zoneId": "ZONE_bench_sheko"
  },
  "WOREDA_bench_sheko_biftu_town": {
    "lat": 6.858,
    "lng": 35.339,
    "name": "Biftu town",
    "zoneId": "ZONE_bench_sheko"
  },
  "biftu town": {
    "lat": 6.858,
    "lng": 35.339,
    "name": "Biftu town",
    "zoneId": "ZONE_bench_sheko"
  },
  "WOREDA_bench_sheko_sheko_town": {
    "lat": 7.044,
    "lng": 35.493,
    "name": "Sheko town",
    "zoneId": "ZONE_bench_sheko"
  },
  "sheko town": {
    "lat": 7.044,
    "lng": 35.493,
    "name": "Sheko town",
    "zoneId": "ZONE_bench_sheko"
  },
  "WOREDA_dawuro_tocha": {
    "lat": 7.148,
    "lng": 36.993,
    "name": "Tocha",
    "zoneId": "ZONE_dawuro"
  },
  "tocha": {
    "lat": 7.148,
    "lng": 36.993,
    "name": "Tocha",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_mareka": {
    "lat": 7.043,
    "lng": 37.192,
    "name": "Mareka",
    "zoneId": "ZONE_dawuro"
  },
  "mareka": {
    "lat": 7.043,
    "lng": 37.192,
    "name": "Mareka",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_loma": {
    "lat": 6.932,
    "lng": 37.285,
    "name": "Loma",
    "zoneId": "ZONE_dawuro"
  },
  "loma": {
    "lat": 6.932,
    "lng": 37.285,
    "name": "Loma",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_gena": {
    "lat": 7.237,
    "lng": 37.273,
    "name": "Gena",
    "zoneId": "ZONE_dawuro"
  },
  "gena": {
    "lat": 7.237,
    "lng": 37.273,
    "name": "Gena",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_esara": {
    "lat": 6.845,
    "lng": 36.89,
    "name": "Esara",
    "zoneId": "ZONE_dawuro"
  },
  "esara": {
    "lat": 6.845,
    "lng": 36.89,
    "name": "Esara",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_kachi": {
    "lat": 7.043,
    "lng": 36.916,
    "name": "Kachi",
    "zoneId": "ZONE_dawuro"
  },
  "kachi": {
    "lat": 7.043,
    "lng": 36.916,
    "name": "Kachi",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_tercha_zuriya": {
    "lat": 7.111,
    "lng": 37.16,
    "name": "Tercha Zuriya",
    "zoneId": "ZONE_dawuro"
  },
  "tercha zuriya": {
    "lat": 7.111,
    "lng": 37.16,
    "name": "Tercha Zuriya",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_mari_mansa": {
    "lat": 6.997,
    "lng": 37.088,
    "name": "Mari Mansa",
    "zoneId": "ZONE_dawuro"
  },
  "mari mansa": {
    "lat": 6.997,
    "lng": 37.088,
    "name": "Mari Mansa",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_disa": {
    "lat": 6.751,
    "lng": 37.116,
    "name": "Disa",
    "zoneId": "ZONE_dawuro"
  },
  "disa": {
    "lat": 6.751,
    "lng": 37.116,
    "name": "Disa",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_zabagazo": {
    "lat": 7.103,
    "lng": 37.377,
    "name": "Zabagazo",
    "zoneId": "ZONE_dawuro"
  },
  "zabagazo": {
    "lat": 7.103,
    "lng": 37.377,
    "name": "Zabagazo",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_tercha_town": {
    "lat": 7.151,
    "lng": 37.169,
    "name": "Tercha town",
    "zoneId": "ZONE_dawuro"
  },
  "tercha town": {
    "lat": 7.151,
    "lng": 37.169,
    "name": "Tercha town",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_dawuro_gesa_town": {
    "lat": 7.013,
    "lng": 37.275,
    "name": "Gesa town",
    "zoneId": "ZONE_dawuro"
  },
  "gesa town": {
    "lat": 7.013,
    "lng": 37.275,
    "name": "Gesa town",
    "zoneId": "ZONE_dawuro"
  },
  "WOREDA_west_omo_gachit": {
    "lat": 6.72,
    "lng": 35.702,
    "name": "Gachit",
    "zoneId": "ZONE_west_omo"
  },
  "gachit": {
    "lat": 6.72,
    "lng": 35.702,
    "name": "Gachit",
    "zoneId": "ZONE_west_omo"
  },
  "WOREDA_west_omo_menit_goldiye": {
    "lat": 6.74,
    "lng": 36.033,
    "name": "Menit Goldiye",
    "zoneId": "ZONE_west_omo"
  },
  "menit goldiye": {
    "lat": 6.74,
    "lng": 36.033,
    "name": "Menit Goldiye",
    "zoneId": "ZONE_west_omo"
  },
  "WOREDA_west_omo_gori_gesha": {
    "lat": 6.559,
    "lng": 35.387,
    "name": "Gori Gesha",
    "zoneId": "ZONE_west_omo"
  },
  "gori gesha": {
    "lat": 6.559,
    "lng": 35.387,
    "name": "Gori Gesha",
    "zoneId": "ZONE_west_omo"
  },
  "WOREDA_west_omo_menit_shasha": {
    "lat": 6.465,
    "lng": 35.863,
    "name": "Menit Shasha",
    "zoneId": "ZONE_west_omo"
  },
  "menit shasha": {
    "lat": 6.465,
    "lng": 35.863,
    "name": "Menit Shasha",
    "zoneId": "ZONE_west_omo"
  },
  "WOREDA_west_omo_bero": {
    "lat": 6.343,
    "lng": 35.239,
    "name": "Bero",
    "zoneId": "ZONE_west_omo"
  },
  "bero": {
    "lat": 6.343,
    "lng": 35.239,
    "name": "Bero",
    "zoneId": "ZONE_west_omo"
  },
  "WOREDA_west_omo_surma": {
    "lat": 5.901,
    "lng": 35.26,
    "name": "Surma",
    "zoneId": "ZONE_west_omo"
  },
  "surma": {
    "lat": 5.901,
    "lng": 35.26,
    "name": "Surma",
    "zoneId": "ZONE_west_omo"
  },
  "WOREDA_west_omo_maji": {
    "lat": 5.934,
    "lng": 35.695,
    "name": "Maji",
    "zoneId": "ZONE_west_omo"
  },
  "maji": {
    "lat": 5.934,
    "lng": 35.695,
    "name": "Maji",
    "zoneId": "ZONE_west_omo"
  },
  "WOREDA_west_omo_bachuma_town": {
    "lat": 6.816,
    "lng": 35.896,
    "name": "Bachuma town",
    "zoneId": "ZONE_west_omo"
  },
  "bachuma town": {
    "lat": 6.816,
    "lng": 35.896,
    "name": "Bachuma town",
    "zoneId": "ZONE_west_omo"
  },
  "WOREDA_west_omo_jemu_town": {
    "lat": 6.641,
    "lng": 35.787,
    "name": "Jemu town",
    "zoneId": "ZONE_west_omo"
  },
  "jemu town": {
    "lat": 6.641,
    "lng": 35.787,
    "name": "Jemu town",
    "zoneId": "ZONE_west_omo"
  },
  "WOREDA_west_omo_maji_tum_town": {
    "lat": 6.21,
    "lng": 35.554,
    "name": "Maji Tum town",
    "zoneId": "ZONE_west_omo"
  },
  "maji tum town": {
    "lat": 6.21,
    "lng": 35.554,
    "name": "Maji Tum town",
    "zoneId": "ZONE_west_omo"
  },
  "WOREDA_konta_konta_koysha": {
    "lat": 6.695,
    "lng": 36.513,
    "name": "Konta Koysha",
    "zoneId": "ZONE_konta"
  },
  "konta koysha": {
    "lat": 6.695,
    "lng": 36.513,
    "name": "Konta Koysha",
    "zoneId": "ZONE_konta"
  },
  "WOREDA_konta_chida_town": {
    "lat": 7.154,
    "lng": 36.785,
    "name": "Chida town",
    "zoneId": "ZONE_konta"
  },
  "chida town": {
    "lat": 7.154,
    "lng": 36.785,
    "name": "Chida town",
    "zoneId": "ZONE_konta"
  },
  "WOREDA_konta_amaya_town": {
    "lat": 7.097,
    "lng": 36.668,
    "name": "Amaya town",
    "zoneId": "ZONE_konta"
  },
  "amaya town": {
    "lat": 7.097,
    "lng": 36.668,
    "name": "Amaya town",
    "zoneId": "ZONE_konta"
  },
  "WOREDA_konta_elahanchano": {
    "lat": 7.252,
    "lng": 36.857,
    "name": "Elahanchano",
    "zoneId": "ZONE_konta"
  },
  "elahanchano": {
    "lat": 7.252,
    "lng": 36.857,
    "name": "Elahanchano",
    "zoneId": "ZONE_konta"
  },
  "WOREDA_konta_ameya_zuria": {
    "lat": 6.981,
    "lng": 36.657,
    "name": "Ameya Zuria",
    "zoneId": "ZONE_konta"
  },
  "ameya zuria": {
    "lat": 6.981,
    "lng": 36.657,
    "name": "Ameya Zuria",
    "zoneId": "ZONE_konta"
  },
  "WOREDA_nuwer_akobo": {
    "lat": 7.964,
    "lng": 33.272,
    "name": "Akobo",
    "zoneId": "ZONE_nuwer"
  },
  "akobo": {
    "lat": 7.964,
    "lng": 33.272,
    "name": "Akobo",
    "zoneId": "ZONE_nuwer"
  },
  "WOREDA_nuwer_lare": {
    "lat": 8.342,
    "lng": 33.944,
    "name": "Lare",
    "zoneId": "ZONE_nuwer"
  },
  "lare": {
    "lat": 8.342,
    "lng": 33.944,
    "name": "Lare",
    "zoneId": "ZONE_nuwer"
  },
  "WOREDA_nuwer_jikawo": {
    "lat": 8.346,
    "lng": 33.632,
    "name": "Jikawo",
    "zoneId": "ZONE_nuwer"
  },
  "jikawo": {
    "lat": 8.346,
    "lng": 33.632,
    "name": "Jikawo",
    "zoneId": "ZONE_nuwer"
  },
  "WOREDA_nuwer_wantawo": {
    "lat": 8.319,
    "lng": 33.319,
    "name": "Wantawo",
    "zoneId": "ZONE_nuwer"
  },
  "wantawo": {
    "lat": 8.319,
    "lng": 33.319,
    "name": "Wantawo",
    "zoneId": "ZONE_nuwer"
  },
  "WOREDA_nuwer_makuey": {
    "lat": 8.219,
    "lng": 33.713,
    "name": "Makuey",
    "zoneId": "ZONE_nuwer"
  },
  "makuey": {
    "lat": 8.219,
    "lng": 33.713,
    "name": "Makuey",
    "zoneId": "ZONE_nuwer"
  },
  "WOREDA_agnewak_gambela_national_park": {
    "lat": 8.106,
    "lng": 33.993,
    "name": "Gambela National Park",
    "zoneId": "ZONE_agnewak"
  },
  "gambela national park": {
    "lat": 8.106,
    "lng": 33.993,
    "name": "Gambela National Park",
    "zoneId": "ZONE_agnewak"
  },
  "WOREDA_agnewak_abobo": {
    "lat": 7.921,
    "lng": 34.497,
    "name": "Abobo",
    "zoneId": "ZONE_agnewak"
  },
  "abobo": {
    "lat": 7.921,
    "lng": 34.497,
    "name": "Abobo",
    "zoneId": "ZONE_agnewak"
  },
  "WOREDA_agnewak_gambela_zuria": {
    "lat": 8.148,
    "lng": 34.751,
    "name": "Gambela Zuria",
    "zoneId": "ZONE_agnewak"
  },
  "gambela zuria": {
    "lat": 8.148,
    "lng": 34.751,
    "name": "Gambela Zuria",
    "zoneId": "ZONE_agnewak"
  },
  "WOREDA_agnewak_gog": {
    "lat": 7.62,
    "lng": 34.15,
    "name": "Gog",
    "zoneId": "ZONE_agnewak"
  },
  "gog": {
    "lat": 7.62,
    "lng": 34.15,
    "name": "Gog",
    "zoneId": "ZONE_agnewak"
  },
  "WOREDA_agnewak_jore": {
    "lat": 7.897,
    "lng": 33.739,
    "name": "Jore",
    "zoneId": "ZONE_agnewak"
  },
  "jore": {
    "lat": 7.897,
    "lng": 33.739,
    "name": "Jore",
    "zoneId": "ZONE_agnewak"
  },
  "WOREDA_agnewak_dima_gm": {
    "lat": 7.003,
    "lng": 34.683,
    "name": "Dima (GM)",
    "zoneId": "ZONE_agnewak"
  },
  "dima (gm)": {
    "lat": 7.003,
    "lng": 34.683,
    "name": "Dima (GM)",
    "zoneId": "ZONE_agnewak"
  },
  "WOREDA_agnewak_gambela_town": {
    "lat": 8.246,
    "lng": 34.589,
    "name": "Gambela town",
    "zoneId": "ZONE_agnewak"
  },
  "gambela town": {
    "lat": 8.246,
    "lng": 34.589,
    "name": "Gambela town",
    "zoneId": "ZONE_agnewak"
  },
  "WOREDA_majang_godere": {
    "lat": 7.201,
    "lng": 35.299,
    "name": "Godere",
    "zoneId": "ZONE_majang"
  },
  "godere": {
    "lat": 7.201,
    "lng": 35.299,
    "name": "Godere",
    "zoneId": "ZONE_majang"
  },
  "WOREDA_majang_mengesh": {
    "lat": 7.437,
    "lng": 35.08,
    "name": "Mengesh",
    "zoneId": "ZONE_majang"
  },
  "mengesh": {
    "lat": 7.437,
    "lng": 35.08,
    "name": "Mengesh",
    "zoneId": "ZONE_majang"
  },
  "WOREDA_itang_special_itang": {
    "lat": 8.346,
    "lng": 34.22,
    "name": "Itang",
    "zoneId": "ZONE_itang_special"
  },
  "itang": {
    "lat": 8.346,
    "lng": 34.22,
    "name": "Itang",
    "zoneId": "ZONE_itang_special"
  },
  "WOREDA_harari_sofi": {
    "lat": 9.258,
    "lng": 42.191,
    "name": "Sofi",
    "zoneId": "ZONE_harari"
  },
  "sofi": {
    "lat": 9.258,
    "lng": 42.191,
    "name": "Sofi",
    "zoneId": "ZONE_harari"
  },
  "WOREDA_harari_shenkor": {
    "lat": 9.344,
    "lng": 42.149,
    "name": "Shenkor",
    "zoneId": "ZONE_harari"
  },
  "shenkor": {
    "lat": 9.344,
    "lng": 42.149,
    "name": "Shenkor",
    "zoneId": "ZONE_harari"
  },
  "WOREDA_harari_jinela": {
    "lat": 9.297,
    "lng": 42.089,
    "name": "Jinela",
    "zoneId": "ZONE_harari"
  },
  "jinela": {
    "lat": 9.297,
    "lng": 42.089,
    "name": "Jinela",
    "zoneId": "ZONE_harari"
  },
  "WOREDA_harari_hakim": {
    "lat": 9.256,
    "lng": 42.093,
    "name": "Hakim",
    "zoneId": "ZONE_harari"
  },
  "hakim": {
    "lat": 9.256,
    "lng": 42.093,
    "name": "Hakim",
    "zoneId": "ZONE_harari"
  },
  "WOREDA_harari_erer_hr": {
    "lat": 9.328,
    "lng": 42.225,
    "name": "Erer (HR)",
    "zoneId": "ZONE_harari"
  },
  "erer (hr)": {
    "lat": 9.328,
    "lng": 42.225,
    "name": "Erer (HR)",
    "zoneId": "ZONE_harari"
  },
  "WOREDA_harari_dire_teyara": {
    "lat": 9.379,
    "lng": 42.142,
    "name": "Dire Teyara",
    "zoneId": "ZONE_harari"
  },
  "dire teyara": {
    "lat": 9.379,
    "lng": 42.142,
    "name": "Dire Teyara",
    "zoneId": "ZONE_harari"
  },
  "WOREDA_harari_amir_nur": {
    "lat": 9.308,
    "lng": 42.176,
    "name": "Amir Nur",
    "zoneId": "ZONE_harari"
  },
  "amir nur": {
    "lat": 9.308,
    "lng": 42.176,
    "name": "Amir Nur",
    "zoneId": "ZONE_harari"
  },
  "WOREDA_harari_aboker": {
    "lat": 9.342,
    "lng": 42.112,
    "name": "Aboker",
    "zoneId": "ZONE_harari"
  },
  "aboker": {
    "lat": 9.342,
    "lng": 42.112,
    "name": "Aboker",
    "zoneId": "ZONE_harari"
  },
  "WOREDA_harari_abadir": {
    "lat": 9.31,
    "lng": 42.123,
    "name": "Abadir",
    "zoneId": "ZONE_harari"
  },
  "abadir": {
    "lat": 9.31,
    "lng": 42.123,
    "name": "Abadir",
    "zoneId": "ZONE_harari"
  },
  "WOREDA_region_14_akaki_kality_sub_city": {
    "lat": 8.897,
    "lng": 38.804,
    "name": "Akaki Kality Sub City",
    "zoneId": "ZONE_region_14"
  },
  "akaki kality sub city": {
    "lat": 8.897,
    "lng": 38.804,
    "name": "Akaki Kality Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_region_14_nifas_silk_lafto_sub_city": {
    "lat": 8.947,
    "lng": 38.731,
    "name": "Nifas Silk Lafto Sub City",
    "zoneId": "ZONE_region_14"
  },
  "nifas silk lafto sub city": {
    "lat": 8.947,
    "lng": 38.731,
    "name": "Nifas Silk Lafto Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_region_14_kolfe_keraniyo_sub_city": {
    "lat": 8.993,
    "lng": 38.685,
    "name": "Kolfe Keraniyo Sub City",
    "zoneId": "ZONE_region_14"
  },
  "kolfe keraniyo sub city": {
    "lat": 8.993,
    "lng": 38.685,
    "name": "Kolfe Keraniyo Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_region_14_bole_sub_city": {
    "lat": 8.974,
    "lng": 38.809,
    "name": "Bole Sub City",
    "zoneId": "ZONE_region_14"
  },
  "bole sub city": {
    "lat": 8.974,
    "lng": 38.809,
    "name": "Bole Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_region_14_lideta_sub_city": {
    "lat": 9.002,
    "lng": 38.731,
    "name": "Lideta Sub City",
    "zoneId": "ZONE_region_14"
  },
  "lideta sub city": {
    "lat": 9.002,
    "lng": 38.731,
    "name": "Lideta Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_region_14_kirkos_sub_city": {
    "lat": 9.0,
    "lng": 38.759,
    "name": "Kirkos Sub City",
    "zoneId": "ZONE_region_14"
  },
  "kirkos sub city": {
    "lat": 9.0,
    "lng": 38.759,
    "name": "Kirkos Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_region_14_yeka_sub_city": {
    "lat": 9.049,
    "lng": 38.81,
    "name": "Yeka Sub City",
    "zoneId": "ZONE_region_14"
  },
  "yeka sub city": {
    "lat": 9.049,
    "lng": 38.81,
    "name": "Yeka Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_region_14_addis_ketema_sub_city": {
    "lat": 9.044,
    "lng": 38.707,
    "name": "Addis Ketema Sub City",
    "zoneId": "ZONE_region_14"
  },
  "addis ketema sub city": {
    "lat": 9.044,
    "lng": 38.707,
    "name": "Addis Ketema Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_region_14_arada_sub_city": {
    "lat": 9.031,
    "lng": 38.757,
    "name": "Arada Sub City",
    "zoneId": "ZONE_region_14"
  },
  "arada sub city": {
    "lat": 9.031,
    "lng": 38.757,
    "name": "Arada Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_region_14_gulele_sub_city": {
    "lat": 9.071,
    "lng": 38.739,
    "name": "Gulele Sub City",
    "zoneId": "ZONE_region_14"
  },
  "gulele sub city": {
    "lat": 9.071,
    "lng": 38.739,
    "name": "Gulele Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_region_14_lemi_kura_sub_city": {
    "lat": 9.005,
    "lng": 38.87,
    "name": "Lemi Kura Sub City",
    "zoneId": "ZONE_region_14"
  },
  "lemi kura sub city": {
    "lat": 9.005,
    "lng": 38.87,
    "name": "Lemi Kura Sub City",
    "zoneId": "ZONE_region_14"
  },
  "WOREDA_dire_dawa_urban_sabian": {
    "lat": 9.627,
    "lng": 41.835,
    "name": "Sabian",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "sabian": {
    "lat": 9.627,
    "lng": 41.835,
    "name": "Sabian",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "WOREDA_dire_dawa_urban_malka_jabti_m_jebdu": {
    "lat": 9.629,
    "lng": 41.795,
    "name": "Malka Jabti /M.Jebdu",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "malka jabti /m.jebdu": {
    "lat": 9.629,
    "lng": 41.795,
    "name": "Malka Jabti /M.Jebdu",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "WOREDA_dire_dawa_urban_legehare": {
    "lat": 9.605,
    "lng": 41.877,
    "name": "Legehare",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "legehare": {
    "lat": 9.605,
    "lng": 41.877,
    "name": "Legehare",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "WOREDA_dire_dawa_urban_addis_ketema_dd": {
    "lat": 9.589,
    "lng": 41.86,
    "name": "Addis Ketema (DD)",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "addis ketema (dd)": {
    "lat": 9.589,
    "lng": 41.86,
    "name": "Addis Ketema (DD)",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "WOREDA_dire_dawa_urban_gende_kore": {
    "lat": 9.6,
    "lng": 41.855,
    "name": "Gende Kore",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "gende kore": {
    "lat": 9.6,
    "lng": 41.855,
    "name": "Gende Kore",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "WOREDA_dire_dawa_urban_dechatu": {
    "lat": 9.601,
    "lng": 41.883,
    "name": "Dechatu",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "dechatu": {
    "lat": 9.601,
    "lng": 41.883,
    "name": "Dechatu",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "WOREDA_dire_dawa_urban_hafat_issa": {
    "lat": 9.605,
    "lng": 41.869,
    "name": "Hafat Issa",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "hafat issa": {
    "lat": 9.605,
    "lng": 41.869,
    "name": "Hafat Issa",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "WOREDA_dire_dawa_urban_kazira": {
    "lat": 9.636,
    "lng": 41.855,
    "name": "Kazira",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "kazira": {
    "lat": 9.636,
    "lng": 41.855,
    "name": "Kazira",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "WOREDA_dire_dawa_urban_police_maret": {
    "lat": 9.639,
    "lng": 41.868,
    "name": "Police Maret",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "police maret": {
    "lat": 9.639,
    "lng": 41.868,
    "name": "Police Maret",
    "zoneId": "ZONE_dire_dawa_urban"
  },
  "WOREDA_dire_dawa_rural_aseliso": {
    "lat": 9.572,
    "lng": 41.783,
    "name": "Aseliso",
    "zoneId": "ZONE_dire_dawa_rural"
  },
  "aseliso": {
    "lat": 9.572,
    "lng": 41.783,
    "name": "Aseliso",
    "zoneId": "ZONE_dire_dawa_rural"
  },
  "WOREDA_dire_dawa_rural_jeldessa": {
    "lat": 9.69,
    "lng": 42.187,
    "name": "Jeldessa",
    "zoneId": "ZONE_dire_dawa_rural"
  },
  "jeldessa": {
    "lat": 9.69,
    "lng": 42.187,
    "name": "Jeldessa",
    "zoneId": "ZONE_dire_dawa_rural"
  },
  "WOREDA_dire_dawa_rural_wahil": {
    "lat": 9.52,
    "lng": 41.861,
    "name": "Wahil",
    "zoneId": "ZONE_dire_dawa_rural"
  },
  "wahil": {
    "lat": 9.52,
    "lng": 41.861,
    "name": "Wahil",
    "zoneId": "ZONE_dire_dawa_rural"
  },
  "WOREDA_dire_dawa_rural_biyoawale": {
    "lat": 9.576,
    "lng": 42.0,
    "name": "Biyoawale",
    "zoneId": "ZONE_dire_dawa_rural"
  },
  "biyoawale": {
    "lat": 9.576,
    "lng": 42.0,
    "name": "Biyoawale",
    "zoneId": "ZONE_dire_dawa_rural"
  },
  "WOREDA_hawassa_town_admin_hawassa_town": {
    "lat": 7.017,
    "lng": 38.491,
    "name": "Hawassa town",
    "zoneId": "ZONE_hawassa_town_admin"
  },
  "hawassa town": {
    "lat": 7.017,
    "lng": 38.491,
    "name": "Hawassa town",
    "zoneId": "ZONE_hawassa_town_admin"
  },
  "WOREDA_northern_wondo_genet_town": {
    "lat": 7.046,
    "lng": 38.613,
    "name": "Wondo-Genet town",
    "zoneId": "ZONE_northern"
  },
  "wondo-genet town": {
    "lat": 7.046,
    "lng": 38.613,
    "name": "Wondo-Genet town",
    "zoneId": "ZONE_northern"
  },
  "WOREDA_northern_wondo_genet": {
    "lat": 7.021,
    "lng": 38.645,
    "name": "Wondo-Genet",
    "zoneId": "ZONE_northern"
  },
  "wondo-genet": {
    "lat": 7.021,
    "lng": 38.645,
    "name": "Wondo-Genet",
    "zoneId": "ZONE_northern"
  },
  "WOREDA_northern_malga": {
    "lat": 6.934,
    "lng": 38.643,
    "name": "Malga",
    "zoneId": "ZONE_northern"
  },
  "malga": {
    "lat": 6.934,
    "lng": 38.643,
    "name": "Malga",
    "zoneId": "ZONE_northern"
  },
  "WOREDA_northern_gorche": {
    "lat": 6.838,
    "lng": 38.604,
    "name": "Gorche",
    "zoneId": "ZONE_northern"
  },
  "gorche": {
    "lat": 6.838,
    "lng": 38.604,
    "name": "Gorche",
    "zoneId": "ZONE_northern"
  },
  "WOREDA_northern_hawela": {
    "lat": 6.92,
    "lng": 38.483,
    "name": "Hawela",
    "zoneId": "ZONE_northern"
  },
  "hawela": {
    "lat": 6.92,
    "lng": 38.483,
    "name": "Hawela",
    "zoneId": "ZONE_northern"
  },
  "WOREDA_northern_leku_town": {
    "lat": 6.873,
    "lng": 38.444,
    "name": "Leku town",
    "zoneId": "ZONE_northern"
  },
  "leku town": {
    "lat": 6.873,
    "lng": 38.444,
    "name": "Leku town",
    "zoneId": "ZONE_northern"
  },
  "WOREDA_northern_shebe_dino": {
    "lat": 6.882,
    "lng": 38.399,
    "name": "Shebe Dino",
    "zoneId": "ZONE_northern"
  },
  "shebe dino": {
    "lat": 6.882,
    "lng": 38.399,
    "name": "Shebe Dino",
    "zoneId": "ZONE_northern"
  },
  "WOREDA_northern_boricha": {
    "lat": 6.919,
    "lng": 38.338,
    "name": "Boricha",
    "zoneId": "ZONE_northern"
  },
  "boricha": {
    "lat": 6.919,
    "lng": 38.338,
    "name": "Boricha",
    "zoneId": "ZONE_northern"
  },
  "WOREDA_northern_bilate_zuria": {
    "lat": 6.939,
    "lng": 38.209,
    "name": "Bilate Zuria",
    "zoneId": "ZONE_northern"
  },
  "bilate zuria": {
    "lat": 6.939,
    "lng": 38.209,
    "name": "Bilate Zuria",
    "zoneId": "ZONE_northern"
  },
  "WOREDA_northern_hawassa_zuria": {
    "lat": 7.054,
    "lng": 38.356,
    "name": "Hawassa Zuria",
    "zoneId": "ZONE_northern"
  },
  "hawassa zuria": {
    "lat": 7.054,
    "lng": 38.356,
    "name": "Hawassa Zuria",
    "zoneId": "ZONE_northern"
  },
  "WOREDA_central_arbegona": {
    "lat": 6.65,
    "lng": 38.733,
    "name": "Arbegona",
    "zoneId": "ZONE_central"
  },
  "arbegona": {
    "lat": 6.65,
    "lng": 38.733,
    "name": "Arbegona",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_shafamo": {
    "lat": 6.664,
    "lng": 38.64,
    "name": "Shafamo",
    "zoneId": "ZONE_central"
  },
  "shafamo": {
    "lat": 6.664,
    "lng": 38.64,
    "name": "Shafamo",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_wonosho": {
    "lat": 6.747,
    "lng": 38.523,
    "name": "Wonosho",
    "zoneId": "ZONE_central"
  },
  "wonosho": {
    "lat": 6.747,
    "lng": 38.523,
    "name": "Wonosho",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_yirgalem_town": {
    "lat": 6.742,
    "lng": 38.387,
    "name": "Yirgalem town",
    "zoneId": "ZONE_central"
  },
  "yirgalem town": {
    "lat": 6.742,
    "lng": 38.387,
    "name": "Yirgalem town",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_dale": {
    "lat": 6.706,
    "lng": 38.413,
    "name": "Dale",
    "zoneId": "ZONE_central"
  },
  "dale": {
    "lat": 6.706,
    "lng": 38.413,
    "name": "Dale",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_darara": {
    "lat": 6.831,
    "lng": 38.215,
    "name": "Darara",
    "zoneId": "ZONE_central"
  },
  "darara": {
    "lat": 6.831,
    "lng": 38.215,
    "name": "Darara",
    "zoneId": "ZONE_central"
  },
  "WOREDA_central_loka_abaya": {
    "lat": 6.646,
    "lng": 38.168,
    "name": "Loka Abaya",
    "zoneId": "ZONE_central"
  },
  "loka abaya": {
    "lat": 6.646,
    "lng": 38.168,
    "name": "Loka Abaya",
    "zoneId": "ZONE_central"
  },
  "WOREDA_southern_bursa": {
    "lat": 6.627,
    "lng": 38.59,
    "name": "Bursa",
    "zoneId": "ZONE_southern"
  },
  "bursa": {
    "lat": 6.627,
    "lng": 38.59,
    "name": "Bursa",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_teticha": {
    "lat": 6.57,
    "lng": 38.539,
    "name": "Teticha",
    "zoneId": "ZONE_southern"
  },
  "teticha": {
    "lat": 6.57,
    "lng": 38.539,
    "name": "Teticha",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_aleta_wendo": {
    "lat": 6.602,
    "lng": 38.441,
    "name": "Aleta Wendo",
    "zoneId": "ZONE_southern"
  },
  "aleta wendo": {
    "lat": 6.602,
    "lng": 38.441,
    "name": "Aleta Wendo",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_aleta_wondo_town": {
    "lat": 6.606,
    "lng": 38.42,
    "name": "Aleta Wondo town",
    "zoneId": "ZONE_southern"
  },
  "aleta wondo town": {
    "lat": 6.606,
    "lng": 38.42,
    "name": "Aleta Wondo town",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_aleta_chuko": {
    "lat": 6.566,
    "lng": 38.303,
    "name": "Aleta Chuko",
    "zoneId": "ZONE_southern"
  },
  "aleta chuko": {
    "lat": 6.566,
    "lng": 38.303,
    "name": "Aleta Chuko",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_chuko_town": {
    "lat": 6.587,
    "lng": 38.336,
    "name": "Chuko town",
    "zoneId": "ZONE_southern"
  },
  "chuko town": {
    "lat": 6.587,
    "lng": 38.336,
    "name": "Chuko town",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_dara": {
    "lat": 6.442,
    "lng": 38.36,
    "name": "Dara",
    "zoneId": "ZONE_southern"
  },
  "dara": {
    "lat": 6.442,
    "lng": 38.36,
    "name": "Dara",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_dara_otilicho": {
    "lat": 6.489,
    "lng": 38.432,
    "name": "Dara Otilicho",
    "zoneId": "ZONE_southern"
  },
  "dara otilicho": {
    "lat": 6.489,
    "lng": 38.432,
    "name": "Dara Otilicho",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_hulla": {
    "lat": 6.47,
    "lng": 38.548,
    "name": "Hulla",
    "zoneId": "ZONE_southern"
  },
  "hulla": {
    "lat": 6.47,
    "lng": 38.548,
    "name": "Hulla",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_southern_chirone": {
    "lat": 6.454,
    "lng": 38.652,
    "name": "Chirone",
    "zoneId": "ZONE_southern"
  },
  "chirone": {
    "lat": 6.454,
    "lng": 38.652,
    "name": "Chirone",
    "zoneId": "ZONE_southern"
  },
  "WOREDA_eastern_bura": {
    "lat": 6.627,
    "lng": 38.854,
    "name": "Bura",
    "zoneId": "ZONE_eastern"
  },
  "bura": {
    "lat": 6.627,
    "lng": 38.854,
    "name": "Bura",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_bona_zuria": {
    "lat": 6.502,
    "lng": 38.712,
    "name": "Bona Zuria",
    "zoneId": "ZONE_eastern"
  },
  "bona zuria": {
    "lat": 6.502,
    "lng": 38.712,
    "name": "Bona Zuria",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_bensa": {
    "lat": 6.534,
    "lng": 38.863,
    "name": "Bensa",
    "zoneId": "ZONE_eastern"
  },
  "bensa": {
    "lat": 6.534,
    "lng": 38.863,
    "name": "Bensa",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_daye_town": {
    "lat": 6.521,
    "lng": 38.827,
    "name": "Daye town",
    "zoneId": "ZONE_eastern"
  },
  "daye town": {
    "lat": 6.521,
    "lng": 38.827,
    "name": "Daye town",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_daella": {
    "lat": 6.514,
    "lng": 38.976,
    "name": "Daella",
    "zoneId": "ZONE_eastern"
  },
  "daella": {
    "lat": 6.514,
    "lng": 38.976,
    "name": "Daella",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_chire": {
    "lat": 6.492,
    "lng": 39.06,
    "name": "Chire",
    "zoneId": "ZONE_eastern"
  },
  "chire": {
    "lat": 6.492,
    "lng": 39.06,
    "name": "Chire",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_aroresa": {
    "lat": 6.355,
    "lng": 39.012,
    "name": "Aroresa",
    "zoneId": "ZONE_eastern"
  },
  "aroresa": {
    "lat": 6.355,
    "lng": 39.012,
    "name": "Aroresa",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_hokko": {
    "lat": 6.222,
    "lng": 38.982,
    "name": "Hokko",
    "zoneId": "ZONE_eastern"
  },
  "hokko": {
    "lat": 6.222,
    "lng": 38.982,
    "name": "Hokko",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_eastern_chabe_gambeltu": {
    "lat": 6.428,
    "lng": 38.855,
    "name": "Chabe Gambeltu",
    "zoneId": "ZONE_eastern"
  },
  "chabe gambeltu": {
    "lat": 6.428,
    "lng": 38.855,
    "name": "Chabe Gambeltu",
    "zoneId": "ZONE_eastern"
  },
  "WOREDA_area_1_setit_humera_town": {
    "lat": 14.272,
    "lng": 36.616,
    "name": "Setit Humera town",
    "zoneId": "ZONE_area_1"
  },
  "setit humera town": {
    "lat": 14.272,
    "lng": 36.616,
    "name": "Setit Humera town",
    "zoneId": "ZONE_area_1"
  },
  "WOREDA_area_1_korarit": {
    "lat": 13.893,
    "lng": 37.552,
    "name": "Korarit",
    "zoneId": "ZONE_area_1"
  },
  "korarit": {
    "lat": 13.893,
    "lng": 37.552,
    "name": "Korarit",
    "zoneId": "ZONE_area_1"
  },
  "WOREDA_area_1_kafta_humera": {
    "lat": 14.077,
    "lng": 37.022,
    "name": "Kafta Humera",
    "zoneId": "ZONE_area_1"
  },
  "kafta humera": {
    "lat": 14.077,
    "lng": 37.022,
    "name": "Kafta Humera",
    "zoneId": "ZONE_area_1"
  },
  "WOREDA_area_1_welkait": {
    "lat": 13.673,
    "lng": 37.421,
    "name": "Welkait",
    "zoneId": "ZONE_area_1"
  },
  "welkait": {
    "lat": 13.673,
    "lng": 37.421,
    "name": "Welkait",
    "zoneId": "ZONE_area_1"
  },
  "WOREDA_area_1_tsegede": {
    "lat": 13.442,
    "lng": 37.29,
    "name": "Tsegede",
    "zoneId": "ZONE_area_1"
  },
  "tsegede": {
    "lat": 13.442,
    "lng": 37.29,
    "name": "Tsegede",
    "zoneId": "ZONE_area_1"
  },
  "WOREDA_area_1_may_kadra": {
    "lat": 13.905,
    "lng": 36.584,
    "name": "May Kadra",
    "zoneId": "ZONE_area_1"
  },
  "may kadra": {
    "lat": 13.905,
    "lng": 36.584,
    "name": "May Kadra",
    "zoneId": "ZONE_area_1"
  },
  "WOREDA_area_1_dansha_town": {
    "lat": 13.53,
    "lng": 36.723,
    "name": "Dansha town",
    "zoneId": "ZONE_area_1"
  },
  "dansha town": {
    "lat": 13.53,
    "lng": 36.723,
    "name": "Dansha town",
    "zoneId": "ZONE_area_1"
  },
  "WOREDA_area_1_awra": {
    "lat": 13.638,
    "lng": 37.128,
    "name": "Awra",
    "zoneId": "ZONE_area_1"
  },
  "awra": {
    "lat": 13.638,
    "lng": 37.128,
    "name": "Awra",
    "zoneId": "ZONE_area_1"
  },
  "WOREDA_area_1_may_gaba": {
    "lat": 13.782,
    "lng": 37.696,
    "name": "May Gaba",
    "zoneId": "ZONE_area_1"
  },
  "may gaba": {
    "lat": 13.782,
    "lng": 37.696,
    "name": "May Gaba",
    "zoneId": "ZONE_area_1"
  },
  "WOREDA_area_2_tselemti_west_telemt": {
    "lat": 13.638,
    "lng": 38.009,
    "name": "Tselemti /West Telemt",
    "zoneId": "ZONE_area_2"
  },
  "tselemti /west telemt": {
    "lat": 13.638,
    "lng": 38.009,
    "name": "Tselemti /West Telemt",
    "zoneId": "ZONE_area_2"
  },
  "WOREDA_area_2_laelay_tselemti": {
    "lat": 13.678,
    "lng": 38.357,
    "name": "Laelay Tselemti",
    "zoneId": "ZONE_area_2"
  },
  "laelay tselemti": {
    "lat": 13.678,
    "lng": 38.357,
    "name": "Laelay Tselemti",
    "zoneId": "ZONE_area_2"
  },
  "WOREDA_area_2_may_tsebri_town": {
    "lat": 13.574,
    "lng": 38.137,
    "name": "May Tsebri town",
    "zoneId": "ZONE_area_2"
  },
  "may tsebri town": {
    "lat": 13.574,
    "lng": 38.137,
    "name": "May Tsebri town",
    "zoneId": "ZONE_area_2"
  },
  "WOREDA_area_3_raya_alamata": {
    "lat": 12.387,
    "lng": 39.513,
    "name": "Raya Alamata",
    "zoneId": "ZONE_area_3"
  },
  "raya alamata": {
    "lat": 12.387,
    "lng": 39.513,
    "name": "Raya Alamata",
    "zoneId": "ZONE_area_3"
  },
  "WOREDA_area_3_ofla": {
    "lat": 12.551,
    "lng": 39.419,
    "name": "Ofla",
    "zoneId": "ZONE_area_3"
  },
  "ofla": {
    "lat": 12.551,
    "lng": 39.419,
    "name": "Ofla",
    "zoneId": "ZONE_area_3"
  },
  "WOREDA_area_3_korem_town": {
    "lat": 12.507,
    "lng": 39.516,
    "name": "Korem town",
    "zoneId": "ZONE_area_3"
  },
  "korem town": {
    "lat": 12.507,
    "lng": 39.516,
    "name": "Korem town",
    "zoneId": "ZONE_area_3"
  },
  "WOREDA_area_3_alamata_town": {
    "lat": 12.418,
    "lng": 39.564,
    "name": "Alamata town",
    "zoneId": "ZONE_area_3"
  },
  "alamata town": {
    "lat": 12.418,
    "lng": 39.564,
    "name": "Alamata town",
    "zoneId": "ZONE_area_3"
  },
  "WOREDA_area_3_zata": {
    "lat": 12.535,
    "lng": 39.263,
    "name": "Zata",
    "zoneId": "ZONE_area_3"
  },
  "zata": {
    "lat": 12.535,
    "lng": 39.263,
    "name": "Zata",
    "zoneId": "ZONE_area_3"
  },
  "WOREDA_area_3_chercher": {
    "lat": 12.509,
    "lng": 39.754,
    "name": "Chercher",
    "zoneId": "ZONE_area_3"
  },
  "chercher": {
    "lat": 12.509,
    "lng": 39.754,
    "name": "Chercher",
    "zoneId": "ZONE_area_3"
  }
};

export function getLocationCoords(regionIdOrName?: string | number, zoneIdOrName?: string, woredaIdOrName?: string): [number, number] | null {
  if (woredaIdOrName) {
    const w = WOREDA_COORDINATES[woredaIdOrName] || WOREDA_COORDINATES[woredaIdOrName.toLowerCase()];
    if (w) return [w.lat, w.lng];
  }
  if (zoneIdOrName) {
    const z = ZONE_COORDINATES[zoneIdOrName] || ZONE_COORDINATES[zoneIdOrName.toLowerCase()];
    if (z) return [z.lat, z.lng];
  }
  if (regionIdOrName) {
    const r = REGION_COORDINATES[regionIdOrName] || REGION_COORDINATES[String(regionIdOrName).toLowerCase()];
    if (r) return [r.lat, r.lng];
  }
  return null;
}
