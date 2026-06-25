import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TvShell } from "@/components/tv/TvShell";
import { useFocusable } from "@/lib/focus";
import { CHANNELS } from "@/lib/channels";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/live")({
  head: () => ({ meta: [{ title: "STAR — שידור חי" }] }),
  component: LivePage,
});

function LivePage() {
  const nav = useNavigate();
  return (
    <TvShell activePath="/live" initialRow={1}>
      <div className="px-16 pt-6 pb-8 flex items-end justify-between">
        <div className="text-right">
          <h1 className="text-6xl font-black">שידור חי</h1>
          <p className="text-lg text-muted-foreground mt-3">{CHANNELS.length} ערוצים זמינים עכשיו</p>
        </div>
        <EpgButton row={1} col={0} onSelect={() => nav({ to: "/epg" })} />
      </div>

      <div className="px-16 grid grid-cols-4 gap-5 pb-32">
        {CHANNELS.map((ch, i) => (
          <ChannelTile
            key={ch.id}
            item={ch}
            row={2 + Math.floor(i / 4)}
            col={i % 4}
            onSelect={() => nav({ to: "/player", search: { src: ch.src, title: ch.title } as any })}
          />
        ))}
      </div>
    </TvShell>
  );
}

function EpgButton({ row, col, onSelect }: { row: number; col: number; onSelect: () => void }) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div ref={ref} tabIndex={-1}
      className={["glass px-6 py-3 rounded-xl flex items-center gap-3 transition-all", focused ? "ring-2 ring-white scale-105" : ""].join(" ")}>
      <Calendar className="w-5 h-5" /> לוח שידורים
    </div>
  );
}

function ChannelTile({ item, row, col, onSelect }: any) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={[
        "relative rounded-2xl overflow-hidden h-44 transition-all duration-300 cursor-default",
        focused ? "ring-[3px] ring-white scale-[1.04] shadow-[0_18px_50px_rgba(0,0,0,0.55)]" : "shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
      ].join(" ")}
      style={{ background: `linear-gradient(135deg, ${item.accent}cc, #0b0f1aef)` }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <img src={item.logo} alt={item.title} className="max-h-20 max-w-[70%] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" draggable={false} />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between text-right"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.85), transparent)" }}>
        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
        </div>
        <div className="text-right">
          <div className="text-sm font-bold">{item.title}</div>
          <div className="text-[11px] text-white/70 truncate max-w-[180px]">{item.subtitle}</div>
        </div>
      </div>
      <div className="absolute top-2 right-2 text-xs font-black text-white/70">{item.number}</div>
    </div>
  );
}
