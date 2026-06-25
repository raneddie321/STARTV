import { useNavigate } from "@tanstack/react-router";
import { useFocusable } from "@/lib/focus";
import { Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const items = [
  { label: "ילדים", to: "/kids" },
  { label: "נוער", to: "/kids" },
  { label: "דוקו", to: "/movies" },
  { label: "סדרות", to: "/series" },
  { label: "סרטים", to: "/movies" },
  { label: "STAR", to: "/" },
  { label: "CatchUp", to: "/live" },
  { label: "ערוצים", to: "/live" },
] as const;

export function TopMenu({ row = 0, activePath }: { row?: number; activePath: string }) {
  const [time, setTime] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    setTime(formatTime(new Date()));
    const t = setInterval(() => setTime(formatTime(new Date())), 30000);
    return () => clearInterval(t);
  }, []);

  // Column layout (RTL visual order, right→left):
  // col 0: avatar  | col 1: search | col 2..N+1: items | last+1: settings
  const colAvatar = 0;
  const colSearch = 1;
  const colSettings = items.length + 2;

  return (
    <header
      className="fixed top-0 inset-x-0 z-40 px-10 pt-6 pb-5 flex items-center gap-6"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.06 0.02 260 / 0.92) 0%, oklch(0.06 0.02 260 / 0.55) 70%, transparent 100%)",
      }}
    >
      <AvatarItem row={row} col={colAvatar} onSelect={() => nav({ to: "/profiles" })} />

      <div
        className="text-3xl font-black tracking-tight select-none"
        style={{ color: "#fff", textShadow: "0 2px 16px oklch(0.55 0.25 270 / 0.6)" }}
      >
        STAR
      </div>

      <SearchItem row={row} col={colSearch} onSelect={() => nav({ to: "/search" })} />

      <nav className="flex items-center gap-1">
        {items.map((it, idx) => (
          <MenuItem
            key={it.label}
            row={row}
            col={idx + 2}
            label={it.label}
            active={activePath === it.to}
            onSelect={() => nav({ to: it.to })}
          />
        ))}
      </nav>

      <div className="flex-1" />

      <SettingsItem row={row} col={colSettings} onSelect={() => nav({ to: "/settings" })} />
      <div className="text-white/80 font-medium tabular-nums">{time}</div>
    </header>
  );
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function MenuItem({
  row, col, label, active, onSelect,
}: { row: number; col: number; label: string; active: boolean; onSelect: () => void }) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={[
        "px-4 py-2 rounded-md text-base font-medium transition-all duration-200",
        focused
          ? "bg-white text-background scale-105 shadow-[0_0_24px_0_oklch(0.72_0.25_245/0.6)]"
          : active
            ? "text-white"
            : "text-white/65",
      ].join(" ")}
    >
      {label}
    </div>
  );
}

function SearchItem({ row, col, onSelect }: { row: number; col: number; onSelect: () => void }) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={[
        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
        focused ? "bg-white text-background scale-110" : "text-white/80",
      ].join(" ")}
    >
      <Search className="w-5 h-5" />
    </div>
  );
}

function SettingsItem({ row, col, onSelect }: { row: number; col: number; onSelect: () => void }) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={[
        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
        focused ? "bg-white text-background scale-110" : "text-white/80",
      ].join(" ")}
    >
      <Settings className="w-5 h-5" />
    </div>
  );
}

function AvatarItem({ row, col, onSelect }: { row: number; col: number; onSelect: () => void }) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={[
        "w-11 h-11 rounded-full transition-all duration-200",
        focused ? "ring-4 ring-white scale-110" : "ring-2 ring-white/20",
      ].join(" ")}
      style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}
    />
  );
}
