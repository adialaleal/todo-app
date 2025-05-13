import { WhiteboardManager } from '@/components/WhiteboardManager';
import { Toolbar } from '@/components/Toolbar';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 p-4">
        <h1 className="text-xl font-bold text-slate-800 mb-2">TODO Whiteboard</h1>
        <Toolbar />
      </header>
      
      <main className="flex-1 p-4">
        <WhiteboardManager />
      </main>
      
      <footer className="bg-white border-t border-slate-200 p-2 text-center text-xs text-slate-500">
        TODO Whiteboard App - Desenvolvido com React, Zustand e TailwindCSS
      </footer>
    </div>
  );
}

export default App
