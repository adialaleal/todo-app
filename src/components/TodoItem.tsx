import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TodoItem as TodoItemType, Priority } from "@/types";
import { useTodoStore } from "@/store/todoStore";
import { cn, generatePastelColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "@/components/ui/context-menu";

interface TodoItemProps {
  todo: TodoItemType;
  className?: string;
}

// Mapeamento de cores para prioridades
const priorityColors = {
  baixa:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200",
  média:
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200",
  alta: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200",
};

export const TodoItem = ({ todo, className }: TodoItemProps) => {
  const {
    updateTodoContent,
    removeTodo,
    duplicateTodo,
    bringToFront,
    updateTodoColor,
    updateTodoPriority,
    updateTodoCategory,
    categories,
  } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(todo.content);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Verificar se é dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Animação de entrada quando o componente monta
  useEffect(() => {
    // Pequeno atraso para iniciar a animação
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Focar no elemento quando entrar no modo de edição
  useEffect(() => {
    if (isEditing && contentEditableRef.current) {
      contentEditableRef.current.focus();

      // Posicionar o cursor no final do texto
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentEditableRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  // Lidar com o clique para trazer para frente
  const handleClick = () => {
    bringToFront(todo.id);
  };

  // Lidar com duplo clique para editar
  const handleDoubleClick = () => {
    setIsEditing(true);
    bringToFront(todo.id);
  };

  // Lidar com toque longo em dispositivos móveis
  const handleTouchStart = () => {
    if (isMobile) {
      const timer = setTimeout(() => {
        setIsEditing(true);
        bringToFront(todo.id);
      }, 500); // 500ms para considerar como toque longo

      return () => clearTimeout(timer);
    }
  };

  // Terminar edição e salvar o conteúdo
  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      if (content.trim() !== todo.content.trim()) {
        updateTodoContent(todo.id, content);
      }
    }
  };

  // Eventos de teclado para salvar com Enter ou cancelar com Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setContent(todo.content);
    }
  };

  // Capturar as mudanças de conteúdo
  const handleContentChange = () => {
    if (contentEditableRef.current) {
      setContent(contentEditableRef.current.innerText);
    }
  };

  // Mudar a cor do TODO
  const handleColorChange = () => {
    const newColor = generatePastelColor();
    updateTodoColor(todo.id, newColor);
  };

  // Funções para prioridade e categoria
  const handlePriorityChange = (priority: Priority) => {
    updateTodoPriority(todo.id, priority);
  };

  const handleCategoryChange = (category: string) => {
    updateTodoCategory(todo.id, category);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          className={cn(
            "absolute p-4 shadow-md cursor-move group",
            isMobile
              ? "min-w-[150px] max-w-[250px]"
              : "min-w-[200px] max-w-[300px]",
            "hover:shadow-lg transition-all duration-300",
            "backdrop-blur-sm bg-opacity-90 border-t border-white/40",
            "rounded-lg hover:scale-[1.01]",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            className
          )}
          style={{
            left: `${todo.position.x}px`,
            top: `${todo.position.y}px`,
            backgroundColor: todo.color,
            zIndex: todo.zIndex || 1,
            // Garantir que não haja inversão de texto
            transform: "none",
            direction: "ltr",
            boxShadow:
              "0 4px 15px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTouchStart}
        >
          {/* Indicador visual no topo do card */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-black/10"></div>

          {/* Badges de prioridade e categoria */}
          <div className="flex items-center gap-1.5 mb-2">
            {todo.priority && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium py-0 h-5",
                  priorityColors[todo.priority]
                )}
              >
                {todo.priority}
              </Badge>
            )}
            {todo.category && (
              <Badge
                variant="secondary"
                className="text-xs font-medium py-0 h-5 bg-black/10 hover:bg-black/15"
              >
                {todo.category}
              </Badge>
            )}
          </div>

          {/* Conteúdo */}
          <div className="mb-3">
            <div
              ref={contentEditableRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
              className={cn(
                "outline-none break-words whitespace-pre-wrap min-h-[30px] text-slate-800",
                isMobile ? "text-sm" : "text-base",
                isEditing &&
                  "border border-dashed border-slate-400 p-2 rounded-md bg-white/70",
                !isEditing && "select-text cursor-text"
              )}
              style={{
                // Garantir direção correta do texto
                direction: "ltr",
                unicodeBidi: "normal",
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onInput={handleContentChange}
            >
              {content}
            </div>
          </div>

          {/* Barra de ferramentas (sempre visível em mobile, visível no hover em desktop) */}
          <div
            className={cn(
              "flex justify-end items-center gap-1 mt-2 transition-all bg-white/20 rounded-lg p-1",
              isMobile
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
            )}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "text-slate-600 hover:text-slate-900 rounded-full hover:bg-black/5",
                      isMobile ? "h-8 w-8 p-0" : "h-7 w-7 p-0"
                    )}
                    onClick={(e) => {
                      e.stopPropagation(); // Impedir propagação para o Card
                      handleColorChange();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={isMobile ? "14" : "16"}
                      height={isMobile ? "14" : "16"}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mudar cor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "text-slate-600 hover:text-slate-900 rounded-full hover:bg-black/5",
                      isMobile ? "h-8 w-8 p-0" : "h-7 w-7 p-0"
                    )}
                    onClick={(e) => {
                      e.stopPropagation(); // Impedir propagação para o Card
                      duplicateTodo(todo.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={isMobile ? "14" : "16"}
                      height={isMobile ? "14" : "16"}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="8" y="8" width="12" height="12" rx="2" />
                      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "text-slate-600 hover:text-slate-900 rounded-full hover:bg-black/5",
                      isMobile ? "h-8 w-8 p-0" : "h-7 w-7 p-0"
                    )}
                    onClick={(e) => {
                      e.stopPropagation(); // Impedir propagação para o Card
                      removeTodo(todo.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={isMobile ? "14" : "16"}
                      height={isMobile ? "14" : "16"}
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
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remover</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Tempo de criação e atualização */}
          <div
            className={cn(
              "text-slate-600 opacity-60 mt-2",
              isMobile ? "text-[10px]" : "text-xs"
            )}
          >
            {new Date(todo.createdAt).toLocaleString("pt-BR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {todo.lastUpdated && todo.lastUpdated > todo.createdAt && (
              <span className="ml-1">• editado</span>
            )}
          </div>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuLabel>Opções do TODO</ContextMenuLabel>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m16 6 4 14" />
                <path d="M12 6v14" />
                <path d="M8 8v12" />
                <path d="M4 4v16" />
              </svg>
              Prioridade {todo.priority ? `(${todo.priority})` : ""}
            </span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem
              onClick={() => handlePriorityChange("baixa")}
              className={cn(
                todo.priority === "baixa" && "bg-blue-50 dark:bg-blue-900/30"
              )}
            >
              <Badge variant="outline" className={priorityColors.baixa}>
                Baixa
              </Badge>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handlePriorityChange("média")}
              className={cn(
                todo.priority === "média" && "bg-amber-50 dark:bg-amber-900/30"
              )}
            >
              <Badge variant="outline" className={priorityColors.média}>
                Média
              </Badge>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handlePriorityChange("alta")}
              className={cn(
                todo.priority === "alta" && "bg-red-50 dark:bg-red-900/30"
              )}
            >
              <Badge variant="outline" className={priorityColors.alta}>
                Alta
              </Badge>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
              Categoria {todo.category ? `(${todo.category})` : ""}
            </span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {categories.map((category) => (
              <ContextMenuItem
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  todo.category === category && "bg-slate-100 dark:bg-slate-800"
                )}
              >
                <Badge variant="secondary" className="bg-black/10">
                  {category}
                </Badge>
              </ContextMenuItem>
            ))}
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleCategoryChange("")}>
              Remover categoria
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => setIsEditing(true)}>
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            Editar
          </span>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => duplicateTodo(todo.id)}>
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="8" y="8" width="12" height="12" rx="2" />
              <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
            </svg>
            Duplicar
          </span>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => handleColorChange()}>
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            Mudar cor
          </span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => removeTodo(todo.id)}
          className="text-red-600 focus:text-red-600"
        >
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
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
            Remover
          </span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
