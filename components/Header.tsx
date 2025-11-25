
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
          PixForge
        </h1>
        <nav className="flex gap-2 sm:gap-4">
          <Link 
            to="/canvas" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/canvas'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Canvas
          </Link>
          <Link 
            to="/prompts" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/prompts'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Prompts
          </Link>
          <Link 
            to="/editor" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/editor'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Editor
          </Link>
          <Link 
            to="/scenes" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/scenes'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Scenes
          </Link>
        </nav>
      </div>
    </header>
  );
};