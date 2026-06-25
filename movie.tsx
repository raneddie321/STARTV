import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TvShell } from "@/components/tv/TvShell";
import { useFocusable } from "@/lib/focus";
import { tmdbDetail, type TMDBDetail } from "@/lib/tmdb";
import { Play, Plus, Star } from "lucide-react";
import { z } from "zod";

const search = z.object({
  id: z.coerce.number(),
  type: z.enum(["movie", "tv"]).optional().default("movie"),
});

export const Route = createFileRoute("/movie")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "STAR — סרט" }] }),
  component: MoviePage,
});

function MoviePage() {
  const { id, type } = Route.useSearch();
  const nav = useNavigate();
  const [d, setD] = useState<TMDBDetail | null>(null);

  useEffect(() => {
    let cancel = false;
    tmdbDetail(type, id).then((r) => { if (!cancel) setD(r); });
    return () => { cancel = true; };
  }, [id, type]);

  if (!d) {
    return (
      <TvShell activePath="/movies" initialRow={1} resetKey={`movie-${id}`}>
        <div className="absolute inset-0 bg-card animate-pulse" />
      </TvShell>
    );
  }

  return (
    <TvShell activePath="/movies" initialRow={1} resetKey={`movie-${id}`}>
      <div className="absolute inset-0">
        {d.backdrop && (
          <img src={d.backdrop} alt={d.title} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.06 0.015 260 / 0.35) 0%, transparent 30%, oklch(0.06 0.015 260 / 0.92) 85%, oklch(0.06 0.015 260))" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(270deg, transparent 50%, oklch(0.06 0.015 260 / 0.88))" }} />

        <div className="relative h-full flex flex-col justify-end px-16 pb-16">
          <div className="max-w-[50%] text-right">
            <div className="text-sm text-primary font-bold mb-2">
              {type === "tv" ? "סדרה" : "סרט"}{d.year ? ` · ${d.year}` : ""}
            </div>
            <h1 className="text-7xl font-black mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">{d.title}</h1>
            <div className="flex flex-row-reverse items-center gap-4 text-base text-white/80 mb-4">
              {d.rating ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" /> {d.rating.toFixed(1)}
                </span>
              ) : null}
              {d.runtime ? <span>{d.runtime} ד׳</span> : null}
              {d.seasons ? <span>{d.seasons} עונות</span> : null}
              {d.genres.length ? <span>{d.genres.slice(0, 3).join(" · ")}</span> : null}
            </div>
            <p className="text-lg text-white/85 leading-relaxed line-clamp-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {d.overview}
            </p>
            {(d.director || d.cast.length > 0) && (
              <div className="mt-4 text-sm text-white/70 space-y-1">
                {d.director && <div><span className="text-white/50">במאי: </span>{d.director}</div>}
                {d.cast.length > 0 && <div><span className="text-white/50">כיכוב: </span>{d.cast.slice(0, 4).join(", ")}</div>}
              </div>
            )}
            <div className="flex flex-row-reverse gap-3 mt-7">
              <Btn row={1} col={0} primary icon={<Play className="w-5 h-5 fill-current" />} label="נגן עכשיו" onSelect={() => nav({ to: "/player" })} />
              <Btn row={1} col={1} icon={<Plus className="w-5 h-5" />} label="הוסף לרשימה" />
              <Btn row={1} col={2} label="טריילר" />
            </div>
          </div>
        </div>
      </div>
    </TvShell>
  );
}

function Btn({ row, col, primary, icon, label, onSelect }: any) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div ref={ref} tabIndex={-1}
      className={["px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all", primary ? "bg-white text-background" : "glass text-white", focused ? "focus-glow-sm scale-105" : ""].join(" ")}>
      {icon} {label}
    </div>
  );
}
