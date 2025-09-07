import { create } from 'zustand';
import { GenerationResult } from '../types';

export interface EditorCanvas {
  id: string;
  blob?: Blob;
  hasContent: boolean;
}

interface EditorState {
  selectedAssets: GenerationResult[];
  canvas: EditorCanvas | null; // Single canvas
  isCanvasSelected: boolean; // Whether canvas is selected for editing
  currentCommand: string;
  isEditing: boolean;
  editHistory: GenerationResult[];
  
  // Actions
  selectAsset: (asset: GenerationResult) => void;
  unselectAsset: (assetId: string) => void;
  toggleAssetSelection: (asset: GenerationResult) => void;
  clearSelectedAssets: () => void;
  
  toggleCanvasSelection: () => void;
  
  initializeCanvas: () => void;
  updateCanvas: (updates: Partial<EditorCanvas>) => void;
  clearCanvas: () => void;
  
  setCurrentCommand: (command: string) => void;
  setIsEditing: (editing: boolean) => void;
  addToEditHistory: (result: GenerationResult) => void;
  clearEditHistory: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  selectedAssets: [],
  canvas: {
    id: `canvas-${Date.now()}`,
    hasContent: false
  },
  isCanvasSelected: false,
  currentCommand: '',
  isEditing: false,
  editHistory: [],
  
  selectAsset: (asset) => set((state) => {
    if (!state.selectedAssets.find(a => a.id === asset.id)) {
      return { selectedAssets: [...state.selectedAssets, asset] };
    }
    return state;
  }),
  
  unselectAsset: (assetId) => set((state) => ({
    selectedAssets: state.selectedAssets.filter(a => a.id !== assetId)
  })),
  
  toggleAssetSelection: (asset) => {
    const state = get();
    if (state.selectedAssets.find(a => a.id === asset.id)) {
      state.unselectAsset(asset.id);
    } else {
      state.selectAsset(asset);
    }
  },
  
  clearSelectedAssets: () => set({ selectedAssets: [] }),
  
  toggleCanvasSelection: () => set((state) => ({
    isCanvasSelected: !state.isCanvasSelected
  })),
  
  initializeCanvas: () => set((state) => {
    if (!state.canvas) {
      return {
        canvas: {
          id: `canvas-${Date.now()}`,
          hasContent: false
        }
      };
    }
    return state;
  }),
  
  updateCanvas: (updates) => set((state) => ({
    canvas: state.canvas ? { ...state.canvas, ...updates } : null
  })),
  
  clearCanvas: () => set((state) => ({
    canvas: state.canvas ? { ...state.canvas, hasContent: false, blob: undefined } : null,
    isCanvasSelected: false
  })),
  
  setCurrentCommand: (command) => set({ currentCommand: command }),
  
  setIsEditing: (editing) => set({ isEditing: editing }),
  
  addToEditHistory: (result) => set((state) => ({
    editHistory: [result, ...state.editHistory].slice(0, 20) // Keep last 20 edits
  })),
  
  clearEditHistory: () => set({ editHistory: [] })
}));