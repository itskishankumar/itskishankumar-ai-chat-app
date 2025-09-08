"use client";

import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { UseSidebar } from "@/components/useSidebar";
import { Suspense, useEffect } from "react";
import { useChatListStore } from "@/store/useChatListStore";

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
          </SidebarProvider>
        </Suspense>
      </body>
    </html>
  );
}
