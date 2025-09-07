import React from 'react';
import { AssetSelector } from '../AssetSelector';
import { Card, CardContent } from '@/components/ui/card';

interface AssetsViewProps {
  selectedAssetsCount: number;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ selectedAssetsCount }) => {
  return (
    <div className="absolute inset-0 flex flex-col">
      {selectedAssetsCount === 0 && (
        <div className="p-4">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-900 mb-2">🎯 Select Assets to Edit</h3>
              <p className="text-blue-800 text-sm mb-3">
                Choose generated assets below and edit them with natural language commands.
              </p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Click assets to select multiple</li>
                <li>• Combine different assets together</li>
                <li>• Use descriptive editing commands</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AssetSelector />
      </div>
    </div>
  );
};