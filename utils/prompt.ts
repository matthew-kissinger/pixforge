import { PromptPreset } from '../types';

export function renderPrompt(preset: PromptPreset, vars: Record<string, string>) {
  const fill = (s: string) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  return { 
    system: fill(preset.system), 
    user: fill(preset.userTemplate) 
  };
}

export function renderStrictSuffix(preset: PromptPreset, vars: Record<string, string>) {
  const fill = (s: string) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  return fill(`

STRICT: This is for a game engine sprite. Output MUST be exactly {W}x{H} pixels. Create only the sprite artwork with clean edges. No gradients, glows, drop shadows, or padding around the character.`);
}