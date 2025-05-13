import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoItem, TodoStore } from '@/types';
import { generateId, generatePastelColor } from '@/lib/utils';

// Função para posicionar um novo TODO aleatoriamente na tela
const getRandomPosition = () => {
  // Considerando dimensões típicas de tela
  const maxWidth = window.innerWidth - 200; // Subtrair largura do TODO
  const maxHeight = window.innerHeight - 200; // Subtrair altura do TODO
  
  // Evitar posicionar muito próximo das bordas
  const x = 50 + Math.random() * (maxWidth - 100);
  const y = 50 + Math.random() * (maxHeight - 100);
  
  return { x, y };
};

// Criação do store Zustand com persistência
export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      
      addTodo: (content) => set((state) => {
        const position = getRandomPosition();
        const newTodo: TodoItem = {
          id: generateId(),
          content,
          position,
          color: generatePastelColor(),
          createdAt: Date.now(),
        };
        
        return { todos: [...state.todos, newTodo] };
      }),
      
      removeTodo: (id) => set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      })),
      
      updateTodoPosition: (id, x, y) => set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, position: { x, y } } : todo
        ),
      })),
      
      updateTodoContent: (id, content) => set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, content } : todo
        ),
      })),
    }),
    {
      name: 'todo-storage', // Nome para localStorage
    }
  )
); 