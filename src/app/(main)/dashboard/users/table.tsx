import { PaginationState } from "@tanstack/react-table";
import useAdminStore, { UsersData,  } from "./users.service";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlobalTable from "@/components/global/global.table";
import { columns } from "./coulmn";

export type ListTableDataType = UsersData;


const Table = () => {
    const store = useAdminStore();

    const handlePagination = (pagination: PaginationState) => {
        store.action.paginate({ page: pagination.pageIndex, size: pagination.pageSize })
    }

    useEffect(() => {
        store.action.paginate({ page: 0, size: 10 })
    }, [])

    return (
        <>
            <Card className="border-muted/60">
                <CardContent className="space-y-6">
                    <div className="grid gap-3 mt-3 lg:grid-cols-[1.6fr_repeat(2,minmax(160px,1fr))_auto]">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                            <Input
                                value={store.search || ""}
                                onChange={(event) => store.action.paginate({ search: event.target.value })}
                                placeholder={"Search..."}
                                className="w-full pl-10"
                            />
                        </div>

                    </div>

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
                </CardContent>

            </Card>
        </>
    )
}
export default Table