import { useRef, useState, useEffect } from 'react';
import { useTodoStore } from '@/store/todoStore';
import { cn } from '@/lib/utils';

interface WhiteboardProps {
  className?: string;
}

export const Whiteboard = ({ className }: WhiteboardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const { todos } = useTodoStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Ajustar dimensões do whiteboard quando o componente montar ou o tamanho da janela mudar
  useEffect(() => {
    const updateDimensions = () => {
      if (boardRef.current) {
        const { width, height } = boardRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Executar inicialmente e adicionar evento de resize
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Limpar evento ao desmontar
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div
      ref={boardRef}
      className={cn(
        "relative w-full h-[calc(100vh-5rem)] bg-slate-50 overflow-hidden border border-slate-200 rounded-lg shadow-sm",
        className
      )}
    >
      {/* Grade visual de fundo (opcional) */}
      <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-10 pointer-events-none">
        {Array.from({ length: 400 }).map((_, index) => (
          <div 
            key={index} 
            className="border border-slate-400"
          />
        ))}
      </div>
      
      {/* Container para os TODOs - será implementado na Tarefa 4 */}
      <div className="absolute inset-0">
        {todos.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            Adicione TODOs usando a barra de ferramentas
          </div>
        )}
      </div>

      {/* Informação de depuração - pode ser removida na versão final */}
      <div className="absolute bottom-2 right-2 text-xs text-slate-400 pointer-events-none">
        Dimensões: {dimensions.width}x{dimensions.height} | TODOs: {todos.length}
      </div>
    </div>
  );
}; 