import { MessageCirclePlus } from "lucide-react";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { useChatListStore } from "@/store/useChatListStore";
import { clsx } from "clsx";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import { stripMarkdown } from "@/lib/utils";

export function AppSidebar() {
  const { loading, chatsList, currentChat } = useChatListStore(
    (state) => state,
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { setOpenMobile } = useSidebar();

  function handleLinkClick(e, route) {
    e.preventDefault();
    const fullUrl = pathname + "?" + searchParams.toString();
    if (fullUrl !== route) {
      router.push(route);
      setOpenMobile(false);
    }
  }

  return (
    <Sidebar>
      <SidebarGroup className="h-full">
        <SidebarMenuButton asChild>
          <Link href="/" onClick={(e) => handleLinkClick(e, `/`)}>
            <MessageCirclePlus />
            <span>New Chat</span>
          </Link>
        </SidebarMenuButton>
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarGroupContent className="h-full overflow-auto">
          <SidebarMenu>
            {loading && <Spinner show={true} className="mt-8 text-blue-100" />}
            {chatsList?.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  asChild
                  className={clsx({ "bg-blue-100": currentChat === chat.id })}
                >
                  <Link
                    href={`/chats?id=${chat.id}`}
                    onClick={(e) => handleLinkClick(e, `/chats?id=${chat.id}`)}
                  >
                    <span>{stripMarkdown(chat.title) ?? chat.id}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}
