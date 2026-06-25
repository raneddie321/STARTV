import { createFileRoute } from "@tanstack/react-router";
import { TvShell } from "@/components/tv/TvShell";
import { useFocusable } from "@/lib/focus";
import { useState } from "react";
import { Volume2 } from "lucide-react";

export const Route = createFileRoute("/find-me")({
  head: () => ({ meta: [{ title: "STAR — Find Me" }] }),
  component: FindMePage,
});

function FindMePage() {
  const [ringing, setRinging] = useState(false);
  return (
    <TvShell activePath="/" initialRow={1} resetKey="findme">
      <div className="flex flex-col items-center justify-center text-center px-16 pt-10">
        <div className={[
          "w-72 h-72 rounded-full flex items-center justify-center mb-10 transition-all duration-500",
          ringing ? "animate-tap-pulse-glow" : "",
        ].join(" ")}
          style={{ background: "var(--gradient-primary)" }}>
          <Volume2 className="w-32 h-32" />
        </div>
        <h1 className="text-5xl font-black mb-3">Find Me — איתור שלט</h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-10">
          איבדתם את השלט? לחצו על הכפתור כדי שהשלט ישמיע צליל ויהבהב במשך 30 שניות.
        </p>

        <BigBtn row={1} col={0} active={ringing} onSelect={() => setRinging((r) => !r)}>
          {ringing ? "הפסק צלצול" : "הפעל צלצול"}
        </BigBtn>
      </div>
    </TvShell>
  );
}

function BigBtn({ row, col, children, active, onSelect }: any) {
  const { ref, focused } = useFocusable({ row, col, onSelect });
  return (
    <div ref={ref} tabIndex={-1}
      className={[
        "px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-200 cursor-default",
        active ? "bg-red-500 text-white" : "bg-white text-background",
        focused ? "focus-glow-sm scale-105" : "",
      ].join(" ")}>
      {children}
    </div>
  );
}
