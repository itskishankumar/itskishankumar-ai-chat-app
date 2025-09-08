import { useEffect, useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  generateUserPrompt,
  parseModelToOurs,
  parseOursToModel,
} from "@/lib/transformer";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      let chatData = await db.chats.get(chatId);
      chatData = JSON.parse(chatData?.data);
      setMessages(chatData?.history ?? []);
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
    try {
      db.chats.put({ id: chatId, data: JSON.stringify({ history: messages }) });
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  async function generateTitle(message) {
    // if (!router.query?.id) {
    //   const response = await ai.models.generateContent({
    //     model,
    //     contents: `Generate a 3 word title summarising this query for an LLM - ${message}`,
    //   });
    //   console.log(response.text);
    // }
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
