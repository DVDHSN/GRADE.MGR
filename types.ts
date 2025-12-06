
export enum ExamType {
  MIDTERM = 'Midterm',
  FINAL = 'Final',
  QUIZ = 'Quiz',
  ASSIGNMENT = 'Assignment',
  PROJECT = 'Project'
}

export interface Grade {
  id: string;
  courseName: string;
  customCode?: string; // Optional custom code (e.g., "ROB" for Robotics)
  type: ExamType;
  score: number; // 0-100
  year: string; // e.g., "2024", "2025"
  date: string;
}

export interface GradingScale {
  A: number;
  B: number;
  C: number;
  D: number;
  // F is implied as below D
}

export interface AppSettings {
  targetScore: number;
  gradingScale: GradingScale;
}

export const DEFAULT_SCALE: GradingScale = {
  A: 82,
  B: 60,
  C: 40,
  D: 20
};

export const SUBJECT_LIST = [
  "Bahasa Melayu", "Bahasa Inggeris", "Sejarah", "Geografi", "Pendidikan Islam", 
  "Pendidikan Moral", "Mathematics", "Science", "Pendidikan Jasmani dan Kesihatan", 
  "Pendidikan Seni Visual", "Pendidikan Muzik", "Reka Bentuk dan Teknologi", 
  "Asas Sains Komputer", "Pendidikan Sivik", "Bahasa Arab", "Bahasa Cina", 
  "Bahasa Tamil", "Bahasa Iban", "Bahasa Kadazandusun", "Bahasa Jepun", 
  "Bahasa Jerman", "Bahasa Perancis", "Additional Mathematics", "Physics", 
  "Chemistry", "Biology", "Ekonomi", "Perdagangan", "Prinsip Perakaunan", 
  "Sosiologi", "Literature in English", "Sains Komputer", "Pendidikan Al-Quran dan As-Sunnah",
  "Pendidikan Syariah Islamiah"
];

export const SUBJECT_CODES: Record<string, string> = {
  "Bahasa Melayu": "BML",
  "Bahasa Inggeris": "ENG",
  "Sejarah": "SEJ",
  "Geografi": "GEO",
  "Pendidikan Islam": "PIS",
  "Pendidikan Moral": "PMO",
  "Mathematics": "MAT",
  "Science": "SCI",
  "Pendidikan Jasmani dan Kesihatan": "PJK",
  "Pendidikan Seni Visual": "PSV",
  "Pendidikan Muzik": "PMU",
  "Reka Bentuk dan Teknologi": "RBT",
  "Asas Sains Komputer": "ASK",
  "Pendidikan Sivik": "SIV",
  "Bahasa Arab": "BAR",
  "Bahasa Cina": "BCN",
  "Bahasa Tamil": "BTM",
  "Bahasa Iban": "BIB",
  "Bahasa Kadazandusun": "BKD",
  "Bahasa Jepun": "BJP",
  "Bahasa Jerman": "BJR",
  "Bahasa Perancis": "BFR",
  "Additional Mathematics": "ADM",
  "Physics": "PHY",
  "Chemistry": "CHE",
  "Biology": "BIO",
  "Ekonomi": "EKO",
  "Perdagangan": "PRD",
  "Prinsip Perakaunan": "ACC",
  "Sosiologi": "SOC",
  "Literature in English": "LIT",
  "Literature": "LIT",
  "Sains Komputer": "SKO",
  "Pendidikan Al-Quran dan As-Sunnah": "AQS",
  "Pendidikan Syariah Islamiah": "PSY"
};

export const getSubjectCode = (name: string, customCode?: string): string => {
  if (customCode) return customCode;
  if (SUBJECT_CODES[name]) return SUBJECT_CODES[name];
  // Fallback for custom subjects: First 3 letters, uppercase
  return name.slice(0, 3).toUpperCase();
};