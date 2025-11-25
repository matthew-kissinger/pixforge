
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import CanvasPage from './pages/CanvasPage';
import PromptsPage from './pages/PromptsPage';
import AssetEditorPage from './pages/AssetEditorPage';
import ScenesPage from './pages/ScenesPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="h-screen bg-gray-100 text-gray-800 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/canvas" element={<CanvasPage />} />
            <Route path="/prompts" element={<PromptsPage />} />
            <Route path="/editor" element={<AssetEditorPage />} />
            <Route path="/scenes" element={<ScenesPage />} />
            <Route path="/" element={<Navigate to="/canvas" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
