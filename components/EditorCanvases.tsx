import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Tldraw, Editor, exportAs } from 'tldraw';
import 'tldraw/tldraw.css';
import { useEditorStore, EditorCanvas } from '../state/editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface SingleCanvasProps {
  canvas: EditorCanvas;
  isActive: boolean;
  onUpdate: (updates: Partial<EditorCanvas>) => void;
}

interface SingleCanvasRef {
  exportCanvas: () => Promise<Blob | null>;
  clearCanvas: () => void;
}

const SingleCanvas = forwardRef<SingleCanvasRef, SingleCanvasProps>(
  ({ canvas, isActive, onUpdate }, ref) => {
    const editorRef = useRef<Editor | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useImperativeHandle(ref, () => ({
      exportCanvas: handleExport,
      clearCanvas: handleClear
    }));

    const handleMount = (editor: Editor) => {
      editorRef.current = editor;
      
      try {
        editor.updateInstanceState({
          isGridMode: true,
        });
      } catch (error) {
        console.warn('Could not set grid mode:', error);
      }

      const unsubscribe = editor.store.listen(() => {
        const shapes = editor.getCurrentPageShapeIds();
        const hasContent = shapes.size > 0;
        
        if (hasContent !== canvas.hasContent) {
          onUpdate({ hasContent });
          // Don't auto-save - only update hasContent state
        }
      });

      return unsubscribe;
    };

    const handleExport = async (): Promise<Blob | null> => {
      if (!editorRef.current) return null;

      try {
        const editor = editorRef.current;
        const shapeIds = editor.getCurrentPageShapeIds();
        
        if (shapeIds.size === 0) return null;
        
        let capturedBlob: Blob | null = null;
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = (object: any) => {
          if (object instanceof Blob && object.type.startsWith('image/')) {
            capturedBlob = object;
          }
          return originalCreateObjectURL(object);
        };
        
        try {
          await exportAs(editor, [...shapeIds], 'png', `canvas-${canvas.id}`);
          return capturedBlob;
        } finally {
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
        if (allShapeIds.size > 0) {
          editor.deleteShapes([...allShapeIds]);
        }
        editor.setSelectedShapes([]);
        onUpdate({ hasContent: false, blob: undefined });
      } catch (error) {
        console.error('Failed to clear canvas:', error);
      }
    };

    if (!isClient) {
      return (
        <div className="w-full h-96">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      );
    }

    if (!isActive) return null;

    return (
      <div 
        className="w-full h-full border-2 border-primary rounded-lg overflow-hidden bg-white" 
        style={{ position: 'relative' }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <Tldraw
            onMount={handleMount}
            options={{
              maxPages: 1,
            }}
            components={{
              ActionsMenu: null,
              HelpMenu: null,
              MainMenu: null,
              NavigationPanel: null,
            }}
          />
        </div>
      </div>
    );
  }
);

export const EditorCanvasesManager: React.FC = () => {
  const { 
    canvas, 
    isCanvasSelected,
    updateCanvas, 
    toggleCanvasSelection,
    clearCanvas
  } = useEditorStore();
  
  const canvasRef = useRef<SingleCanvasRef>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
    clearCanvas();
  };

  const handleExportAndSave = async () => {
    if (canvasRef.current) {
      const blob = await canvasRef.current.exportCanvas();
      if (blob) {
        updateCanvas({ blob });
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Controls */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Drawing Canvas</h3>
          <div className="flex gap-2">
            {canvas?.hasContent && (
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
            )}
            {canvas?.hasContent && (
              <Button size="sm" onClick={handleExportAndSave}>
                Save Canvas
              </Button>
            )}
          </div>
        </div>

        {/* Canvas Selection */}
        {canvas?.blob && (
          <Card className="mt-3">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="canvas-include"
                  checked={isCanvasSelected}
                  onChange={toggleCanvasSelection}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <div className="flex-1">
                  <label htmlFor="canvas-include" className="text-sm font-medium cursor-pointer">
                    Include saved canvas in editing
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Check to use this saved canvas alongside selected assets for AI editing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 flex-shrink-0">
          {canvas?.hasContent && !canvas.blob && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✅ Canvas has content! Click "Save Canvas" to make it available for editing.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex-1 px-4 pb-4">
          <div className="h-full w-full">
            {isClient && canvas && (
              <SingleCanvas
                ref={canvasRef}
                canvas={canvas}
                isActive={true}
                onUpdate={updateCanvas}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};