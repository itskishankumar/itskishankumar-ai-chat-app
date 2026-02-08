import { useEffect, useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  generateUserPrompt,
  parseModelToOurs,
  parseOursToModel,
} from "@/lib/transformer/transformer";
import { getChatData, getChatModel, setChatData } from "@/lib/data_utils";
import { v4 as uuidv4 } from "uuid";
import { useChatListStore } from "@/store/useChatListStore";
import { modelTypes } from "@/lib/constants/models";
import { toast } from "sonner";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export function useChat(chatId) {
  const [model, setModel] = useState("gemini-2.5-flash");
  const [currentlyStreamingMessage, setCurrentlyStreamingMessage] =
    useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const currentChatId = useRef(null);
  const refreshChatList = useChatListStore((state) => state.refreshChatList);

  const dummyRefForScrollingRef = useRef(null);

  useEffect(() => {
    if (hydrated && currentChatId.current) {
      try {
        setChatData(currentChatId.current, { messages, model });
      } catch (e) {
        console.error(e);
      }
    }
    // TODO: This doesn't work accurately all the time
    dummyRefForScrollingRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, model]);

  useEffect(() => {
    init();
  }, [chatId]);

  async function init() {
    try {
      setHydrated(false);
      setMessages([]);
      setLoading(true);
      currentChatId.current = chatId;
      const chatData = await getChatData(chatId);
      setMessages(chatData ?? []);
      const chatModel = (await getChatModel(chatId)) ?? model;
      setModel(chatModel);
    } catch (e) {
      console.error(e);
      toast.warning("Something went wrong. Please try again later!");
    } finally {
      setHydrated(true);
      setLoading(false);
    }
  }

  async function generateTitle(prompt, type) {
    if (!currentChatId.current) {
      const id = uuidv4();
      currentChatId.current = id;
      window.history.replaceState({}, "", `/chats?id=${id}`);
      const generateTitlePrompt = generateUserPrompt(
        "Generate a 3 word title summarising this query for an LLM -",
        "text",
      );
      const serializedPrompt = generateUserPrompt(prompt, type);
      const response = await ai.models.generateContent({
        model: modelTypes.text.model,
        contents: [
          ...parseOursToModel([generateTitlePrompt, serializedPrompt], model),
        ],
      });
      const text = response.text;
      await setChatData(id, { title: text });
      await refreshChatList();
    }
  }

  async function generateTextResponse(prompts) {
    try {
      setLoading(true);
      generateTitle(prompts[0].data, prompts[0].type);
      const serializedPrompts = prompts.map((prompt) =>
        generateUserPrompt(prompt.data, prompt.type),
      );
      const updatedMessages = [...messages, ...serializedPrompts];
      setMessages(updatedMessages);
      const stream = await ai.models.generateContentStream({
        model,
        contents: [...parseOursToModel(updatedMessages, model)],
      });
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
      toast.warning("Something went wrong. Please try again later!");
    } finally {
      setLoading(false);
    }
  }

  async function generateImageResponse(prompts) {
    try {
      setLoading(true);
      generateTitle(prompts[0].data, prompts[0].type);
      const serializedPrompts = prompts.map((prompt) =>
        generateUserPrompt(prompt.data, prompt.type),
      );
      const updatedMessages = [...messages, ...serializedPrompts];
      setMessages(updatedMessages);
      const response = await ai.models.generateContent({
        model,
        contents: [...parseOursToModel(updatedMessages, model)],
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
      toast.warning("Something went wrong. Please try again later!");
    } finally {
      setLoading(false);
    }
  }

  function injectChat(chatMessages) {
    if (chatMessages && Array.isArray(chatMessages)) {
      // Mark injected messages as hidden so they don't show in UI but are sent to the model
      const hiddenMessages = chatMessages.map((msg) => ({
        ...msg,
        _hidden: true,
      }));

      setMessages((prevMessages) => [...prevMessages, ...hiddenMessages]);
      toast.success("Chat context injected successfully!");
    }
  }

  return {
    loading,
    model,
    setModel,
    messages,
    currentlyStreamingMessage,
    generateTextResponse,
    generateImageResponse,
    injectChat,
    dummyRefForScrollingRef,
  };
}
