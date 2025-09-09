"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import Chat from "@/components/chat";
import { Suspense } from "react";
import { useSetupRoute } from "@/hooks/use-setup-route";

export default function ChatPageSuspense() {
  return (
    <Suspense>
      <ChatPage />
    </Suspense>
  );
}

function ChatPage() {
  const { id } = useSetupRoute();
  return (
    <div className="w-full h-screen overflow-y-auto">
      <SidebarTrigger className="sticky top-4 left-4" />
      <Chat id={id} />
    </div>
  );
}
