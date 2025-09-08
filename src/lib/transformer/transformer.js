import {
  parseOursToModel as geminiParseOursToModel,
  parseModelToOurs as geminiParseModelToOurs,
} from "@/lib/transformer/models/google-gemini";

export function generateUserPrompt(message) {
  return {
    role: "user",
    data: [{ type: "text", data: message }],
  };
}

export function parseOursToModel(history, model) {
  return history.map((data) => modelToModelMappers[model].oursToModel(data));
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
