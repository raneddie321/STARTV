import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FocusProvider, useFocusable } from "@/lib/focus";
import { profiles } from "@/lib/mock-data";
import { Settings, Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/profiles")({
  head: () => ({ meta: [{ title: "STAR — בחר פרופיל" }] }),
  component: ProfilesPage,
});

function ProfilesPage() {
  const nav = useNavigate();
  return (
    <FocusProvider initial={{ row: 0, col: 2 }} resetKey="profiles">
      <div className="min-h-screen flex flex-col items-center justify-center px-16">
        <div className="text-center mb-16">
          <div className="text-5xl font-black mb-3">מי צופה כעת?</div>
          <div className="text-lg text-muted-foreground">בחרו פרופיל כדי להתחיל</div>
        </div>
        <div className="flex gap-10">
          {profiles.map((p, i) => (
            <ProfileTile key={p.id} profile={p} col={i} onSelect={() => nav({ to: p.name === "ילדים" ? "/kids" : "/" })} />
          ))}
        </div>
        <div className="mt-16 flex gap-4">
          <FooterBtn row={1} col={0} icon={<Settings className="w-5 h-5" />} label="ניהול פרופילים" onSelect={() => nav({ to: "/settings" })} />
          <FooterBtn row={1} col={1} icon={<SearchIcon className="w-5 h-5" />} label="Find Me" onSelect={() => nav({ to: "/find-me" })} />
        </div>
      </div>
    </FocusProvider>
  );
}

function ProfileTile({ profile, col, onSelect }: { profile: typeof profiles[number]; col: number; onSelect: () => void }) {
  const { ref, focused } = useFocusable({ row: 0, col, onSelect });
  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={ref} tabIndex={-1}
        className={["w-44 h-44 rounded-3xl flex items-center justify-center text-7xl transition-all duration-200 cursor-default", focused ? "focus-glow" : "shadow-[var(--shadow-card)]"].join(" ")}
        style={{ background: profile.color }}>
        {profile.icon}
      </div>
      <div className={["text-xl font-medium transition-colors", focused ? "text-foreground" : "text-muted-foreground"].join(" ")}>{profile.name}</div>
    </div>
  );
}

function FooterBtn({ row, col, icon, label, onSelect }: { row: number; col: number; icon: React.ReactNode; label: string; onSelect: () => void }) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div ref={ref} tabIndex={-1}
      className={["glass px-6 py-3 rounded-full flex items-center gap-3 transition-all", focused ? "focus-glow-sm scale-105" : ""].join(" ")}>
      {icon} {label}
    </div>
  );
}
