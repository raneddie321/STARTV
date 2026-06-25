import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";

type Pos = { row: number; col: number };
type Item = {
  row: number;
  col: number;
  el: HTMLElement;
  onSelect?: () => void;
  onFocus?: () => void;
};

type Ctx = {
  pos: Pos;
  register: (item: Item) => () => void;
  setPos: (p: Pos) => void;
  isFocused: (row: number, col: number) => boolean;
};

const FocusCtx = createContext<Ctx | null>(null);

function scrollToFocused(el: HTMLElement) {
  // Horizontal: scroll the nearest row container
  const row = el.closest<HTMLElement>("[data-tap-row]");
  if (row) {
    const rRect = row.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const offset = (eRect.left + eRect.width / 2) - (rRect.left + rRect.width / 2);
    row.scrollBy({ left: offset, behavior: "smooth" });
  }
  // Vertical: scroll the main scroll container
  const main = el.closest<HTMLElement>("[data-tap-main]");
  if (main) {
    const mRect = main.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    // Keep focused element vertically centered with some bias
    const target = (eRect.top + eRect.height / 2) - (mRect.top + mRect.height / 2);
    main.scrollBy({ top: target, behavior: "smooth" });
  }
}

export function FocusProvider({
  children,
  initial = { row: 0, col: 0 },
  onBack,
  resetKey,
}: {
  children: ReactNode;
  initial?: Pos;
  onBack?: () => void;
  resetKey?: string | number;
}) {
  const [pos, setPosState] = useState<Pos>(initial);
  const itemsRef = useRef<Item[]>([]);
  const posRef = useRef(pos);
  posRef.current = pos;

  // Reset when route changes
  useEffect(() => {
    setPosState(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const register = useCallback((item: Item) => {
    itemsRef.current.push(item);
    queueMicrotask(() => {
      const p = posRef.current;
      if (item.row === p.row && item.col === p.col) {
        item.el.focus({ preventScroll: true });
        item.onFocus?.();
        scrollToFocused(item.el);
      }
    });
    return () => {
      itemsRef.current = itemsRef.current.filter((i) => i !== item);
    };
  }, []);

  const setPos = useCallback((p: Pos) => setPosState(p), []);

  useEffect(() => {
    const match = itemsRef.current.find((i) => i.row === pos.row && i.col === pos.col);
    if (match) {
      match.el.focus({ preventScroll: true });
      match.onFocus?.();
      scrollToFocused(match.el);
    }
  }, [pos]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const items = itemsRef.current;
      if (!items.length) return;
      const p = posRef.current;
      const key = e.key;

      const rowsSet = Array.from(new Set(items.map((i) => i.row))).sort((a, b) => a - b);
      const rowCols = (row: number) =>
        items.filter((i) => i.row === row).map((i) => i.col).sort((a, b) => a - b);

      const clampCol = (row: number, desiredCol: number) => {
        const cols = rowCols(row);
        if (!cols.length) return desiredCol;
        // pick closest
        return cols.reduce((best, c) =>
          Math.abs(c - desiredCol) < Math.abs(best - desiredCol) ? c : best
        , cols[0]);
      };

      if (key === "ArrowUp" || key === "ArrowDown") {
        e.preventDefault();
        const idx = rowsSet.indexOf(p.row);
        const nextIdx = key === "ArrowUp" ? idx - 1 : idx + 1;
        if (nextIdx < 0 || nextIdx >= rowsSet.length) return;
        const nextRow = rowsSet[nextIdx];
        setPosState({ row: nextRow, col: clampCol(nextRow, p.col) });
      } else if (key === "ArrowRight" || key === "ArrowLeft") {
        // RTL: Right arrow goes to LOWER column index (visually right in RTL = earlier item)
        // Actually for an RTL row, the first item (col=0) is on the RIGHT.
        // So ArrowRight should DECREASE col, ArrowLeft should INCREASE col.
        e.preventDefault();
        const cols = rowCols(p.row);
        if (!cols.length) return;
        const curIdx = cols.indexOf(p.col);
        const delta = key === "ArrowRight" ? -1 : 1;
        const nextIdx = curIdx + delta;
        if (nextIdx < 0 || nextIdx >= cols.length) return;
        setPosState({ row: p.row, col: cols[nextIdx] });
      } else if (key === "Enter" || key === " ") {
        e.preventDefault();
        const match = items.find((i) => i.row === p.row && i.col === p.col);
        match?.onSelect?.();
      } else if (key === "Escape" || key === "Backspace") {
        e.preventDefault();
        onBack?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onBack]);

  const isFocused = useCallback(
    (row: number, col: number) => pos.row === row && pos.col === col,
    [pos]
  );

  return (
    <FocusCtx.Provider value={{ pos, register, setPos, isFocused }}>
      {children}
    </FocusCtx.Provider>
  );
}

export function useFocusable({
  row,
  col,
  onSelect,
  onFocus,
}: {
  row: number;
  col: number;
  onSelect?: () => void;
  onFocus?: () => void;
}) {
  const ctx = useContext(FocusCtx);
  if (!ctx) throw new Error("useFocusable must be inside FocusProvider");
  const ref = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  const onFocusRef = useRef(onFocus);
  onSelectRef.current = onSelect;
  onFocusRef.current = onFocus;

  useEffect(() => {
    if (!ref.current) return;
    return ctx.register({
      row,
      col,
      el: ref.current,
      onSelect: () => onSelectRef.current?.(),
      onFocus: () => onFocusRef.current?.(),
    });
  }, [row, col, ctx]);

  return {
    ref,
    focused: ctx.isFocused(row, col),
    tabIndex: -1,
  };
}

export function useFocusContext() {
  const c = useContext(FocusCtx);
  if (!c) throw new Error("no focus ctx");
  return c;
}
