import { useRouter } from "@tanstack/react-router";
import { FocusProvider } from "@/lib/focus";
import { TopMenu } from "./TopMenu";
import type { ReactNode } from "react";

export function TvShell({
  children,
  activePath,
  initialRow = 1,
  resetKey,
  onBack,
}: {
  children: ReactNode;
  activePath: string;
  initialRow?: number;
  resetKey?: string | number;
  onBack?: () => void;
}) {
  const router = useRouter();
  return (
    <FocusProvider
      initial={{ row: initialRow, col: 0 }}
      onBack={onBack ?? (() => router.history.back())}
      resetKey={resetKey ?? activePath}
    >
      <div className="h-screen w-full overflow-hidden relative">
        <TopMenu row={0} activePath={activePath} />
        <main data-tap-main className="absolute inset-0 overflow-hidden">
          {children}
        </main>
      </div>
    </FocusProvider>
  );
}

