"use client";

import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/use-chat";
import { clsx } from "clsx";
import Spinner from "@/components/ui/spinner";

export default function Chat({ id }) {
  const {
    loading,
    messages,
    currentlyStreamingMessage,
    sendMessage,
    generateImage,
  } = useChat(id, "gemini-2.5-flash");

  async function handleEnter(input) {
    await sendMessage(input);
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
      <div className="w-full h-32 sticky bottom-0 bg-white flex justify-center items-center p-4">
        <Input
          placeholder="Ask me anything"
          onEnter={handleEnter}
          className="lg:w-1/2 h-16 bg-gray-100"
        />
      </div>
    </div>
  );
}
