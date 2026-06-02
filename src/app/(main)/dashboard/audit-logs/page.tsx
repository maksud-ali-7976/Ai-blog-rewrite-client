"use client";
import ModalButton from "@/components/modal-view/modal.button";
import React from "react";
import Table from "./table";
import GlobalSchemaForm from "@/components/global/form/global-schema-form";
import { CategorySchema } from "./schema";
import useAuditStore from "./audit-log.service";
import { PageHeader } from "../components/PageHeader";

const Categorypage = () => {
  const store = useAuditStore();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex  items-center justify-between">
        <div>
          <PageHeader
            title="Audit Logs"
            description="See  Your Apps All Activity Audit Logs"
          />
        </div>
      </div>
      <Table />
    </div>
  );
};

export default Categorypage;
