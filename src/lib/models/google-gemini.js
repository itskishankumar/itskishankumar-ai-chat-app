export function parseOursToModel(history) {
  return {
    role: history.role,
    parts: history.data.map((dat) => oursToPromptMapper[dat.type](dat)),
  };
}

const oursToPromptMapper = {
  text: mapTextToTextPrompt,
  "image/png": mapImageToImagePrompt,
  "image/jpeg": mapImageToImagePrompt,
};

function mapTextToTextPrompt(data) {
  return {
    text: data.data,
  };
}

function mapTextResponseToText(data) {
  return {
    type: "text",
    data: data.data,
  };
}

function mapImageToImagePrompt(data) {
  return {
    inlineData: {
      mimeType: data.type,
      data: data.data,
    },
  };
}

function mapImageResponseToImage(inlineData) {
  return {
    type: inlineData.mimeType,
    data: inlineData.data,
  };
}

export function parseModelToOurs(response) {
  return modelToOursMapper[response.type](response);
}

const modelToOursMapper = {
  text: mapTextResponseToText,
  image: mapImageResponseToImage,
};
