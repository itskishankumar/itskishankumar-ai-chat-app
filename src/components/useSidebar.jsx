"use client";

import { MessageCirclePlus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { useChatListStore } from "@/store/useChatListStore";
import { clsx } from "clsx";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export function UseSidebar() {
  const { chatsList, currentChat } = useChatListStore((state) => state);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleLinkClick(e, route) {
    e.preventDefault();
    const fullUrl = pathname + "?" + searchParams.toString();
    if (fullUrl !== route) {
      router.push(route);
    }
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuButton asChild>
            <Link href="/">
              <MessageCirclePlus />
              <span>New Chat</span>
            </Link>
          </SidebarMenuButton>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatsList?.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    asChild
                    className={clsx({ "bg-blue-100": currentChat === chat.id })}
                  >
                    <Link
                      href={`/chats?id=${chat.id}`}
                      onClick={(e) =>
                        handleLinkClick(e, `/chats?id=${chat.id}`)
                      }
                    >
                      <span>{chat.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
