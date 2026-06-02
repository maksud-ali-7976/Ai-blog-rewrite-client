"use client";

import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    PaginationState,
} from "@tanstack/react-table";

import { useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

interface GlobalTableProps<T> {
    data: T[];
    columns: ColumnDef<T, any>[];

    showPagination?: boolean;
    manualPagination?: boolean;

    pageCount?: number;
    totalCount?: number;

    paginationState?: { pageIndex: number; pageSize: number };
    onPaginationChange?: (pagination: {
        pageIndex: number;
        pageSize: number;
    }) => void;
}

/* ---------------- COMPONENT ---------------- */

export default function GlobalTable<T>({
    data,
    columns,
    showPagination = false,
    manualPagination = false,
    pageCount: externalPageCount,
    totalCount,
    paginationState: externalPagination,
    onPaginationChange,
}: GlobalTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);

    const [internalPagination, setInternalPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    /* ---------------- PAGINATION ---------------- */

    const pagination = externalPagination ?? internalPagination;

    const handlePaginationChange = (updater: any) => {
        const next =
            typeof updater === "function"
                ? updater(pagination)
                : updater;

        if (onPaginationChange) {
            onPaginationChange(next);
        } else {
            setInternalPagination(next);
        }
    };

    /* ---------------- TABLE ---------------- */

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: handlePaginationChange,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        ...(manualPagination
            ? {
                manualPagination: true,
                pageCount: externalPageCount ?? -1,
            }
            : {
                getPaginationRowModel: getPaginationRowModel(),
            }),
    });

    /* ---------------- META ---------------- */

    const total = totalCount ?? data.length;
    const start = pagination.pageIndex * pagination.pageSize + 1;
    const end = Math.min(start + pagination.pageSize - 1, total);

    /* ---------------- UI ---------------- */

    return (
        <div className="space-y-4">
            {/* TABLE */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="cursor-pointer select-none"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                        {header.column.getIsSorted() === "asc" && " ↑"}
                                        {header.column.getIsSorted() === "desc" && " ↓"}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="animate-fade-in">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}
            {showPagination && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {total > 0 ? start : 0} to {end} of {total}
                    </p>

                    <div className="flex items-center gap-2">
                        {/* PAGE SIZE */}
                        <Select
                            value={String(pagination.pageSize)}
                            onValueChange={(v) =>
                                handlePaginationChange({
                                    pageIndex: 0,
                                    pageSize: Number(v),
                                })
                            }
                        >
                            <SelectTrigger className="w-[80px] h-8">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {[5, 10, 20, 50].map((s) => (
                                    <SelectItem key={s} value={String(s)}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* CONTROLS */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                            Page {pagination.pageIndex + 1} of{" "}
                            {table.getPageCount() || 1}
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
