import { create } from "zustand";
import { getAllChatsData } from "@/lib/data_utils";
import { toast } from "sonner";

export const useChatListStore = create((set) => ({
  chatsList: [],
  refreshChatList: async () => {
    try {
      const chats = await getAllChatsData();
      set({ chatsList: chats });
    } catch (e) {
      console.error(e);
      toast.warning("Something went wrong. Please try again later!");
    }
  },
  currentChat: "",
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
}));
