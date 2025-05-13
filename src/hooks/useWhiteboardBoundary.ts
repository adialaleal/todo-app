import { useCallback, useEffect, useState } from 'react';

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
  const [boundary, setBoundary] = useState<Boundary>({
    minX: 0,
    maxX: window.innerWidth - itemWidth,
    minY: 0,
    maxY: window.innerHeight - itemHeight,
  });

  // Atualizar limites quando o tamanho do whiteboard mudar
  useEffect(() => {
    const updateBoundaries = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setBoundary({
          minX: 0,
          maxX: rect.width - itemWidth,
          minY: 0,
          maxY: rect.height - itemHeight,
        });
      }
    };

    updateBoundaries();
    window.addEventListener('resize', updateBoundaries);
    
    return () => window.removeEventListener('resize', updateBoundaries);
  }, [ref, itemWidth, itemHeight]);

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

  return {
    boundary,
    constrainPosition,
  };
}; 