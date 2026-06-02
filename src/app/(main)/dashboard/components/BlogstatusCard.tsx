import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function BlogStatusCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "primary" | "muted" | "info" | "success";
  hint?: string;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    muted: "bg-muted text-muted-foreground",
    info: "bg-info/15 text-info",
    success: "bg-success/15 text-success",
  };
  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex size-10 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
