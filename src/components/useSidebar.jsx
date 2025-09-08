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

export function UseSidebar() {
  const { chatsList, currentChat } = useChatListStore((state) => state);
  console.log(currentChat);
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
                    <Link href={`chats?id=${chat.id}`}>
                      <span>{chat.id}</span>
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
