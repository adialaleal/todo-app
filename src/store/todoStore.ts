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

// Encontrar o maior zIndex atual para garantir que o novo elemento fique no topo
const getMaxZIndex = (todos: TodoItem[]): number => {
  if (todos.length === 0) return 1;
  return Math.max(...todos.map(todo => todo.zIndex || 0)) + 1;
};

// Criação do store Zustand com persistência
export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      
      // Ações básicas CRUD
      addTodo: (content) => set((state) => {
        const position = getRandomPosition();
        const newTodo: TodoItem = {
          id: generateId(),
          content,
          position,
          color: generatePastelColor(),
          createdAt: Date.now(),
          lastUpdated: Date.now(),
          zIndex: getMaxZIndex(state.todos),
        };
        
        return { todos: [...state.todos, newTodo] };
      }),
      
      removeTodo: (id) => set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      })),
      
      updateTodoPosition: (id, x, y) => set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id 
            ? { 
                ...todo, 
                position: { x, y },
                lastUpdated: Date.now()
              } 
            : todo
        ),
      })),
      
      updateTodoContent: (id, content) => set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id 
            ? { 
                ...todo, 
                content,
                lastUpdated: Date.now()
              } 
            : todo
        ),
      })),

      // Novas funcionalidades
      updateTodoColor: (id, color) => set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id 
            ? { 
                ...todo, 
                color,
                lastUpdated: Date.now()
              } 
            : todo
        ),
      })),

      clearAllTodos: () => set({ todos: [] }),

      bringToFront: (id) => set((state) => {
        const newZIndex = getMaxZIndex(state.todos);
        return {
          todos: state.todos.map((todo) =>
            todo.id === id 
              ? { 
                  ...todo, 
                  zIndex: newZIndex,
                  lastUpdated: Date.now()
                } 
              : todo
          ),
        };
      }),

      duplicateTodo: (id) => set((state) => {
        const todoToDuplicate = state.todos.find(todo => todo.id === id);
        if (!todoToDuplicate) return state;
        
        // Cria uma cópia com novo ID e posição ligeiramente diferente
        const newTodo: TodoItem = {
          ...todoToDuplicate,
          id: generateId(),
          position: {
            x: todoToDuplicate.position.x + 20,
            y: todoToDuplicate.position.y + 20,
          },
          createdAt: Date.now(),
          lastUpdated: Date.now(),
          zIndex: getMaxZIndex(state.todos),
        };
        
        return { todos: [...state.todos, newTodo] };
      }),

      // Ações em lote
      saveTodoLayout: () => {
        const { todos } = get();
        // Retorna apenas as informações de posição para restauração rápida
        const layoutData = todos.map(todo => ({
          id: todo.id,
          position: todo.position,
          zIndex: todo.zIndex
        }));
        return JSON.stringify(layoutData);
      },

      loadTodoLayout: (layoutData) => set((state) => {
        try {
          const parsedLayout = JSON.parse(layoutData);
          if (!Array.isArray(parsedLayout)) throw new Error('Formato inválido');

          // Atualizar apenas as posições dos TODOs existentes
          const updatedTodos = state.todos.map(todo => {
            const layoutItem = parsedLayout.find(item => item.id === todo.id);
            if (layoutItem) {
              return {
                ...todo,
                position: layoutItem.position,
                zIndex: layoutItem.zIndex,
                lastUpdated: Date.now()
              };
            }
            return todo;
          });

          return { todos: updatedTodos };
        } catch (e) {
          console.error('Erro ao carregar layout:', e);
          return state; // Retorna o estado inalterado em caso de erro
        }
      }),

      exportTodos: () => {
        const { todos } = get();
        return JSON.stringify(todos);
      },

      importTodos: (data) => set((state) => {
        try {
          const parsedData = JSON.parse(data);
          if (!Array.isArray(parsedData)) throw new Error('Formato inválido');

          // Validar cada item para garantir que segue a estrutura TodoItem
          const validTodos = parsedData.filter(item => 
            typeof item === 'object' && 
            item !== null &&
            typeof item.id === 'string' &&
            typeof item.content === 'string' &&
            typeof item.position === 'object' &&
            typeof item.position.x === 'number' &&
            typeof item.position.y === 'number' &&
            typeof item.color === 'string'
          );

          // Adiciona timestamp atual para os itens importados
          const timestamp = Date.now();
          const processedTodos = validTodos.map(todo => ({
            ...todo,
            createdAt: todo.createdAt || timestamp,
            lastUpdated: timestamp,
            zIndex: todo.zIndex || getMaxZIndex(state.todos),
          }));

          return { todos: [...state.todos, ...processedTodos] };
        } catch (e) {
          console.error('Erro ao importar TODOs:', e);
          return state; // Retorna o estado inalterado em caso de erro
        }
      }),
    }),
    {
      name: 'todo-storage', // Nome para localStorage
    }
  )
); 