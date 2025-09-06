import React, { useRef } from 'react';
import * as fabric from 'fabric';
import { BrushIcon, CircleIcon, CursorArrowIcon, EraserIcon, RedoIcon, RectangleIcon, TrashIcon, UndoIcon, UploadIcon } from './icons/EditorIcons';

interface ToolsPanelProps {
  fabricCanvas: fabric.Canvas | null;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  undo: () => void;
  redo: () => void;
  saveState: () => void;
}

const ToolButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    title={label}
    onClick={onClick}
    className={`flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {icon}
  </button>
);


export const ToolsPanel: React.FC<ToolsPanelProps> = ({
  fabricCanvas,
  activeTool,
  setActiveTool,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  undo,
  redo,
  saveState,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
  };
  
  const addShape = (shapeType: 'rect' | 'circle') => {
    if (!fabricCanvas) return;
    let shape;
    if (shapeType === 'rect') {
      shape = new fabric.Rect({
        left: 100,
        top: 100,
        fill: brushColor,
        width: 100,
        height: 100,
      });
    } else {
      shape = new fabric.Circle({
        left: 100,
        top: 100,
        fill: brushColor,
        radius: 50,
      });
    }
    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.renderAll();
    saveState();
    // Switch to select tool for immediate manipulation
    setActiveTool('select');
  };

  const clearCanvas = () => {
    if (fabricCanvas && window.confirm('Are you sure you want to clear the canvas?')) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = '#FFFFFF';
      fabricCanvas.renderAll();
      saveState();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && fabricCanvas) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgObj = new Image();
        imgObj.src = event.target?.result as string;
        imgObj.onload = () => {
          const image = new fabric.Image(imgObj);
          const canvasWidth = fabricCanvas.width || 512;
          image.scaleToWidth(canvasWidth / 2);
          fabricCanvas.centerObject(image);
          fabricCanvas.add(image);
          fabricCanvas.setActiveObject(image);
          fabricCanvas.renderAll();
          saveState();
          // Switch to select tool for immediate manipulation
          setActiveTool('select');
        };
      };
      reader.readAsDataURL(file);
      // Reset file input to allow uploading the same file again
      e.target.value = '';
    }
  };

  return (
    <aside className="bg-white rounded-lg p-4 flex flex-col space-y-6 shadow-md border border-gray-200">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-blue-500">Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          <ToolButton label="Select" icon={<CursorArrowIcon />} isActive={activeTool === 'select'} onClick={() => handleToolChange('select')} />
          <ToolButton label="Brush" icon={<BrushIcon />} isActive={activeTool === 'brush'} onClick={() => handleToolChange('brush')} />
          <ToolButton label="Eraser" icon={<EraserIcon />} isActive={activeTool === 'eraser'} onClick={() => handleToolChange('eraser')} />
          {/* Shapes are now one-shot actions, so they are not "active" */}
          <ToolButton label="Rectangle" icon={<RectangleIcon />} onClick={() => addShape('rect')} />
          <ToolButton label="Circle" icon={<CircleIcon />} onClick={() => addShape('circle')} />
        </div>
      </div>
      
      <div>
        <label htmlFor="brushSize" className="block text-sm font-medium mb-2 text-gray-600">Brush Size: {brushSize}px</label>
        <input
          type="range"
          id="brushSize"
          min="1"
          max="50"
          value={brushSize}
          // FIX: The onChange handler was incomplete due to a truncated file. Completed the handler and the rest of the file.
          onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label htmlFor="brushColor" className="block text-sm font-medium mb-2 text-gray-600">Color</label>
        <input
          type="color"
          id="brushColor"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="w-full h-10 p-1 bg-white border border-gray-300 rounded-md cursor-pointer"
        />
      </div>

      <div className="pt-4 mt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-3 text-blue-500">History</h3>
        <div className="grid grid-cols-2 gap-2">
          <ToolButton label="Undo" icon={<UndoIcon />} onClick={undo} />
          <ToolButton label="Redo" icon={<RedoIcon />} onClick={redo} />
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-3 text-blue-500">Canvas</h3>
        <div className="grid grid-cols-2 gap-2">
          <ToolButton label="Upload Image" icon={<UploadIcon />} onClick={() => fileInputRef.current?.click()} />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <ToolButton label="Clear Canvas" icon={<TrashIcon />} onClick={clearCanvas} />
        </div>
      </div>
    </aside>
  );
};
