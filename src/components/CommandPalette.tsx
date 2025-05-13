import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTodoStore } from "@/store/todoStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Badge } from "@/components/ui/badge";
import { Priority } from "@/types";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Stores
  const {
    todos,
    addTodo,
    clearAllTodos,
    searchTodos,
    filterByCategory,
    filterByPriority,
    categories,
    updateTodoPriority,
    updateTodoCategory,
    bringToFront,
  } = useTodoStore();

  const {
    defaultCategory,
    defaultPriority,
    setDefaultCategory,
    setDefaultPriority,
  } = useSettingsStore();

  // Comandos rápidos para adicionar TODO com diferentes prioridades
  const handleQuickAdd = (priority?: Priority) => {
    if (searchQuery.trim()) {
      const todoContent = searchQuery.trim();
      addTodo(todoContent);

      // Se uma prioridade foi especificada, atualize o TODO recém-criado
      if (priority) {
        const newTodoId = todos[todos.length - 1]?.id;
        if (newTodoId) {
          updateTodoPriority(newTodoId, priority);
        }
      }

      setSearchQuery("");
      setOpen(false);
    }
  };

  // Buscar um TODO existente e trazê-lo para frente
  const handleFindAndFocus = (todoId: string) => {
    bringToFront(todoId);
    setOpen(false);
  };

  // Atalho de teclado para abrir o Command Palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Resultados da busca
  const searchResults = searchQuery.trim() ? searchTodos(searchQuery) : [];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Digite para buscar ou adicionar TODOs..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        {/* Ações rápidas */}
        <CommandGroup heading="Ações rápidas">
          <CommandItem
            onSelect={() => handleQuickAdd()}
            disabled={!searchQuery.trim()}
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>
              Adicionar TODO: <span className="font-medium">{searchQuery}</span>
            </span>
          </CommandItem>

          <CommandItem
            onSelect={() => handleQuickAdd("baixa")}
            disabled={!searchQuery.trim()}
          >
            <svg
              className="mr-2 h-4 w-4 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Adicionar como prioridade baixa</span>
          </CommandItem>

          <CommandItem
            onSelect={() => handleQuickAdd("média")}
            disabled={!searchQuery.trim()}
          >
            <svg
              className="mr-2 h-4 w-4 text-amber-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Adicionar como prioridade média</span>
          </CommandItem>

          <CommandItem
            onSelect={() => handleQuickAdd("alta")}
            disabled={!searchQuery.trim()}
          >
            <svg
              className="mr-2 h-4 w-4 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Adicionar como prioridade alta</span>
          </CommandItem>

          {todos.length > 0 && (
            <CommandItem onSelect={() => clearAllTodos()}>
              <svg
                className="mr-2 h-4 w-4 text-red-500"
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
              </svg>
              <span>Limpar todos os TODOs ({todos.length})</span>
            </CommandItem>
          )}
        </CommandGroup>

        {/* Resultados da busca */}
        {searchResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="TODOs encontrados">
              {searchResults.map((todo) => (
                <CommandItem
                  key={todo.id}
                  onSelect={() => handleFindAndFocus(todo.id)}
                >
                  <div className="mr-2 flex items-center">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: todo.color }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="truncate w-[300px]">{todo.content}</span>
                    <div className="flex gap-1 mt-1">
                      {todo.priority && (
                        <Badge variant="outline" className="text-xs py-0 h-4">
                          {todo.priority}
                        </Badge>
                      )}
                      {todo.category && (
                        <Badge
                          variant="secondary"
                          className="text-xs py-0 h-4 bg-black/10"
                        >
                          {todo.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Categorias */}
        {categories.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Filtrar por categoria">
              {categories.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => {
                    setDefaultCategory(category);
                    setOpen(false);
                  }}
                >
                  <svg
                    className="mr-2 h-4 w-4"
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
                  <span>{category}</span>
                  {defaultCategory === category && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Ativo
                    </span>
                  )}
                </CommandItem>
              ))}
              <CommandItem onSelect={() => setDefaultCategory("")}>
                <svg
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 6-12 12" />
                  <path d="m6 6 12 12" />
                </svg>
                <span>Limpar filtro de categoria</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
