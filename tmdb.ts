// TMDB client – Hebrew metadata, Israeli region
const KEY = "fbac2b38b05899557ecab405b11a0695";
const BASE = "https://api.themoviedb.org/3";
const LANG = "he-IL";
const REGION = "IL";

export type TMDBItem = {
  id: number;
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  year?: string;
  rating?: number;
  mediaType: "movie" | "tv";
  badge?: string;
};

const img = (path: string | null | undefined, size: string) =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

async function get(path: string, params: Record<string, string> = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set("api_key", KEY);
  url.searchParams.set("language", LANG);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url.toString());
  if (!r.ok) throw new Error("tmdb " + r.status);
  return r.json();
}

const map = (m: any, mediaType?: "movie" | "tv"): TMDBItem => {
  const mt = mediaType || (m.media_type === "tv" || m.first_air_date ? "tv" : "movie");
  return {
    id: m.id,
    title: m.title || m.name || "",
    overview: m.overview || "",
    poster: img(m.poster_path, "w500"),
    backdrop: img(m.backdrop_path, "original"),
    year: (m.release_date || m.first_air_date || "").slice(0, 4),
    rating: m.vote_average,
    mediaType: mt,
  };
};

const onlyWithImages = (arr: TMDBItem[]) =>
  arr.filter((x) => x.poster && x.backdrop);

async function discoverMovie(params: Record<string, string>) {
  const d = await get("/discover/movie", { sort_by: "popularity.desc", ...params });
  return onlyWithImages(d.results.map((x: any) => map(x, "movie")));
}
async function discoverTv(params: Record<string, string>) {
  const d = await get("/discover/tv", { sort_by: "popularity.desc", ...params });
  return onlyWithImages(d.results.map((x: any) => map(x, "tv")));
}

export const tmdb = {
  trending: () => get("/trending/all/week").then((d) => onlyWithImages(d.results.map((x: any) => map(x)))),
  trendingMovies: () => get("/trending/movie/week").then((d) => onlyWithImages(d.results.map((x: any) => map(x, "movie")))),
  trendingTv: () => get("/trending/tv/week").then((d) => onlyWithImages(d.results.map((x: any) => map(x, "tv")))),
  popularMovies: () => get("/movie/popular", { region: REGION }).then((d) => onlyWithImages(d.results.map((x: any) => map(x, "movie")))),
  topRatedMovies: () => get("/movie/top_rated").then((d) => onlyWithImages(d.results.map((x: any) => map(x, "movie")))),
  nowPlaying: () => get("/movie/now_playing", { region: REGION }).then((d) => onlyWithImages(d.results.map((x: any) => map(x, "movie")))),
  upcoming: () => get("/movie/upcoming", { region: REGION }).then((d) => onlyWithImages(d.results.map((x: any) => map(x, "movie")))),
  popularTv: () => get("/tv/popular").then((d) => onlyWithImages(d.results.map((x: any) => map(x, "tv")))),
  topRatedTv: () => get("/tv/top_rated").then((d) => onlyWithImages(d.results.map((x: any) => map(x, "tv")))),
  airingToday: () => get("/tv/airing_today").then((d) => onlyWithImages(d.results.map((x: any) => map(x, "tv")))),
  onTheAir: () => get("/tv/on_the_air").then((d) => onlyWithImages(d.results.map((x: any) => map(x, "tv")))),

  // Movies by genre
  actionMovies: () => discoverMovie({ with_genres: "28" }),
  comedyMovies: () => discoverMovie({ with_genres: "35" }),
  dramaMovies: () => discoverMovie({ with_genres: "18" }),
  thrillerMovies: () => discoverMovie({ with_genres: "53" }),
  romanceMovies: () => discoverMovie({ with_genres: "10749" }),
  sciFiMovies: () => discoverMovie({ with_genres: "878" }),
  horrorMovies: () => discoverMovie({ with_genres: "27" }),
  israeliMovies: () => discoverMovie({ with_origin_country: "IL" }),
  documentaries: () => discoverMovie({ with_genres: "99" }),

  // TV by genre
  dramaTv: () => discoverTv({ with_genres: "18" }),
  comedyTv: () => discoverTv({ with_genres: "35" }),
  crimeTv: () => discoverTv({ with_genres: "80" }),
  sciFiTv: () => discoverTv({ with_genres: "10765" }),
  realityTv: () => discoverTv({ with_genres: "10764" }),
  israeli: () => discoverTv({ with_origin_country: "IL" }),
  israeliTv: () => discoverTv({ with_origin_country: "IL" }),

  // Kids
  kids: () => discoverMovie({ with_genres: "16,10751" }),
  kidsTv: () => discoverTv({ with_genres: "10762" }),
  animation: () => discoverMovie({ with_genres: "16" }),
  familyMovies: () => discoverMovie({ with_genres: "10751" }),
};


export async function tmdbDetail(type: "movie" | "tv", id: number) {
  const d = await get(`/${type}/${id}`, { append_to_response: "credits,videos,similar" });
  return {
    id: d.id,
    title: d.title || d.name || "",
    overview: d.overview || "",
    poster: img(d.poster_path, "w500"),
    backdrop: img(d.backdrop_path, "original"),
    year: (d.release_date || d.first_air_date || "").slice(0, 4),
    rating: d.vote_average as number,
    runtime: d.runtime || (d.episode_run_time && d.episode_run_time[0]) || null,
    genres: (d.genres || []).map((g: any) => g.name) as string[],
    seasons: d.number_of_seasons || null,
    episodes: d.number_of_episodes || null,
    cast: (d.credits?.cast || []).slice(0, 6).map((c: any) => c.name) as string[],
    director: (d.credits?.crew || []).find((c: any) => c.job === "Director")?.name || null,
    similar: (d.similar?.results || []).filter((x: any) => x.poster_path && x.backdrop_path).slice(0, 10).map((x: any) => map(x, type)),
    mediaType: type,
  };
}
export type TMDBDetail = Awaited<ReturnType<typeof tmdbDetail>>;
