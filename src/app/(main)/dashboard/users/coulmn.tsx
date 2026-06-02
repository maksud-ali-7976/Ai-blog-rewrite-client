import { createColumnHelper } from "@tanstack/react-table";
import { ListTableDataType } from "./table";
import moment from "moment";
import { useState } from "react";
import useAdminStore from "./users.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const coulmnHelper = createColumnHelper<ListTableDataType>();

export const columns = [
  coulmnHelper.accessor("name", {
    header: "Name",
    cell: ({ row }) => row.original?.name,
  }),

  coulmnHelper.accessor("email", {
    header: "Email",
    cell: ({ row }) => row.original?.email,
  }),

  coulmnHelper.accessor("role", {
    header: "Role",
    cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {row.original?.role?.name}
        </span>
    )
  }),

  coulmnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [confirmOpen, setConfirmOpen] = useState(false);
      const store = useAdminStore();

      const handleDelete = async () => {
        // store.action.delete(row.original._id as any);
      };
      return (
        <div className="flex items-center gap-2">
          <Popover open={confirmOpen} onOpenChange={setConfirmOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className={`hover:bg-red-50`}>
                <Trash className="text-red-600" size={18} />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              side="right"
              className="w-64 rounded-xl shadow-lg"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-full ${"bg-red-100"}`}>
                  <Trash className="text-red-600" size={16} />
                </div>

                {/* Text */}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Delete
                     {row.original.name}?
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant={"outline"}
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
