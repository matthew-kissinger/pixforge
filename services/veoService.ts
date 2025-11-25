import { GoogleGenAI, PersonGeneration } from "@google/genai";
import { blobToBase64 } from '../utils/image';

// Initialize AI client lazily to avoid errors during development
let ai: GoogleGenAI | null = null;
let apiKey: string | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    // In browser environment, process.env is set by Vite config
    apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
             (typeof process !== 'undefined' && process.env?.API_KEY) || 
             (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);
    if (!apiKey) {
      throw new Error("API key not found. Set VITE_GEMINI_API_KEY, GEMINI_API_KEY, or API_KEY");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

function getApiKey(): string {
  if (!apiKey) {
    getAI(); // This will initialize the apiKey
  }
  return apiKey!;
}

export interface VideoGenerationResult {
  id: string;
  videoBlob: Blob;
  prompt: string;
  createdAt: string;
  duration: number; // seconds
  resolution: string;
}

export interface VideoGenerationOptions {
  aspectRatio?: '16:9' | '9:16';
  duration?: number; // 5-8 seconds
  model?: string;
}

// Generate video from single image (most common use case)
export async function generateVideoFromImage(
  image: Blob,
  prompt: string,
  options: VideoGenerationOptions = {}
): Promise<VideoGenerationResult> {
  const {
    aspectRatio = '16:9',
    duration = 8,
    model = 'veo-3.0-generate-001'
  } = options;

  try {
    // Convert image to base64
    const base64Data = await blobToBase64(image);
    const imageMimeType = base64Data.split(';')[0].split(':')[1];
    const imageBase64 = base64Data.split(',')[1];

    console.log('Starting Veo 3 video generation...');

    // Generate video with Veo using correct image parameter structure
    console.log('Calling generateVideos with model:', model);
    
    const operation = await getAI().models.generateVideos({
      model,
      prompt,
      image: {
        imageBytes: imageBase64,
        mimeType: imageMimeType,
      },
      config: {
        numberOfVideos: 1,
        aspectRatio: aspectRatio,
        durationSeconds: duration,
        personGeneration: PersonGeneration.ALLOW_ADULT,
      }
    });

    console.log('Video generation operation started, polling for completion...');

    // Poll until the operation is complete using correct polling method
    let completedOperation = operation;
    while (!completedOperation.done) {
      console.log('Waiting for video generation to complete...');
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      completedOperation = await getAI().operations.getVideosOperation({
        operation: completedOperation,
      });
    }

    if (completedOperation.error) {
      throw new Error(`Video generation failed: ${completedOperation.error.message}`);
    }

    // Get the generated video
    const generatedVideos = completedOperation.response?.generatedVideos;
    if (!generatedVideos || generatedVideos.length === 0) {
      throw new Error('No video was generated');
    }

    const generatedVideo = generatedVideos[0];
    if (!generatedVideo.video) {
      throw new Error('No video file was generated');
    }

    // Download the video blob using fetch from URI
    const videoUri = generatedVideo.video?.uri;
    if (!videoUri) {
      throw new Error('No video URI was provided');
    }
    
    const videoResponse = await fetch(`${videoUri}&key=${getApiKey()}`);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();

    const result: VideoGenerationResult = {
      id: new Date().toISOString(),
      videoBlob,
      prompt,
      createdAt: new Date().toISOString(),
      duration,
      resolution: aspectRatio === '16:9' ? '1280x720' : '720x1280',
    };

    console.log('Video generation completed successfully');
    return result;

  } catch (error) {
    console.error('Veo video generation failed:', error);
    throw error;
  }
}

// Generate video from first and last frame
export async function generateVideoFromFrames(
  firstFrame: Blob,
  lastFrame: Blob,
  prompt: string,
  options: VideoGenerationOptions = {}
): Promise<VideoGenerationResult> {
  const {
    aspectRatio = '16:9',
    duration = 8,
    model = 'veo-3.0-generate-001'
  } = options;

  try {
    // Convert images to base64
    const firstFrameBase64 = await blobToBase64(firstFrame);
    const lastFrameBase64 = await blobToBase64(lastFrame);
    
    const firstImageMimeType = firstFrameBase64.split(';')[0].split(':')[1];
    const firstImageBase64 = firstFrameBase64.split(',')[1];
    
    const lastImageMimeType = lastFrameBase64.split(';')[0].split(':')[1];
    const lastImageBase64 = lastFrameBase64.split(',')[1];

    console.log('Starting Veo 3 first+last frame video generation...');

    // Generate video with first frame (last frame not supported in current API)
    // Note: VEO API currently only supports single image input
    const operation = await getAI().models.generateVideos({
      model,
      prompt: `${prompt} (transition from the provided image to create a video sequence)`,
      image: {
        imageBytes: firstImageBase64,
        mimeType: firstImageMimeType,
      },
      config: {
        numberOfVideos: 1,
        aspectRatio: aspectRatio,
        durationSeconds: duration,
        personGeneration: PersonGeneration.ALLOW_ADULT,
      }
    });

    console.log('Video generation operation started, polling for completion...');

    // Poll until complete
    let completedOperation = operation;
    while (!completedOperation.done) {
      console.log('Waiting for video generation to complete...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      completedOperation = await getAI().operations.getVideosOperation({
        operation: completedOperation,
      });
    }

    if (completedOperation.error) {
      throw new Error(`Video generation failed: ${completedOperation.error.message}`);
    }

    // Get the generated video
    const generatedVideos = completedOperation.response?.generatedVideos;
    if (!generatedVideos || generatedVideos.length === 0) {
      throw new Error('No video was generated');
    }

    const generatedVideo = generatedVideos[0];
    if (!generatedVideo.video) {
      throw new Error('No video file was generated');
    }

    // Download the video blob using fetch from URI
    const videoUri = generatedVideo.video?.uri;
    if (!videoUri) {
      throw new Error('No video URI was provided');
    }
    
    const videoResponse = await fetch(`${videoUri}&key=${getApiKey()}`);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();

    const result: VideoGenerationResult = {
      id: new Date().toISOString(),
      videoBlob,
      prompt,
      createdAt: new Date().toISOString(),
      duration,
      resolution: aspectRatio === '16:9' ? '1280x720' : '720x1280',
    };

    console.log('First+last frame video generation completed successfully');
    return result;

  } catch (error) {
    console.error('Veo first+last frame video generation failed:', error);
    throw error;
  }
}

// Generate video sequence from multiple frames (future enhancement)
export async function generateVideoSequence(
  frames: Blob[],
  prompts: string[],
  options: VideoGenerationOptions = {}
): Promise<VideoGenerationResult[]> {
  // For now, generate individual videos for each frame
  // In the future, this could chain videos together or use multi-frame generation
  const results: VideoGenerationResult[] = [];
  
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const prompt = prompts[i] || prompts[0]; // Use first prompt if not enough prompts provided
    
    try {
      const result = await generateVideoFromImage(frame, prompt, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate video for frame ${i}:`, error);
      throw error;
    }
  }
  
  return results;
}

// Helper function to get operation status
export async function getOperationStatus(operation: any): Promise<any> {
  return getAI().operations.get({ operation });
}

// Helper to download video file
export function downloadVideo(videoBlob: Blob, filename: string = 'scene-video.mp4'): void {
  const url = URL.createObjectURL(videoBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}