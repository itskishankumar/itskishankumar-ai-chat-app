"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import Chat from "@/components/chat";
import { useSetupRoute } from "@/hooks/use-setup-route";
import { Suspense } from "react";

export default function HomePageSuspense() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}

function HomePage() {
  useSetupRoute();
  return (
    <div className="w-full h-fit relative flex justify-center items-center">
      <SidebarTrigger className="absolute top-0 left-0 ml-4 mt-4" />
      <Chat />
    </div>
  );
}
