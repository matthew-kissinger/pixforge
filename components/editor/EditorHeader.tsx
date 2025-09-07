import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EditorHeaderProps {
  selectedAssetsCount: number;
  hasCanvasSelected: boolean;
  canEdit: boolean;
  isLoading: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  selectedAssetsCount,
  hasCanvasSelected,
  canEdit,
  isLoading,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="border-b bg-card px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex rounded-lg bg-muted p-1">
          <Button
            variant={activeTab === 'assets' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('assets')}
            className="flex items-center gap-2"
          >
            Assets
            <Badge variant="outline" className="ml-1">
              {selectedAssetsCount}
            </Badge>
          </Button>
          <Button
            variant={activeTab === 'canvas' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('canvas')}
            className="flex items-center gap-2"
          >
            Canvas
            <Badge variant="outline" className="ml-1">
              {hasCanvasSelected ? 1 : 0}
            </Badge>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${canEdit ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-muted-foreground">
            {canEdit ? 'Ready to edit' : 'Select assets or canvas to continue'}
          </span>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-primary">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
};