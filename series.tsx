import { createFileRoute } from "@tanstack/react-router";
import { CategoryScreen, type CategoryRow } from "@/components/tv/CategoryScreen";
import { tmdb } from "@/lib/tmdb";

export const Route = createFileRoute("/series")({
  head: () => ({ meta: [{ title: "STAR — סדרות" }] }),
  component: SeriesPage,
});

async function load(): Promise<CategoryRow[]> {
  const [trending, popular, topRated, drama, comedy, crime, sciFi, israeli, airing] = await Promise.all([
    tmdb.trendingTv(), tmdb.popularTv(), tmdb.topRatedTv(),
    tmdb.dramaTv(), tmdb.comedyTv(), tmdb.crimeTv(), tmdb.sciFiTv(),
    tmdb.israeliTv(), tmdb.onTheAir(),
  ]);
  return [
    { title: "הסדרות החמות השבוע", items: trending },
    { title: "סדרות פופולריות", items: popular },
    { title: "הסדרות המדורגות ביותר", items: topRated },
    { title: "דרמה", items: drama },
    { title: "קומדיה", items: comedy },
    { title: "פשע ומתח", items: crime },
    { title: "מדע בדיוני", items: sciFi },
    { title: "ישראלי+", items: israeli },
    { title: "משודרות עכשיו", items: airing },
  ];
}

function SeriesPage() {
  return <CategoryScreen activePath="/series" loader={load} variant="wide" />;
}
