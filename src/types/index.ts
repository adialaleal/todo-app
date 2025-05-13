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
}

// Interface para o estado do store Zustand
export interface TodoStore {
  todos: TodoItem[];
  addTodo: (content: string) => void;
  removeTodo: (id: string) => void;
  updateTodoPosition: (id: string, x: number, y: number) => void;
  updateTodoContent: (id: string, content: string) => void;
} 