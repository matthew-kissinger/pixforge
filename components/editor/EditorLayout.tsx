import React from 'react';

interface EditorLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  output: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  sidebar,
  main,
  output
}) => {
  return (
    <div className="grid grid-cols-[280px_1fr_280px] h-screen bg-background">
      <aside className="border-r bg-card overflow-hidden">
        {sidebar}
      </aside>
      
      <main className="flex flex-col overflow-hidden">
        {main}
      </main>
      
      <aside className="border-l bg-card overflow-hidden">
        {output}
      </aside>
    </div>
  );
};