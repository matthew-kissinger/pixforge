import React from 'react';
import { EditorCanvasesManager } from '../EditorCanvases';
import { Card, CardContent } from '@/components/ui/card';

interface CanvasViewProps {
  hasCanvasSelected: boolean;
}

export const CanvasView: React.FC<CanvasViewProps> = ({ hasCanvasSelected }) => {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1 p-4">
        <EditorCanvasesManager />
      </div>
      
      {!hasCanvasSelected && (
        <div className="p-4 border-t">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-green-900 mb-2">✏️ Canvas Workflow</h3>
              <p className="text-green-800 text-sm mb-3">
                Draw → Save → Select → Reference in prompts
              </p>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Draw on canvas above</li>
                <li>• Save when finished</li>
                <li>• Select to use in edits alongside assets</li>
                <li>• Reference in prompts: "using the drawing style"</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};