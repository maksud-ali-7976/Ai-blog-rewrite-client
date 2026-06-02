"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { navItems } from "@/navigation/sidebar/sidebar-items";
import useAuthStore from "@/app/(main)/auth/auth.service";
import { buildAbilityFor } from "@/lib/acl";

export function AppSidebar() {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";
    const pathname = usePathname();
    const user = useAuthStore((s) => s.user);

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {/* Logo */}
                <div className={`px-4 py-5 ${collapsed ? "px-2" : ""}`}>
                    <h1
                        className={`font-bold tracking-tight ${collapsed ? "text-xs text-center" : "text-lg"
                            } text-sidebar-primary-foreground`}
                    >
                        {collapsed ? "AI" : "AI Blog Admin"}
                    </h1>
                </div>

                {/* Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider">
                        Navigation
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.filter((item) => {
                                if (!item.modules || item.modules.length === 0) return true;
                                const ability = buildAbilityFor(user?.role, item.modules);
                                return ability.read;
                            }).map((item) => {
                                const isActive =
                                    item.url === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(item.url);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url}
                                                className={`flex items-center hover:bg-sidebar-accent/50 transition-colors ${isActive
                                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                                    : ""
                                                    }`}
                                            >
                                                {item.icon && (
                                                    <item.icon className="h-4 w-4 mr-2 shrink-0" />
                                                )}

                                                {!collapsed && <span>{item.title}</span>}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
