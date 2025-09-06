
import React from 'react';

const SVGIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    {children}
  </svg>
);

export const BrushIcon: React.FC = () => (
  <SVGIcon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </SVGIcon>
);

export const EraserIcon: React.FC = () => (
  <SVGIcon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 19H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z" />
  </SVGIcon>
);

export const RectangleIcon: React.FC = () => (
  <SVGIcon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
  </SVGIcon>
);

export const CircleIcon: React.FC = () => (
  <SVGIcon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
  </SVGIcon>
);

export const UndoIcon: React.FC = () => (
  <SVGIcon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8A5 5 0 009 5" />
  </SVGIcon>
);

export const RedoIcon: React.FC = () => (
  <SVGIcon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 15l3-3m0 0l-3-3m3 3H5a5 5 0 005 5" />
  </SVGIcon>
);

export const UploadIcon: React.FC = () => (
  <SVGIcon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </SVGIcon>
);

export const TrashIcon: React.FC = () => (
  <SVGIcon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </SVGIcon>
);

export const SparklesIcon: React.FC = () => (
  <SVGIcon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </SVGIcon>
);

export const DownloadIcon: React.FC = () => (
    <SVGIcon>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </SVGIcon>
);

export const CursorArrowIcon: React.FC = () => (
    <SVGIcon>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.374L6.92 13.252a1.5 1.5 0 010-2.121l8.122-8.122a1.5 1.5 0 012.121 0l2.121 2.121a1.5 1.5 0 010 2.121L13.252 19.252a1.5 1.5 0 01-2.121 0l-2.121-2.121a1.5 1.5 0 010-2.121L15.042 8.626" />
    </SVGIcon>
  );
  