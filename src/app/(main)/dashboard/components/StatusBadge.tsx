import { cn } from "@/lib/utils";
import { BlogStatus } from "../blogs/blog.service";

const styles: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground border-border",
  REVIEWED: "bg-info/15 text-info border-info/30",
  PUBLISHED: "bg-success/15 text-success border-success/30",
};

export function StatusBadge({ status, className }: { status: BlogStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
