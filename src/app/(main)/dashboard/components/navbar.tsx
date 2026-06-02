"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut, UserCircle2 } from "lucide-react";
import { useThemeStore } from "@/lib/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuthStore from "../../auth/auth.service";

export function Navbar() {
  const { theme, toggle } = useThemeStore();
  const store = useAuthStore();
  return (
    <header className="h-14 border-b flex items-center justify-between px-4 bg-card">
      <SidebarTrigger />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-9 w-9"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <UserCircle2 className="h-4 w-4" />
              Profile
            </DropdownMenuItem>

            {/* Logout */}
            <DropdownMenuItem
              onClick={() => store.actions.logout()} // ✅ sirf yaha
              className="gap-2 cursor-pointer text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
