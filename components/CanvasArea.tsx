

import React, { useRef, useEffect, useMemo } from 'react';
import * as fabric from 'fabric';

interface CanvasAreaProps {
  setFabricCanvas: (canvas: fabric.Canvas) => void;
  activeTool: string;
  brushSize: number;
  brushColor: string;
  saveState: () => void;
  historyCounter: number;
}

// Simple debounce utility to delay function execution
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: number | undefined;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), waitFor);
  };
};

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  setFabricCanvas,
  activeTool,
  brushSize,
  brushColor,
  saveState,
  historyCounter,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  
  // Use a ref to hold the latest saveState function to avoid dependency cycles in useEffect
  const saveStateRef = useRef(saveState);
  useEffect(() => {
    saveStateRef.current = saveState;
  }, [saveState]);

  // Create a debounced version of saveState for continuous actions like resizing.
  const debouncedSaveState = useMemo(() => debounce(() => saveStateRef.current(), 300), []);

  // Effect for canvas initialization. Runs only once.
  useEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#FFFFFF',
      isDrawingMode: false,
    });
    fabricCanvasRef.current = canvas;
    setFabricCanvas(canvas);

    const resizeCanvas = () => {
      if (canvasContainerRef.current && fabricCanvasRef.current) {
        const { clientWidth, clientHeight } = canvasContainerRef.current;
        const size = Math.min(clientWidth, clientHeight);
        fabricCanvasRef.current.setWidth(size);
        fabricCanvasRef.current.setHeight(size);
        fabricCanvasRef.current.renderAll();
      }
    };

    resizeCanvas();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          activeObjects.forEach(obj => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();
          saveStateRef.current(); // Use immediate save for discrete actions like delete
        }
      }
    };
    
    // Use immediate save for discrete actions like creating a brush stroke.
    const onPathCreated = () => saveStateRef.current();
    // Use debounced save for continuous actions like moving/scaling to avoid saving too often.
    const onObjectModified = () => debouncedSaveState();

    canvas.on('path:created', onPathCreated);
    canvas.on('object:modified', onObjectModified);

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('keydown', handleKeyDown);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.off('path:created', onPathCreated);
        fabricCanvasRef.current.off('object:modified', onObjectModified);
        fabricCanvasRef.current.dispose();
      }
    };
  }, [setFabricCanvas, debouncedSaveState]); // Dependencies are stable, so effect runs only once.

  // Effect for handling tool changes and brush properties.
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const isDrawing = activeTool === 'brush' || activeTool === 'eraser';

    if (isDrawing) {
      // When in drawing mode, make all objects non-selectable
      canvas.selection = false;
      canvas.discardActiveObject();
      canvas.getObjects().forEach(obj => {
        obj.selectable = false;
        obj.evented = false;
      });
      // FIX: Re-create the brush to prevent state corruption (e.g., color stuck on white)
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = activeTool === 'eraser' ? '#FFFFFF' : brushColor;
    } else {
      // When not in drawing mode (e.g., 'select' tool), make objects selectable
      canvas.selection = true;
      canvas.getObjects().forEach(obj => {
        obj.selectable = true;
        obj.evented = true;
      });
    }
    
    // FIX: Set isDrawingMode as the final step to avoid race conditions where
    // other operations (like discardActiveObject) might internally reset it.
    canvas.isDrawingMode = isDrawing;
    
    canvas.renderAll();
  }, [activeTool, brushSize, brushColor]);

  // Effect to re-render canvas when history changes from undo/redo
  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.renderAll();
    }
  }, [historyCounter]);


  return (
    <div ref={canvasContainerRef} className="bg-white rounded-lg flex items-center justify-center p-2 w-full h-full min-h-[512px] lg:min-h-0 shadow-inner border border-gray-200 min-w-0">
      <canvas ref={canvasRef} />
    </div>
  );
};
