"use client";

import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSidebar";
import { Suspense, useEffect } from "react";
import { useChatListStore } from "@/store/useChatListStore";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  const refreshChatList = useChatListStore((state) => state.refreshChatList);

  useEffect(() => {
    refreshChatList();
  }, []);

  return (
    <html lang="en">
      <body>
        <Suspense>
          <SidebarProvider>
            <AppSidebar />
            {children}
            <Toaster
              position="bottom-center"
              richColors
              toastOptions={{
                className: "flex justify-center items-center",
              }}
            />
          </SidebarProvider>
        </Suspense>
      </body>
    </html>
  );
}
