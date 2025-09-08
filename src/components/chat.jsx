"use client";

import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/use-chat";
import { clsx } from "clsx";
import Spinner from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { getTypeFromModel, modelTypes } from "@/lib/constants/models";
import { useEffect, useState } from "react";

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

  const [inputType, setInputType] = useState("");

  useEffect(() => {
    setInputType(getTypeFromModel(model));
  }, [model]);

  async function handleEnter(input) {
    const trimmedInput = input.trim();
    if (trimmedInput) {
      switch (inputType) {
        case "text":
          await generateTextResponse(trimmedInput);
          break;
        case "image":
          await generateImageResponse(trimmedInput);
          break;
      }
    }
  }

  function changeInputType(type) {
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
                data.type !== "image/png" ? (
                  <div key={index2}>{data.data}</div>
                ) : (
                  <img
                    key={index2}
                    src={`data:image/png;base64,${data.data}`}
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
      {/*TODO: Move this to it's own component?*/}
      <div className="w-full h-32 sticky bottom-0 bg-white flex justify-center items-center p-4">
        <div
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "h-16 lg:w-1/2 bg-gray-100 flex justify-center items-center",
          )}
        >
          <Input
            placeholder="Ask me anything"
            onEnter={handleEnter}
            disabled={loading}
            className="h-full w-full border-none focus:outline-0 mr-4"
          />
          <Select
            onValueChange={changeInputType}
            defaultValue="text"
            value={inputType}
            className="h-full"
          >
            <SelectTrigger className="h-full bg-gray-100 border-none focus:border-none focus-visible:ring-0 focus:outline-0 shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(modelTypes).map(([type, { title, icon }]) => (
                <SelectItem key={type} value={type}>
                  {icon}
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
