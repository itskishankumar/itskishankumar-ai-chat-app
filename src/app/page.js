"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import Chat from "@/components/chat";

export default function Home() {
  return (
    <div className="w-full relative flex justify-center items-center">
      <SidebarTrigger className="absolute top-0 left-0 z-1" />
      <Chat />
    </div>
  );
}
