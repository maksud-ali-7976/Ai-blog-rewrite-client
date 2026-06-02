import { create } from "zustand";
import { combine } from "zustand/middleware";
import { BlogsData } from "@/open-api-client/admin/models";
import { BlogsService } from "@/open-api-client/index";
import { AsyncCall } from "@/lib/utils";
import { toast } from "sonner";
import { tr } from "zod/v4/locales";

export enum BlogStatus {
  DRAFT = "DRAFT",
  REVIEWED = "REVIEWED",
  PUBLISHED = "PUBLISHED",
}

export enum BlogGenStatus {
  QUEUED = "QUEUED",
  SCRAPING = "SCRAPING",
  PROCESSING = "PROCESSING",
  IMAGE_GENERATING = "IMAGE_GENERATING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export type Blog = BlogsData["responses"]["BlogList"]["data"][0];

let timeOut: any;

const useBlogStore = create(
  combine(
    {
      loading: true,
      id: null as any,
      list: [] as Blog[],
      total: 0,
      pages: 0,
      page: 0,
      size: 10,
      detail: null as Blog | null,
      status: null as string | null,
    },
    (set, get) => ({
      actions: {
        list: async () => {
          let { page, size, status } = get();
          set({ loading: true });
          try {
            const request = await AsyncCall(
              BlogsService.blogList({
                query: {
                  page: page.toString(),
                  size: size.toString(),
                  ...(status && { status: status }),
                },
              }),
              false,
            );
            set({
              list: request.data,
              total: request.meta.total,
              pages: request.meta.pages,
            });
          } finally {
            set({ loading: false });
          }
        },
        paginate: ({
          page,
          size,
          status,
        }: {
          page?: number;
          size?: number;
          status?: string;
        }) => {
          const init = () => {
            set((prev) => ({
              ...prev,
              page: page !== undefined ? page : prev.page,
              size: size !== undefined ? size : prev.size,
              status: status ?? prev.status,
            }));
            useBlogStore.getState().actions.list();
          };

          init();
        },
        select: (id: null | string) => set({ id: id }),
        detail: async (id: string) => {
          set({ loading: true });

          try {
            const request = await AsyncCall(
              BlogsService.blogDetail({
                query: {
                  id: id,
                },
              }),
              false,
            );
            set({ detail: request.data as any });
            return request;
          } catch (error: any) {
            toast.error(error?.message || "failed to fetch template detail");
          } finally {
            set({ loading: false });
          }
        },
        delete: async (id: string) => {
          set({ loading: true });
          try {
            const req = await AsyncCall(
              BlogsService.blogDelete({
                query: {
                  id: id,
                },
              }),
            );

            useBlogStore.getState().actions.paginate({});
            return req
          } catch (error: any) {
            toast.error(error?.message || "failed to delete blog");
          } finally {
            set({ loading: false });
          }
        },
        add: async (payload: any) => {
          set({ loading: true });
          let { id } = get();
          try {
            const request = await AsyncCall(
              BlogsService.blogCreate({
                requestBody: payload,
              }),
            );
            useBlogStore.getState().actions.paginate({});
            return request;
          } catch (error: any) {
            toast.error(error?.message || "failed to create template");
          } finally {
            set({ loading: false });
          }
        },
        publish: async (payload: any) => {
          let { id } = get();
          set({ loading: true });
          try {
            const req = await AsyncCall(
              BlogsService.blogPublish({
                query: {
                  id: id,
                },
                requestBody: { status: payload },
              }),
            );
            useBlogStore.getState().actions.paginate({});
            if (id) {
              useBlogStore.getState().actions.detail(id);
            }
            return req;
          } catch (error: any) {
            toast.error(error?.message || "faild to Publish");
          } finally {
            set({ loading: false });
          }
        },
        reviewed: async (payload: any) => {
          let { id } = get();
          set({ loading: true });
          try {
            const req = await AsyncCall(
              BlogsService.blogReviewed({
                query: {
                  id: id,
                },
                requestBody: { status: payload },
              }),
            );
            useBlogStore.getState().actions.paginate({});
            if (id) {
              useBlogStore.getState().actions.detail(id);
            }
            return req;
          } catch (error: any) {
            toast.error(error?.message || "faild to Reviewed Blog");
            set({ loading: false });
          } finally {
            set({ loading: false });
          }
        },
        update: async (payload: any) => {
          let { id } = get()
          try {
            const req = await AsyncCall(BlogsService.blogUpdate({
              query: {
                id: id
              },
              requestBody: payload
            }));

            if (id) {
              useBlogStore.getState().actions.detail(id);
            }
            return req;
          } catch (error: any) {
            toast.error(error.message || "faild to update blog")
          }
        }
      },
    }),
  ),
);

export default useBlogStore;
