import { useEffect, useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  generateUserPrompt,
  parseModelToOurs,
  parseOursToModel,
} from "@/lib/transformer";
import { useRouter } from "next/navigation";
import { getChatData, setChatData } from "@/lib/data_utils";
import { v4 as uuidv4 } from "uuid";
import { useChatListStore } from "@/store/useChatListStore";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export function useChat(chatId, model) {
  const router = useRouter();

  const [currentlyStreamingMessage, setCurrentlyStreamingMessage] =
    useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);
  const currentChatId = useRef(null);
  const setCurrentChat = useChatListStore((state) => state.setCurrentChat);

  useEffect(() => {
    init();
  }, [chatId]);

  async function init() {
    try {
      currentChatId.current = chatId;
      const chatData = await getChatData(chatId);
      setMessages(chatData ?? []);
      const history = parseOursToModel(chatData?.history ?? [], model);
      chatRef.current = ai.chats.create({
        model,
        history,
      });
    } catch (e) {
      console.error(e);
    }
  }

  // TODO: Prevent it from being fired initially.
  useEffect(() => {
    if (currentChatId.current) {
      try {
        setChatData(currentChatId.current, { messages, model });
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [messages]);

  async function generateTitle(message) {
    if (!currentChatId.current) {
      const id = uuidv4();
      currentChatId.current = id;
      window.history.replaceState({}, "", `/chats?id=${id}`);
      setCurrentChat(id);
      const response = await ai.models.generateContent({
        model,
        contents: `Generate a 3 word title summarising this query for an LLM - ${message}`,
      });
      const text = response.text;
    }
  }

  async function sendMessage(message) {
    generateTitle(message);
    const prompt = generateUserPrompt(message);
    setMessages([...messages, prompt]);
    try {
      const stream = await chatRef.current.sendMessageStream({
        message,
      });
      setLoading(true);
      let fullText = "";
      for await (const chunk of stream) {
        fullText += chunk.text;
        setCurrentlyStreamingMessage(fullText);
      }
      const response = parseModelToOurs(
        { type: "text", data: fullText },
        model,
      );
      setMessages((messages) => [...messages, response]);
      setCurrentlyStreamingMessage("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function generateImage(message) {
    generateTitle(message);
    const history = parseOursToModel(messages, model);
    const prompt = generateUserPrompt(message);
    setMessages([...messages, prompt]);
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [...history, ...parseOursToModel([prompt], model)],
      });
      for (const part of response.candidates[0].content.parts) {
        let response;
        if (part.text) {
          response = parseModelToOurs({ type: "text", data: part.text }, model);
        } else if (part.inlineData) {
          response = parseModelToOurs(
            { type: part.inlineData.mimeType, data: part.inlineData.data },
            model,
          );
        }
        setMessages((messages) => [...messages, response]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return {
    loading,
    messages,
    currentlyStreamingMessage,
    sendMessage,
    generateImage,
  };
}
