import { create } from "zustand";

export const useChatListStore = create((set) => ({
  chatsList: [],
  updateChatList: (chatsList) => set({ chatsList: chatsList }),
  currentChat: "",
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
}));
