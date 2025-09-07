import React, { useState } from 'react';
import { PromptPreset, GenerationRequest } from '../types';
import { usePromptsStore } from '../state/prompts';
import { generateAssetFromInput } from '../services/geminiService';
import { pushArtifact } from '../state/artifacts';

const PromptsPage: React.FC = () => {
  const { presets, activePresetId, setActivePreset, addPreset, updatePreset, deletePreset } = usePromptsStore();
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [newPreset, setNewPreset] = useState<Partial<PromptPreset> | null>(null);
  const [testingPreset, setTestingPreset] = useState<string | null>(null);

  const handleEdit = (preset: PromptPreset) => {
    setEditingPreset(preset.id);
    setNewPreset({ ...preset });
  };

  const handleSave = () => {
    if (!newPreset || !editingPreset) return;

    const updated: PromptPreset = {
      id: editingPreset,
      label: newPreset.label || '',
      type: newPreset.type || 'sprite',
      system: newPreset.system || '',
      userTemplate: newPreset.userTemplate || '',
      variables: newPreset.variables || {},
      constraints: newPreset.constraints || {},
      gen: newPreset.gen,
      notes: newPreset.notes,
      version: (newPreset.version || 0) + 1,
      active: newPreset.active
    };

    updatePreset(editingPreset, updated);
    setEditingPreset(null);
    setNewPreset(null);
  };

  const handleCancel = () => {
    setEditingPreset(null);
    setNewPreset(null);
  };

  const handleCreateNew = () => {
    const newId = `preset-${Date.now()}`;
    const preset: PromptPreset = {
      id: newId,
      label: 'New Preset',
      type: 'sprite',
      system: 'System prompt here...',
      userTemplate: 'User template here...',
      variables: {
        STYLE: ['16-bit console', 'NES-like 8-bit'],
        SUBJECT: ['robot', 'knight'],
        W: ['96'],
        H: ['96']
      },
      constraints: {
        transparentBG: true,
        targetSize: [96, 96],
        paletteColors: 12
      },
      version: 1,
      active: false
    };

    addPreset(preset);
    setEditingPreset(newId);
    setNewPreset(preset);
  };

  const handleTest = async (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    setTestingPreset(presetId);

    try {
      // Create a simple test canvas (transparent square)
      const canvas = document.createElement('canvas');
      canvas.width = 96;
      canvas.height = 96;
      const ctx = canvas.getContext('2d')!;
      
      // Draw a simple shape for testing
      ctx.fillStyle = '#4299e1';
      ctx.fillRect(20, 20, 56, 56);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(blob => resolve(blob!), 'image/png');
      });

      // Create test request with default variables
      const defaultVars: Record<string, string> = {};
      Object.entries(preset.variables).forEach(([key, values]) => {
        defaultVars[key] = values[0] || '';
      });

      const request: GenerationRequest = {
        input: blob,
        presetId: preset.id,
        vars: defaultVars,
      };

      const { result } = await generateAssetFromInput(request);
      pushArtifact(result);
      
    } catch (error) {
      console.error('Test generation failed:', error);
    } finally {
      setTestingPreset(null);
    }
  };

  const renderVariableEditor = (variables: Record<string, string[]>) => {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Variables</label>
        {Object.entries(variables).map(([key, values]) => (
          <div key={key} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={key}
              onChange={(e) => {
                if (!newPreset) return;
                const newVars = { ...newPreset.variables };
                delete newVars[key];
                newVars[e.target.value] = values;
                setNewPreset({ ...newPreset, variables: newVars });
              }}
              className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Variable name"
            />
            <input
              type="text"
              value={values.join(', ')}
              onChange={(e) => {
                if (!newPreset) return;
                const newValues = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                const newVars = { ...newPreset.variables };
                newVars[key] = newValues;
                setNewPreset({ ...newPreset, variables: newVars });
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Values (comma-separated)"
            />
            <button
              onClick={() => {
                if (!newPreset) return;
                const newVars = { ...newPreset.variables };
                delete newVars[key];
                setNewPreset({ ...newPreset, variables: newVars });
              }}
              className="px-2 py-2 text-red-600 hover:text-red-800 text-sm"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            if (!newPreset) return;
            const newVars = { ...newPreset.variables };
            newVars['NEW_VAR'] = ['value1', 'value2'];
            setNewPreset({ ...newPreset, variables: newVars });
          }}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
        >
          Add Variable
        </button>
      </div>
    );
  };

  if (editingPreset && newPreset) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Preset</h1>
          <div className="space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
              <input
                type="text"
                value={newPreset.label || ''}
                onChange={(e) => setNewPreset({ ...newPreset, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newPreset.type || 'sprite'}
                onChange={(e) => setNewPreset({ ...newPreset, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="sprite">Sprite</option>
                <option value="prop">Prop</option>
                <option value="tile">Tile</option>
                <option value="background">Background</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
            <textarea
              value={newPreset.system || ''}
              onChange={(e) => setNewPreset({ ...newPreset, system: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="System prompt with rules and constraints..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Template</label>
            <textarea
              value={newPreset.userTemplate || ''}
              onChange={(e) => setNewPreset({ ...newPreset, userTemplate: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="User template with variables like {SUBJECT}, {STYLE}..."
            />
          </div>

          {newPreset.variables && renderVariableEditor(newPreset.variables)}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newPreset.constraints?.transparentBG !== false}
                  onChange={(e) => setNewPreset({
                    ...newPreset,
                    constraints: { ...newPreset.constraints, transparentBG: e.target.checked }
                  })}
                />
                <span className="text-sm">Transparent Background</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Size</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={newPreset.constraints?.targetSize?.[0] || 96}
                  onChange={(e) => setNewPreset({
                    ...newPreset,
                    constraints: {
                      ...newPreset.constraints,
                      targetSize: [parseInt(e.target.value) || 96, newPreset.constraints?.targetSize?.[1] || 96]
                    }
                  })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-gray-500 text-sm pt-1">×</span>
                <input
                  type="number"
                  value={newPreset.constraints?.targetSize?.[1] || 96}
                  onChange={(e) => setNewPreset({
                    ...newPreset,
                    constraints: {
                      ...newPreset.constraints,
                      targetSize: [newPreset.constraints?.targetSize?.[0] || 96, parseInt(e.target.value) || 96]
                    }
                  })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Palette Colors</label>
              <input
                type="number"
                min="4"
                max="256"
                value={newPreset.constraints?.paletteColors || 12}
                onChange={(e) => setNewPreset({
                  ...newPreset,
                  constraints: { ...newPreset.constraints, paletteColors: parseInt(e.target.value) || 12 }
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prompt Presets</h1>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className={`bg-white rounded-lg shadow-sm border p-6 space-y-4 ${
              preset.id === activePresetId ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{preset.label}</h3>
                <span className="text-sm text-gray-500 capitalize">{preset.type}</span>
              </div>
              {preset.id === activePresetId && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Active
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Size:</strong> {preset.constraints.targetSize?.join('×') || 'Any'}</p>
              <p><strong>Colors:</strong> {preset.constraints.paletteColors || 'Unlimited'}</p>
              <p><strong>Alpha:</strong> {preset.constraints.transparentBG ? 'Yes' : 'No'}</p>
            </div>

            <div className="text-xs text-gray-500">
              <p className="truncate">{preset.system.slice(0, 100)}...</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActivePreset(preset.id)}
                disabled={preset.id === activePresetId}
                className={`px-3 py-1 rounded-md text-sm ${
                  preset.id === activePresetId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Set Active
              </button>
              <button
                onClick={() => handleTest(preset.id)}
                disabled={testingPreset === preset.id}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:bg-gray-300"
              >
                {testingPreset === preset.id ? 'Testing...' : 'Test'}
              </button>
              <button
                onClick={() => handleEdit(preset)}
                className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
              >
                Edit
              </button>
              {presets.length > 1 && (
                <button
                  onClick={() => deletePreset(preset.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptsPage;