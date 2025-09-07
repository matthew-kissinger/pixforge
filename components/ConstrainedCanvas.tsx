import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Tldraw, Editor, exportAs } from 'tldraw';
import 'tldraw/tldraw.css';
import { useActivePreset } from '../state/prompts';

interface ConstrainedCanvasProps {
  onClear: () => void;
}

interface ConstrainedCanvasRef {
  exportCanvas: () => Promise<Blob | null>;
}

export const ConstrainedCanvas = forwardRef<ConstrainedCanvasRef, ConstrainedCanvasProps>(({ onClear }, ref) => {
  const editorRef = useRef<Editor | null>(null);
  const preset = useActivePreset();
  const [zoom, setZoom] = useState<number | null>(null); // Will be calculated after mount
  const [showGrid, setShowGrid] = useState(true);
  const [hasContent, setHasContent] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isClient, setIsClient] = useState(false);

  // Get canvas dimensions from active preset
  const canvasWidth = preset?.constraints.targetSize?.[0] || 96;
  const canvasHeight = preset?.constraints.targetSize?.[1] || 96;
  
  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update container size on mount and window resize
  useEffect(() => {
    if (!isClient) return;

    const updateContainerSize = () => {
      // Calculate available space accounting for sidebars (256px + 288px) and header
      const availableWidth = Math.max(400, window.innerWidth - 256 - 288 - 64); // Left + Right + padding
      const availableHeight = Math.max(300, window.innerHeight - 140); // Header + canvas controls + padding
      setContainerSize({ width: availableWidth, height: availableHeight });
      
      // Set initial zoom if not set
      if (zoom === null) {
        const newOptimalZoom = calculateOptimalZoom(availableWidth, availableHeight);
        setZoom(newOptimalZoom);
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [isClient, zoom, canvasWidth, canvasHeight]);

  // Helper function to calculate optimal zoom
  const calculateOptimalZoom = (availableWidth: number, availableHeight: number) => {
    const zoomForWidth = Math.floor(availableWidth / canvasWidth);
    const zoomForHeight = Math.floor(availableHeight / canvasHeight);
    const calculatedZoom = Math.min(zoomForWidth, zoomForHeight);
    return Math.max(1, Math.min(16, calculatedZoom));
  };

  // Calculate optimal zoom to fill available container space
  const getOptimalZoom = () => {
    return calculateOptimalZoom(containerSize.width, containerSize.height);
  };
  
  const optimalZoom = getOptimalZoom();
  const displayWidth = canvasWidth * (zoom || optimalZoom);
  const displayHeight = canvasHeight * (zoom || optimalZoom);

  useEffect(() => {
    // Update zoom when preset changes
    const newOptimalZoom = getOptimalZoom();
    setZoom(newOptimalZoom);
    
    if (editorRef.current) {
      // Set up the canvas bounds when preset changes
      const editor = editorRef.current;
      
      // Clear everything first
      const allShapes = editor.getCurrentPageShapeIds();
      if (allShapes.length > 0) {
        editor.deleteShapes([...allShapes]);
      }
      
      // Reset camera to center on the canvas area
      editor.zoomToFit();
      editor.resetZoom();
    }
  }, [preset?.id, canvasWidth, canvasHeight]);

  useImperativeHandle(ref, () => ({
    exportCanvas: handleExport
  }));

  const handleMount = (editor: Editor) => {
    editorRef.current = editor;
    
    // Configure editor for pixel art
    try {
      editor.updateInstanceState({
        isGridMode: showGrid,
      });
    } catch (error) {
      console.warn('Could not set grid mode:', error);
    }

    // Just track if we have content for the generate button
    const unsubscribe = editor.store.listen(() => {
      const shapes = editor.getCurrentPageShapeIds();
      setHasContent(shapes.size > 0);
    });

    return unsubscribe;
  };

  const handleExport = async (): Promise<Blob | null> => {
    if (!editorRef.current) return null;

    try {
      const editor = editorRef.current;
      const shapeIds = editor.getCurrentPageShapeIds();
      
      if (shapeIds.size === 0) {
        return null;
      }
      
      // Use exportAs function with blob capture hack
      let capturedBlob: Blob | null = null;
      
      // Override URL.createObjectURL temporarily to capture the blob
      const originalCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = (object: any) => {
        if (object instanceof Blob && object.type.startsWith('image/')) {
          capturedBlob = object;
        }
        return originalCreateObjectURL(object);
      };
      
      try {
        await exportAs(editor, [...shapeIds], 'png', 'pixforge-export');
        return capturedBlob;
      } finally {
        // Always restore the original function
        URL.createObjectURL = originalCreateObjectURL;
      }
    } catch (err) {
      console.error('Export failed:', err);
      return null;
    }
  };

  const handleClear = () => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    
    try {
      const allShapeIds = editor.getCurrentPageShapeIds();
      if (allShapeIds.length > 0) {
        editor.deleteShapes([...allShapeIds]);
      }
      editor.setSelectedShapes([]);
      setHasContent(false);
      onClear();
    } catch (error) {
      console.error('Failed to clear canvas:', error);
    }
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (editorRef.current) {
      editorRef.current.setCamera({ 
        x: 0, 
        y: 0, 
        z: newZoom / 4 // Adjust zoom factor
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Canvas Info Bar */}
      <div className="flex items-center justify-between p-2 bg-white border-b">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium">{canvasWidth}×{canvasHeight}</span>
            <span className="text-gray-500 ml-2">({preset?.type || 'sprite'})</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Zoom:</label>
            <select 
              value={zoom} 
              onChange={(e) => handleZoomChange(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
              <option value={4}>4x</option>
              <option value={6}>6x</option>
              <option value={8}>8x</option>
              <option value={12}>12x</option>
              <option value={16}>16x</option>
            </select>
          </div>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => {
                setShowGrid(e.target.checked);
                if (editorRef.current) {
                  try {
                    editorRef.current.updateInstanceState({
                      isGridMode: e.target.checked
                    });
                  } catch (error) {
                    console.warn('Could not toggle grid:', error);
                  }
                }
              }}
              className="mr-1"
            />
            Grid
          </label>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Clear
          </button>
          <button
            onClick={async () => {
              const blob = await handleExport();
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `pixforge-sketch-${Date.now()}.png`;
                link.click();
                URL.revokeObjectURL(url);
              }
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Export Canvas
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div 
          className="border-2 border-gray-300 shadow-lg"
          style={{
            width: `min(${displayWidth}px, 100%)`,
            height: `min(${displayHeight}px, calc(100vh - 200px))`,
            maxWidth: '100%',
            maxHeight: '100%',
            imageRendering: 'pixelated'
          }}
        >
          <Tldraw
            onMount={handleMount}
            options={{
              maxPages: 1,
            }}
            components={{
              // Keep essential tools visible, hide only navigation menus
              ActionsMenu: null,
              HelpMenu: null,
              MainMenu: null,
              // Keep drawing tools, zoom controls, etc.
            }}
          />
        </div>
      </div>

      {/* Canvas Help Text */}
      <div className="p-1 bg-gray-50 border-t text-center text-xs text-gray-500">
        Draw → Describe → Generate
      </div>
    </div>
  );
});