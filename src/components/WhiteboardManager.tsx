import { useRef } from 'react';
import { useTodoStore } from '@/store/todoStore';
import { Whiteboard } from './Whiteboard';
import { WhiteboardContainer } from './WhiteboardContainer';
import { useWhiteboardBoundary } from '@/hooks/useWhiteboardBoundary';

export const WhiteboardManager = () => {
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const { boundary } = useWhiteboardBoundary(whiteboardRef);
  const { todos } = useTodoStore();

  return (
    <WhiteboardContainer>
      <div ref={whiteboardRef} className="w-full h-full relative">
        <Whiteboard />
        
        {/* Informações rápidas (atalhos e status) */}
        <div className="absolute top-2 left-2 text-xs bg-white/80 p-1 rounded shadow">
          <span className="font-medium">Atalhos:</span> Duplo clique para editar • Arraste para mover
        </div>
        
        {/* Debug info */}
        <div className="absolute top-2 right-2 text-xs text-slate-500 bg-white/80 p-1 rounded shadow">
          Itens: {todos.length} • Área: {Math.round(boundary.maxX)}x{Math.round(boundary.maxY)}
        </div>
      </div>
    </WhiteboardContainer>
  );
}; 