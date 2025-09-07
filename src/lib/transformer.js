import {
  parseOursToModel as geminiParseOursToModel,
  parseModelToOurs as geminiParseModelToOurs,
} from "@/lib/models/google-gemini";

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
};
