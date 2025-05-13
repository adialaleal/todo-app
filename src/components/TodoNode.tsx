import { memo, useState } from "react";
import { Handle, Position, NodeProps, NodeResizer } from "reactflow";
import { TodoItem as TodoItemType, Priority } from "@/types";
import { useTodoStore } from "@/store/todoStore";
import { cn, generatePastelColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useSettingsStore } from "@/store/settingsStore";

// Definição da interface para os dados do nó
interface TodoNodeData {
  todo: TodoItemType;
}

// Mapeamento de cores para prioridades
const priorityColors = {
  baixa:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200",
  média:
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200",
  alta: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200",
};

// Mapeamento de cores para os tipos de nós
const nodeTypeColors = {
  default: "bg-slate-50 dark:bg-slate-800",
  input: "bg-emerald-50 dark:bg-emerald-950",
  output: "bg-violet-50 dark:bg-violet-950",
  group: "bg-amber-50 dark:bg-amber-950",
};

// Mapeamento de ícones para os tipos de nós
const nodeTypeIcons = {
  default: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-slate-500"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
  input: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald-500"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  output: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-violet-500"
    >
      <path d="M12 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
      <path d="M5 9.2h14v5.6H5z" />
    </svg>
  ),
  group: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-500"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  ),
};

// Formatação de data
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Componente TodoNode
const TodoNodeComponent = ({
  data,
  selected,
  id,
  type,
}: NodeProps<TodoNodeData>) => {
  const { todo } = data;
  const { updateTodoContent, updateTodoColor, removeTodo, duplicateTodo } =
    useTodoStore();
  const { showTimestamps, compactMode } = useSettingsStore();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(todo.content);

  // Determinar se é um nó do tipo grupo
  const isGroup = type === "group";

  // Nós de entrada só têm conexão de saída
  const isInput = type === "input";

  // Nós de saída só têm conexão de entrada
  const isOutput = type === "output";

  // Pegar o tipo atual para estilização
  const nodeType = type || "default";

  // Estilo para grupos
  const groupStyle = isGroup
    ? {
        minWidth: 300,
        minHeight: 200,
        width: "100%",
        height: "100%",
        padding: "1.5rem",
      }
    : {};

  // Manipulação da edição do conteúdo
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      if (content.trim() !== todo.content.trim()) {
        updateTodoContent(todo.id, content);
      }
    }
  };

  // Eventos de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setContent(todo.content);
    }
  };

  // Alternar cor do TODO
  const handleColorChange = () => {
    const newColor = generatePastelColor();
    updateTodoColor(todo.id, newColor);
  };

  // Duplo clique para editar
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Duplicar o nó
  const handleDuplicate = () => {
    duplicateTodo(todo.id);
  };

  return (
    <>
      {/* Handles para conexões - posicionados conforme o tipo de nó */}
      {!isInput && (
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          style={{ background: "#555", width: 8, height: 8 }}
          className="border-2 border-background"
        />
      )}
      {!isOutput && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{ background: "#555", width: 8, height: 8 }}
          className="border-2 border-background"
        />
      )}
      {!isInput && !isOutput && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            style={{ background: "#555", width: 8, height: 8 }}
            className="border-2 border-background"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            style={{ background: "#555", width: 8, height: 8 }}
            className="border-2 border-background"
          />
        </>
      )}

      {/* Resizer para nós de grupo */}
      {isGroup && (
        <NodeResizer
          minWidth={200}
          minHeight={150}
          isVisible={selected}
          lineClassName="border-primary"
          handleClassName="h-3 w-3 bg-white border-2 border-primary rounded"
        />
      )}

      {/* Conteúdo do nó */}
      <div
        className={cn(
          "p-4 rounded-lg shadow-lg transition-all min-w-[200px]",
          `border-2 ${selected ? "border-primary" : "border-transparent"}`,
          `${nodeTypeColors[nodeType as keyof typeof nodeTypeColors]}`,
          isGroup
            ? "bg-opacity-60 dark:bg-opacity-30"
            : "bg-opacity-90 dark:bg-opacity-80",
          !isGroup && selected ? "scale-[1.02]" : "",
          isGroup ? "min-h-[120px] flex flex-col" : ""
        )}
        style={{
          backgroundColor: todo.color,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          ...groupStyle,
        }}
        onDoubleClick={handleDoubleClick}
      >
        {/* Indicador visual no topo e bordas */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-md bg-primary/20"></div>
        <div className="absolute inset-0 rounded-lg border border-black/5 dark:border-white/5 pointer-events-none"></div>

        {/* Informações do nó */}
        <div className="flex flex-col gap-3 h-full">
          {/* Cabeçalho com badges */}
          <div className="flex flex-wrap items-center gap-1.5 justify-between mb-1">
            <div className="flex gap-1.5 flex-wrap">
              {/* Badge de tipo de nó */}
              <div className="flex items-center space-x-1.5">
                {nodeTypeIcons[nodeType as keyof typeof nodeTypeIcons]}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs border-0 bg-black/5 dark:bg-white/10 px-1.5 py-0 h-5"
                  )}
                >
                  {nodeType}
                </Badge>
              </div>

              {/* Badge de prioridade */}
              {todo.priority && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-medium py-0 h-5",
                    priorityColors[todo.priority as Priority]
                  )}
                >
                  {todo.priority}
                </Badge>
              )}
            </div>

            {/* Badge de categoria - à direita */}
            {todo.category && (
              <Badge
                variant="secondary"
                className="text-xs font-medium py-0 h-5 bg-black/10 dark:bg-white/10 hover:bg-black/15"
              >
                {todo.category}
              </Badge>
            )}
          </div>

          {/* Conteúdo */}
          <div
            className={cn("min-h-[40px] flex-grow", isEditing ? "m-0" : "mt-1")}
          >
            {isEditing ? (
              <textarea
                value={content}
                onChange={handleContentChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full h-auto min-h-[60px] p-2.5 bg-white/80 dark:bg-slate-800/80 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            ) : (
              <div className="text-sm font-medium whitespace-pre-wrap break-words">
                {todo.content}
              </div>
            )}
          </div>

          {/* Tempo de criação e atualização */}
          {showTimestamps && (
            <div className="text-[10px] text-slate-600 dark:text-slate-400 opacity-60 mt-auto">
              {formatDate(todo.createdAt)}
              {todo.lastUpdated && todo.lastUpdated > todo.createdAt && (
                <span className="ml-1">• editado</span>
              )}
            </div>
          )}

          {/* Barra de ações */}
          {!compactMode && (
            <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                className="text-xs p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={handleColorChange}
                title="Mudar cor"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </button>
              <button
                className="text-xs p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={handleDuplicate}
                title="Duplicar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="13" height="13" x="9" y="9" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <button
                className="text-xs p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                onClick={() => removeTodo(id)}
                title="Remover"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Memoizar o componente para evitar re-renderizações desnecessárias
export const TodoNode = memo(TodoNodeComponent);
