import { createFileRoute } from "@tanstack/react-router";
import { TvShell } from "@/components/tv/TvShell";
import { useFocusable } from "@/lib/focus";
import { ChevronLeft, User, Wifi, Tv2, Volume2, Globe, ShieldCheck, Info } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "STAR — הגדרות" }] }),
  component: SettingsPage,
});

const sections = [
  { icon: User, title: "חשבון ופרופילים", desc: "ניהול פרופילים, הורים, אבטחה" },
  { icon: Tv2, title: "תצוגה ווידאו", desc: "רזולוציה 4K, HDR, Dolby Vision" },
  { icon: Volume2, title: "שמע", desc: "Dolby Atmos · DTS · מצב לילה" },
  { icon: Wifi, title: "רשת ואינטרנט", desc: "Wi-Fi · בדיקת מהירות · DNS" },
  { icon: Globe, title: "שפה ואזור", desc: "עברית · אנגלית · ערבית" },
  { icon: ShieldCheck, title: "פרטיות ואבטחה", desc: "PIN · ניהול מכשירים מחוברים" },
  { icon: Info, title: "אודות TAP", desc: "גרסה 1.0.0 · עדכוני מערכת" },
];

function SettingsPage() {
  return (
    <TvShell activePath="/" initialRow={1} resetKey="settings">
      <div className="px-16 pt-4 pb-8 flex items-center gap-3">
        <ChevronLeft className="w-6 h-6 text-muted-foreground" />
        <h1 className="text-5xl font-black">הגדרות</h1>
      </div>

      <div className="px-16 grid grid-cols-2 gap-5 pb-32">
        {sections.map((s, i) => (
          <SettingRow key={i} icon={<s.icon className="w-6 h-6" />} title={s.title} desc={s.desc} row={1 + Math.floor(i / 2)} col={i % 2} />
        ))}
      </div>
    </TvShell>
  );
}

function SettingRow({ icon, title, desc, row, col }: any) {
  const { ref, focused } = useFocusable({ row, col });
  return (
    <div ref={ref} tabIndex={-1}
      className={["glass rounded-2xl p-6 flex items-center gap-5 transition-all", focused ? "focus-glow-sm scale-[1.02]" : ""].join(" ")}>
      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <div className="text-lg font-bold">{title}</div>
        <div className="text-sm text-muted-foreground mt-1">{desc}</div>
      </div>
      <ChevronLeft className="w-5 h-5 text-muted-foreground" />
    </div>
  );
}
