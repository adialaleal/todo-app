import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TodoItem as TodoItemType } from '@/types';
import { useTodoStore } from '@/store/todoStore';
import { cn, generatePastelColor } from '@/lib/utils';

interface TodoItemProps {
  todo: TodoItemType;
  className?: string;
}

export const TodoItem = ({ todo, className }: TodoItemProps) => {
  const { updateTodoContent, removeTodo, duplicateTodo, bringToFront, updateTodoColor } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(todo.content);
  const [isVisible, setIsVisible] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);

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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
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

  return (
    <Card
      className={cn(
        "absolute p-3 shadow-md min-w-[200px] max-w-[300px] cursor-move group",
        "hover:shadow-lg transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{
        left: `${todo.position.x}px`,
        top: `${todo.position.y}px`,
        backgroundColor: todo.color,
        zIndex: todo.zIndex || 1,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Conteúdo */}
      <div className="mb-2">
        <div
          ref={contentEditableRef}
          contentEditable={isEditing}
          suppressContentEditableWarning
          className={cn(
            "outline-none break-words whitespace-pre-wrap min-h-[30px] text-slate-800",
            isEditing && "border border-dashed border-slate-400 p-1 rounded bg-white/50",
            !isEditing && "select-text cursor-text"
          )}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onInput={handleContentChange}
        >
          {content}
        </div>
      </div>

      {/* Barra de ferramentas (visível apenas no hover ou edição) */}
      <div className="flex justify-end items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-slate-600 hover:text-slate-900"
          onClick={(e) => {
            e.stopPropagation(); // Impedir propagação para o Card
            handleColorChange();
          }}
          title="Mudar cor"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12 2 2 4-4" />
          </svg>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-slate-600 hover:text-slate-900"
          onClick={(e) => {
            e.stopPropagation(); // Impedir propagação para o Card
            duplicateTodo(todo.id);
          }}
          title="Duplicar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-slate-600 hover:text-slate-900"
          onClick={(e) => {
            e.stopPropagation(); // Impedir propagação para o Card
            setIsEditing(true);
          }}
          title="Editar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-slate-600 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation(); // Impedir propagação para o Card
            removeTodo(todo.id);
          }}
          title="Remover"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </Button>
      </div>

      {/* Tempo de criação e atualização */}
      <div className="text-xs text-slate-600 opacity-60 mt-2">
        {new Date(todo.createdAt).toLocaleString('pt-BR', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
        {todo.lastUpdated && todo.lastUpdated > todo.createdAt && (
          <span className="ml-1">
            • editado
          </span>
        )}
      </div>
    </Card>
  );
}; 