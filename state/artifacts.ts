import { create } from 'zustand';
import { GenerationResult } from '../types';

interface ArtifactsState {
  artifacts: GenerationResult[];
  addArtifact: (result: GenerationResult) => void;
  removeArtifact: (id: string) => void;
  clearArtifacts: () => void;
  getLatestArtifacts: (count: number) => GenerationResult[];
}

export const useArtifactsStore = create<ArtifactsState>((set, get) => ({
  artifacts: [],
  
  addArtifact: (result) => set((state) => ({
    artifacts: [result, ...state.artifacts].slice(0, 50) // Keep max 50 artifacts
  })),
  
  removeArtifact: (id) => set((state) => ({
    artifacts: state.artifacts.filter(a => a.id !== id)
  })),
  
  clearArtifacts: () => set({ artifacts: [] }),
  
  getLatestArtifacts: (count) => {
    const state = get();
    return state.artifacts.slice(0, count);
  }
}));

export const pushArtifact = (result: GenerationResult) => {
  useArtifactsStore.getState().addArtifact(result);
};