import { create } from "zustand";
import { combine } from "zustand/middleware";
import { AuditData } from "@/open-api-client/admin/models";
import { AuditService } from "@/open-api-client/index";
import { AsyncCall } from "@/lib/utils";
import { toast } from "sonner";
import { User } from "../../auth/auth.service";

export type Audit = AuditData["responses"]["AuditList"]["data"][0];

let timeOut: any;

const useAuditStore = create(
  combine(
    {
      loading: false,
      id: null as any,
      list: [] as Audit[],
      total: 0,
      pages: 0,
      page: 0,
      size: 10,
      search: "" as null | string,
      deleted: false,
      detail: {} as Audit,
    },
    (set, get) => ({
      actions: {
        list: async () => {
          let { page, size } = get();
          set({ loading: true });
          try {
            const request = await AsyncCall(
              AuditService.auditList({
                query: {
                  page: page.toString(),
                  size: size.toString(),
                },
              }),
              false,
            );

            set({
              list: request.data,
              total: request.meta.total,
              pages: request.meta.pages,
            });
            return request;
          } finally {
            set({ loading: false });
          }
        },
        paginate: async ({
          page,

          size,
        }: {
          page?: number;
          size?: number;
        }) => {
          clearTimeout(timeOut);

          const init = () => {
            set((prev) => ({
              ...prev,
              page: page ?? prev.page,
              size: size ?? prev.size,
            }));
            useAuditStore.getState().actions.list();
          };

          init();
        },
        select: (id: any) => set({ id: id }),
      },
    }),
  ),
);

export default useAuditStore;
