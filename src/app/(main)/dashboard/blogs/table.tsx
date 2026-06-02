import { PaginationState } from "@tanstack/react-table";
import useBlogStore, { Blog, BlogGenStatus, BlogStatus } from "./blog.service";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Globe as GlobeIcon,
  Lock as LockIcon,
  BookDashed,
} from "lucide-react";
import GlobalTable from "@/components/global/global.table";
import { Input } from "@/components/ui/input";
import { columns } from "./column";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useAuditStore from "../audit-logs/audit-log.service";
import useAuthStore, { RoleLevel } from "../../auth/auth.service";

type Props = {};
export type ListTableDataType = Blog;

const Table = (props: Props) => {
  const store = useBlogStore();
  const [status, setStatus] = useState("all");
  const POLL_INTERVAL = 4000;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuthStore();

  const roleLevel = (user?.role as any)?.level;
  const isSuperAdmin = user?.super_admin;

  const handlePagination = (pagination: PaginationState) => {
    store.actions.paginate({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    });
  };

  useEffect(() => {
    store.actions.paginate({ page: 0, size: 10, status: status });
  }, [status]);

  useEffect(() => {
    const hasProcessing = store.list?.some(
      (b) =>
        b.gen_status === BlogGenStatus.QUEUED ||
        b.gen_status === BlogGenStatus.SCRAPING ||
        b.gen_status === BlogGenStatus.PROCESSING ||
        b.gen_status === BlogGenStatus.IMAGE_GENERATING,
    );

    if (!hasProcessing) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current) return;

    const poll = async () => {
      await store.actions.paginate({
        page: store.page,
        size: store.size,
        status,
      });
    };

    poll();

    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [store.list, store.page, store.size, status]);
  useEffect(() => {
    if (roleLevel === RoleLevel.L3) {
      store.actions.paginate({
        page: 0,
        size: 10,
        status: BlogStatus.REVIEWED,
      });
    }
  }, [roleLevel]);
  return (
    <>
      <Card className="border-muted/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/30 border-b border-muted/50">
            <div className="relative w-full md:max-w-md">
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                value={""}
                onChange={(event) => { }}
                placeholder="Search templates..."
                className="w-full pl-10 bg-background/50 border-muted-foreground/20 focus:border-primary/50 transition-all"
              />
            </div>

            {!(roleLevel === RoleLevel.L3 && !isSuperAdmin) && (
              <div className="w-full md:w-[220px]">
                <Select
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value);

                    store.actions.paginate({
                      page: 0,
                      size: 10,
                      status: value,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>

                  <SelectContent>
                    {isSuperAdmin && (
                      <>
                        <SelectItem value="all">All Statuses</SelectItem>

                        {Object.values(BlogStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </>
                    )}

                    {!isSuperAdmin && roleLevel === RoleLevel.L2 && (
                      <>
                        <SelectItem value="all">All Statuses</SelectItem>

                        <SelectItem value={BlogStatus.DRAFT}>
                          Draft
                        </SelectItem>

                        <SelectItem value={BlogStatus.REVIEWED}>
                          Reviewed
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="p-0">
            <GlobalTable
              data={store.list}
              columns={columns}
              showPagination
              manualPagination
              pageCount={store.pages}
              totalCount={store.total}
              paginationState={{ pageIndex: store.page, pageSize: store.size }}
              onPaginationChange={handlePagination}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Table;
