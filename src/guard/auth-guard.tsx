"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/app/(main)/auth/auth.service";
import { Loader2Icon } from "lucide-react";
import Loader from "@/components/ui/loader";
import useAclStore from "@/service/acl.service";
import { isTokenExpired } from "@/lib/utils";
import { toast } from "sonner";

const PUBLIC_PATHS = ["/auth", "/unauthorized"];

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  console.log("🚀 ~ AuthGuard ~ pathname:", pathname);
  const user = useAuthStore((state) => state.user);
  const isPublicRoute = useMemo(
    () => PUBLIC_PATHS.some((path) => pathname?.startsWith(path)),
    [pathname],
  );
  const aclStore = useAclStore();

  useEffect(() => {
    const unsubHydrate = useAuthStore.persist.onHydrate(() =>
      setHydrated(false),
    );
    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    setHydrated(useAuthStore.persist.hasHydrated());
    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const checkSession = async () => {
      console.log("Calling...")
      const auth = useAuthStore.getState();

      if (!isPublicRoute && !auth.user) {
        router.replace("/auth/login");
        return;
      }

      if (!auth.user) return;

      if (isTokenExpired(auth.user.token)) {
        const refreshed = await auth.actions.refresh();

        if (!refreshed) {
          await auth.actions.logout();

          toast.error("Session expired. Please login again.");

          router.replace("/auth/login");
          return;
        }
      }

      aclStore.actions.checkAbility(pathname);
    };

    checkSession();
  }, [hydrated, pathname, isPublicRoute]);

  if (!hydrated) {
    return <Loader />;
  }

  if (!user && !isPublicRoute) return null;

  return children;
}
