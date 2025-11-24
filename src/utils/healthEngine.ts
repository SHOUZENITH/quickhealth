// src/utils/healthEngine.ts

export type Gender = "Laki-laki" | "Perempuan";

export interface HealthInput {
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  
  // Diet / Pola Makan
  makan_freq: "≤2x" | "3x" | "≥3x";
  fast_food: "≤1x/minggu" | "2–3x/minggu" | "≥3x/minggu";
  sayur: "≤7x" | "7–14x" | "≥14x";
  manis: "≤1x/minggu" | "2–4x/minggu" | "≥4x/minggu";
  air: "≤1L" | "1–2L" | "≥2L";
  makan_tidur: "≤2 jam" | "2–3 jam" | "≥3 jam";
  
  // Sleep / Pola Tidur
  tidur_durasi: "≤6 jam" | "6–8 jam" | "≥8 jam";
  tidur_konsistensi: "Tidak teratur" | "Cukup teratur" | "Teratur";
  tidur_siang: "Tidak pernah" | "≤1 jam/hari" | "1–2 jam/hari";
  tidur_quality: "Sangat lelah" | "Lelah" | "Netral" | "Cukup segar" | "Sangat segar";
  
  // Activity / Aktivitas Fisik
  olahraga: "Tidak pernah" | "1–3x" | "4–8x" | "≥8x";
  gaya: "Pasif (jarang bergerak)" | "Cukup aktif (kadang olahraga)" | "Aktif (sering bergerak)";
  langkah: "≤3000" | "3000–7000" | "≥7000";
  
  // Mental & Habits
  screen: "≤4 jam" | "4–6 jam" | "≥6 jam";
  stres_level: number; // 1-5 (Mapped from UI label)
  mood_level: number; // 1-5 (Mapped from UI label)
  rokok: "Tidak pernah" | "≤1x/bulan" | "1–3x/bulan" | "≥1x/minggu";
  alkohol: "Tidak pernah" | "≤1x/bulan" | "1–3x/bulan" | "≥1x/minggu";
}

// --- Constants (The Scoring MAP) ---
// Note: "Tidak pernah" is handled manually in the logic because it varies by context.
const SCORE_MAP: Record<string, number> = {
  // Diet
  "≤2x": 45, "3x": 100, "≥3x": 80,
  "≤1x/minggu": 100, "2–3x/minggu": 65, "≥3x/minggu": 30, // shared for fast food & others
  "≤7x": 30, "7–14x": 80, "≥14x": 100, // sayur
  "2–4x/minggu": 70, "≥4x/minggu": 35, // manis specific
  "≤1L": 25, "1–2L": 75, "≥2L": 100, // air
  "≤2 jam": 35, "2–3 jam": 75, "≥3 jam": 100, // makan_tidur
  
  // Sleep
  "≤6 jam": 25, "6–8 jam": 100, "≥8 jam": 80,
  "Tidak teratur": 35, "Cukup teratur": 80, "Teratur": 100,
  "≤1 jam/hari": 100, "1–2 jam/hari": 80, // tidur siang
  "Sangat lelah": 10, "Lelah": 35, "Netral": 65, "Cukup segar": 90, "Sangat segar": 100,
  
  // Activity
  "1–3x": 65, "4–8x": 85, "≥8x": 100, // olahraga
  "Pasif (jarang bergerak)": 45, "Cukup aktif (kadang olahraga)": 80, "Aktif (sering bergerak)": 100, // gaya
  "≤3000": 25, "3000–7000": 75, "≥7000": 100, // langkah
  
  // Mental
  "≤4 jam": 100, "4–6 jam": 70, "≥6 jam": 35, // screen
  
  // Habits (Rokok/Alkohol - generic fallback)
  "≤1x/bulan": 80, "1–3x/bulan": 45, "≥1x/minggu": 20,
};

/**
 * Helper to get score from map with a default fallback of 50.
 * Allows context override for keys like "Tidak pernah" which differ by category.
 */
function getScore(key: string, contextDefault?: number): number {
  if (contextDefault !== undefined && key === "Tidak pernah") {
    return contextDefault;
  }
  if (key in SCORE_MAP) return SCORE_MAP[key];
  return 50; 
}

// --- Core Calculation Functions ---

export function calcBMI(weight: number, height: number): number {
  if (weight <= 0 || height <= 0) return 0.0;
  const h_m = height / 100.0;
  return parseFloat((weight / (h_m * h_m)).toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi === 0) return "N/A";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function calcBMR(gender: Gender, weight: number, height: number, age: number): number {
  if (weight <= 0 || height <= 0 || age <= 0) return 0;
  // Harris-Benedict Simplified
  if (gender === "Laki-laki") {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
  }
}

export function calcTDEE(bmr: number, gaya: string, olahraga: string): number {
  if (bmr <= 0) return 0;

  // Base factor from 'gaya'
  let base = 1.2; // Pasif
  if (gaya.includes("Cukup aktif")) base = 1.35;
  if (gaya.includes("Aktif") && !gaya.includes("Cukup")) base = 1.55;

  // Modifier from 'olahraga'
  let mod = 0;
  if (olahraga === "1–3x") mod = 0.05;
  else if (olahraga === "4–8x") mod = 0.12;
  else if (olahraga === "≥8x") mod = 0.20;
  // "Tidak pernah" results in 0 mod

  return Math.round(bmr * (base + mod));
}

export function calcWaterNeed(weight: number): number {
  if (weight <= 0) return 0;
  // 35 ml/kg
  return parseFloat(((35 * weight) / 1000).toFixed(2));
}

// --- Main Health Scoring Logic ---

export function calcHealthScore(data: HealthInput) {
  // 1. Pola Makan (Weight: 35%)
  const s_freq = getScore(data.makan_freq);
  const s_sayur = getScore(data.sayur);
  const s_manis = getScore(data.manis);
  const s_fast = getScore(data.fast_food);
  const s_air = getScore(data.air);
  
  const score_makan = 
    (0.25 * s_freq) + 
    (0.25 * s_sayur) + 
    (0.20 * s_manis) + 
    (0.20 * s_fast) + 
    (0.10 * s_air);

  // 2. Tidur (Weight: 25%)
  const s_dur = getScore(data.tidur_durasi);
  const s_reg = getScore(data.tidur_konsistensi);
  const s_qual = getScore(data.tidur_quality);
  const s_meal = getScore(data.makan_tidur);
  // Note: tidur_siang is not used in the main formula in Python script, 
  // but let's keep it available if needed.
  
  const score_tidur = 
    (0.4 * s_dur) + 
    (0.25 * s_reg) + 
    (0.25 * s_qual) + 
    (0.10 * s_meal);

  // 3. Aktivitas (Weight: 25%)
  const s_step = getScore(data.langkah);
  const s_screen = getScore(data.screen);
  
  // Specific Context: Olahraga "Tidak pernah" = 25
  const s_sport = getScore(data.olahraga, 25); 

  const score_aktivitas = 
    (0.5 * s_step) + 
    (0.3 * s_sport) + 
    (0.2 * s_screen);

  // 4. Mental (Weight: 15%)
  // Stres Penalty: (Level - 3) * 8. If level 3 (Normal), penalty 0.
  const stres_penalty = Math.max(0, (data.stres_level - 3) * 8);
  // Mood Score: (Level - 3) * 5 + 75.
  const mood_score = (data.mood_level - 3) * 5 + 75;
  
  const score_mental = Math.min(100, Math.max(0, mood_score - stres_penalty));

  // Overall Calculation
  let overall = (
    0.35 * (score_makan / 100) +
    0.25 * (score_tidur / 100) +
    0.25 * (score_aktivitas / 100) +
    0.15 * (score_mental / 100)
  ) * 100;

  overall = Math.min(100, Math.max(0, Math.round(overall)));

  return {
    overall,
    breakdown: {
      diet: Math.round(score_makan),
      sleep: Math.round(score_tidur),
      activity: Math.round(score_aktivitas),
      mental: Math.round(score_mental),
    }
  };
}

// --- Insights: Risk Flags & Advice ---

export function getRiskFlags(data: HealthInput, bmi: number): string[] {
  const flags: string[] = [];

  if (bmi >= 25) {
    flags.push("Risiko kelebihan berat badan (BMI tinggi).");
  }
  if (data.tidur_durasi === "≤6 jam" || ["Sangat lelah", "Lelah"].includes(data.tidur_quality)) {
    flags.push("Risiko kurang tidur atau kualitas tidur rendah.");
  }
  if (data.olahraga === "Tidak pernah" && data.langkah === "≤3000") {
    flags.push("Risiko kurang aktivitas fisik.");
  }
  // Check hydration score
  if (getScore(data.air) <= 40) {
    flags.push("Risiko dehidrasi ringan.");
  }
  if (data.stres_level >= 4) {
    flags.push("Tanda stres relatif tinggi.");
  }
  if (data.fast_food === "≥3x/minggu") {
    flags.push("Konsumsi fast food sering: risiko nutrisi kurang ideal.");
  }

  return flags;
}

export function getAdvice(data: HealthInput, bmi: number): string[] {
  const adv: string[] = [];

  if (data.tidur_durasi === "≤6 jam") {
    adv.push("Usahakan tidur minimal 6–7 jam; tambah 30–60 menit bertahap.");
  }
  if (data.tidur_konsistensi === "Tidak teratur") {
    adv.push("Buat jadwal tidur konsisten (bangun & tidur di waktu sama).");
  }
  if (data.olahraga === "Tidak pernah") {
    adv.push("Mulai aktivitas ringan 3x/minggu (jalan 20–30 menit).");
  }
  if (data.langkah === "≤3000") {
    adv.push("Naikkan target langkah ke >3000/hari, lalu ke 7000.");
  }
  if (data.air === "≤1L") {
    adv.push("Tambahkan asupan air sampai ~1.5–2L/hari.");
  }
  if (data.fast_food === "≥3x/minggu") {
    adv.push("Kurangi frekuensi fast food; pilih sumber protein + sayur.");
  }
  if (bmi >= 25) {
    adv.push("Pertimbangkan defisit kalori kecil dan lebih banyak aktivitas.");
  }
  if (data.stres_level >= 4) {
    adv.push("Coba teknik relaksasi 10 menit/hari (napas, jalan santai).");
  }

  // Remove duplicates and limit to 6
  return Array.from(new Set(adv)).slice(0, 6);
}