import { create } from 'zustand';
import { GenerationResult } from '../types';
import { VideoGenerationResult } from '../services/veoService';

export type SceneMode = 'single' | 'dual' | 'sequence';

export interface SceneFrame {
  id: string;
  blob: Blob;
  name: string;
  type: 'canvas' | 'asset';
  sourceId?: string; // Reference to original asset ID
}

export interface SceneGeneration {
  id: string;
  mode: SceneMode;
  frames: SceneFrame[];
  prompts: string[];
  result?: VideoGenerationResult;
  status: 'idle' | 'generating' | 'completed' | 'error';
  error?: string;
  createdAt: string;
}

interface ScenesState {
  // Current scene being edited
  currentMode: SceneMode;
  selectedFrames: SceneFrame[];
  currentPrompts: string[];
  
  // Generation state
  isGenerating: boolean;
  generationProgress: string;
  
  // History
  generations: SceneGeneration[];
  
  // Available frames (from canvas exports and assets)
  availableFrames: SceneFrame[];
  
  // Actions
  setMode: (mode: SceneMode) => void;
  addSelectedFrame: (frame: SceneFrame) => void;
  removeSelectedFrame: (frameId: string) => void;
  clearSelectedFrames: () => void;
  reorderSelectedFrames: (fromIndex: number, toIndex: number) => void;
  
  updatePrompt: (index: number, prompt: string) => void;
  clearPrompts: () => void;
  
  setGenerating: (generating: boolean, progress?: string) => void;
  
  addGeneration: (generation: SceneGeneration) => void;
  updateGeneration: (id: string, updates: Partial<SceneGeneration>) => void;
  removeGeneration: (id: string) => void;
  clearGenerations: () => void;
  
  refreshAvailableFrames: (canvasBlob?: Blob, assets?: GenerationResult[]) => void;
  
  // Preset prompts for quick selection
  getPresetPrompts: () => string[];
}

const presetPrompts = [
  'The character walks forward slowly',
  'Zoom in on the character',
  'Pan the camera left to right',
  'The character jumps up and down',
  'Add gentle wind effects',
  'The character looks around',
  'Fade from day to night',
  'The character attacks forward',
  'Add magical sparkles',
  'The scene comes alive with movement'
];

export const useScenesStore = create<ScenesState>((set, get) => ({
  // Initial state
  currentMode: 'single',
  selectedFrames: [],
  currentPrompts: [],
  isGenerating: false,
  generationProgress: '',
  generations: [],
  availableFrames: [],
  
  // Mode management
  setMode: (mode) => set((state) => {
    // Clear selected frames when switching modes
    const maxFrames = mode === 'single' ? 1 : mode === 'dual' ? 2 : 10;
    return {
      currentMode: mode,
      selectedFrames: state.selectedFrames.slice(0, maxFrames),
      currentPrompts: mode === 'single' ? state.currentPrompts.slice(0, 1) : state.currentPrompts
    };
  }),
  
  // Frame selection
  addSelectedFrame: (frame) => set((state) => {
    const maxFrames = state.currentMode === 'single' ? 1 : 
                     state.currentMode === 'dual' ? 2 : 10;
    
    // Don't add if already selected
    if (state.selectedFrames.find(f => f.id === frame.id)) {
      return state;
    }
    
    // For single mode, replace the frame
    if (state.currentMode === 'single') {
      return {
        selectedFrames: [frame],
        currentPrompts: state.currentPrompts.slice(0, 1)
      };
    }
    
    // For other modes, add up to the limit
    const newFrames = [...state.selectedFrames, frame].slice(0, maxFrames);
    return {
      selectedFrames: newFrames
    };
  }),
  
  removeSelectedFrame: (frameId) => set((state) => ({
    selectedFrames: state.selectedFrames.filter(f => f.id !== frameId)
  })),
  
  clearSelectedFrames: () => set({
    selectedFrames: [],
    currentPrompts: []
  }),
  
  reorderSelectedFrames: (fromIndex, toIndex) => set((state) => {
    const newFrames = [...state.selectedFrames];
    const [moved] = newFrames.splice(fromIndex, 1);
    newFrames.splice(toIndex, 0, moved);
    return { selectedFrames: newFrames };
  }),
  
  // Prompt management
  updatePrompt: (index, prompt) => set((state) => {
    const newPrompts = [...state.currentPrompts];
    newPrompts[index] = prompt;
    return { currentPrompts: newPrompts };
  }),
  
  clearPrompts: () => set({ currentPrompts: [] }),
  
  // Generation state
  setGenerating: (generating, progress = '') => set({
    isGenerating: generating,
    generationProgress: progress
  }),
  
  // Generation history
  addGeneration: (generation) => set((state) => ({
    generations: [generation, ...state.generations].slice(0, 20) // Keep last 20
  })),
  
  updateGeneration: (id, updates) => set((state) => ({
    generations: state.generations.map(g => 
      g.id === id ? { ...g, ...updates } : g
    )
  })),
  
  removeGeneration: (id) => set((state) => ({
    generations: state.generations.filter(g => g.id !== id)
  })),
  
  clearGenerations: () => set({ generations: [] }),
  
  // Available frames management
  refreshAvailableFrames: (canvasBlob, assets = []) => {
    const frames: SceneFrame[] = [];
    
    // Add canvas frame if available
    if (canvasBlob) {
      frames.push({
        id: `canvas-${Date.now()}`,
        blob: canvasBlob,
        name: 'Current Canvas',
        type: 'canvas'
      });
    }
    
    // Add asset frames
    assets.forEach((asset, index) => {
      frames.push({
        id: `asset-${asset.id}`,
        blob: asset.raw,
        name: `Asset ${index + 1}`,
        type: 'asset',
        sourceId: asset.id
      });
    });
    
    set({ availableFrames: frames });
  },
  
  // Preset prompts
  getPresetPrompts: () => presetPrompts
}));