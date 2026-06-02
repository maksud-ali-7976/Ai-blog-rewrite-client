import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { APP_CONFIG } from "@/config/app-config";
import { AuthGuard } from "@/guard/auth-guard";
import GlobalModal from "@/components/modal-view/global-modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <AuthGuard>{children}</AuthGuard>
        <Toaster position="top-center"/>
        <GlobalModal />
      </body>
    </html>
  );
}
