import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CategoryScreen, type CategoryRow } from "@/components/tv/CategoryScreen";
import { tmdb } from "@/lib/tmdb";
import { KAN11_M3U8 } from "@/lib/channels";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STAR — בית" },
      { name: "description", content: "מסך הבית של STAR — סדרות, סרטים, ילדים וערוצים חיים." },
    ],
  }),
  component: HomePage,
});

async function load(): Promise<CategoryRow[]> {
  const [trending, israeli, popTv, topTv, popMov, topMov, kids, docs] = await Promise.all([
    tmdb.trending(), tmdb.israeli(), tmdb.popularTv(), tmdb.topRatedTv(),
    tmdb.popularMovies(), tmdb.topRatedMovies(), tmdb.kids(), tmdb.documentaries(),
  ]);
  return [
    { title: "הכי חדשים", items: trending },
    { title: "סדרה ישראלית חדשה", items: israeli },
    { title: "סדרות פופולריות", items: popTv },
    { title: "הסדרות המדורגות ביותר", items: topTv },
    { title: "סרטים פופולריים", items: popMov },
    { title: "הסרטים המדורגים ביותר", items: topMov },
    { title: "ילדים ונוער", items: kids },
    { title: "דוקו", items: docs },
  ];
}

function HomePage() {
  const nav = useNavigate();
  // Exit on home → open Kan 11 live channel
  return (
    <CategoryScreen
      activePath="/"
      loader={load}
      variant="wide"
      onBack={() => nav({ to: "/player", search: { src: KAN11_M3U8, title: "כאן 11" } as any })}
    />
  );
}
