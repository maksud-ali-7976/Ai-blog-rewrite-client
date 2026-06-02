"use client";
import React, { useEffect } from "react";

import type { PaginationState } from "@tanstack/react-table";

import { Card, CardContent } from "@/components/ui/card";
import { Search, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import GlobalTable from "@/components/global/global.table";
import { coulmn } from "./coulmn";
import useAuditStore, { Audit } from "./audit-log.service";
import { Button } from "@/components/ui/button";

type Props = {};

export type ListTableDataType = Audit;

/**  */
const Table = (props: Props) => {
  const store = useAuditStore();

  const handlePagination = (pagination: PaginationState) => {
    store.actions.paginate({
      page: pagination.pageIndex,
      size: pagination.pageSize,
    });
  };

  useEffect(() => {
    // initial fetch
    store.actions.paginate({ page: store.page, size: store.size });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card className="border-muted/60">
        <CardContent className="space-y-6">
          <div className="grid gap-3 mt-3 lg:grid-cols-[1.6fr_repeat(2,minmax(160px,1fr))_auto]">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                value={""}
                onChange={(event) => { }}
                placeholder={""}
                className="w-full pl-10"
              />
            </div>

          </div>

          <GlobalTable
            data={store.list}
            columns={coulmn}
            showPagination
            manualPagination
            pageCount={store.pages}
            totalCount={store.total}
            paginationState={{ pageIndex: store.page, pageSize: store.size }}
            onPaginationChange={handlePagination}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default Table;
