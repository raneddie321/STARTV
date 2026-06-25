import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FocusProvider, useFocusable } from "@/lib/focus";
import { useRouter } from "@tanstack/react-router";
import { tmdbDetail, type TMDBDetail } from "@/lib/tmdb";
import { Play, Plus, Sparkles, Star } from "lucide-react";
import { z } from "zod";

const search = z.object({
  id: z.coerce.number(),
  type: z.enum(["movie", "tv"]).optional().default("tv"),
});

export const Route = createFileRoute("/kids-detail")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "STAR Kids — תוכן" }] }),
  component: KidsDetailPage,
});

function KidsDetailPage() {
  const { id, type } = Route.useSearch();
  const router = useRouter();
  const [d, setD] = useState<TMDBDetail | null>(null);
  useEffect(() => {
    let cancel = false;
    tmdbDetail(type, id).then((r) => { if (!cancel) setD(r); });
    return () => { cancel = true; };
  }, [id, type]);

  return (
    <FocusProvider initial={{ row: 1, col: 0 }} onBack={() => router.history.back()} resetKey={`kids-d-${id}`}>
      <div
        className="h-screen w-full overflow-hidden relative"
        style={{ background: "linear-gradient(180deg, #fef3c7 0%, #fde68a 35%, #fca5a5 100%)" }}
      >
        {d?.backdrop && (
          <img
            src={d.backdrop}
            alt={d.title}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.0) 30%, rgba(255,200,150,0.55) 100%)" }} />

        <div className="relative h-full grid grid-cols-2 gap-12 px-16 py-12">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[40px] bg-white/40 blur-2xl" />
              <div className="relative rounded-[36px] overflow-hidden ring-8 ring-white shadow-[0_30px_80px_rgba(0,0,0,0.25)] w-[520px] aspect-[2/3] bg-white/50">
                {d?.poster && <img src={d.poster} alt={d.title} className="w-full h-full object-cover" />}
              </div>
              <div className="absolute -top-6 -right-6 text-5xl rotate-12">⭐</div>
              <div className="absolute -bottom-4 -left-4 text-5xl -rotate-12">🎈</div>
            </div>
          </div>

          <div className="flex flex-col justify-center text-right" dir="rtl">
            <div className="inline-flex self-end items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 text-amber-700 text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" /> STAR Kids
            </div>
            <h1 className="text-7xl font-black text-amber-900 mb-4" style={{ textShadow: "0 2px 0 #fff" }}>
              {d?.title ?? "טוען..."}
            </h1>
            <div className="flex flex-row-reverse items-center gap-3 text-amber-900/80 font-bold mb-5">
              {d?.year && <span className="px-3 py-1 rounded-full bg-white/70">{d.year}</span>}
              {d?.rating && (
                <span className="px-3 py-1 rounded-full bg-white/70 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {d.rating.toFixed(1)}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-green-200 text-green-800">לכל המשפחה</span>
            </div>
            <p className="text-xl text-amber-950/85 leading-relaxed line-clamp-5 max-w-xl mr-auto">
              {d?.overview}
            </p>
            <div className="flex flex-row-reverse gap-4 mt-8">
              <KBtn row={1} col={0} primary icon={<Play className="w-6 h-6 fill-current" />} label="הפעלה" />
              <KBtn row={1} col={1} icon={<Plus className="w-6 h-6" />} label="הוסף למועדפים" />
              <KBtn row={1} col={2} label="טריילר" />
            </div>
            <button
              onClick={() => router.history.back()}
              className="self-end mt-10 text-amber-900/60 text-sm"
            >חזרה ←</button>
          </div>
        </div>
      </div>
    </FocusProvider>
  );
}

function KBtn({ row, col, primary, icon, label, onSelect }: any) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div ref={ref} tabIndex={-1}
      className={[
        "px-7 py-4 rounded-full font-black flex items-center gap-2 transition-all text-lg",
        primary ? "bg-amber-500 text-white" : "bg-white/80 text-amber-900",
        focused ? "ring-4 ring-white scale-110 shadow-[0_10px_30px_rgba(0,0,0,0.25)]" : "",
      ].join(" ")}>
      {icon} {label}
    </div>
  );
}
