
import { GenerationRequest, GenerationResult } from '../types';
import { renderPrompt, renderStrictSuffix } from '../utils/prompt';
import { validateAlphaAndSize, blobToBase64 } from '../utils/image';
import { usePromptsStore } from '../state/prompts';

// Secure API client that uses backend endpoint
async function callSecureAPI(payload: any) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
}

async function callGeminiWithImage(
  inputBlob: Blob,
  prompt: string,
  temperature?: number
): Promise<{ imageBlob: Blob; textNote?: string }> {
  const base64Data = await blobToBase64(inputBlob);
  const imageMimeType = base64Data.split(';')[0].split(':')[1];
  const imageBase64 = base64Data.split(',')[1];

  const response = await callSecureAPI({
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
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
      temperature: temperature || 0.7,
    },
  });

  let imageData: string | null = null;
  let textNote: string | null = null;

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      imageData = part.inlineData.data;
    } else if (part.text) {
      textNote = part.text;
    }
  }

  if (!imageData) {
    throw new Error("API did not return an image. Response: " + (textNote || 'No response'));
  }

  // Convert base64 to blob
  const imageBlob = await fetch(`data:image/png;base64,${imageData}`).then(res => res.blob());
  
  return { imageBlob, textNote: textNote || undefined };
}

function buildResult(
  response: { imageBlob: Blob; textNote?: string },
  promptUsed: string,
  model: string
): GenerationResult {
  return {
    id: new Date().toISOString(),
    raw: response.imageBlob,
    promptUsed,
    width: 0, // Will be updated after validation
    height: 0,
    model,
    createdAt: new Date().toISOString(),
  };
}

export async function generateAssetFromInput(request: GenerationRequest): Promise<{ result: GenerationResult }> {
  const preset = usePromptsStore.getState().getPreset(request.presetId);
  if (!preset) {
    throw new Error(`Preset not found: ${request.presetId}`);
  }

  const { system, user } = renderPrompt(preset, request.vars);
  const finalPrompt = [system, user].join('\n\n');

  // Convert input to blob if it's a string
  let inputBlob: Blob;
  if (typeof request.input === 'string') {
    inputBlob = await fetch(request.input).then(res => res.blob());
  } else {
    inputBlob = request.input;
  }

  const modelName = 'gemini-2.5-flash-image-preview';

  try {
    // First attempt
    const response = await callGeminiWithImage(
      inputBlob,
      finalPrompt,
      preset.gen?.temperature
    );

    // Validate the result
    const { targetSize } = preset.constraints || {};
    if (targetSize) {
      const [targetWidth, targetHeight] = targetSize;
      const expectAlpha = preset.constraints?.transparentBG !== false;
      
      const isValid = await validateAlphaAndSize(
        response.imageBlob,
        targetWidth,
        targetHeight,
        expectAlpha
      );

      if (!isValid) {
        console.log('First attempt failed validation, trying strict retry...');
        
        // Strict retry with additional constraints
        const retryPrompt = finalPrompt + '\n\n' + renderStrictSuffix(preset, request.vars);
        
        const retryResponse = await callGeminiWithImage(
          inputBlob,
          retryPrompt,
          preset.gen?.temperature
        );

        const result = buildResult(retryResponse, retryPrompt, modelName);
        
        // Update dimensions from validation
        const bmp = await createImageBitmap(retryResponse.imageBlob);
        result.width = bmp.width;
        result.height = bmp.height;
        
        return { result };
      }
    }

    const result = buildResult(response, finalPrompt, modelName);
    
    // Update dimensions
    const bmp = await createImageBitmap(response.imageBlob);
    result.width = bmp.width;
    result.height = bmp.height;
    
    return { result };
    
  } catch (error) {
    console.error('Gemini generation failed:', error);
    throw error;
  }
}

// Asset editing function with multi-image support
export async function editAssets(
  inputImages: Blob[],
  command: string
): Promise<GenerationResult> {
  if (inputImages.length === 0) {
    throw new Error('No input images provided');
  }

  // Create the editing system prompt
  const systemPrompt = `You are an expert game asset editor. Your job is to modify and enhance game assets based on natural language commands.

Key capabilities:
- Background removal and transparency
- Color scheme changes
- Style transfer and enhancement
- Character pose modification
- Asset combination and composition
- Quality improvement
- Lighting and shadow adjustments

When processing multiple images:
- If combining images, blend them naturally
- If transferring poses, apply the pose from one image to characters in another
- If changing colors, maintain the overall style and shading
- Preserve pixel art style if the original is pixel art

Always output a single, high-quality game asset that fulfills the user's command.
Maintain transparency where appropriate for game assets.
Keep the output dimensions reasonable for game use (typically 64x64 to 512x512 pixels).`;

  const userPrompt = `Please edit these game assets with the following instruction: ${command}

Process the provided images and create a single edited result that fulfills this command.`;

  // Prepare content parts with all input images
  const contentParts: any[] = [];
  
  // Add all images to the request
  for (let i = 0; i < inputImages.length; i++) {
    const base64Data = await blobToBase64(inputImages[i]);
    const imageMimeType = base64Data.split(';')[0].split(':')[1];
    const imageBase64 = base64Data.split(',')[1];
    
    contentParts.push({
      inlineData: {
        data: imageBase64,
        mimeType: imageMimeType,
      },
    });
  }
  
  // Add the text prompt
  contentParts.push({
    text: `${systemPrompt}\n\n${userPrompt}`
  });

  try {
    const response = await callSecureAPI({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: contentParts
      },
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
        temperature: 0.7,
      },
    });

    let imageData: string | null = null;
    let textNote: string | null = null;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
      } else if (part.text) {
        textNote = part.text;
      }
    }

    if (!imageData) {
      throw new Error("API did not return an image. Response: " + (textNote || 'No response'));
    }

    // Convert base64 to blob
    const imageBlob = await fetch(`data:image/png;base64,${imageData}`).then(res => res.blob());
    
    // Create the result
    const result: GenerationResult = {
      id: new Date().toISOString(),
      raw: imageBlob,
      promptUsed: `${systemPrompt}\n\n${userPrompt}`,
      width: 0,
      height: 0,
      model: 'gemini-2.5-flash-image-preview',
      createdAt: new Date().toISOString(),
    };

    // Update dimensions
    const bmp = await createImageBitmap(imageBlob);
    result.width = bmp.width;
    result.height = bmp.height;
    
    return result;
    
  } catch (error) {
    console.error('Asset editing failed:', error);
    throw error;
  }
}

// Legacy function for backward compatibility
export const generateAsset = async (
  canvasImage: string, // base64 data URL
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {
  const fullPrompt = `${systemPrompt}\n\nUser request: ${userPrompt}`;
  const imageMimeType = canvasImage.split(';')[0].split(':')[1];
  const imageBase64 = canvasImage.split(',')[1];
  
  const response = await callSecureAPI({
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
        responseModalities: ['IMAGE', 'TEXT'],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("API did not return an image. It may have returned text instead: " + response.text);
};
