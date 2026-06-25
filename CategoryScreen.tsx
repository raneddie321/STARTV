import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { TvShell } from "./TvShell";
import { HeroBanner } from "./HeroBanner";
import { ContentRow, type CardData } from "./ContentRow";
import { useFocusContext } from "@/lib/focus";
import type { TMDBItem } from "@/lib/tmdb";

export type CategoryRow = { title: string; items: TMDBItem[] };

function toCard(it: TMDBItem): CardData & { _src: TMDBItem } {
  return {
    id: `${it.mediaType}-${it.id}`,
    title: it.title,
    poster: it.poster,
    backdrop: it.backdrop,
    gradient: "linear-gradient(135deg,#1e1b4b,#831843)",
    _src: it,
  };
}

export function CategoryScreen({
  activePath,
  loader,
  variant = "wide",
  onBack,
}: {
  activePath: string;
  loader: () => Promise<CategoryRow[]>;
  variant?: "wide" | "poster";
  onBack?: () => void;
}) {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  useEffect(() => {
    let cancelled = false;
    loader().then((r) => {
      if (!cancelled) setRows(r.filter((x) => x.items.length));
    }).catch((e) => console.error("category load failed", e));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePath]);

  return (
    <TvShell activePath={activePath} initialRow={1} resetKey={activePath} onBack={onBack}>
      <Inner rows={rows} variant={variant} />
    </TvShell>
  );
}


function Inner({ rows, variant }: { rows: CategoryRow[]; variant: "wide" | "poster" }) {
  const nav = useNavigate();
  const ctx = useFocusContext();
  const [hero, setHero] = useState<TMDBItem | null>(null);

  useEffect(() => {
    if (!hero && rows[0]?.items[0]) setHero(rows[0].items[0]);
  }, [rows, hero]);

  const go = (it: TMDBItem) =>
    nav({
      to: it.mediaType === "tv" ? "/series-detail" : "/movie",
      search: { id: it.id, type: it.mediaType } as any,
    });

  // Row 0 is the top menu, rows 1..N are content rows.
  const focusedIdx = Math.max(0, ctx.pos.row - 1);
  const ROW_H = 260;

  return (
    <div className="absolute inset-0">
      <HeroBanner item={hero} />

      {/* Bottom dock with a single visible row */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
        style={{
          height: ROW_H + 40,
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.08 0.02 260 / 0.85) 35%, oklch(0.06 0.015 260) 100%)",
        }}
      >
        <div className="relative h-full overflow-hidden pointer-events-auto">
          <div
            className="absolute inset-x-0 top-5 transition-transform duration-300 ease-out"
            style={{ transform: `translateY(-${focusedIdx * ROW_H}px)` }}
          >
            {rows.map((r, idx) => (
              <ContentRow
                key={r.title}
                title={r.title}
                items={r.items.map(toCard)}
                row={idx + 1}
                variant={variant}
                onFocusItem={(c) => setHero((c as any)._src)}
                onSelect={(c) => go((c as any)._src)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
