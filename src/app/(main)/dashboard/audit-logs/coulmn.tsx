import { createColumnHelper } from "@tanstack/react-table";
import { ListTableDataType } from "./table";
import ModalButton from "@/components/modal-view/modal.button";
import GlobalSchemaForm from "@/components/global/form/global-schema-form";
import useAuditStore from "./audit-log.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye, Trash, Undo } from "lucide-react";
import Loader from "@/components/ui/loader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";

const coulmnHelper = createColumnHelper<ListTableDataType>();
export const coulmn = [
  coulmnHelper.accessor("admin.name", {
    header: "User Name",
    cell: ({ row }) => row.original?.admin?.name,
  }),

  coulmnHelper.accessor("action", {
    header: "Action",
    cell: ({ row }) => row.original.action,
  }),

  coulmnHelper.accessor("entity", {
    header: "Entity",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs font-medium">
        {row.original.entity}
      </span>
    ),
  }),

  coulmnHelper.accessor("createdAt", {
    header: "TimeStamp",
    cell: ({ row }) =>
      moment(row.original.createdAt).format("DD MMM YYYY h:mm:ss A"),
  }),
];
