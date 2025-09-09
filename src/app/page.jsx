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
    <div className="w-full h-dvh overflow-y-auto">
      <SidebarTrigger className="sticky top-4 left-4" />
      <Chat />
    </div>
  );
}
