"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import useAuthStore from "@/app/(main)/auth/auth.service";
import useAclStore from "@/service/acl.service";


export function AclGuard({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const aclStore = useAclStore();

  useEffect(() => {
    if (user) {
      aclStore.actions.checkAbility(pathname);
    }
  }, [user, pathname]);

  return children;
}
