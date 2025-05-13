import { useRef } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DraggableTodoItem } from './DraggableTodoItem';
import { useTodoStore } from '@/store/todoStore';
import { useWhiteboardBoundary } from '@/hooks/useWhiteboardBoundary';

interface WhiteboardDropAreaProps {
  parentRef: React.RefObject<HTMLElement>;
}

export const WhiteboardDropArea = ({ parentRef }: WhiteboardDropAreaProps) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const { todos, updateTodoPosition } = useTodoStore();
  const { constrainPosition } = useWhiteboardBoundary(parentRef);

  // Configuração dos sensores para o dnd-kit
  const mouseSensor = useSensor(MouseSensor, {
    // Priorizar movimento do mouse para melhor precisão
    activationConstraint: {
      distance: 5, // 5px de distância para ativar o arrasto
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    // Configuração para dispositivos touch
    activationConstraint: {
      delay: 100, // 100ms de delay para evitar eventos falsos
      tolerance: 5, // 5px de tolerância para ativar o arrasto
    },
  });

  // Usar ambos os sensores
  const sensors = useSensors(mouseSensor, touchSensor);

  // Calcular posição final baseado no evento de drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const todoId = active.id as string;
    
    // Encontrar o todo que foi arrastado
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    // Calcular nova posição
    const newX = todo.position.x + delta.x;
    const newY = todo.position.y + delta.y;
    
    // Verificar limites e atualizar posição
    const { x, y } = constrainPosition({ x: newX, y: newY });
    updateTodoPosition(todoId, x, y);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div 
        ref={dropAreaRef} 
        className="absolute inset-0"
        style={{ 
          // Garantir que não haja transformações que afetem o texto
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Renderizar todos os TODOs como itens arrastáveis */}
        {todos.map((todo) => (
          <DraggableTodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </DndContext>
  );
}; 