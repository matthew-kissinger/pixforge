import React, { useState, useEffect } from 'react';
import { GenerationResult } from '../types';
import { useArtifactsStore } from '../state/artifacts';
import { useEditorStore } from '../state/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const AssetSelector: React.FC = () => {
  const artifacts = useArtifactsStore(state => state.artifacts);
  const { selectedAssets, toggleAssetSelection, clearSelectedAssets } = useEditorStore();
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate thumbnails for artifacts
    const generateThumbnails = async () => {
      const newThumbnails: Record<string, string> = {};
      
      for (const artifact of artifacts.slice(0, 20)) {
        if (!thumbnails[artifact.id]) {
          try {
            const url = URL.createObjectURL(artifact.raw);
            newThumbnails[artifact.id] = url;
          } catch (error) {
            console.error('Failed to create thumbnail:', error);
          }
        }
      }
      
      if (Object.keys(newThumbnails).length > 0) {
        setThumbnails(prev => ({ ...prev, ...newThumbnails }));
      }
    };

    generateThumbnails();

    // Cleanup old thumbnails
    return () => {
      Object.values(thumbnails).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [artifacts]);

  if (artifacts.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <CardTitle className="mb-2">No Generated Assets Found</CardTitle>
          <p className="text-muted-foreground text-sm">Go to the Canvas page to generate some assets first!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>Select Assets</CardTitle>
            {selectedAssets.length > 0 && (
              <Badge variant="secondary">
                {selectedAssets.length} selected
              </Badge>
            )}
          </div>
          {selectedAssets.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearSelectedAssets}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {artifacts.map((artifact) => {
            const isSelected = selectedAssets.find(a => a.id === artifact.id);
            
            return (
              <Card
                key={artifact.id}
                className={`relative cursor-pointer transition-all hover:shadow-md ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => toggleAssetSelection(artifact)}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <Badge className="absolute top-2 right-2 z-10 h-6 w-6 p-0 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </Badge>
                )}
                
                {/* Thumbnail */}
                <CardContent className="p-0">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    {thumbnails[artifact.id] ? (
                      <img
                        src={thumbnails[artifact.id]}
                        alt="Asset thumbnail"
                        className="w-full h-full object-cover"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Loading...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 rounded-b-lg">
                    <p className="text-xs font-medium truncate">
                      {artifact.width}×{artifact.height}
                    </p>
                    <p className="text-xs text-gray-300 truncate">
                      {new Date(artifact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};