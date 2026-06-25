import { createFileRoute } from "@tanstack/react-router";
import { TvShell } from "@/components/tv/TvShell";
import { ContentRow } from "@/components/tv/ContentRow";
import { liveChannels, recommended } from "@/lib/mock-data";

export const Route = createFileRoute("/sports")({
  head: () => ({ meta: [{ title: "STAR — ספורט" }] }),
  component: SportsPage,
});

function SportsPage() {
  return (
    <TvShell activePath="/sports" initialRow={1}>
      <div className="px-16 pt-6 pb-10">
        <h1 className="text-6xl font-black">ספורט</h1>
        <p className="text-lg text-muted-foreground mt-3">כל הליגות, כל המשחקים, בזמן אמת.</p>
      </div>
      <ContentRow title="משחקים חיים עכשיו" items={liveChannels.slice(0, 6)} row={1} variant="wide" />
      <ContentRow title="ערוצי ספורט" items={liveChannels} row={2} variant="channel" />
      <ContentRow title="הדגשים של היום" items={recommended} row={3} />
      <div className="h-24" />
    </TvShell>
  );
}
