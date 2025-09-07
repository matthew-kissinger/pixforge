import { useState } from 'react';
import { useEditorStore } from '../state/editor';
import { editAssets } from '../services/geminiService';
import { pushArtifact } from '../state/artifacts';

export const useAssetEditor = () => {
  const { 
    selectedAssets, 
    canvas, 
    isCanvasSelected, 
    setIsEditing, 
    addToEditHistory, 
    setCurrentCommand 
  } = useEditorStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async (command: string) => {
    if (isLoading) return;

    const hasCanvasBlob = canvas?.blob && isCanvasSelected;
    
    if (selectedAssets.length === 0 && !hasCanvasBlob) {
      setError('Please select some assets or select the canvas first');
      return;
    }

    setIsLoading(true);
    setIsEditing(true);
    setError(null);
    setCurrentCommand(command);

    try {
      const inputImages: Blob[] = [];
      
      // Add selected assets
      for (const asset of selectedAssets) {
        inputImages.push(asset.raw);
      }
      
      // Add canvas if selected and has content
      if (hasCanvasBlob) {
        inputImages.push(canvas.blob);
      }

      if (inputImages.length === 0) {
        throw new Error('No images to process');
      }

      console.log(`Processing ${inputImages.length} images with command: ${command}`);
      
      const result = await editAssets(inputImages, command);
      
      pushArtifact(result);
      addToEditHistory(result);
      
      setError(null);
      
    } catch (err) {
      console.error('Edit failed:', err);
      setError(err instanceof Error ? err.message : 'Edit failed');
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const hasAssets = selectedAssets.length > 0;
  const hasCanvasSelected = canvas?.blob && isCanvasSelected;
  const canEdit = hasAssets || hasCanvasSelected;

  return {
    isLoading,
    error,
    canEdit,
    hasAssets,
    hasCanvasSelected,
    selectedAssetsCount: selectedAssets.length,
    handleEdit
  };
};