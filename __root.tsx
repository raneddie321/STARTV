import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center glass-strong rounded-3xl p-16">
        <h1 className="text-7xl font-black">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">המסך לא נמצא</p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center glass-strong rounded-3xl p-16 max-w-xl">
        <h1 className="text-3xl font-bold">שגיאה בטעינת המסך</h1>
        <p className="mt-3 text-muted-foreground">משהו השתבש. נסה שוב.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
        >נסה שוב</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "STAR — Smart TV" },
      { name: "description", content: "STAR — חוויית טלוויזיה חכמה בעברית" },
      { property: "og:title", content: "STAR — Smart TV" },
      { name: "twitter:title", content: "STAR — Smart TV" },
      { property: "og:description", content: "STAR — חוויית טלוויזיה חכמה בעברית" },
      { name: "twitter:description", content: "STAR — חוויית טלוויזיה חכמה בעברית" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6385610c-554c-4819-8602-01fd3dc27eab/id-preview-7f88a782--4b0b3db0-90b3-4f62-b82e-0df18e2b1258.lovable.app-1782041777647.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6385610c-554c-4819-8602-01fd3dc27eab/id-preview-7f88a782--4b0b3db0-90b3-4f62-b82e-0df18e2b1258.lovable.app-1782041777647.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
