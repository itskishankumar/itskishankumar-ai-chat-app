import { db } from "@/lib/db";

export async function getAllChatsData() {
  const chatData = await db.chats.toArray();
  return chatData.map((chat) => ({
    id: chat.id,
    title: chat.title,
  }));
}

export async function searchChatsByTitle(query) {
  if (!query?.trim()) return [];
  const lowerQuery = query.toLowerCase();
  const allChats = await db.chats.toArray();
  return allChats
    .filter((chat) => chat.title?.toLowerCase().includes(lowerQuery))
    .map((chat) => ({
      id: chat.id,
      title: chat.title,
      matchType: "title",
    }));
}

export async function searchChatsByContent(query) {
  if (!query?.trim()) return [];
  const lowerQuery = query.toLowerCase();
  const allChats = await db.chats.toArray();

  return allChats
    .map((chat) => {
      const messages = JSON.parse(chat.data ?? "[]");
      const matchingSnippets = [];

      for (const message of messages) {
        // Skip hidden/injected messages
        if (message._hidden) continue;

        if (message.data) {
          for (const item of message.data) {
            if (item.type === "text" && item.data) {
              const text = item.data.toLowerCase();
              if (text.includes(lowerQuery)) {
                // Extract snippet around match
                const idx = text.indexOf(lowerQuery);
                const start = Math.max(0, idx - 30);
                const end = Math.min(item.data.length, idx + lowerQuery.length + 30);
                const snippet = (start > 0 ? "..." : "") + item.data.slice(start, end) + (end < item.data.length ? "..." : "");
                matchingSnippets.push({ snippet, role: message.role });
              }
            }
          }
        }
      }

      if (matchingSnippets.length > 0) {
        return {
          id: chat.id,
          title: chat.title,
          matchType: "content",
          snippets: matchingSnippets.slice(0, 3), // Limit to 3 snippets
        };
      }
      return null;
    })
    .filter(Boolean);
}

export async function searchChats(query) {
  if (!query?.trim()) return [];

  const [titleMatches, contentMatches] = await Promise.all([
    searchChatsByTitle(query),
    searchChatsByContent(query),
  ]);

  // Combine and dedupe, prioritizing title matches
  const seen = new Set();
  const results = [];

  for (const match of titleMatches) {
    seen.add(match.id);
    results.push(match);
  }

  for (const match of contentMatches) {
    if (!seen.has(match.id)) {
      results.push(match);
    }
  }

  return results;
}

export async function getChatData(chatId) {
  if (chatId) {
    const chatData = await db.chats.get(chatId);
    return JSON.parse(chatData?.data ?? "[]");
  }
}

export async function getChatModel(chatId) {
  if (chatId) {
    const chatData = await db.chats.get(chatId);
    return chatData.model;
  }
}

export async function setChatData(chatId, { messages, model, title }) {
  const updated = await db.chats.update(chatId, {
    ...(messages
      ? {
          data: JSON.stringify(messages),
        }
      : {}),
    ...(model ? { model } : {}),
    ...(title ? { title } : {}),
  });
  if (!updated) {
    await db.chats.add({
      id: chatId,
      ...(messages
        ? {
            data: JSON.stringify(messages),
          }
        : {}),
      ...(model ? { model } : {}),
      ...(title ? { title } : {}),
    });
  }
}
