import { useChat } from "@/hooks/use-chat";
import { clsx } from "clsx";
import Spinner from "@/components/ui/spinner";

import { getTypeFromModel, modelTypes } from "@/lib/constants/models";
import { useEffect, useState } from "react";

import PromptBar from "@/components/promptBar";
import ChatSearchDialog from "@/components/chatSearchDialog";
import { FolderSearch } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Chat({ id }) {
  const {
    loading,
    model,
    setModel,
    messages,
    currentlyStreamingMessage,
    generateTextResponse,
    generateImageResponse,
    injectChat,
    dummyRefForScrollingRef,
  } = useChat(id);

  const [modelType, setModelType] = useState("text");
  const [imagePrompt, setImagePrompt] = useState(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

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

  // adding the -mt-8 here because this is getting pushed down by the sidebar trigger, even though it's stick
  // hence causing the scroll bar to show even when there's no content
  return (
    <div className="-mt-8 w-full h-full flex flex-col items-center">
      <ChatSearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onInjectChat={injectChat}
      />
      <div className="w-full h-full lg:w-1/2 flex flex-col items-center justify-between">
        <div className="w-full pt-12 flex flex-col p-4 ">
          <div className="flex justify-end mb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSearchDialogOpen(true)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                  aria-label="Load chat into context"
                >
                  <FolderSearch className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Load another chat into context</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-col gap-4">
            {messages
              .filter((message) => !message._hidden)
              .map((message, index1) => (
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
          <div id="dummyRefForScrolling" ref={dummyRefForScrollingRef} />
        </div>
        <div
          className={clsx(
            "w-full min-h-32 sticky bottom-0 bg-white flex justify-center items-center p-4",
            { "min-h-46": imagePrompt },
          )}
        >
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
    </div>
  );
}
