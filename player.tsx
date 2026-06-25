import { createFileRoute, useRouter } from "@tanstack/react-router";
import { FocusProvider, useFocusable } from "@/lib/focus";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Subtitles, Volume2, Settings } from "lucide-react";
import Hls from "hls.js";
import { z } from "zod";

const search = z.object({
  src: z.string().optional(),
  title: z.string().optional(),
});

export const Route = createFileRoute("/player")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "STAR — נגן" }] }),
  component: PlayerPage,
});

function PlayerPage() {
  const router = useRouter();
  return (
    <FocusProvider initial={{ row: 0, col: 1 }} onBack={() => router.history.back()} resetKey="player">
      <PlayerInner />
    </FocusProvider>
  );
}

function PlayerInner() {
  const { src, title } = Route.useSearch();
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [t, setT] = useState(0);
  const [total, setTotal] = useState(0);
  const isLive = !!src;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    let hls: Hls | null = null;
    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(v);
    }
    v.play().catch(() => {});
    return () => { hls?.destroy(); };
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onT = () => { setT(v.currentTime); setTotal(v.duration || 0); };
    v.addEventListener("timeupdate", onT);
    v.addEventListener("loadedmetadata", onT);
    return () => { v.removeEventListener("timeupdate", onT); v.removeEventListener("loadedmetadata", onT); };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {}); else v.pause();
  }, [playing]);

  const fmt = (s: number) => {
    if (!isFinite(s)) return "00:00";
    const h = Math.floor(s / 3600);
    const m = Math.floor(s / 60) % 60;
    const sec = Math.floor(s % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black">
      {src ? (
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-contain bg-black" autoPlay playsInline muted={false} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1e1b4b,#831843)" }}>
          <div className="text-9xl opacity-10 font-black">STAR</div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.55))" }} />

      <div className="absolute top-0 inset-x-0 p-10 flex items-start justify-between">
        <div className="text-right">
          <div className="text-sm text-white/60">{isLive ? "שידור חי" : "משדר כעת"}</div>
          <div className="text-3xl font-bold">{title ?? "פרויקט תל אביב · עונה 1 פרק 3"}</div>
        </div>
        <div className="glass-strong rounded-full px-4 py-2 text-sm">{isLive ? "LIVE · HD" : "4K HDR · Dolby Atmos"}</div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-12"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.85), transparent)" }}>
        {!isLive && (
          <div className="flex items-center gap-4 mb-6 text-sm">
            <span>{fmt(t)}</span>
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${total ? (t / total) * 100 : 0}%` }} />
            </div>
            <span className="text-white/60">{fmt(total)}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <CtrlBtn row={0} col={0} icon={<SkipBack className="w-6 h-6" />} label="קודם" />
          <CtrlBtn row={0} col={1} large
            icon={playing ? <Pause className="w-9 h-9 fill-current" /> : <Play className="w-9 h-9 fill-current" />}
            onSelect={() => setPlaying((p) => !p)} />
          <CtrlBtn row={0} col={2} icon={<SkipForward className="w-6 h-6" />} label="הבא" />
          <div className="w-8" />
          <CtrlBtn row={0} col={3} icon={<Subtitles className="w-6 h-6" />} label="כתוביות" />
          <CtrlBtn row={0} col={4} icon={<Volume2 className="w-6 h-6" />} label="שמע" />
          <CtrlBtn row={0} col={5} icon={<Settings className="w-6 h-6" />} label="איכות" />
        </div>
        <div className="text-center mt-6 text-xs text-white/50">לחיצה על ESC חוזרת אחורה</div>
      </div>
    </div>
  );
}

function CtrlBtn({ row, col, icon, label, large, onSelect }: any) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div ref={ref} tabIndex={-1}
      className={[
        "flex flex-col items-center gap-2 transition-all duration-200 cursor-default",
        focused ? "scale-110" : "",
      ].join(" ")}>
      <div className={[
        "rounded-full flex items-center justify-center transition-all",
        large ? "w-20 h-20" : "w-14 h-14",
        focused ? "bg-white text-background ring-2 ring-white" : "glass text-foreground",
      ].join(" ")}>{icon}</div>
      {label && <div className={["text-xs", focused ? "text-white" : "text-white/60"].join(" ")}>{label}</div>}
    </div>
  );
}
