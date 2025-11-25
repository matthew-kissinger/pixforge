import React, { useRef, useEffect, useState, useCallback } from 'react';

interface ImageColorPickerProps {
  onColorSelect: (hex: string) => void;
  selectedColor: string;
}

export const ImageColorPicker: React.FC<ImageColorPickerProps> = ({ onColorSelect, selectedColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const [brightness, setBrightness] = useState(0.5);
  const [baseColor, setBaseColor] = useState('#FF0000');

  // Draw a color spectrum/rainbow gradient (hue and saturation only)
  const drawColorSpectrum = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create HSV color spectrum (no brightness variation)
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const hue = (x / width) * 360;
        const saturation = 1 - (y / height);
        const value = 1; // Fixed at full brightness

        // Convert HSV to RGB
        const rgb = hsvToRgb(hue, saturation, value);
        
        const index = (y * width + x) * 4;
        data[index] = rgb.r;     // Red
        data[index + 1] = rgb.g; // Green  
        data[index + 2] = rgb.b; // Blue
        data[index + 3] = 255;   // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setIsDrawn(true);
  }, []);

  // HSV to RGB conversion
  const hsvToRgb = (h: number, s: number, v: number) => {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  // RGB to Hex conversion
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Apply brightness to a color (0 = black, 0.5 = original color, 1 = white)
  const applyBrightness = (hex: string, brightnessValue: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    let newR, newG, newB;
    
    if (brightnessValue < 0.5) {
      // Darken towards black
      const factor = brightnessValue * 2;
      newR = Math.round(r * factor);
      newG = Math.round(g * factor);
      newB = Math.round(b * factor);
    } else {
      // Lighten towards white
      const factor = (brightnessValue - 0.5) * 2;
      newR = Math.round(r + (255 - r) * factor);
      newG = Math.round(g + (255 - g) * factor);
      newB = Math.round(b + (255 - b) * factor);
    }
    
    return rgbToHex(
      Math.max(0, Math.min(255, newR)),
      Math.max(0, Math.min(255, newG)),
      Math.max(0, Math.min(255, newB))
    );
  };

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const data = imageData.data;
    
    const baseHex = rgbToHex(data[0], data[1], data[2]);
    setBaseColor(baseHex);
    
    // Apply current brightness to the selected color
    const finalColor = applyBrightness(baseHex, brightness);
    onColorSelect(finalColor);
  };

  // Handle brightness slider change
  const handleBrightnessChange = (newBrightness: number) => {
    setBrightness(newBrightness);
    // Apply brightness to current base color
    const finalColor = applyBrightness(baseColor, newBrightness);
    onColorSelect(finalColor);
  };

  useEffect(() => {
    drawColorSpectrum();
  }, [drawColorSpectrum]);

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-gray-700">Color Picker</div>
      
      {/* Color Spectrum Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={200}
          height={120}
          onClick={handleCanvasClick}
          className="border border-gray-300 rounded cursor-crosshair shadow-sm"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Crosshair indicator for selected color */}
        {isDrawn && (
          <div className="absolute top-1 left-1 pointer-events-none">
            <div 
              className="w-4 h-4 border-2 border-white rounded-full shadow-md"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
        )}
      </div>

      {/* Brightness Slider */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700">Brightness</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Dark</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={brightness}
            onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gradient-to-r from-black via-gray-500 to-white rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-500">Light</span>
          <button
            onClick={() => handleBrightnessChange(0.5)}
            className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded border"
          >
            50%
          </button>
        </div>
      </div>

      {/* Selected Color Display */}
      <div className="flex items-center gap-2">
        <div 
          className="w-6 h-6 border border-gray-300 rounded"
          style={{ backgroundColor: selectedColor }}
        />
        <span className="text-xs font-mono">{selectedColor}</span>
      </div>

      {/* Quick preset colors */}
      <div className="grid grid-cols-8 gap-1">
        {[
          '#FF0000', '#FF8000', '#FFFF00', '#80FF00',
          '#00FF00', '#00FF80', '#00FFFF', '#0080FF',
          '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
          '#FFFFFF', '#C0C0C0', '#808080', '#000000'
        ].map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`w-6 h-6 rounded border transition-all hover:scale-110 ${
              selectedColor === color 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      <div className="text-xs text-gray-500">
        Click the spectrum to pick any color
      </div>
    </div>
  );
};