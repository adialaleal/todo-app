import { useRef } from 'react';
import { useTodoStore } from '@/store/todoStore';
import { Whiteboard } from './Whiteboard';
import { WhiteboardContainer } from './WhiteboardContainer';
import { useWhiteboardBoundary } from '@/hooks/useWhiteboardBoundary';

export const WhiteboardManager = () => {
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const { boundary, constrainPosition } = useWhiteboardBoundary(whiteboardRef);
  const { todos, updateTodoPosition } = useTodoStore();

  // Função para lidar com o posicionamento dos TODOs
  const handlePositionUpdate = (id: string, x: number, y: number) => {
    // Certificar que a posição está dentro dos limites
    const constrainedPosition = constrainPosition({ x, y });
    
    // Atualizar no store
    updateTodoPosition(id, constrainedPosition.x, constrainedPosition.y);
  };

  return (
    <WhiteboardContainer>
      <div ref={whiteboardRef} className="w-full h-full relative">
        <Whiteboard />
        
        {/* Debug info */}
        <div className="absolute top-2 right-2 text-xs text-slate-500 bg-white/80 p-1 rounded">
          Limites: {boundary.minX},{boundary.minY} → {boundary.maxX},{boundary.maxY}
        </div>
      </div>
    </WhiteboardContainer>
  );
}; 