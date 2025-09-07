import React, { useState, useEffect } from 'react';
import { GenerationResult } from '../types';
import { useArtifactsStore } from '../state/artifacts';
import { OutputManager } from './OutputManager';

export const OutputPanel: React.FC = () => {
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
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [artifacts]);

  if (artifacts.length === 0) {
    return (
      <div className="w-full h-full bg-gray-50 border-l border-gray-200 flex flex-col">
        <div className="flex justify-between items-center p-3 border-b bg-white">
          <h2 className="text-lg font-semibold">Generated Assets</h2>
          <span className="text-sm text-gray-500">0</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-3">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm mb-2">No assets generated yet</p>
            <p className="text-gray-400 text-xs">Generate assets on Canvas page first!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full bg-gray-50 border-l border-gray-200 flex flex-col">
        <div className="flex justify-between items-center p-3 border-b bg-white">
          <h2 className="text-lg font-semibold">Generated Assets</h2>
          <span className="text-sm text-gray-500">{artifacts.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {artifacts.map((result, index) => (
            <div 
              key={result.id}
              className="bg-white rounded-lg p-3 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedResult(result)}
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  {thumbnails[result.id] ? (
                    <img
                      src={thumbnails[result.id]}
                      alt="Generation thumbnail"
                      className="w-16 h-16 object-cover rounded border"
                      style={{ 
                        imageRendering: 'pixelated'
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                      <span className="text-gray-400 text-xs">IMG</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      #{index + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(result.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1">
                    {result.width}×{result.height} • {Math.round(result.raw.size / 1024)}KB
                  </p>
                  
                  <p className="text-xs text-gray-500 truncate">
                    {result.promptUsed.split('\n\n')[1]?.slice(0, 50) || 'Generated asset'}...
                  </p>
                  
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Quick export
                        const url = URL.createObjectURL(result.raw);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `pixforge-asset-${index + 1}.png`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Export
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedResult(result);
                      }}
                      className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Clear All Button */}
          {artifacts.length > 3 && (
            <div className="pt-3">
              <button
                onClick={() => useArtifactsStore.getState().clearArtifacts()}
                className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Clear All ({artifacts.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Output Manager Modal */}
      {selectedResult && (
        <OutputManager
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </>
  );
};