
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAsset = async (
  canvasImage: string, // base64 data URL
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {

  const fullPrompt = `${systemPrompt}\n\nUser request: ${userPrompt}`;

  const imageMimeType = canvasImage.split(';')[0].split(':')[1];
  const imageBase64 = canvasImage.split(',')[1];
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageMimeType,
          },
        },
        {
          text: fullPrompt,
        },
      ],
    },
    config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("API did not return an image. It may have returned text instead: " + response.text);
};
