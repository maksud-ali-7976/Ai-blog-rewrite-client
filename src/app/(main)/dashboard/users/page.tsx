"use client";

import React from "react";
import Table from "./table";
import ModalButton from "@/components/modal-view/modal.button";
import GlobalSchemaForm from "@/components/global/form/global-schema-form";
import { AdminSchema } from "./schema";
import useAdminStore from "./users.service";
import { PageHeader } from "../components/PageHeader";

const UsersPage = () => {
  const store = useAdminStore();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="felx items-center justify-between">
        <div>
          <PageHeader title="Admins Page" />
          <p className="text-muted-foreground text-sm mt-3">Manage Admins</p>
        </div>
      </div>
      <ModalButton
        label="Add Admin"
        variant="default"
        view={
          <GlobalSchemaForm
            schema={AdminSchema}
            onSubmitCb={async (data: any, close) => {
              try {
                await store.action.add(data as any);

                close();
              } catch (error) {
                console.error("Error creating template:", error);
              }
            }}
          />
        }
      />
      <Table />
    </div>
  );
};

export default UsersPage;
