"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import Chat from "@/components/chat";
import { useSetupRoute } from "@/hooks/use-setup-route";

export default function ChatPage() {
  const { id } = useSetupRoute();
  return (
    <div
      className="w-full h-dvh overflow-y-auto"
      style={{ scrollbarGutter: "stable" }}
    >
      <SidebarTrigger className="sticky top-4 left-4" />
      <Chat id={id} />
    </div>
  );
}
