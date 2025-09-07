import React, { useState } from 'react';
import { EditorLayout } from '../components/editor/EditorLayout';
import { EditorHeader } from '../components/editor/EditorHeader';
import { AssetsView } from '../components/editor/AssetsView';
import { CanvasView } from '../components/editor/CanvasView';
import { EditorControls } from '../components/EditorControls';
import { OutputPanel } from '../components/OutputPanel';
import { useAssetEditor } from '../hooks/useAssetEditor';

const AssetEditorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assets' | 'canvas'>('assets');
  
  const {
    isLoading,
    error,
    canEdit,
    hasCanvasSelected,
    selectedAssetsCount,
    handleEdit
  } = useAssetEditor();
  
  return (
    <EditorLayout
      sidebar={
        <EditorControls
          onEdit={handleEdit}
          isLoading={isLoading}
          error={error}
        />
      }
      main={
        <>
          <EditorHeader
            selectedAssetsCount={selectedAssetsCount}
            hasCanvasSelected={hasCanvasSelected}
            canEdit={canEdit}
            isLoading={isLoading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div className="flex-1 relative">
            <div 
              className={activeTab === 'assets' ? 'block' : 'hidden'}
              style={{ position: 'absolute', inset: 0 }}
            >
              <AssetsView selectedAssetsCount={selectedAssetsCount} />
            </div>
            <div 
              className={activeTab === 'canvas' ? 'block' : 'hidden'}
              style={{ position: 'absolute', inset: 0 }}
            >
              <CanvasView hasCanvasSelected={hasCanvasSelected} />
            </div>
          </div>
        </>
      }
      output={<OutputPanel />}
    />
  );
};

export default AssetEditorPage;