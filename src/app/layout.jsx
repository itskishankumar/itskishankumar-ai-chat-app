"use client";

import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { UseSidebar } from "@/components/useSidebar";
import { useEffect } from "react";
import { useChatListStore } from "@/store/useChatListStore";

export default function RootLayout({ children }) {
  const refreshChatList = useChatListStore((state) => state.refreshChatList);

  useEffect(() => {
    refreshChatList();
  }, []);

  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <UseSidebar />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
