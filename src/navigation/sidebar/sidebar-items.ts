import {
  BookOpen,
  CreditCard,
  FileText,
  Grid2X2,
  Layers,
  LayoutDashboard,
  ScrollText,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;

  // future use
  modules?: Modules[];
  subItems?: NavItem[];

  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

/* ---------------- FUTURE RBAC ENUM ---------------- */

export enum Modules {
  DASHBOARD = "dashboard",
  USERS = "users",
  ROLES = "roles",
  BLOGS = "blogs",
  AUDIT = "audit",
  ROLES_AND_PERMISSIONS = "roles",
}

/* helper (future ACL) */
const can = (...modules: Modules[]) => ({
  modules: [...modules],
});

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    ...can(Modules.DASHBOARD),
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
    ...can(Modules.ROLES_AND_PERMISSIONS),
  },
  {
    title: "Blogs",
    url: "/dashboard/blogs",
    icon: FileText,
    ...can(Modules.BLOGS),
  },
  {
    title: "Audit Logs",
    url: "/dashboard/audit-logs",
    icon: ScrollText,
    ...can(Modules.AUDIT),
  },
];
