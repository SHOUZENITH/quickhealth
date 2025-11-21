export type Gender = "Laki-laki" | "Perempuan";

export interface HealthInput {
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  // Diet
  makan_freq: "≤2x" | "3x" | "≥3x";
  fast_food: "≤1x/minggu" | "2–3x/minggu" | "≥3x/minggu";
  sayur: "≤7x" | "7–14x" | "≥14x";
  manis: "≤1x/minggu" | "2–4x/minggu" | "≥4x/minggu";
  air: "≤1L" | "1–2L" | "≥2L";
  makan_tidur: "≤2 jam" | "2–3 jam" | "≥3 jam";
  // Sleep
  tidur_durasi: "≤6 jam" | "6–8 jam" | "≥8 jam";
  tidur_konsistensi: "Tidak teratur" | "Cukup teratur" | "Teratur";
  tidur_siang: "Tidak pernah" | "≤1 jam/hari" | "1–2 jam/hari";
  tidur_quality: "Sangat lelah" | "Lelah" | "Netral" | "Cukup segar" | "Sangat segar";
  // Activity
  olahraga: "Tidak pernah" | "1–3x" | "4–8x" | "≥8x";
  gaya: "Pasif" | "Cukup aktif" | "Aktif";
  langkah: "≤3000" | "3000–7000" | "≥7000";
  // Mental
  screen: "≤4 jam" | "4–6 jam" | "≥6 jam";
  stres_level: number; // 1-5
  mood_level: number; // 1-5
  rokok: string;
  alkohol: string;
}

// --- Constants (The MAP) ---
const SCORE_MAP: Record<string, number> = {
  // Diet
  "≤2x": 45, "3x": 100, "≥3x": 80,
  "≤1x/minggu": 100, "2–3x/minggu": 65, "≥3x/minggu": 30,
  "≤7x": 30, "7–14x": 80, "≥14x": 100,
  "2–4x/minggu": 70, "≥4x/minggu": 35, // manis
  "≤1L": 25, "1–2L": 75, "≥2L": 100,
  "≤2 jam": 35, "2–3 jam": 75, "≥3 jam": 100,
  // Sleep
  "≤6 jam": 25, "6–8 jam": 100, "≥8 jam": 80,
  "Tidak teratur": 35, "Cukup teratur": 80, "Teratur": 100,
  "Tidak pernah": 90, "≤1 jam/hari": 100, "1–2 jam/hari": 80, // tidur siang
  "Sangat lelah": 10, "Lelah": 35, "Netral": 65, "Cukup segar": 90, "Sangat segar": 100,
  // Activity
  "1–3x": 65, "4–8x": 85, "≥8x": 100, // olahraga
  "Pasif": 45, "Cukup aktif": 80, "Aktif": 100, // gaya
  "≤3000": 25, "3000–7000": 75, "≥7000": 100,
  // Mental
  "≤4 jam": 100, "4–6 jam": 70, "≥6 jam": 35,
  // Rokok/Alkohol default map if needed, though specific logic usually applies
  "≤1x/bulan": 80, "1–3x/bulan": 45, "≥1x/minggu": 20,
};

function getScore(key: string): number {
  // Special handling for keys that might be duplicates in map or standard lookups
  if (key in SCORE_MAP) return SCORE_MAP[key];
  // Fallback for keys that share names (like olahraga "Tidak pernah" vs tidur siang "Tidak pernah")
  if (key === "Tidak pernah") return 25; // Default penalty
  return 50;
}

// --- Core Functions ---

export function calcBMI(weight: number, height: number) {
  if (weight <= 0 || height <= 0) return 0;
  const h_m = height / 100;
  return parseFloat((weight / (h_m * h_m)).toFixed(1));
}

export function getBMICategory(bmi: number) {
  if (bmi === 0) return "N/A";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function calcBMR(gender: Gender, weight: number, height: number, age: number) {
  if (weight <= 0 || height <= 0 || age <= 0) return 0;
  // Harris-Benedict
  if (gender === "Laki-laki") {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
  }
}

export function calcTDEE(bmr: number, gaya: string, olahraga: string) {
  let base = 1.2; // Pasif
  if (gaya.includes("Cukup aktif")) base = 1.35;
  if (gaya.includes("Aktif") && !gaya.includes("Cukup")) base = 1.55;

  let mod = 0;
  if (olahraga === "1–3x") mod = 0.05;
  else if (olahraga === "4–8x") mod = 0.12;
  else if (olahraga === "≥8x") mod = 0.20;

  return bmr * (base + mod);
}

export function calcHealthScore(data: HealthInput) {
  // 1. Pola Makan
  const s_freq = getScore(data.makan_freq);
  const s_sayur = getScore(data.sayur);
  const s_manis = getScore(data.manis);
  const s_fast = getScore(data.fast_food);
  const s_air = getScore(data.air);
  
  const score_makan = (0.25 * s_freq) + (0.25 * s_sayur) + (0.20 * s_manis) + (0.20 * s_fast) + (0.10 * s_air);

  // 2. Tidur
  const s_dur = getScore(data.tidur_durasi);
  const s_reg = getScore(data.tidur_konsistensi);
  const s_qual = getScore(data.tidur_quality);
  const s_meal = getScore(data.makan_tidur);
  
  const score_tidur = (0.4 * s_dur) + (0.25 * s_reg) + (0.25 * s_qual) + (0.10 * s_meal);

  // 3. Aktivitas
  const s_step = getScore(data.langkah);
  
  // Manual handling for Olahraga "Tidak pernah" which is specifically mapped in Python
  let s_sport = 25; 
  if(data.olahraga === "1–3x") s_sport = 65;
  if(data.olahraga === "4–8x") s_sport = 85;
  if(data.olahraga === "≥8x") s_sport = 100;
  
  const s_screen = getScore(data.screen);
  
  const score_aktivitas = (0.5 * s_step) + (0.3 * s_sport) + (0.2 * s_screen);

  // 4. Mental
  const stres_penalty = Math.max(0, (data.stres_level - 3) * 8);
  const mood_score = (data.mood_level - 3) * 5 + 75;
  const score_mental = Math.min(100, Math.max(0, mood_score - stres_penalty));

  // Overall
  const overall = (
    0.35 * (score_makan / 100) +
    0.25 * (score_tidur / 100) +
    0.25 * (score_aktivitas / 100) +
    0.15 * (score_mental / 100)
  ) * 100;

  return {
    overall: Math.round(Math.min(100, Math.max(0, overall))),
    breakdown: {
      diet: Math.round(score_makan),
      sleep: Math.round(score_tidur),
      activity: Math.round(score_aktivitas),
      mental: Math.round(score_mental),
    }
  };
}