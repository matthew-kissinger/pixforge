import React, { useState, useEffect } from 'react';
import { GenerationResult } from '../types';
import { useArtifactsStore } from '../state/artifacts';
import { OutputManager } from './OutputManager';

export const HistoryPanel: React.FC = () => {
  const artifacts = useArtifactsStore(state => state.artifacts);
  const [selectedResult, setSelectedResult] = useState<GenerationResult | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate thumbnails for recent artifacts
    const generateThumbnails = async () => {
      const newThumbnails: Record<string, string> = {};
      
      for (const artifact of artifacts.slice(0, 10)) {
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
        URL.revokeObjectURL(url);
      });
    };
  }, [artifacts]);

  if (artifacts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="text-lg font-semibold mb-3">Generation History</h3>
        <p className="text-gray-500 text-sm">No generations yet. Create something on the canvas and send it to Gemini!</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="text-lg font-semibold mb-3">Recent Generations</h3>
        <div className="space-y-3">
          {artifacts.slice(0, 5).map((result) => (
            <div 
              key={result.id}
              className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer border"
              onClick={() => setSelectedResult(result)}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                {thumbnails[result.id] ? (
                  <img
                    src={thumbnails[result.id]}
                    alt="Generation thumbnail"
                    className="w-12 h-12 object-cover rounded border"
                    style={{ 
                      imageRendering: 'pixelated'
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center">
                    <span className="text-gray-400 text-xs">IMG</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {result.width}×{result.height}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate">
                  {result.model}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {result.promptUsed.slice(0, 60)}...
                </p>
              </div>
            </div>
          ))}
        </div>

        {artifacts.length > 5 && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            +{artifacts.length - 5} more generations
          </p>
        )}
      </div>

      {selectedResult && (
        <OutputManager
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </>
  );
};