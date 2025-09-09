import {
  parseOursToModel as geminiParseOursToModel,
  parseModelToOurs as geminiParseModelToOurs,
} from "@/lib/transformer/models/google-gemini";

// our format
export function generateUserPrompt(data, type) {
  switch (type) {
    case "text":
      return {
        role: "user",
        data: [{ type: "text", data: data }],
      };
    case "image/png":
    case "image/jpeg":
      return {
        role: "user",
        data: [{ type, data: data }],
      };
  }
}

export function parseOursToModel(messages, model) {
  return messages.map((message) =>
    modelToModelMappers[model].oursToModel(message),
  );
}

export function parseModelToOurs(response, model) {
  return modelToModelMappers[model].modelToOurs(response);
}

const modelToModelMappers = {
  "gemini-2.5-flash": {
    oursToModel: geminiParseOursToModel,
    modelToOurs: geminiParseModelToOurs,
  },
  "gemini-2.5-flash-image-preview": {
    oursToModel: geminiParseOursToModel,
    modelToOurs: geminiParseModelToOurs,
  },
};
