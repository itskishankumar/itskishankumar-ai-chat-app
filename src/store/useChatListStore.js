import { create } from "zustand";
import { getAllChatsData } from "@/lib/data_utils";
import { toast } from "sonner";

export const useChatListStore = create((set) => ({
  loading: false,
  chatsList: [],
  refreshChatList: async () => {
    try {
      set({ loading: true });
      const chats = await getAllChatsData();
      set({ chatsList: chats });
    } catch (e) {
      console.error(e);
      toast.warning("Something went wrong. Please try again later!");
    } finally {
      set({ loading: false });
    }
  },
  currentChat: "",
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
}));
