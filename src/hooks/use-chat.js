import { useEffect, useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { parseModelToOurs, parseOursToModel } from "@/lib/transformer";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

function createUserPrompt(prompt) {
  return {
    role: "user",
    prompt,
  };
}

export function useChat(chatId, model) {
  const [currentlyStreamingMessage, setCurrentlyStreamingMessage] =
    useState("");
  const [messages, setMessages] = useState([]);

  const chatRef = useRef(null);
  useEffect(() => {
    const chatData = JSON.parse(localStorage.getItem(chatId));
    setMessages(chatData.history ?? []);
    const history = parseOursToModel(chatData?.history ?? [], model);
    chatRef.current = ai.chats.create({
      model,
      history,
    });
  }, []);

  async function sendMessage(message) {
    const stream = await chatRef.current.sendMessageStream({
      message,
    });
    // parseModelToOurs({ type: "text", data: response.text }, "gemini-2.5-flash");
    for await (const chunk of stream) {
      console.log(chunk.text);
      console.log("_".repeat(80));
    }
  }

  return { messages, sendMessage };
}
