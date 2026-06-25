import { createFileRoute } from "@tanstack/react-router";
import { TvShell } from "@/components/tv/TvShell";
import { ContentRow } from "@/components/tv/ContentRow";
import { useFocusable } from "@/lib/focus";
import { recommended } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "STAR — חיפוש" }] }),
  component: SearchPage,
});

const keys = "אבגדהוזחטיכלמנסעפצקרשת".split("");

function SearchPage() {
  const [query, setQuery] = useState("");
  return (
    <TvShell activePath="/search" initialRow={1}>
      <div className="px-16 pt-6">
        <h1 className="text-5xl font-black mb-6">חיפוש</h1>
        <div className="glass-strong rounded-2xl px-8 py-6 text-3xl font-medium min-h-[80px] mb-8">
          {query || <span className="text-muted-foreground">הקלידו לחיפוש סדרות, סרטים, ערוצים…</span>}
        </div>

        {/* Virtual keyboard */}
        <div className="glass rounded-3xl p-6 mb-10">
          <div className="grid grid-cols-11 gap-2">
            {keys.map((k, i) => (
              <Key key={k} char={k} row={1} col={i} onSelect={() => setQuery((q) => q + k)} />
            ))}
            <Key char="␣" row={2} col={0} wide onSelect={() => setQuery((q) => q + " ")} />
            <Key char="⌫" row={2} col={1} wide onSelect={() => setQuery((q) => q.slice(0, -1))} />
            <Key char="נקה" row={2} col={2} wide onSelect={() => setQuery("")} />
          </div>
        </div>
      </div>

      <ContentRow title="חיפושים אחרונים" items={recommended.slice(0, 8)} row={3} />
      <ContentRow title="פופולרי כעת" items={recommended.slice(2, 10)} row={4} />
      <div className="h-24" />
    </TvShell>
  );
}

function Key({ char, row, col, wide, onSelect }: { char: string; row: number; col: number; wide?: boolean; onSelect: () => void }) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div ref={ref} tabIndex={-1}
      className={[
        "h-16 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-150 cursor-default",
        wide ? "text-base" : "",
        focused ? "bg-white text-background scale-110 focus-glow-sm" : "bg-white/10 text-foreground",
      ].join(" ")}>
      {char}
    </div>
  );
}
