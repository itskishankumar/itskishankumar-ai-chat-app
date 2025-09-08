import { Image, Type } from "lucide-react";

export const modelTypes = {
  text: {
    title: "Text mode",
    icon: <Type />,
    model: "gemini-2.5-flash",
  },
  image: {
    title: "Image mode",
    icon: <Image />,
    model: "gemini-2.5-flash-image-preview",
  },
};

export function getTypeFromModel(model) {
  return Object.entries(modelTypes).find(([_, v]) => v.model === model)[0];
}
