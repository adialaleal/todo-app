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
  priority?: "baixa" | "média" | "alta";
  category?: string;
}

// Define os tipos de prioridade disponíveis
export type Priority = "baixa" | "média" | "alta";

// Interface para o estado do store Zustand
export interface TodoStore {
  todos: TodoItem[];
  categories: string[];
  // Ações básicas CRUD
  addTodo: (content: string) => void;
  removeTodo: (id: string) => void;
  updateTodoPosition: (id: string, x: number, y: number) => void;
  updateTodoContent: (id: string, content: string) => void;
  // Novas funcionalidades
  updateTodoColor: (id: string, color: string) => void;
  updateTodoPriority: (id: string, priority: Priority) => void;
  updateTodoCategory: (id: string, category: string) => void;
  clearAllTodos: () => void;
  bringToFront: (id: string) => void;
  duplicateTodo: (id: string) => void;
  // Gerenciamento de categorias
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  // Filtros
  filterByCategory: (category?: string) => TodoItem[];
  filterByPriority: (priority?: Priority) => TodoItem[];
  searchTodos: (query: string) => TodoItem[];
  // Ações em lote
  saveTodoLayout: () => string;
  loadTodoLayout: (layoutData: string) => void;
  exportTodos: () => string;
  importTodos: (data: string) => void;
}

// Interface para o gerenciamento de tema
export interface ThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

// Interface para configurações do aplicativo
export interface SettingsStore {
  showCompletedTodos: boolean;
  defaultCategory: string;
  defaultPriority: Priority | null;
  sortOrder: "createdAt" | "priority" | "category";
  showTimestamps: boolean;
  defaultView: "board" | "list";
  // Ações
  toggleShowCompletedTodos: () => void;
  setDefaultCategory: (category: string) => void;
  setDefaultPriority: (priority: Priority | null) => void;
  setSortOrder: (order: "createdAt" | "priority" | "category") => void;
  toggleShowTimestamps: () => void;
  setDefaultView: (view: "board" | "list") => void;
}
