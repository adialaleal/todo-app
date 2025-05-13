import { useRef, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { DraggableTodoItem } from "./DraggableTodoItem";
import { useTodoStore } from "@/store/todoStore";
import { useWhiteboardBoundary } from "@/hooks/useWhiteboardBoundary";

interface WhiteboardDropAreaProps {
  parentRef: React.RefObject<HTMLElement>;
  filter?: string; // Filtrar por categoria
}

export const WhiteboardDropArea = ({
  parentRef,
  filter = "",
}: WhiteboardDropAreaProps) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const { todos, updateTodoPosition, updateTodoCategory, filterByCategory } =
    useTodoStore();
  const { constrainPosition } = useWhiteboardBoundary(parentRef);

  // Filtrar TODOs com base na categoria
  const filteredTodos = filter ? filterByCategory(filter) : todos;

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
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;

    // Calcular nova posição
    const newX = todo.position.x + delta.x;
    const newY = todo.position.y + delta.y;

    // Verificar limites e atualizar posição
    const { x, y } = constrainPosition({ x: newX, y: newY });
    updateTodoPosition(todoId, x, y);

    // Se estamos em uma aba de categoria e o TODO foi arrastado para cá,
    // atualizar a categoria do TODO
    if (filter && todo.category !== filter) {
      updateTodoCategory(todoId, filter);
    }
  };

  // Efeito para salvar posição de TODOs visíveis ao mudar de categoria
  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      if (!filter) return;

      // Se um TODO for arrastado de outro lugar, atribuí-lo a esta categoria
      if (e.dataTransfer?.getData("text/plain")?.startsWith("todo:")) {
        const todoId = e.dataTransfer
          .getData("text/plain")
          .replace("todo:", "");
        updateTodoCategory(todoId, filter);
      }
    };

    const div = dropAreaRef.current;
    if (div) {
      div.addEventListener("drop", handleDrop);
      return () => {
        div.removeEventListener("drop", handleDrop);
      };
    }
  }, [filter, updateTodoCategory]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        ref={dropAreaRef}
        className="absolute inset-0"
        style={{
          // Garantir que não haja transformações que afetem o texto
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Renderizar os TODOs filtrados como itens arrastáveis */}
        {filteredTodos.map((todo) => (
          <DraggableTodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </DndContext>
  );
};
