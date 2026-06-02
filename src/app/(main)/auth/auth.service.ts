import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";
import { AuthData } from "@/open-api-client/admin/models";
import { AuthService } from "@/open-api-client/index";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { AsyncCall } from "@/lib/utils";

export type User = AuthData["responses"]["Profile"]["data"];

export enum RoleLevel {
  L1 = 1,
  L2 = 2,
  L3 = 3,
}

const useAuthStore = create(
  persist(
    combine(
      {
        loading: false,
        user: null as User | null,
      },
      (set, get) => ({
        actions: {
          login: async (
            payload: AuthData["payloads"]["Login"]["requestBody"],
          ) => {
            set({ loading: true });
            try {
              const request = await AsyncCall(
                AuthService.login({ requestBody: payload }),
                "trying to log you in....",
              );
              set({ user: request.data });
              return request;
            } catch (error) {
              console.log("ApiError: ", error);
            } finally {
              set({ loading: false });
            }
          },
          logout: async () => {
            set({ user: null });
            console.log("Calling.....");
            redirect("/auth/login");
          },
          refresh: async () => {
            const { user } = get();

            if (!user?.refreshToken) {
              return false;
            }

            try {
              const response = await AuthService.refreshToken({
                requestBody: {
                  refreshToken: user.refreshToken,
                },
              });

              set({
                user: response.data,
              });

              return true;
            } catch {
              set({
                user: null,
              });

              return false;
            }
          },
        },
      }),
    ),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
