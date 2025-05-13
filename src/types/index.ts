// Define a interface para um item de TODO
export interface TodoItem {
  id: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  color: string;
  createdAt: number;
  lastUpdated?: number;
  zIndex?: number;
}

// Interface para o estado do store Zustand
export interface TodoStore {
  todos: TodoItem[];
  // Ações básicas CRUD
  addTodo: (content: string) => void;
  removeTodo: (id: string) => void;
  updateTodoPosition: (id: string, x: number, y: number) => void;
  updateTodoContent: (id: string, content: string) => void;
  // Novas funcionalidades
  updateTodoColor: (id: string, color: string) => void;
  clearAllTodos: () => void;
  bringToFront: (id: string) => void;
  duplicateTodo: (id: string) => void;
  // Ações em lote
  saveTodoLayout: () => string;
  loadTodoLayout: (layoutData: string) => void;
  exportTodos: () => string;
  importTodos: (data: string) => void;
} 