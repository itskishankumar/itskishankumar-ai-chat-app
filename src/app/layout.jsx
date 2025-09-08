"use client";

import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { UseSidebar } from "@/components/useSidebar";
import { useEffect } from "react";
import { useChatListStore } from "@/store/useChatListStore";
import { getAllChatsData } from "@/lib/data_utils";

export default function RootLayout({ children }) {
  const updateChatList = useChatListStore((state) => state.updateChatList);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const chats = await getAllChatsData();
    updateChatList(chats);
  }

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
