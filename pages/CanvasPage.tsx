import React, { useState, useRef } from 'react';
import { GenerationControls } from '../components/GenerationControls';
import { ConstrainedCanvas } from '../components/ConstrainedCanvas';
import { OutputPanel } from '../components/OutputPanel';
import { useActivePreset } from '../state/prompts';
import { generateAssetFromInput } from '../services/geminiService';
import { pushArtifact } from '../state/artifacts';
import { GenerationRequest } from '../types';

const CanvasPage: React.FC = () => {
  const preset = useActivePreset();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<any>(null);

  const handleGenerate = async (userPrompt: string, variables: Record<string, string>) => {
    if (!preset || isLoading) {
      return;
    }

    // Get canvas content directly from the canvas ref
    if (!canvasRef.current) {
      setError('Canvas not ready');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Export canvas content directly when generating
      const canvasBlob = await canvasRef.current.exportCanvas();
      
      if (!canvasBlob) {
        setError('Please draw something on the canvas first');
        return;
      }

      const request: GenerationRequest = {
        input: canvasBlob,
        presetId: preset.id,
        vars: {
          ...variables,
          USER_PROMPT: userPrompt
        },
      };

      const { result } = await generateAssetFromInput(request);
      pushArtifact(result);
      
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCanvasClear = () => {
    // Canvas will handle clearing internally
  };

  if (!preset) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <p className="text-gray-500">No preset selected</p>
          <p className="text-gray-400 text-sm mt-1">Go to Prompts page to set up presets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Mobile: Top controls bar */}
      <div className="lg:hidden bg-white border-b p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{preset.label}</span>
            <span className="text-xs text-gray-500">
              {preset.constraints.targetSize?.join('×')}
            </span>
          </div>
          <button
            onClick={() => handleGenerate('pixel art character', {})}
            disabled={isLoading}
            className={`px-3 py-1 rounded text-sm ${
              isLoading
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex lg:flex-row overflow-hidden">
        {/* Left Panel - Generation Controls */}
        <div className="w-64 h-full flex-shrink-0">
          <GenerationControls
            onGenerate={handleGenerate}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Center - Constrained Canvas */}
        <div className="flex-1 h-full">
          <ConstrainedCanvas
            ref={canvasRef}
            onClear={handleCanvasClear}
          />
        </div>

        {/* Right Panel - Generated Outputs */}
        <div className="w-72 h-full flex-shrink-0">
          <OutputPanel />
        </div>
      </div>

      {/* Mobile: Bottom controls drawer - TODO: implement if needed */}
      {/* Could add expandable controls drawer here for mobile */}
    </div>
  );
};

export default CanvasPage;