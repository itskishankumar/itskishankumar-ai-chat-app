import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Paperclip, Trash2 } from "lucide-react";
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
  modelType,
  changeModelType,
  imagePrompt,
  disabled,
}) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent p-3 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "min-h-16 bg-gray-100 flex justify-center items-center",
      )}
    >
      <Tooltip>
        <TooltipTrigger>
          <label htmlFor="file-upload">
            <Paperclip className="mr-4 cursor-pointer" />
          </label>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add image</p>
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
        <SelectTrigger className="h-full bg-gray-100 border-none focus:border-none focus-visible:ring-0 focus:outline-0 shadow-none">
          {isMobile ? modelTypes[modelType].icon : <SelectValue />}
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
  );
}
