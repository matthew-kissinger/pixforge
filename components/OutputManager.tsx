import React, { useState, useEffect } from 'react';
import { GenerationResult, PostOpSpec } from '../types';
import { runPipeline, registry } from '../utils/postOps';

interface OutputManagerProps {
  result: GenerationResult;
  onClose: () => void;
}

export const OutputManager: React.FC<OutputManagerProps> = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = useState<'raw' | 'processed'>('raw');
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [pipeline, setPipeline] = useState<PostOpSpec[]>([
    { id: 'trim', params: {} },
    { id: 'resize', params: { scale: 4 } }
  ]);

  const [rawUrl, setRawUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');

  useEffect(() => {
    // Create object URLs for display
    const rawObjectUrl = URL.createObjectURL(result.raw);
    setRawUrl(rawObjectUrl);

    return () => {
      URL.revokeObjectURL(rawObjectUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [result.raw]);

  useEffect(() => {
    if (processedBlob) {
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      const url = URL.createObjectURL(processedBlob);
      setProcessedUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [processedBlob]);

  const handleProcessPipeline = async () => {
    if (pipeline.length === 0) return;
    
    setProcessing(true);
    try {
      const processed = await runPipeline(result.raw, pipeline);
      setProcessedBlob(processed);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleExport = async (type: 'raw' | 'processed') => {
    const blob = type === 'raw' ? result.raw : processedBlob;
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pixforge-${type}-${result.id.slice(0, 8)}.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addOperation = (opId: string) => {
    const defaultParams = opId === 'resize' ? { scale: 2 } : 
                         opId === 'chroma' ? { r: 255, g: 255, b: 255, tolerance: 18 } : {};
    setPipeline([...pipeline, { id: opId, params: defaultParams }]);
  };

  const removeOperation = (index: number) => {
    setPipeline(pipeline.filter((_, i) => i !== index));
  };

  const updateOperation = (index: number, params: any) => {
    setPipeline(pipeline.map((op, i) => i === index ? { ...op, params } : op));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-full overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Output Manager</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'raw'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Raw ({result.width}×{result.height})
          </button>
          <button
            onClick={() => setActiveTab('processed')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'processed'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Processed
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'raw' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Original model output</p>
                <button
                  onClick={() => handleExport('raw')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Export Raw
                </button>
              </div>
              <div className="flex justify-center bg-gray-100 rounded-lg p-4">
                <img
                  src={rawUrl}
                  alt="Raw output"
                  className="max-w-full max-h-96 object-contain"
                  style={{ 
                    imageRendering: 'pixelated'
                  }}
                />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Model:</strong> {result.model}</p>
                <p><strong>Created:</strong> {new Date(result.createdAt).toLocaleString()}</p>
                <p><strong>Prompt:</strong> {result.promptUsed.slice(0, 200)}...</p>
              </div>
            </div>
          )}

          {activeTab === 'processed' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Post-processed version</p>
                <div className="space-x-2">
                  <button
                    onClick={handleProcessPipeline}
                    disabled={processing || pipeline.length === 0}
                    className={`px-4 py-2 rounded-md ${
                      processing || pipeline.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {processing ? 'Processing...' : 'Process'}
                  </button>
                  {processedBlob && (
                    <button
                      onClick={() => handleExport('processed')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Export Processed
                    </button>
                  )}
                </div>
              </div>

              {/* Pipeline Controls */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">Add Operation:</span>
                  {Object.values(registry).map(op => (
                    <button
                      key={op.id}
                      onClick={() => addOperation(op.id)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
                    >
                      {op.label}
                    </button>
                  ))}
                </div>

                {/* Pipeline Steps */}
                {pipeline.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Pipeline:</span>
                    {pipeline.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border">
                        <span className="text-sm font-medium">{registry[step.id]?.label}</span>
                        
                        {/* Parameters */}
                        {step.id === 'resize' && (
                          <div className="flex items-center gap-1">
                            <label className="text-xs text-gray-600">Scale:</label>
                            <input
                              type="number"
                              min="1"
                              max="8"
                              value={step.params.scale || 2}
                              onChange={(e) => updateOperation(index, { scale: parseInt(e.target.value) || 2 })}
                              className="w-16 px-1 py-1 border rounded text-sm"
                            />
                          </div>
                        )}
                        
                        <button
                          onClick={() => removeOperation(index)}
                          className="text-red-500 hover:text-red-700 text-sm ml-auto"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Processed Image Display */}
              {processedBlob && (
                <div className="flex justify-center bg-gray-100 rounded-lg p-4">
                  <img
                    src={processedUrl}
                    alt="Processed output"
                    className="max-w-full max-h-96 object-contain"
                    style={{ 
                      imageRendering: 'pixelated'
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};