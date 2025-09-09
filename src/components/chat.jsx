"use client";

import { useChat } from "@/hooks/use-chat";
import { clsx } from "clsx";
import Spinner from "@/components/ui/spinner";

import { getTypeFromModel, modelTypes } from "@/lib/constants/models";
import { useEffect, useState } from "react";

import PromptBar from "@/components/promptBar";

export default function Chat({ id }) {
  const {
    loading,
    model,
    setModel,
    messages,
    currentlyStreamingMessage,
    generateTextResponse,
    generateImageResponse,
  } = useChat(id);

  const [modelType, setModelType] = useState("text");

  const [imagePrompt, setImagePrompt] = useState(null);

  useEffect(() => {
    setModelType(getTypeFromModel(model));
  }, [model]);

  function generateResponse(input) {
    const trimmedInput = input.trim();
    if (trimmedInput) {
      switch (modelType) {
        case "text":
          generateTextResponse([
            ...(imagePrompt ? [imagePrompt] : []),
            { type: "text", data: trimmedInput },
          ]);
          break;
        case "image":
          generateImageResponse([
            ...(imagePrompt ? [imagePrompt] : []),
            { type: "text", data: trimmedInput },
          ]);
          break;
      }
      setImagePrompt(null);
    }
  }

  async function handleImageSelection({ type, name, data }) {
    setImagePrompt({ type, name, data });
  }

  async function deleteImageSelection() {
    setImagePrompt(null);
  }

  function changeModelType(type) {
    setModel(modelTypes[type].model);
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full pt-20 lg:w-1/2 flex flex-col p-4 ">
        <div className="w-full flex flex-col gap-4">
          {messages.map((message, index1) => (
            <div
              key={index1}
              className={clsx("p-2 rounded-sm ", {
                "self-end bg-gray-100": message.role === "user",
                "self-start bg-blue-100": message.role === "model",
              })}
            >
              {message.data.map((data, index2) =>
                data.type === "text" ? (
                  <div key={index2}>{data.data}</div>
                ) : (
                  <img
                    key={index2}
                    src={`data:${data.type};base64,${data.data}`}
                  />
                ),
              )}
            </div>
          ))}
        </div>
        {/*TODO: Remove this duplication by extracting chat box to a separate component*/}
        {currentlyStreamingMessage && (
          <div className="mt-2 p-2 rounded-sm self-start bg-blue-100">
            <div>{currentlyStreamingMessage}</div>
          </div>
        )}
        {loading && <Spinner show={true} className="mt-8 text-blue-100" />}
      </div>
      <div className="w-full min-h-32 sticky bottom-0 bg-white flex justify-center items-center p-4">
        <PromptBar
          handleEnter={generateResponse}
          handleImageSelection={handleImageSelection}
          deleteImageSelection={deleteImageSelection}
          modelType={modelType}
          changeModelType={changeModelType}
          imagePrompt={imagePrompt}
          disabled={loading}
        />
      </div>
    </div>
  );
}
