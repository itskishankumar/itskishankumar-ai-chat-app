import { create } from "zustand";
import { getAllChatsData } from "@/lib/data_utils";

export const useChatListStore = create((set) => ({
  chatsList: [],
  refreshChatList: async () => {
    const chats = await getAllChatsData();
    set({ chatsList: chats });
  },
  currentChat: "",
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
}));
