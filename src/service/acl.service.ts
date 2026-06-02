import { create } from "zustand";
import { combine } from "zustand/middleware";

import useAuthStore from "@/app/(main)/auth/auth.service";
import { buildAbilityFor } from "@/lib/acl";
import { navItems } from "@/navigation/sidebar/sidebar-items";

const defaultAbility = {
  read: false,
  write: false,
  update: false,
  del: false,
  review: false,
  publish: false,
};

export const useAclStore = create(
  combine(
    {
      loading: false,
      ability: defaultAbility,
    },
    (set) => ({
      actions: {
        checkAbility: (pathName: string) => {
          console.log("Ablitry Check Calling....");
          set({
            ability: defaultAbility,
          });

          let modules: string[] = [];
          // console.log("Nav Items:", navItems);
          for (const item of navItems) {
            if (item.url !== "/" && pathName.startsWith(item.url)) {
              modules = item.modules || [];
              break;
            }
          }
          console.log("Modules:", modules);
          console.log("Call After ");
          if (modules.length) {
            const { user } = useAuthStore.getState();
            console.log("Check Ab", user);
            const ability = buildAbilityFor(user?.role, modules);

            set({
              ability: {
                read: ability?.read || false,
                write: ability?.write || false,
                update: ability?.update || false,
                del: ability?.delete || false,
                review: ability?.review || false,
                publish: ability?.publish || false,
              },
            });
          }
        },
      },
    }),
  ),
);

export default useAclStore;
