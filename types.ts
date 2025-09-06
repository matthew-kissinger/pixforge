
import { PRESETS } from './constants';

export type PresetId = keyof typeof PRESETS;

export interface Preset {
  name: string;
  systemPrompt: string;
  defaultText: string;
}

export interface GenerationHistoryItem {
  id: string;
  generatedImage: string; // base64 string
  prompt: string;
  presetId: PresetId;
}
