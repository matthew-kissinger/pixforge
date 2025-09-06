
import React from 'react';
import { PRESETS } from '../constants';
import type { PresetId, GenerationHistoryItem } from '../types';
import { SparklesIcon } from './icons/EditorIcons';

interface GenerationPanelProps {
  selectedPresetId: PresetId;
  onPresetChange: (id: PresetId) => void;
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
  history: GenerationHistoryItem[];
  onHistoryItemClick: (item: GenerationHistoryItem) => void;
}

export const GenerationPanel: React.FC<GenerationPanelProps> = ({
  selectedPresetId,
  onPresetChange,
  userPrompt,
  setUserPrompt,
  onGenerate,
  isLoading,
  error,
  history,
  onHistoryItemClick,
}) => {
  return (
    <aside className="bg-white rounded-lg p-4 flex flex-col shadow-md border border-gray-200">
      <div className="flex-grow flex flex-col space-y-4">
        <div>
          <label htmlFor="preset-select" className="block text-sm font-medium text-blue-500 mb-1">
            Asset Style Preset
          </label>
          <select
            id="preset-select"
            value={selectedPresetId}
            onChange={(e) => onPresetChange(e.target.value as PresetId)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(PRESETS).map(([id, preset]) => (
              <option key={id} value={id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="user-prompt" className="block text-sm font-medium text-blue-500 mb-1">
            Prompt
          </label>
          <textarea
            id="user-prompt"
            rows={4}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="e.g., a magical sword"
          />
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full flex justify-center items-center p-3 font-semibold text-white bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon />
              <span className="ml-2">Generate</span>
            </>
          )}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-300">
        <h3 className="text-lg font-semibold mb-3 text-blue-500">History</h3>
        {history.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {history.map((item) => (
              <div key={item.id} className="relative group cursor-pointer" onClick={() => onHistoryItemClick(item)}>
                <img
                  src={item.generatedImage}
                  alt={item.prompt}
                  className="w-full h-24 object-cover rounded-md border border-gray-200"
                />
                 <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md">
                    <p className="text-white text-xs text-center p-1">{PRESETS[item.presetId].name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center">Your generated assets will appear here.</p>
        )}
      </div>
    </aside>
  );
};