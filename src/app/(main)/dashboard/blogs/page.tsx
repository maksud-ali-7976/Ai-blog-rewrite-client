"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useModal } from "@/components/modal-view/use-modal";
import GlobalSchemaForm from "@/components/global/form/global-schema-form";
import ModalButton from "@/components/modal-view/modal.button";
import GlobalTable from "@/components/global/global.table";
import useBlogStore from "./blog.service";
import Table from "./table";
import { BlogSchema } from "./schema";
import { useRouter } from "next/navigation";
export default function BlogsPage() {
  const store = useBlogStore();
  const router = useRouter()
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground text-sm">Manage Blogs</p>
        </div>
        <ModalButton
          label="Add Blog Url"
          variant="default"
          view={
            <GlobalSchemaForm
              schema={BlogSchema}
              onSubmitCb={async (data: any, close) => {
                const req = await store.actions.add(data);

                if (req?.status) {
                  router.push(`/dashboard/blogs/${req?.data?._id}`)
                }
              }}
            />
          }
        />
      </div>
      <Table />
    </div>
  );
}
