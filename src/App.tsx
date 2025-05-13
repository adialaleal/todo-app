import { WhiteboardManager } from "@/components/WhiteboardManager";
import { Toolbar } from "@/components/Toolbar";
import { useThemeStore } from "@/store/themeStore";
import { useEffect } from "react";
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col overflow-hidden">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 md:p-4 p-2">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-2 text-center md:text-left">
          TODO Whiteboard
        </h1>
        <Toolbar className="flex-wrap justify-center md:justify-start" />
      </header>

      <main className="flex-1 p-4 md:p-4 p-2 overflow-hidden">
        <WhiteboardManager />
      </main>

      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-2 text-center text-xs text-slate-500 dark:text-slate-400">
        TODO Whiteboard App - Desenvolvido com React, Zustand e TailwindCSS
      </footer>
    </div>
  );
}

export default App;
