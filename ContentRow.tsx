import { useFocusable } from "@/lib/focus";

export type CardData = {
  id: string | number;
  title: string;
  subtitle?: string;
  poster?: string | null;
  backdrop?: string | null;
  gradient?: string;
  badge?: string;
  progress?: number;
};

export function ContentRow<T extends CardData>({
  title, items, row, onSelect, onFocusItem, variant = "wide",
}: {
  title: string;
  items: T[];
  row: number;
  onSelect?: (item: T) => void;
  onFocusItem?: (item: T) => void;
  variant?: "poster" | "wide" | "channel";
}) {
  return (
    <section className="w-full overflow-hidden" style={{ height: 260 }}>
      <h2 className="text-lg font-bold mb-3 text-foreground/95 px-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{title}</h2>
      <div
        data-tap-row
        className="flex gap-3 overflow-x-auto overflow-y-visible scrollbar-none px-10 py-3"
        style={{ scrollPaddingInline: "5rem", scrollBehavior: "smooth" }}
      >
        {items.map((it, i) => (
          <Card
            key={it.id}
            item={it}
            row={row}
            col={i}
            variant={variant}
            onSelect={() => onSelect?.(it)}
            onFocus={() => onFocusItem?.(it)}
          />
        ))}
      </div>
    </section>
  );
}

export function Card({
  item, row, col, variant = "wide", onSelect, onFocus,
}: {
  item: CardData;
  row: number;
  col: number;
  variant?: "poster" | "wide" | "channel";
  onSelect?: () => void;
  onFocus?: () => void;
}) {
  const { ref, focused } = useFocusable({ row, col, onSelect, onFocus });

  const sizes = {
    poster: "w-[150px] h-[225px]",
    wide: "w-[300px] h-[170px]",
    channel: "w-[200px] h-[120px]",
  } as const;

  const src =
    variant === "poster"
      ? item.poster || item.backdrop
      : item.backdrop || item.poster;
  const isUrl = !!src && /^https?:\/\//.test(src);
  const bgFallback = isUrl ? undefined : (src || item.gradient);

  return (
    <div className="flex-shrink-0 flex flex-col items-stretch">
      <div
        ref={ref}
        tabIndex={-1}
        className={[
          "relative rounded-lg overflow-hidden transition-all duration-300 cursor-default bg-card",
          sizes[variant],
          focused
            ? "ring-[3px] ring-white scale-[1.04] shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
            : "shadow-[var(--shadow-card)]",
        ].join(" ")}

        style={bgFallback ? { background: bgFallback } : undefined}
      >
        {isUrl && (
          <img
            src={src!}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        )}
        {item.badge && (
          <div
            className="absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold tracking-wider"
            style={{ background: item.badge === "LIVE" ? "#dc2626" : "var(--gradient-primary)" }}
          >
            {item.badge}
          </div>
        )}
        {item.progress !== undefined && (
          <div className="absolute inset-x-2 bottom-2 h-1 bg-white/20 rounded overflow-hidden z-10">
            <div className="h-full bg-primary rounded" style={{ width: `${item.progress * 100}%` }} />
          </div>
        )}
        {/* Always-visible title overlay, bottom-right RTL */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.9) 100%)",
            paddingTop: 36,
          }}
        >
          <div
            dir="rtl"
            className={[
              "px-3 pb-2 text-right text-white font-bold truncate drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] transition-all duration-200 tracking-tight",
              focused ? "text-[15px]" : "text-[13px] text-white/95",
            ].join(" ")}
          >
            {item.title}
          </div>
        </div>
      </div>
    </div>
  );
}
