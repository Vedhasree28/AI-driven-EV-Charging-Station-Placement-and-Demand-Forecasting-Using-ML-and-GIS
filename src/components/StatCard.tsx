import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "accent" | "info" | "warning" | "success";
}) {
  const ring: Record<string, string> = {
    primary: "text-primary bg-primary/10 ring-primary/30",
    accent: "text-accent bg-accent/10 ring-accent/30",
    info: "text-[color:var(--color-info)] bg-[color:var(--color-info)]/10 ring-[color:var(--color-info)]/30",
    warning: "text-[color:var(--color-warning)] bg-[color:var(--color-warning)]/10 ring-[color:var(--color-warning)]/30",
    success: "text-[color:var(--color-success)] bg-[color:var(--color-success)]/10 ring-[color:var(--color-success)]/30",
  };
  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-lg ring-1", ring[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
