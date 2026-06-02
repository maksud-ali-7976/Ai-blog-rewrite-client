import { create } from "zustand";
import { combine } from "zustand/middleware";
import { AdminData } from "@/open-api-client/admin/models";
import { AdminService } from "@/open-api-client/index";
import { AsyncCall } from "@/lib/utils";
import { toast } from "sonner";
import { Search } from "lucide-react";

export type UsersData = AdminData["responses"]["AdminList"]["data"][0];

let timeOut: any;

const useAdminStore = create(
  combine(
    {
      loading: false,
      id: null as any,
      list: [] as UsersData[],
      total: 0,
      pages: 0,
      page: 0,
      size: 10,
      search: "" as null | string,
    },
    (set, get) => ({
      action: {
        list: async () => {
          let { page, size, search } = get();
          try {
            const request = await AsyncCall(
              AdminService.adminList({
                query: {
                  page: page.toString(),
                  size: size.toString(),
                  ...(search && { search: search }),
                },
              }),
              false,
            );

            set({
              list: request.data,
              total: request.meta?.total,
              pages: request?.meta?.pages,
            });
            return request;
          } catch (error: any) {
            toast.error(error.message || "Error in Fetching List");
          }
        },
        paginate: ({
          page,
          search,
          size,
        }: {
          page?: number;
          size?: number;
          search?: string;
        }) => {
          set({ search: search || "" });
          clearTimeout(timeOut);
          const init = () => {
            set((prev) => ({
              ...prev,
              page: page ?? prev.page,
              size: size ?? prev.size,
              search: search ?? prev.search,
            }));

            useAdminStore.getState().action.list();
          };
          if (search) {
            timeOut = setTimeout(() => {
              init();
            });
            set({ search: search });
          }

          init();
        },
        add: async (
          payload: AdminData["payloads"]["AdminCreate"]["requestBody"],
        ) => {
          try {
            const req = await AsyncCall(
              AdminService.adminCreate({
                requestBody: payload,
              }),
            );
            useAdminStore.getState().action.paginate({});
            return req;
          } catch (error: any) {
            toast.error(error.messsage || "Error in Adding Admin");
          }
        },
      },
    }),
  ),
);

export default useAdminStore;
