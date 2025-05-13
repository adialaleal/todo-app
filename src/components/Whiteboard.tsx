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
        "relative w-full bg-slate-50 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm",
        "h-[calc(100vh-8rem)] md:h-[calc(100vh-7rem)]", // Altura ajustada para diferentes tamanhos de tela
        className
      )}
    >
      {/* Grade visual de fundo (opcional) - apenas em desktop */}
      {!isMobile && (
        <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-10 pointer-events-none">
          {Array.from({ length: 400 }).map((_, index) => (
            <div
              key={index}
              className="border border-slate-400 dark:border-slate-500"
            />
          ))}
        </div>
      )}

      {/* Área de drop com TODOs */}
      <WhiteboardDropArea parentRef={boardRef} />

      {/* Mensagem quando não há TODOs */}
      {todos.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-500 text-center px-4">
          <p>
            {isMobile
              ? "Toque no botão + para adicionar TODOs"
              : "Adicione TODOs usando a barra de ferramentas"}
          </p>
        </div>
      )}

      {/* Informação de depuração - pode ser removida na versão final */}
      <div className="absolute bottom-2 right-2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none hidden md:block">
        Dimensões: {dimensions.width}x{dimensions.height} | TODOs:{" "}
        {todos.length}
      </div>
    </div>
  );
};
