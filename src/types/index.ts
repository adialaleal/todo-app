// Define os tipos de prioridade disponíveis
export type Priority = "baixa" | "média" | "alta";

// Tipos de nós para o React Flow
export type NodeType = "default" | "input" | "output" | "group";

// Interface para um item de TODO
export interface TodoItem {
  id: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  zIndex?: number;
  color: string;
  createdAt: number;
  lastUpdated?: number;
  completed?: boolean;
  priority?: Priority;
  category?: string;
  tags?: string[];
  // Campos para React Flow
  type?: NodeType;
  parentNode?: string;
  extent?: "parent";
  // Outros campos possíveis: dueDate, assignee, etc.
}

// Interface para conexões entre TODOs
export interface TodoEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: "default" | "step" | "smoothstep";
  animated?: boolean;
  style?: React.CSSProperties;
}

// Interface para o estado do store Zustand
export interface TodoStore {
  todos: TodoItem[];
  edges: TodoEdge[];
  categories: string[];
  // Ações básicas CRUD
  addTodo: (
    content: string,
    type?: NodeType,
    parentNode?: string,
    customPosition?: { x: number; y: number }
  ) => void;
  removeTodo: (id: string) => void;
  updateTodoPosition: (id: string, x: number, y: number) => void;
  updateTodoContent: (id: string, content: string) => void;
  // Gestão de conexões
  addEdge: (source: string, target: string, label?: string) => void;
  removeEdge: (id: string) => void;
  updateEdge: (id: string, data: Partial<TodoEdge>) => void;
  // Novas funcionalidades
  updateTodoColor: (id: string, color: string) => void;
  updateTodoPriority: (id: string, priority: Priority) => void;
  updateTodoCategory: (id: string, category: string) => void;
  updateTodoType: (id: string, type: NodeType) => void;
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
