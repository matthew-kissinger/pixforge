import React, { useState, useEffect } from 'react';
import { useScenesStore } from '../state/scenes';
import { useArtifactsStore } from '../state/artifacts';
import { generateVideoFromImage, generateVideoFromFrames, downloadVideo } from '../services/veoService';

const ScenesPage: React.FC = () => {
  const {
    currentMode,
    selectedFrames,
    currentPrompts,
    isGenerating,
    generationProgress,
    generations,
    availableFrames,
    setMode,
    addSelectedFrame,
    removeSelectedFrame,
    clearSelectedFrames,
    updatePrompt,
    setGenerating,
    addGeneration,
    refreshAvailableFrames,
    getPresetPrompts
  } = useScenesStore();

  const { artifacts } = useArtifactsStore();
  const [error, setError] = useState<string | null>(null);

  // Refresh available frames when artifacts change
  useEffect(() => {
    refreshAvailableFrames(undefined, artifacts);
  }, [artifacts, refreshAvailableFrames]);

  const handleGenerate = async () => {
    if (selectedFrames.length === 0) {
      setError('Please select at least one frame');
      return;
    }

    if (!currentPrompts[0]?.trim()) {
      setError('Please enter a prompt for the video');
      return;
    }

    setError(null);
    setGenerating(true, 'Starting video generation...');

    try {
      let result;
      
      if (currentMode === 'single') {
        setGenerating(true, 'Generating video from single frame...');
        result = await generateVideoFromImage(
          selectedFrames[0].blob,
          currentPrompts[0]
        );
      } else if (currentMode === 'dual' && selectedFrames.length >= 2) {
        setGenerating(true, 'Generating video from first and last frame...');
        result = await generateVideoFromFrames(
          selectedFrames[0].blob,
          selectedFrames[1].blob,
          currentPrompts[0]
        );
      } else {
        throw new Error('Invalid configuration for selected mode');
      }

      // Add to generation history
      const generation = {
        id: result.id,
        mode: currentMode,
        frames: [...selectedFrames],
        prompts: [...currentPrompts],
        result,
        status: 'completed' as const,
        createdAt: new Date().toISOString()
      };

      addGeneration(generation);
      setGenerating(false, '');
      
    } catch (err) {
      console.error('Video generation failed:', err);
      setError(err instanceof Error ? err.message : 'Video generation failed');
      setGenerating(false, '');
    }
  };

  const canGenerate = selectedFrames.length > 0 && 
    currentPrompts[0]?.trim() && 
    !isGenerating &&
    ((currentMode === 'single' && selectedFrames.length === 1) ||
     (currentMode === 'dual' && selectedFrames.length === 2));

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Frame Selection */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold mb-3">Select Frames</h3>
            
            {/* Mode Selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode('single')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentMode === 'single'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Single Frame
              </button>
              <button
                onClick={() => setMode('dual')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentMode === 'dual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Start + End
              </button>
            </div>

            {/* Selected Frames */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Selected ({selectedFrames.length}/{currentMode === 'single' ? 1 : 2})
              </div>
              {selectedFrames.length > 0 ? (
                <div className="space-y-2">
                  {selectedFrames.map((frame, index) => (
                    <div key={frame.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <img
                        src={URL.createObjectURL(frame.blob)}
                        alt={frame.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span className="text-sm flex-1">{frame.name}</span>
                      <button
                        onClick={() => removeSelectedFrame(frame.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded">
                  No frames selected
                </div>
              )}
            </div>
          </div>

          {/* Available Frames */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Available Frames</div>
            {availableFrames.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableFrames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => addSelectedFrame(frame)}
                    disabled={selectedFrames.find(f => f.id === frame.id) !== undefined}
                    className={`p-2 border rounded transition-colors ${
                      selectedFrames.find(f => f.id === frame.id)
                        ? 'border-blue-500 bg-blue-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <img
                      src={URL.createObjectURL(frame.blob)}
                      alt={frame.name}
                      className="w-full h-20 object-cover rounded mb-1"
                    />
                    <div className="text-xs text-gray-600 truncate">{frame.name}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No frames available</p>
                <p className="text-xs text-gray-400 mt-1">Create assets or draw on canvas first</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - Video Generation */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-white">
            <h3 className="text-lg font-semibold mb-3">Generate Video</h3>
            
            {/* Prompt Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Prompt
              </label>
              <textarea
                value={currentPrompts[0] || ''}
                onChange={(e) => updatePrompt(0, e.target.value)}
                placeholder="Describe what should happen in the video... e.g., 'The character walks forward slowly'"
                className="w-full p-3 border border-gray-300 rounded-md resize-none h-20 text-sm"
              />
            </div>

            {/* Preset Prompts */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Quick Prompts</div>
              <div className="flex flex-wrap gap-2">
                {getPresetPrompts().slice(0, 6).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => updatePrompt(0, preset)}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                canGenerate
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>{generationProgress || 'Generating...'}</span>
                </div>
              ) : (
                'Generate Video'
              )}
            </button>

          </div>

          {/* Generation Preview Area */}
          <div className="flex-1 p-4 bg-gray-50">
            {generations.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Generated Videos</h4>
                {generations.map((generation) => (
                  <div key={generation.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{generation.mode} mode</div>
                        <div className="text-xs text-gray-500">{generation.prompts[0]}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(generation.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {generation.result && (
                      <div className="mt-3">
                        <video
                          src={URL.createObjectURL(generation.result.videoBlob)}
                          controls
                          className="w-full max-w-md rounded"
                          autoPlay={false}
                        />
                        <button
                          onClick={() => downloadVideo(generation.result!.videoBlob, `scene-${generation.id}.mp4`)}
                          className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Create Video Scenes</h2>
                  <p className="text-gray-500">Select frames and generate 8-second videos</p>
                  <p className="text-gray-400 text-sm mt-1">Powered by Veo 3</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenesPage;