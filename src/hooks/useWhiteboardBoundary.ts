import { useCallback, useEffect, useState } from 'react';
import { useTodoStore } from '@/store/todoStore';
import { toast } from 'sonner';

interface Boundary {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface Position {
  x: number;
  y: number;
}

export const useWhiteboardBoundary = (ref: React.RefObject<HTMLElement>, itemWidth = 200, itemHeight = 150) => {
  const { todos, updateTodoPosition } = useTodoStore();
  const [boundary, setBoundary] = useState<Boundary>({
    minX: 0,
    maxX: window.innerWidth - itemWidth,
    minY: 0,
    maxY: window.innerHeight - itemHeight,
  });

  // Verificar se uma posição está dentro dos limites do quadro
  const isWithinBoundary = useCallback(
    (position: Position): boolean => {
      return (
        position.x >= boundary.minX &&
        position.x <= boundary.maxX &&
        position.y >= boundary.minY &&
        position.y <= boundary.maxY
      );
    },
    [boundary]
  );

  // Função para garantir que a posição esteja dentro dos limites
  const constrainPosition = useCallback(
    (position: Position): Position => {
      return {
        x: Math.max(boundary.minX, Math.min(boundary.maxX, position.x)),
        y: Math.max(boundary.minY, Math.min(boundary.maxY, position.y)),
      };
    },
    [boundary]
  );

  // Atualizar limites quando o tamanho do whiteboard mudar
  useEffect(() => {
    const updateBoundaries = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const newBoundary = {
          minX: 0,
          maxX: Math.max(300, rect.width - itemWidth),
          minY: 0,
          maxY: Math.max(200, rect.height - itemHeight),
        };
        
        setBoundary(newBoundary);
        
        // Verificar se algum TODO está fora dos limites e ajustar se necessário
        let outOfBoundsTodos = 0;
        todos.forEach(todo => {
          if (!isWithinBoundary({
            x: todo.position.x,
            y: todo.position.y
          })) {
            outOfBoundsTodos++;
            const { x, y } = constrainPosition({
              x: todo.position.x,
              y: todo.position.y
            });
            updateTodoPosition(todo.id, x, y);
          }
        });
        
        // Notificar o usuário se algum TODO foi reposicionado
        if (outOfBoundsTodos > 0) {
          toast.info(`${outOfBoundsTodos} TODOs reposicionados`, {
            description: "Alguns itens foram ajustados para se adequarem à nova dimensão da tela."
          });
        }
      }
    };

    updateBoundaries();
    window.addEventListener('resize', updateBoundaries);
    
    return () => window.removeEventListener('resize', updateBoundaries);
  }, [ref, itemWidth, itemHeight, todos, constrainPosition, isWithinBoundary, updateTodoPosition]);

  return {
    boundary,
    constrainPosition,
    isWithinBoundary,
  };
}; 