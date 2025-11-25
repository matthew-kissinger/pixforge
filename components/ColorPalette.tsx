import React, { useState, useEffect } from 'react';
import { Editor, DefaultColorThemePalette, DefaultColorStyle } from 'tldraw';
import { ImageColorPicker } from './ImageColorPicker';

interface ColorPaletteProps {
  editor: Editor | null;
}

// Mapping system for any hex color to tldraw's 13 color slots
const TLDRAW_COLOR_SLOTS = [
  'black', 'white', 'red', 'light-red', 'green', 'light-green', 
  'blue', 'light-blue', 'yellow', 'orange', 'violet', 'light-violet', 'grey'
] as const;

type TldrawColor = typeof TLDRAW_COLOR_SLOTS[number];

export const ColorPalette: React.FC<ColorPaletteProps> = ({ editor }) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [currentColorSlot, setCurrentColorSlot] = useState<TldrawColor>('black');
  const [colorHistory, setColorHistory] = useState<string[]>(['#000000']);

  // Smart color slot assignment - cycles through slots for variety
  const getNextColorSlot = (hexColor: string): TldrawColor => {
    // Check if we've used this exact color before
    const existingSlot = Object.entries(DefaultColorThemePalette.lightMode).find(
      ([_, colorObj]) => typeof colorObj === 'object' && 'solid' in colorObj && colorObj.solid === hexColor
    )?.[0] as TldrawColor;
    
    if (existingSlot && TLDRAW_COLOR_SLOTS.includes(existingSlot)) {
      return existingSlot;
    }

    // Simple color-based mapping for common colors
    const colorMappings: Record<string, TldrawColor> = {
      '#000000': 'black',
      '#FFFFFF': 'white',
      '#FF0000': 'red',
      '#00FF00': 'green', 
      '#0000FF': 'blue',
      '#FFFF00': 'yellow',
      '#FF8000': 'orange',
      '#808080': 'grey',
    };

    if (colorMappings[hexColor]) {
      return colorMappings[hexColor];
    }

    // For any other color, use a rotating slot system
    const slotIndex = colorHistory.length % TLDRAW_COLOR_SLOTS.length;
    return TLDRAW_COLOR_SLOTS[slotIndex];
  };

  const handleColorSelect = (hexColor: string) => {
    const colorSlot = getNextColorSlot(hexColor);
    
    setSelectedColor(hexColor);
    setCurrentColorSlot(colorSlot);
    
    // Add to color history if not already there
    if (!colorHistory.includes(hexColor)) {
      setColorHistory(prev => [hexColor, ...prev].slice(0, 20)); // Keep last 20 colors
    }

    // Update the tldraw palette with the new hex color
    if (DefaultColorThemePalette.lightMode[colorSlot] && typeof DefaultColorThemePalette.lightMode[colorSlot] === 'object') {
      (DefaultColorThemePalette.lightMode[colorSlot] as any).solid = hexColor;
    }
    
    if (!editor) return;

    try {
      // Set the color for drawing
      editor.setStyleForNextShapes(DefaultColorStyle, colorSlot);
      
      // Also update any currently selected shapes
      const selectedShapes = editor.getSelectedShapeIds();
      if (selectedShapes.length > 0) {
        editor.setStyleForSelectedShapes(DefaultColorStyle, colorSlot);
      }

    } catch (error) {
      console.warn('Could not apply color:', error);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm space-y-4">
      {/* Image Color Picker */}
      <ImageColorPicker 
        onColorSelect={handleColorSelect}
        selectedColor={selectedColor}
      />

      {/* Current Status */}
      <div className="border-t pt-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-xs font-medium text-gray-700">Drawing with:</div>
          <div 
            className="w-6 h-6 border border-gray-300 rounded"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-xs font-mono text-gray-600">{selectedColor}</span>
        </div>
        <div className="text-xs text-gray-500">
          Using tldraw slot: <span className="font-mono">{currentColorSlot}</span>
        </div>
      </div>

      {/* Color History */}
      {colorHistory.length > 1 && (
        <div className="border-t pt-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Recent Colors</div>
          <div className="flex flex-wrap gap-1">
            {colorHistory.slice(1, 9).map((color, index) => (
              <button
                key={`${color}-${index}`}
                onClick={() => handleColorSelect(color)}
                className={`w-6 h-6 rounded border transition-all hover:scale-110 ${
                  selectedColor === color 
                    ? 'border-blue-500 ring-1 ring-blue-200' 
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="border-t pt-3 text-xs text-gray-500">
        <div>• Click spectrum for any color</div>
        <div>• Colors apply to drawing & shapes</div>
        <div>• Recent colors saved automatically</div>
      </div>
    </div>
  );
};