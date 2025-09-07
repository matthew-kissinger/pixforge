import React, { useState } from 'react';
import { usePromptsStore, useActivePreset } from '../state/prompts';
import { PromptPreset } from '../types';

interface GenerationControlsProps {
  onGenerate: (userPrompt: string, variables: Record<string, string>) => void;
  isLoading: boolean;
  error: string | null;
}

export const GenerationControls: React.FC<GenerationControlsProps> = ({
  onGenerate,
  isLoading,
  error
}) => {
  const { presets, activePresetId, setActivePreset } = usePromptsStore();
  const activePreset = useActivePreset();
  const [userPrompt, setUserPrompt] = useState('game character');
  const [variables, setVariables] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (activePreset) {
      // Initialize variables with first option from each variable array
      const defaultVars: Record<string, string> = {};
      Object.entries(activePreset.variables).forEach(([key, values]) => {
        defaultVars[key] = values[0] || '';
      });
      setVariables(defaultVars);
    }
  }, [activePreset?.id]);

  const handlePresetChange = (presetId: string) => {
    setActivePreset(presetId);
  };

  const handleGenerate = () => {
    onGenerate(userPrompt, variables);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-3 space-y-4 overflow-y-auto h-full">
      <div className="border-b border-gray-100 pb-3 mb-3">
        <h2 className="text-base font-semibold mb-3">Controls</h2>
        
        {/* Generate Button at Top */}
        <button
          onClick={handleGenerate}
          disabled={!activePreset || isLoading || !userPrompt.trim()}
          className={`w-full px-4 py-3 rounded-md font-medium text-sm ${
            !activePreset || isLoading || !userPrompt.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Asset'}
        </button>
      </div>

      {/* Preset Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preset
        </label>
        <select
          value={activePresetId || ''}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      {/* User Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={2}
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
          placeholder="Describe what you want to generate..."
        />
      </div>

      {/* Variables */}
      {activePreset && Object.keys(activePreset.variables).length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Style Variables
          </label>
          <div className="space-y-2">
            {Object.entries(activePreset.variables).map(([key, options]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {key.replace(/_/g, ' ').toLowerCase()}
                </label>
                <select
                  value={variables[key] || options[0]}
                  onChange={(e) => setVariables({
                    ...variables,
                    [key]: e.target.value
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints Info */}
      {activePreset && (
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Output Settings</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Size:</strong> {activePreset.constraints.targetSize?.join('×') || 'Any'}</p>
            <p><strong>Colors:</strong> {activePreset.constraints.paletteColors || 'Unlimited'}</p>
            <p><strong>Background:</strong> {activePreset.constraints.transparentBG ? 'Transparent' : 'Solid'}</p>
            <p><strong>Type:</strong> {activePreset.type}</p>
          </div>
        </div>
      )}


      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Workflow Help */}
      <div className="border-t pt-4 text-xs text-gray-500">
        <p className="mb-2"><strong>Workflow:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Draw a rough sketch on the canvas</li>
          <li>Describe what you want to create</li>
          <li>Adjust style variables if needed</li>
          <li>Click Generate Asset</li>
          <li>View and export results on the right</li>
        </ol>
      </div>
    </div>
  );
};