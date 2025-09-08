import { useChatListStore } from "@/store/useChatListStore";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function useSetupRoute() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const setCurrentChat = useChatListStore((state) => state.setCurrentChat);
  useEffect(() => {
    setCurrentChat(id);
  }, [id]);
  return { id };
}
