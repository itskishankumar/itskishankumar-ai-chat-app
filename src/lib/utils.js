import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function stripMarkdown(text) {
  if (!text) return text;
  return text
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2") // bold/italic: **text**, *text*, __text__, _text_
    .replace(/~~(.*?)~~/g, "$1") // strikethrough
    .replace(/`{1,3}(.*?)`{1,3}/g, "$1") // inline code
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images
    .trim();
}
