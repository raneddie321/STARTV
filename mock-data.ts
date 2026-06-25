// Mock data for TAP Smart TV app
export type MediaItem = {
  id: string;
  title: string;
  subtitle?: string;
  year?: number;
  rating?: string;
  duration?: string;
  genre?: string;
  description?: string;
  poster: string; // gradient
  hero?: string;
  progress?: number; // 0..1
  badge?: "חדש" | "STAR Original" | "ישראלי" | "LIVE";
};

const grad = (a: string, b: string) =>
  `linear-gradient(135deg, ${a}, ${b})`;

const palette = [
  ["#1e3a8a", "#312e81"],
  ["#7c2d12", "#451a03"],
  ["#831843", "#4a044e"],
  ["#064e3b", "#022c22"],
  ["#9a3412", "#7c2d12"],
  ["#1e40af", "#0c4a6e"],
  ["#581c87", "#1e1b4b"],
  ["#9f1239", "#581c87"],
  ["#0f766e", "#134e4a"],
  ["#a16207", "#422006"],
];

const makeItem = (i: number, baseTitle: string): MediaItem => {
  const [a, b] = palette[i % palette.length];
  return {
    id: `${baseTitle}-${i}`,
    title: `${baseTitle} ${i + 1}`,
    subtitle: ["דרמה", "מתח", "קומדיה", "פעולה", "תיעודי"][i % 5],
    year: 2020 + (i % 6),
    rating: ["+12", "+16", "+18", "כל הגילאים"][i % 4],
    duration: `${1 + (i % 2)}ש׳ ${10 + (i * 7) % 50}ד׳`,
    genre: ["דרמה ישראלית", "מתח בינלאומי", "קומדיה רומנטית", "אקשן", "מדע בדיוני"][i % 5],
    description:
      "סיפור עוצמתי שמרתק מהדקה הראשונה. דמויות מורכבות, עלילה סוחפת ועיצוב חזותי מרהיב שיעבירו אתכם לעולם אחר לחלוטין.",
    poster: grad(a, b),
    hero: grad(a, b),
  };
};

export const continueWatching: MediaItem[] = Array.from({ length: 8 }, (_, i) => ({
  ...makeItem(i, "פרק"),
  title: ["מעבר לקו", "טהרן", "פאודה", "השוטר הטוב", "הסוכן", "החפרים", "סטיסל", "אופירה"][i],
  subtitle: `עונה ${1 + (i % 3)} • פרק ${3 + i}`,
  progress: 0.15 + (i * 0.11) % 0.7,
}));

export const recommended: MediaItem[] = Array.from({ length: 10 }, (_, i) => ({
  ...makeItem(i + 1, "המלצה"),
  title: ["לבד בבית", "המנהלת", "הבורר", "זגורי אימפריה", "החממה", "מטומטמות", "הפיג׳מות", "שטיסל", "מסיבת גיהינום", "טירת קלף"][i],
}));

export const newOnTap: MediaItem[] = Array.from({ length: 10 }, (_, i) => ({
  ...makeItem(i + 2, "חדש"),
  title: ["אקס מכינה", "קוויקסילבר", "ירושלים 2040", "המבצע", "אדמה שחורה", "בלוז לחופש", "תיק 1948", "ערפל", "סוף הדרך", "המעטפה"][i],
  badge: "חדש",
}));

export const tapOriginal: MediaItem[] = Array.from({ length: 8 }, (_, i) => ({
  ...makeItem(i + 3, "אוריג׳ינל"),
  title: ["פרויקט תל אביב", "קוד אדום", "הנוסעת", "מעבר לחומה", "הסוד של רחל", "אגדה אורבנית", "הלילה הארוך", "חוצה גבולות"][i],
  badge: "STAR Original",
}));

export const israeliMovies: MediaItem[] = Array.from({ length: 10 }, (_, i) => ({
  ...makeItem(i + 4, "סרט"),
  title: ["אפס ביחסי אנוש", "הערת שוליים", "ולס עם באשיר", "ביקור התזמורת", "לבנון", "אופסיידרס", "מבצע סבתא", "תהילים", "אבולוציה", "סופי"][i],
  badge: "ישראלי",
}));

export const thrillerSeries: MediaItem[] = Array.from({ length: 10 }, (_, i) => ({
  ...makeItem(i + 5, "מתח"),
  title: ["שורש", "המרגלים", "החדר השחור", "צל של ספק", "האחים", "פתרון סופי", "הדממה", "המעקב", "קוד מולי", "נקודת אל-חזור"][i],
}));

export const dramaSeries: MediaItem[] = Array.from({ length: 10 }, (_, i) => ({
  ...makeItem(i + 6, "דרמה"),
  title: ["משפחה אחת", "הבית הלבן", "ימי קיץ", "החצר האחורית", "המורה", "אהבה כחולה", "ארץ נהדרת", "החיים שלי", "מעבר לחלון", "האם"][i],
}));

export const kidsRow: MediaItem[] = Array.from({ length: 10 }, (_, i) => ({
  ...makeItem(i + 7, "ילדים"),
  title: ["פוקימון", "הרפתקאות בייגלה", "דובי האהוב", "כוכבי הים", "מיני הקופית", "סבא ואני", "החברים", "הצבעים", "מילים קסומות", "אוטו האדום"][i],
}));

export const liveChannels: MediaItem[] = Array.from({ length: 12 }, (_, i) => ({
  ...makeItem(i + 8, "ערוץ"),
  title: ["ערוץ 12", "כאן 11", "ערוץ 13", "ספורט 1", "ספורט 2", "ילדים+", "Discovery", "Nat Geo", "HBO", "AXN", "Comedy", "Cinema"][i],
  subtitle: "משודר כעת: חדשות הערב",
  badge: "LIVE",
}));

export const heroBanner: MediaItem = {
  id: "hero-1",
  title: "פרויקט תל אביב",
  description:
    "סדרת מתח ישראלית פורצת דרך. סוכנת מוסד צעירה נשלחת למשימה הכי מורכבת בקריירה שלה, בעוד שהגבולות בין נאמנות לבגידה מיטשטשים. עונה חדשה ב-STAR Original.",
  genre: "מתח • דרמה • STAR Original",
  year: 2025,
  rating: "+16",
  duration: "עונה 1 • 8 פרקים",
  poster: grad("#1e1b4b", "#831843"),
  hero: grad("#1e1b4b", "#831843"),
  badge: "STAR Original",
};

export const profiles = [
  { id: "p1", name: "דניאל", color: "linear-gradient(135deg,#3b82f6,#8b5cf6)", icon: "🎬" },
  { id: "p2", name: "מיכל", color: "linear-gradient(135deg,#ec4899,#f43f5e)", icon: "🌸" },
  { id: "p3", name: "יואב", color: "linear-gradient(135deg,#10b981,#0ea5e9)", icon: "⚽" },
  { id: "p4", name: "ילדים", color: "linear-gradient(135deg,#f59e0b,#ef4444)", icon: "🧸" },
  { id: "p5", name: "אורח", color: "linear-gradient(135deg,#64748b,#334155)", icon: "👤" },
];
