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
    <div className="w-full h-fit relative flex justify-center items-center">
      <SidebarTrigger className="absolute top-0 left-0 ml-4 mt-4" />
      <Chat id={id} />
    </div>
  );
}
