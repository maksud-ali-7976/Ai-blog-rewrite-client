import { cn } from "@/lib/utils";
import { BlogGenStatus } from "../blogs/blog.service";

const styles: Record<string, string> = {
  QUEUED: "bg-muted text-muted-foreground",
  SCRAPING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  IMAGE_GENERATING: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};

export function GenStatusBadge({
  status,
  className,
}: {
  status: BlogGenStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[status],
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}