import { useEffect, useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  generateUserPrompt,
  parseModelToOurs,
  parseOursToModel,
} from "@/lib/transformer";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

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

  useEffect(() => {
    localStorage.setItem(chatId, JSON.stringify({ history: messages }));
  }, [messages]);

  async function sendMessage(message) {
    const prompt = generateUserPrompt(message);
    setMessages([...messages, prompt]);
    const stream = await chatRef.current.sendMessageStream({
      message,
    });
    // parseModelToOurs({ type: "text", data: response.text }, model);
    for await (const chunk of stream) {
      console.log(chunk);
    }
  }

  async function generateImage(message) {
    const history = parseOursToModel(messages, model);
    const prompt = generateUserPrompt(message);
    setMessages([...messages, prompt]);
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
  }

  return { messages, currentlyStreamingMessage, sendMessage, generateImage };
}
