import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FocusProvider, useFocusable, useFocusContext } from "@/lib/focus";
import { TopMenu } from "@/components/tv/TopMenu";
import { useRouter } from "@tanstack/react-router";
import { tmdb, type TMDBItem } from "@/lib/tmdb";

export const Route = createFileRoute("/kids")({
  head: () => ({ meta: [{ title: "STAR Kids — ילדים" }] }),
  component: KidsPage,
});

type Row = { title: string; items: TMDBItem[] };

function KidsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    Promise.all([tmdb.kidsTv(), tmdb.animation(), tmdb.familyMovies(), tmdb.kids()])
      .then(([a, b, c, d]) => setRows([
        { title: "כיף לראות", items: a },
        { title: "מומלץ בלעדי", items: b },
        { title: "מפץ ההרפתקאות", items: c },
        { title: "אהובים עלינו", items: d },
      ]));
  }, []);

  return (
    <FocusProvider initial={{ row: 1, col: 0 }} onBack={() => router.history.back()} resetKey="kids">
      <div
        className="h-screen w-full overflow-hidden relative"
        style={{ background: "linear-gradient(180deg, #d9f0f5 0%, #cfe9ee 50%, #c5e1e8 100%)" }}
      >
        <KidsTopMenu />
        <main data-tap-main className="absolute inset-0 pt-28 overflow-hidden">
          <KidsRows rows={rows} />
        </main>
      </div>
    </FocusProvider>
  );
}

function KidsTopMenu() {
  // Overrides TopMenu's dark gradient with a light translucent surface
  return (
    <div className="absolute inset-x-0 top-0 z-40" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0))" }}>
      <div className="[&_header]:!bg-none [&_header]:!bg-transparent [&_*]:!text-slate-700">
        <TopMenu row={0} activePath="/kids" />
      </div>
    </div>
  );
}

function KidsRows({ rows }: { rows: Row[] }) {
  const ctx = useFocusContext();
  const nav = useNavigate();
  const focusedRow = Math.max(1, ctx.pos.row) - 1;
  const ROW_H = 380;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute inset-x-0 top-8 transition-transform duration-300 ease-out"
        style={{ transform: `translateY(-${focusedRow * ROW_H}px)` }}
      >
        {rows.map((r, idx) => (
          <section key={r.title} className="mb-2" style={{ height: ROW_H }}>
            <div
              data-tap-row
              className="flex gap-6 overflow-x-auto overflow-y-visible scrollbar-none px-12 py-6"
              style={{ scrollPaddingInline: "5rem", scrollBehavior: "smooth" }}
            >
              {r.items.map((it, i) => (
                <KidsCard
                  key={it.id}
                  item={it}
                  row={idx + 1}
                  col={i}
                  onSelect={() => nav({ to: "/kids-detail", search: { id: it.id, type: it.mediaType } as any })}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function KidsCard({ item, row, col, onSelect }: { item: TMDBItem; row: number; col: number; onSelect: () => void }) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div className="flex-shrink-0 flex flex-col">
      <div
        ref={ref}
        tabIndex={-1}
        className={[
          "relative rounded-[28px] overflow-hidden transition-all duration-300",
          "w-[560px] h-[320px]",
          focused
            ? "scale-[1.03] ring-4 ring-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
            : "shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
        ].join(" ")}
      >
        {item.backdrop && (
          <img src={item.backdrop} alt={item.title} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        )}
      </div>
      <div
        dir="rtl"
        className={[
          "mt-3 text-right text-sm font-bold text-slate-800/90 truncate transition-opacity",
          focused ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {item.title}
      </div>
    </div>
  );
}
