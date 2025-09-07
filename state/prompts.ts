import { create } from 'zustand';
import { PromptPreset } from '../types';
import { PIXEL_PRESETS } from '../constants';

interface PromptsState {
  presets: PromptPreset[];
  activePresetId: string | null;
  setPresets: (presets: PromptPreset[]) => void;
  addPreset: (preset: PromptPreset) => void;
  updatePreset: (id: string, preset: Partial<PromptPreset>) => void;
  deletePreset: (id: string) => void;
  setActivePreset: (id: string) => void;
  getActivePreset: () => PromptPreset | null;
  getPreset: (id: string) => PromptPreset | null;
}

export const usePromptsStore = create<PromptsState>((set, get) => ({
  presets: PIXEL_PRESETS,
  activePresetId: PIXEL_PRESETS[0]?.id || null,
  
  setPresets: (presets) => set({ presets }),
  
  addPreset: (preset) => set((state) => ({
    presets: [...state.presets, preset]
  })),
  
  updatePreset: (id, updates) => set((state) => ({
    presets: state.presets.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  deletePreset: (id) => set((state) => ({
    presets: state.presets.filter(p => p.id !== id),
    activePresetId: state.activePresetId === id ? 
      state.presets.find(p => p.id !== id)?.id || null : 
      state.activePresetId
  })),
  
  setActivePreset: (id) => set({ activePresetId: id }),
  
  getActivePreset: () => {
    const state = get();
    return state.presets.find(p => p.id === state.activePresetId) || null;
  },
  
  getPreset: (id) => {
    const state = get();
    return state.presets.find(p => p.id === id) || null;
  }
}));

export const useActivePreset = () => {
  const activePresetId = usePromptsStore(state => state.activePresetId);
  const getPreset = usePromptsStore(state => state.getPreset);
  return activePresetId ? getPreset(activePresetId) : null;
};