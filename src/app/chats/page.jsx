"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import Chat from "@/components/chat";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useChatListStore } from "@/store/useChatListStore";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const setCurrentChat = useChatListStore((state) => state.setCurrentChat);
  useEffect(() => {
    setCurrentChat(id);
  }, [id]);
  return (
    <div className="w-full h-fit relative flex justify-center items-center">
      <SidebarTrigger className="absolute top-0 left-0 ml-4 mt-4" />
      <Chat id={id} />
    </div>
  );
}
