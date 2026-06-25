import { createFileRoute } from "@tanstack/react-router";
import { CategoryScreen, type CategoryRow } from "@/components/tv/CategoryScreen";
import { tmdb } from "@/lib/tmdb";

export const Route = createFileRoute("/movies")({
  head: () => ({ meta: [{ title: "STAR — סרטים" }] }),
  component: MoviesPage,
});

async function load(): Promise<CategoryRow[]> {
  const [trending, popular, topRated, nowPlaying, action, comedy, drama, thriller, romance, sciFi, israeli, docs] = await Promise.all([
    tmdb.trendingMovies(), tmdb.popularMovies(), tmdb.topRatedMovies(), tmdb.nowPlaying(),
    tmdb.actionMovies(), tmdb.comedyMovies(), tmdb.dramaMovies(), tmdb.thrillerMovies(),
    tmdb.romanceMovies(), tmdb.sciFiMovies(), tmdb.israeliMovies(), tmdb.documentaries(),
  ]);
  return [
    { title: "הסרטים החמים השבוע", items: trending },
    { title: "סרטים פופולריים", items: popular },
    { title: "המדורגים ביותר", items: topRated },
    { title: "בקולנוע עכשיו", items: nowPlaying },
    { title: "אקשן", items: action },
    { title: "קומדיה", items: comedy },
    { title: "דרמה", items: drama },
    { title: "מתח", items: thriller },
    { title: "רומנטיקה", items: romance },
    { title: "מדע בדיוני", items: sciFi },
    { title: "סרטים ישראליים", items: israeli },
    { title: "דוקו", items: docs },
  ];
}

function MoviesPage() {
  // Movies use portrait posters
  return <CategoryScreen activePath="/movies" loader={load} variant="poster" />;
}
