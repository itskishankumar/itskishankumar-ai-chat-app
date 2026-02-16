import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Merge, Paperclip, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modelTypes } from "@/lib/constants/models";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PromptBar({
  handleEnter,
  handleImageSelection,
  deleteImageSelection,
  setSearchDialogOpen,
  modelType,
  changeModelType,
  imagePrompt,
  disabled,
  className,
}) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "w-full min-w-0 rounded-md shadow-xs min-h-16 bg-gray-100 flex justify-center items-center p-4",
        className,
      )}
    >
      <Tooltip>
        <TooltipTrigger>
          <label htmlFor="file-upload">
            <Paperclip className="mr-2 cursor-pointer" />
          </label>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add image</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <button
            onClick={() => setSearchDialogOpen(true)}
            className="p-2 rounded-lg bg-slate-100 transition-colors text-slate-700 cursor-pointer"
            aria-label="Load chat into context"
          >
            <Merge className="mr-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Load another chat into context</p>
        </TooltipContent>
      </Tooltip>
      <Input
        id="file-upload"
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onEnter={handleImageSelection}
      />

      {imagePrompt && (
        <div className="relative flex-shrink-0 mr-4">
          <img
            src={`data:${imagePrompt.type};base64,${imagePrompt.data}`}
            className="h-24 w-24 object-fill rounded-sm"
          />
          <Trash2
            className="absolute z-1 top-2 right-2 text-white cursor-pointer"
            onClick={deleteImageSelection}
          />
        </div>
      )}
      <Input
        placeholder="Ask me anything"
        onEnter={handleEnter}
        disabled={disabled}
        className="h-full w-full border-none focus:outline-0 mr-4 resize-none"
      />
      <Select
        onValueChange={changeModelType}
        defaultValue="text"
        value={modelType}
        className="h-full"
      >
        <SelectTrigger className="h-full bg-gray-100 border-none focus:border-none focus-visible:ring-0 focus:outline-0 shadow-none cursor-pointer">
          {isMobile ? modelTypes[modelType].icon : <SelectValue />}
        </SelectTrigger>
        <SelectContent>
          {Object.entries(modelTypes).map(([type, { title, icon }]) => (
            <SelectItem key={type} value={type} className="cursor-pointer">
              {icon}
              {title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
