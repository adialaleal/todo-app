import { useRef, useState, useEffect } from "react";
import { useTodoStore } from "@/store/todoStore";
import { cn } from "@/lib/utils";
import { WhiteboardDropArea } from "./WhiteboardDropArea";

interface WhiteboardProps {
  className?: string;
}

export const Whiteboard = ({ className }: WhiteboardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const { todos } = useTodoStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Ajustar dimensões do whiteboard quando o componente montar ou o tamanho da janela mudar
  useEffect(() => {
    const updateDimensions = () => {
      if (boardRef.current) {
        const { width, height } = boardRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        setIsMobile(window.innerWidth < 768); // Verificar se é dispositivo móvel
      }
    };

    // Executar inicialmente e adicionar evento de resize
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Limpar evento ao desmontar
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div
      ref={boardRef}
      className={cn(
        "relative w-full overflow-hidden rounded-xl shadow-inner",
        "h-[calc(100vh-8rem)] md:h-[calc(100vh-7rem)]", // Altura ajustada para diferentes tamanhos de tela
        "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900",
        "border border-slate-200 dark:border-slate-700",
        className
      )}
    >
      {/* Padrão de fundo estilo dot-grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

      {/* Área de drop com TODOs */}
      <WhiteboardDropArea parentRef={boardRef} />

      {/* Mensagem quando não há TODOs */}
      {todos.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-center px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 opacity-40"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 14h6" />
            <path d="M12 11v6" />
          </svg>
          <p className="text-lg font-medium">
            {isMobile
              ? "Toque no botão + para adicionar TODOs"
              : "Quadro vazio"}
          </p>
          <p className="text-sm opacity-70 mt-1">
            Adicione TODOs usando a barra de ferramentas acima
          </p>
        </div>
      )}

      {/* Informação de depuração - com design melhorado */}
      <div className="absolute bottom-3 right-3 text-xs bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-1 rounded-full shadow-sm opacity-70 hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
        {dimensions.width}×{dimensions.height} | {todos.length}{" "}
        {todos.length === 1 ? "TODO" : "TODOs"}
      </div>
    </div>
  );
};
