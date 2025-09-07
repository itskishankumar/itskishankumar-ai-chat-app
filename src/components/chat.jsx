import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/use-chat";
import { clsx } from "clsx";

export default function Chat() {
  const { messages, currentlyStreamingMessage, sendMessage, generateImage } =
    useChat("123", "gemini-2.5-flash-image-preview");

  async function handleEnter(input) {
    await generateImage(input);
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
