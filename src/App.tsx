import { WhiteboardManager } from "@/components/WhiteboardManager";
import { Toolbar } from "@/components/Toolbar";
import { useThemeStore } from "@/store/themeStore";
import { useEffect } from "react";
import { CommandPalette } from "@/components/CommandPalette";
import "./App.css";

function App() {
  const { theme } = useThemeStore();

  // Aplicar a classe 'dark' ao elemento HTML quando o tema for escuro
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 text-center md:text-left flex items-center justify-center md:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 text-blue-500"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m9 10 2 2 4-4" />
            </svg>
            TODO Whiteboard
          </h1>
          <Toolbar className="flex-wrap justify-center md:justify-start rounded-lg bg-slate-50 dark:bg-slate-700 p-2 shadow-inner" />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-hidden container mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 h-full overflow-hidden">
          <WhiteboardManager />
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3 text-center text-xs text-slate-500 dark:text-slate-400 shadow-inner">
        <div className="container mx-auto">
          <p className="font-medium">TODO Whiteboard App</p>
          <p className="opacity-75">
            Desenvolvido com React, Zustand e TailwindCSS
          </p>
        </div>
      </footer>

      {/* Paleta de comandos global */}
      <CommandPalette />
    </div>
  );
}

export default App;
