import React, { useState } from 'react';
import { useEditorStore } from '../state/editor';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EditorControlsProps {
  onEdit: (command: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export const EditorControls: React.FC<EditorControlsProps> = ({
  onEdit,
  isLoading,
  error
}) => {
  const { currentCommand, setCurrentCommand, selectedAssets, canvas, isCanvasSelected } = useEditorStore();
  const [customCommand, setCustomCommand] = useState('');

  // Quick action buttons
  const quickActions = [
    {
      label: 'Remove Background',
      command: 'Remove the background and make it transparent',
      icon: '🗑️',
      description: 'Remove background'
    },
    {
      label: 'Enhance Quality',
      command: 'Enhance the image quality and add more detail',
      icon: '✨',
      description: 'Improve quality'
    },
    {
      label: 'Make Fierce',
      command: 'Make the character look more fierce and intimidating',
      icon: '😤',
      description: 'More aggressive'
    },
    {
      label: 'Make Cute',
      command: 'Make the character look more cute and friendly',
      icon: '🥰',
      description: 'More adorable'
    },
    {
      label: 'Change to Blue',
      command: 'Change the primary colors to blue tones',
      icon: '🔵',
      description: 'Blue color scheme'
    },
    {
      label: 'Add Shadows',
      command: 'Add realistic shadows and depth',
      icon: '🌑',
      description: 'Add depth'
    }
  ];

  const handleQuickAction = (command: string) => {
    setCurrentCommand(command);
    onEdit(command);
  };

  const handleCustomEdit = () => {
    if (customCommand.trim()) {
      setCurrentCommand(customCommand);
      onEdit(customCommand);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomEdit();
    }
  };

  const hasCanvasSelected = canvas?.blob && isCanvasSelected;
  const canEdit = selectedAssets.length > 0 || hasCanvasSelected;
  const selectedCanvasCount = hasCanvasSelected ? 1 : 0;

  return (
    <div className="w-full bg-background h-full flex flex-col overflow-hidden">
      {/* Header */}
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="text-lg">Asset Editor</CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Selected assets:</span>
            <Badge variant="outline">{selectedAssets.length}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Selected canvases:</span>
            <Badge variant="outline">{selectedCanvasCount}</Badge>
          </div>
        </div>
      </CardHeader>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto">

        {/* === EDITING SECTION === */}

        {!canEdit && (
          <CardContent className="flex-shrink-0">
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="pt-4 pb-4">
                <h3 className="font-semibold text-orange-900 mb-2">🎯 Edit Existing Assets</h3>
                <p className="text-orange-800 text-sm mb-2">
                  Select assets or canvases to edit them with AI.
                </p>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Click assets in the Assets tab</li>
                  <li>• Select locked canvases from Canvas tab</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        )}

        {error && (
          <CardContent className="flex-shrink-0">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-sm text-red-800">{error}</p>
              </CardContent>
            </Card>
          </CardContent>
        )}

        {/* Quick Actions */}
        <CardContent className="flex-shrink-0">
          <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.command}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.command)}
                disabled={!canEdit || isLoading}
                className="p-2 h-auto flex-col items-center text-center min-h-[60px] justify-center"
                title={action.description}
              >
                <div className="text-sm mb-1">{action.icon}</div>
                <div className="text-xs font-medium leading-tight">{action.label}</div>
              </Button>
            ))}
          </div>
        </CardContent>

        {/* Custom Command */}
        <CardContent className="flex-shrink-0">
          <h3 className="text-sm font-semibold mb-3">Custom Command</h3>
          <div className="space-y-3">
            <Textarea
              value={customCommand}
              onChange={(e) => setCustomCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCustomEdit();
                }
              }}
              placeholder="Describe what you want to do... e.g., 'change the knight's pose' or 'combine with forest background'"
              className="resize-none text-sm min-h-20"
              disabled={!canEdit || isLoading}
            />
            
            <Button
              onClick={handleCustomEdit}
              disabled={!canEdit || isLoading || !customCommand.trim()}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Apply Edit'
              )}
            </Button>

            {/* Command History */}
            {currentCommand && (
              <Card className="mt-3">
                <CardContent className="pt-4">
                  <h4 className="text-sm font-semibold mb-1">Current:</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{currentCommand}</p>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="mt-3">
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold mb-2">💡 Tips:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Select multiple assets to combine them</li>
                  <li>• Draw on canvases and lock them for editing</li>
                  <li>• Reference canvases by name: "use Canvas 1 pose"</li>
                  <li>• Use "combine", "transfer pose", "change color" commands</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>

      </div>
    </div>
  );
};