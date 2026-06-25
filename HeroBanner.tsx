import type { TMDBItem } from "@/lib/tmdb";

export function HeroBanner({ item }: { item: TMDBItem | null }) {
  if (!item) {
    return <section className="absolute inset-0 bg-card animate-pulse" />;
  }
  return (
    <section
      key={item.id}
      className="absolute inset-0 overflow-hidden"
    >
      {item.backdrop && (
        <img
          key={item.backdrop}
          src={item.backdrop}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover animate-tap-fade-up"
          draggable={false}
        />
      )}
      {/* Bottom fade so dock area is dark and readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.06 0.015 260 / 0.45) 0%, transparent 25%, oklch(0.08 0.02 260 / 0.35) 55%, oklch(0.06 0.015 260 / 0.9) 78%, oklch(0.05 0.012 260) 100%)",
        }}
      />
      {/* RTL side fade so text on the right is readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(270deg, transparent 35%, oklch(0.06 0.015 260 / 0.55) 75%, oklch(0.05 0.012 260 / 0.95) 100%)",
        }}
      />

      <div
        key={"text-" + item.id}
        className="absolute top-0 right-0 h-full flex flex-col justify-center animate-tap-fade-up"
        style={{ paddingInlineEnd: "4rem", paddingInlineStart: "4rem", paddingBottom: 360, paddingTop: 140, width: "52%" }}
      >
        <div className="text-right" dir="rtl">
          <div
            className="text-xs font-bold tracking-[0.2em] mb-4 text-white/80"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
          >
            {item.mediaType === "tv" ? "סדרה" : "סרט"}
            {item.year ? ` · ${item.year}` : ""}
            {item.rating ? ` · ★ ${item.rating.toFixed(1)}` : ""}
          </div>
          <h1
            className="text-7xl font-black mb-5 leading-[1.02] text-white"
            style={{ textShadow: "0 4px 28px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.8)" }}
          >
            {item.title}
          </h1>
          <p
            className="text-lg text-white/95 leading-relaxed line-clamp-3"
            style={{ textShadow: "0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.8)" }}
          >
            {item.overview}
          </p>
        </div>
      </div>

    </section>
  );
}

