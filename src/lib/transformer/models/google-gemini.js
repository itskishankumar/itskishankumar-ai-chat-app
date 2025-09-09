export function parseOursToModel(message) {
  return {
    role: message.role,
    parts: message.data.map((dat) => oursToPromptMapper[dat.type](dat)),
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

// our format
function mapTextResponseToText(data) {
  return {
    role: "model",
    data: [{ type: "text", data: data.data }],
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

// our format
function mapImageResponseToImage(inlineData) {
  return {
    role: "model",
    data: [
      {
        type: inlineData.type,
        data: inlineData.data,
      },
    ],
  };
}

export function parseModelToOurs(response) {
  return modelToOursMapper[response.type](response);
}

const modelToOursMapper = {
  text: mapTextResponseToText,
  "image/png": mapImageResponseToImage,
  "image/jpeg": mapImageResponseToImage,
};
