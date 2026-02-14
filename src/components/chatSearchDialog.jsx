"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { searchChats, getChatData } from "@/lib/data_utils";
import { Search, MessageSquare, FileText } from "lucide-react";
import { cn, stripMarkdown } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatSearchDialog({ open, onOpenChange, onInjectChat }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [injecting, setInjecting] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearching(true);
      try {
        const searchResults = await searchChats(query);
        setResults(searchResults);
      } catch (e) {
        console.error("Search failed:", e);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSelectedChat(null);
    }
  }, [open]);

  const handleInject = useCallback(
    async (chatId) => {
      setInjecting(true);
      try {
        const chatData = await getChatData(chatId);
        if (chatData && onInjectChat) {
          onInjectChat(chatData);
          onOpenChange(false);
        }
      } catch (e) {
        console.error("Failed to inject chat:", e);
      } finally {
        setInjecting(false);
      }
    },
    [onInjectChat, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Load Chat into Context
          </DialogTitle>
          <DialogDescription>
            Search by chat name or content to inject into current conversation
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats by name or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-auto min-h-[200px] max-h-[400px] mt-2">
          {searching && (
            <div className="flex items-center justify-center py-8">
              <Spinner show={true} className="text-blue-400" />
            </div>
          )}

          {!searching && query && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mb-2" />
              <p>No chats found matching &quot;{query}&quot;</p>
            </div>
          )}

          {!searching && results.length > 0 && (
            <div className="space-y-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleInject(result.id)}
                  disabled={injecting}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border border-input hover:border-blue-300 hover:bg-accent transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                    selectedChat === result.id && "border-blue-400 bg-accent",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">
                        {stripMarkdown(result.title) || "Untitled Chat"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {result.matchType === "title"
                          ? "Matched by name"
                          : "Matched by content"}
                      </div>
                      {result.snippets && result.snippets.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {result.snippets.map((snippet, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "text-sm p-2 rounded text-foreground markdown-content",
                                snippet.role === "user"
                                  ? "bg-gray-100"
                                  : "bg-blue-100",
                              )}
                            >
                              <span className="text-xs font-medium text-muted-foreground mr-1">
                                {snippet.role === "user" ? "You:" : "AI:"}
                              </span>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {snippet.snippet}
                              </ReactMarkdown>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!searching && !query && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mb-2" />
              <p>Start typing to search your chats</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
