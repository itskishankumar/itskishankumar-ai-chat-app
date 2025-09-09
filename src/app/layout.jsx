"use client";

import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { UseSidebar } from "@/components/useSidebar";
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
            <UseSidebar />
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
