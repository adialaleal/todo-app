import { useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { TodoItem as TodoItemType } from '@/types';
import { TodoItem } from './TodoItem';
import { cn } from '@/lib/utils';

interface DraggableTodoItemProps {
  todo: TodoItemType;
  className?: string;
}

export const DraggableTodoItem = ({ todo, className }: DraggableTodoItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Configurar @dnd-kit para tornar o item arrastável
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id,
    data: {
      todo
    }
  });

  // Aplicar transformação apenas durante o arrasto, caso contrário usar posição absoluta do TODO
  // A transformação afeta apenas a posição, não o conteúdo
  const style = isDragging
    ? {
        transform: CSS.Transform.toString(transform),
        zIndex: 9999, // Garantir que fique acima de outros elementos durante o arrasto
        opacity: 0.8,
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
      }
    : {
        // Não aplicar nenhuma transformação quando não estiver arrastando
        // para evitar problemas com o texto invertido
        zIndex: todo.zIndex || 1
      };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        isDragging ? 'z-50' : '',
        className
      )}
      {...listeners}
      {...attributes}
    >
      <TodoItem 
        todo={todo} 
        className={cn(
          isDragging ? 'shadow-xl ring-2 ring-blue-400 ring-opacity-50' : '',
          'transition-shadow'
        )}
      />
    </div>
  );
}; 