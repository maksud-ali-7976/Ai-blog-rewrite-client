import { createColumnHelper } from "@tanstack/react-table";
import { ListTableDataType } from "./table";
import useBlogStore, { BlogGenStatus, BlogStatus } from "./blog.service";
import { PlusCircle, Eye, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import moment from "moment";
import { StatusBadge } from "../components/StatusBadge";
import { GenStatusBadge } from "../components/BlogGenStatusBadge";

const columnHelper = createColumnHelper<ListTableDataType>();

export const columns = [
  columnHelper.accessor("cover_image", {
    header: "Preview",
    cell: ({ row }) => {
      const [loaded, setLoaded] = useState(false);

      return (
        <div className="relative w-14 h-14">
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-muted rounded-xl" />
          )}

          {row.original.cover_image ? (
            <img
              src={row.original.cover_image}
              alt={row.original.original_title}
              onLoad={() => setLoaded(true)}
              className={`w-14 h-14 rounded-xl object-cover border-2 border-transparent group-hover:border-primary/50 transition-all shadow-sm group-hover:shadow-md duration-300 ${loaded ? "opacity-100" : "opacity-0"
                }`}
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center" />
          )}

          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
        </div>
      );
    },
    enableSorting: false,
  }),

  columnHelper.accessor("original_title", {
    header: "Title",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-foreground/90 hover:text-primary transition-colors cursor-pointer">
          {row.original.original_title}
        </span>

        <span className="text-xs text-muted-foreground truncate max-w-[250px]">
          {row.original.rewrite_title}
        </span>
      </div>
    ),
    enableSorting: false,
  }),

  columnHelper.accessor("author", {
    header: "Author",
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-[11px] font-medium uppercase tracking-wider hover:scale-105 transition-transform">
        {row.original.author}
      </span>
    ),
    enableSorting: false,
  }),

  columnHelper.accessor("source", {
    header: "Source",
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-[11px] font-medium uppercase tracking-wider hover:scale-105 transition-transform">
        {row.original.source}
      </span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("status", {
    header: "Staus",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status as BlogStatus} />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="capitalize">
          {moment(row.original.createdAt).format("MMM DD, YYYY")}
        </span>
      </div>
    ),
    enableSorting: false,
  }),

  columnHelper.accessor("gen_status", {
    header: "Gen Status",
    cell: ({ row }) => {
      const status = row.original.gen_status as BlogGenStatus;

      if (
        status === BlogGenStatus.QUEUED ||
        status === BlogGenStatus.SCRAPING
      ) {
        return (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
            </span>
            <span className="text-yellow-600 text-sm font-medium">
              {status}
            </span>
          </div>
        );
      }

      return <GenStatusBadge status={status} />;
    },
    enableSorting: false,
  }),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [confirmOpen, setConfirmOpen] = useState(false);
      const router = useRouter();
      const store = useBlogStore();

      const handleDelete = async () => {
        store.actions.delete(row.original._id as any);
      };

      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/blogs/${row.original._id}`}>
            <Button
              onClick={() => {
                router.push(`/dashboard/blogs/${row.original._id}`);
              }}
              variant="secondary"
              size="sm"
              className="h-8 px-3 gap-1.5 font-medium transition-all hover:bg-primary hover:text-primary-foreground"
            >
              <Eye className="size-3.5" />
              Manage
            </Button>
          </Link>

          <Popover open={confirmOpen} onOpenChange={setConfirmOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-50 transition-colors"
              >
                <Trash className="text-red-600" size={18} />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              side="right"
              className="w-64 rounded-xl shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <Trash className="text-red-600" size={16} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Delete{" "}
                    <span className="text-red-600">
                      {row.original.rewrite_title ||
                        row.original.original_title}
                    </span>
                    ?
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={store.loading}
                  onClick={async () => {
                    await handleDelete();
                    setConfirmOpen(false);
                  }}
                  className="gap-1"
                >
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  }),
];
