
import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as fabric from 'fabric';
import { ToolsPanel } from './components/ToolsPanel';
import { CanvasArea } from './components/CanvasArea';
import { GenerationPanel } from './components/GenerationPanel';
import { Header } from './components/Header';
import { PRESETS } from './constants';
import type { PresetId, GenerationHistoryItem } from './types';
import { generateAsset } from './services/geminiService';
import { ImageModal } from './components/ImageModal';

const App: React.FC = () => {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [brushColor, setBrushColor] = useState<string>('#000000');
  
  const [selectedPresetId, setSelectedPresetId] = useState<PresetId>('pixel-art-16bit');
  const [userPrompt, setUserPrompt] = useState<string>(PRESETS['pixel-art-16bit'].defaultText);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<GenerationHistoryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const history = useRef<{ states: string[], index: number }>({ states: [], index: -1 });
  // Used to force a re-render after undo/redo, synchronizing React with the canvas state.
  const [historyCounter, setHistoryCounter] = useState(0);

  const saveCanvasState = useCallback(() => {
    if (!fabricCanvas) return;

    const state = JSON.stringify(fabricCanvas.toJSON());

    // Don't save if state is identical to the last one in history
    if (history.current.index >= 0 && history.current.states[history.current.index] === state) {
      return;
    }
    
    // If we are not at the end of the history, slice it
    if (history.current.index < history.current.states.length - 1) {
      history.current.states = history.current.states.slice(0, history.current.index + 1);
    }
    
    history.current.states.push(state);
    history.current.index++;

    // Limit history to 20 steps
    if (history.current.states.length > 21) {
      history.current.states.shift();
      history.current.index--;
    }
  }, [fabricCanvas]);

  useEffect(() => {
    // Save the initial state once the canvas is ready and history is empty
    if (fabricCanvas && history.current.index === -1) {
        saveCanvasState();
    }
  }, [fabricCanvas, saveCanvasState]);
  
  const undo = useCallback(() => {
    if (history.current.index > 0 && fabricCanvas) {
      history.current.index--;
      const prevState = history.current.states[history.current.index];
      // loadFromJSON is async. Its callback now only signals React that a change occurred.
      // The actual canvas render is handled by a useEffect in CanvasArea,
      // which is triggered by the historyCounter state change.
      fabricCanvas.loadFromJSON(prevState, () => {
        setHistoryCounter(c => c + 1);
      });
    }
  }, [fabricCanvas]);
  
  const redo = useCallback(() => {
    if (history.current.index < history.current.states.length - 1 && fabricCanvas) {
      history.current.index++;
      const nextState = history.current.states[history.current.index];
      // The callback now only signals React that a change occurred.
      fabricCanvas.loadFromJSON(nextState, () => {
        setHistoryCounter(c => c + 1);
      });
    }
  }, [fabricCanvas]);

  const handleGenerate = async () => {
    if (!fabricCanvas || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // FIX: Add multiplier property to satisfy fabric.js TDataUrlOptions type.
      const canvasImage = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1.0,
        multiplier: 1,
      });

      const preset = PRESETS[selectedPresetId];
      const result = await generateAsset(canvasImage, preset.systemPrompt, userPrompt);
      
      const newHistoryItem: GenerationHistoryItem = {
        id: new Date().toISOString(),
        generatedImage: `data:image/png;base64,${result}`,
        prompt: userPrompt,
        presetId: selectedPresetId,
      };

      setGenerationHistory(prev => [newHistoryItem, ...prev].slice(0, 5));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetChange = (presetId: PresetId) => {
    setSelectedPresetId(presetId);
    setUserPrompt(PRESETS[presetId].defaultText);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-4 p-4">
        <ToolsPanel 
          fabricCanvas={fabricCanvas}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          undo={undo}
          redo={redo}
          saveState={saveCanvasState}
        />
        <CanvasArea 
          setFabricCanvas={setFabricCanvas}
          activeTool={activeTool}
          brushSize={brushSize}
          brushColor={brushColor}
          saveState={saveCanvasState}
          historyCounter={historyCounter}
        />
        <GenerationPanel 
          selectedPresetId={selectedPresetId}
          onPresetChange={handlePresetChange}
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
          history={generationHistory}
          onHistoryItemClick={(item) => setSelectedImage(item.generatedImage)}
        />
      </main>
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};

export default App;
