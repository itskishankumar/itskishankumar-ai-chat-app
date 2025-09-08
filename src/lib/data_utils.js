import { db } from "@/lib/db";

export async function getAllChatsData() {
  const chatData = await db.chats.toArray();
  return chatData.map((chat) => ({
    id: chat.id,
    title: chat.title,
  }));
}

export async function getChatData(chatId) {
  if (chatId) {
    const chatData = await db.chats.get(chatId);
    return JSON.parse(chatData?.data ?? []);
  }
}

export async function setChatData(chatId, { messages, model, title }) {
  await db.chats.put({
    id: chatId,
    ...(messages
      ? {
          data: JSON.stringify(messages),
        }
      : {}),
    model,
    title,
  });
}
