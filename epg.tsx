import { createFileRoute } from "@tanstack/react-router";
import { TvShell } from "@/components/tv/TvShell";
import { useFocusable } from "@/lib/focus";
import { liveChannels } from "@/lib/mock-data";

export const Route = createFileRoute("/epg")({
  head: () => ({ meta: [{ title: "STAR — לוח שידורים" }] }),
  component: EpgPage,
});

const hours = ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];
const showTitles = [
  "חדשות הערב", "סדרה בכורה", "סרט הערב", "סרט הערב", "טוק שואו", "ספורט חי", "סדרת מתח",
  "תיעודי", "סטנדאפ", "סרט קולנוע", "סדרה לילית", "מוזיקה",
];

function EpgPage() {
  return (
    <TvShell activePath="/live" initialRow={1} resetKey="epg">
      <div className="px-16 pt-4 pb-8">
        <h1 className="text-5xl font-black">לוח שידורים</h1>
        <p className="text-muted-foreground mt-2">היום · {new Date().toLocaleDateString("he-IL")}</p>
      </div>

      {/* Time header */}
      <div className="px-16">
        <div className="grid mb-3" style={{ gridTemplateColumns: `220px repeat(${hours.length}, 1fr)` }}>
          <div />
          {hours.map((h) => (
            <div key={h} className="text-sm text-muted-foreground font-medium">{h}</div>
          ))}
        </div>

        <div className="space-y-2 pb-32">
          {liveChannels.slice(0, 10).map((ch, ri) => (
            <div key={ch.id} className="grid items-stretch gap-2" style={{ gridTemplateColumns: `220px repeat(${hours.length}, 1fr)` }}>
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg" style={{ background: ch.poster }} />
                <div className="text-sm font-bold">{ch.title}</div>
              </div>
              {hours.map((_, ci) => (
                <EpgCell key={ci} row={ri + 1} col={ci} title={showTitles[(ri + ci) % showTitles.length]} live={ci === 0} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </TvShell>
  );
}

function EpgCell({ row, col, title, live }: { row: number; col: number; title: string; live?: boolean }) {
  const { ref, focused } = useFocusable({ row, col });
  return (
    <div ref={ref} tabIndex={-1}
      className={[
        "rounded-xl px-4 py-3 transition-all duration-200 cursor-default",
        focused ? "bg-white text-background scale-105 focus-glow-sm z-10" : "bg-white/5 hover:bg-white/10",
      ].join(" ")}>
      <div className="text-sm font-semibold line-clamp-1">{title}</div>
      {live && (
        <div className={["text-[10px] mt-1 font-bold", focused ? "text-red-600" : "text-red-400"].join(" ")}>● משדר כעת</div>
      )}
    </div>
  );
}
