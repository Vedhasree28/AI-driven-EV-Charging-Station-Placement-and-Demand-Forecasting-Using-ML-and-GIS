import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Route not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page isn't part of the EV control center.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error("[Root Error Boundary]", error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >Try again</button>
          <a href="/" className="rounded-md border border-input px-4 py-2 text-sm font-medium">Go home</a>
        </div>
      </div>
    </div>
  );
}

const RootErrorComponent = lazy(() => Promise.resolve({ default: ErrorComponent }));

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VoltGrid AI — Smart EV Charging Placement & Demand Forecasting" },
      { name: "description", content: "AI + GIS platform for EV charging station placement, demand forecasting, and Smart City coverage optimization." },
      { name: "author", content: "VoltGrid AI" },
      { property: "og:title", content: "VoltGrid AI — Smart EV Charging Platform" },
      { property: "og:description", content: "AI-driven EV charging station placement and demand forecasting with interactive GIS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg?v=3", type: "image/svg+xml" },
      { rel: "alternate icon", href: "/favicon.ico?v=3", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var s = localStorage.getItem('voltgrid-theme');
                var d = s ? s === 'dark' : true;
                if (d) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur transition-colors">
              <SidebarTrigger />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[color:var(--color-success)]" />
                Live · India grid
              </div>
              <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                <div className="hidden items-center gap-2 sm:flex">
                  <span>Model: <span className="text-primary font-medium">XGBoost</span></span>
                  <span>·</span>
                  <span>R² <span className="text-foreground font-medium">0.943</span></span>
                </div>
                <ThemeToggle />
              </div>
            </header>
            <main className="min-w-0 flex-1">
              <Outlet />
            </main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
