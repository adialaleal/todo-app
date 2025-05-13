import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { TodoItem, TodoStore, TodoEdge, Priority, NodeType } from "@/types";
import { generateId, generatePastelColor } from "@/lib/utils";
import { toast } from "sonner";

// Função para posicionar um novo TODO aleatoriamente na tela
const getRandomPosition = () => {
  // Considerando dimensões típicas de tela
  const maxWidth = Math.max(300, window.innerWidth - 250); // Subtrair largura do TODO
  const maxHeight = Math.max(300, window.innerHeight - 250); // Subtrair altura do TODO

  // Evitar posicionar muito próximo das bordas
  const x = 50 + Math.random() * (maxWidth - 100);
  const y = 50 + Math.random() * (maxHeight - 100);

  return { x, y };
};

// Encontrar o maior zIndex atual para garantir que o novo elemento fique no topo
const getMaxZIndex = (todos: TodoItem[]): number => {
  if (todos.length === 0) return 1;
  return Math.max(...todos.map((todo) => todo.zIndex || 0)) + 1;
};

// Storage personalizado com tratamento de erros e recuperação
const customStorage: PersistOptions<TodoStore>["storage"] = {
  ...createJSONStorage(() => localStorage),
  getItem: (name) => {
    try {
      // Tentar recuperar os dados normalmente
      const data = localStorage.getItem(name);
      if (!data) return null;

      return JSON.parse(data);
    } catch (error) {
      // Em caso de erro no parsing, tente recuperar um backup
      console.error("Erro ao carregar dados:", error);

      try {
        // Tentar carregar o backup
        const backupData = localStorage.getItem(`${name}_backup`);
        if (backupData) {
          const parsedBackup = JSON.parse(backupData);
          toast.warning("Recuperação de dados", {
            description: "Dados principais corrompidos. Carregando backup.",
          });
          return parsedBackup;
        }
      } catch (backupError) {
        console.error("Erro ao carregar backup:", backupError);
      }

      // Se tudo falhar, iniciar com estado limpo
      toast.error("Erro de dados", {
        description:
          "Não foi possível recuperar seus dados. Iniciando com estado limpo.",
      });
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      // Antes de salvar os dados principais, faça um backup da versão anterior
      const currentData = localStorage.getItem(name);
      if (currentData) {
        localStorage.setItem(`${name}_backup`, currentData);
      }

      // Salvar os novos dados
      const stringifiedValue = JSON.stringify(value);
      localStorage.setItem(name, stringifiedValue);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      toast.error("Erro ao salvar", {
        description:
          "Não foi possível salvar os dados. Seu progresso pode ser perdido.",
      });
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
      localStorage.removeItem(`${name}_backup`);
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  },
};

// Criação do store Zustand com persistência
export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      edges: [],
      categories: ["Trabalho", "Pessoal", "Estudo", "Compras"],

      // Ações básicas CRUD
      addTodo: (content, type = "default", parentNode, customPosition) =>
        set((state) => {
          try {
            // Usar posição personalizada se fornecida, senão gerar aleatoriamente
            const position = customPosition || getRandomPosition();

            const newTodo: TodoItem = {
              id: generateId(),
              content,
              position,
              color: generatePastelColor(),
              createdAt: Date.now(),
              lastUpdated: Date.now(),
              zIndex: getMaxZIndex(state.todos),
              type,
              parentNode,
              // Se for um nó filho em um grupo, adicionar extent
              ...(parentNode ? { extent: "parent" } : {}),
              // Opcionalmente definir prioridade/categoria padrão
              priority: "média",
            };

            // Sucesso ao adicionar
            toast.success("Adicionado", {
              description: "Novo todo criado com sucesso.",
              duration: 2000,
            });

            return { todos: [...state.todos, newTodo] };
          } catch (error) {
            console.error("Erro ao adicionar TODO:", error);
            toast.error("Erro ao adicionar TODO", {
              description: "Ocorreu um problema ao criar o novo item.",
            });
            return state;
          }
        }),

      removeTodo: (id) =>
        set((state) => {
          try {
            // Ao remover um todo, também remover todas as edges conectadas a ele
            const newEdges = state.edges.filter(
              (edge) => edge.source !== id && edge.target !== id
            );

            // Também remover quaisquer nós filhos se o nó for um grupo
            const childrenIds = state.todos
              .filter((todo) => todo.parentNode === id)
              .map((todo) => todo.id);

            const remainingTodos = state.todos.filter(
              (todo) => todo.id !== id && !childrenIds.includes(todo.id)
            );

            // Notificar remoção
            toast.info("Item removido", { duration: 2000 });

            return {
              todos: remainingTodos,
              edges: newEdges,
            };
          } catch (error) {
            console.error("Erro ao remover TODO:", error);
            toast.error("Erro ao remover TODO", {
              description: "Ocorreu um problema ao remover o item.",
            });
            return state;
          }
        }),

      updateTodoPosition: (id, x, y) =>
        set((state) => {
          try {
            return {
              todos: state.todos.map((todo) =>
                todo.id === id
                  ? {
                      ...todo,
                      position: { x, y },
                      lastUpdated: Date.now(),
                    }
                  : todo
              ),
            };
          } catch (error) {
            console.error("Erro ao atualizar posição:", error);
            return state;
          }
        }),

      updateTodoContent: (id, content) =>
        set((state) => {
          try {
            return {
              todos: state.todos.map((todo) =>
                todo.id === id
                  ? {
                      ...todo,
                      content,
                      lastUpdated: Date.now(),
                    }
                  : todo
              ),
            };
          } catch (error) {
            console.error("Erro ao atualizar conteúdo:", error);
            toast.error("Erro ao salvar conteúdo", {
              description: "Ocorreu um problema ao atualizar o texto.",
            });
            return state;
          }
        }),

      // Gestão de edges (conexões)
      addEdge: (source, target, label) =>
        set((state) => {
          try {
            // Verificar se já existe uma conexão igual
            const edgeExists = state.edges.some(
              (edge) => edge.source === source && edge.target === target
            );

            if (edgeExists) {
              toast.info("Conexão existente", {
                description: "Esta conexão já existe.",
              });
              return state;
            }

            // Verificar se não está tentando conectar a si mesmo
            if (source === target) {
              toast.warning("Operação inválida", {
                description: "Não é possível conectar um nó a si mesmo.",
              });
              return state;
            }

            const newEdge: TodoEdge = {
              id: `edge-${source}-${target}`,
              source,
              target,
              label,
              type: "default",
              animated: false,
            };

            // Notificar sucesso
            toast.success("Conexão criada", { duration: 2000 });

            return {
              edges: [...state.edges, newEdge],
            };
          } catch (error) {
            console.error("Erro ao adicionar conexão:", error);
            toast.error("Erro ao conectar", {
              description: "Não foi possível criar a conexão entre os itens.",
            });
            return state;
          }
        }),

      removeEdge: (id) =>
        set((state) => {
          try {
            // Notificar remoção
            toast.info("Conexão removida", { duration: 2000 });

            return {
              edges: state.edges.filter((edge) => edge.id !== id),
            };
          } catch (error) {
            console.error("Erro ao remover conexão:", error);
            return state;
          }
        }),

      updateEdge: (id, data) =>
        set((state) => {
          try {
            return {
              edges: state.edges.map((edge) =>
                edge.id === id ? { ...edge, ...data } : edge
              ),
            };
          } catch (error) {
            console.error("Erro ao atualizar conexão:", error);
            return state;
          }
        }),

      // Novas funcionalidades
      updateTodoColor: (id, color) =>
        set((state) => {
          try {
            return {
              todos: state.todos.map((todo) =>
                todo.id === id
                  ? {
                      ...todo,
                      color,
                      lastUpdated: Date.now(),
                    }
                  : todo
              ),
            };
          } catch (error) {
            console.error("Erro ao atualizar cor:", error);
            return state;
          }
        }),

      updateTodoType: (id, type) =>
        set((state) => {
          try {
            return {
              todos: state.todos.map((todo) =>
                todo.id === id
                  ? {
                      ...todo,
                      type,
                      lastUpdated: Date.now(),
                    }
                  : todo
              ),
            };
          } catch (error) {
            console.error("Erro ao atualizar tipo:", error);
            return state;
          }
        }),

      clearAllTodos: () => set({ todos: [] }),

      bringToFront: (id) =>
        set((state) => {
          try {
            const newZIndex = getMaxZIndex(state.todos);
            return {
              todos: state.todos.map((todo) =>
                todo.id === id
                  ? {
                      ...todo,
                      zIndex: newZIndex,
                      lastUpdated: Date.now(),
                    }
                  : todo
              ),
            };
          } catch (error) {
            console.error("Erro ao trazer para frente:", error);
            return state;
          }
        }),

      duplicateTodo: (id) =>
        set((state) => {
          try {
            const todoToDuplicate = state.todos.find((todo) => todo.id === id);
            if (!todoToDuplicate) return state;

            // Cria uma cópia com novo ID e posição ligeiramente diferente
            const newId = generateId();
            const newTodo: TodoItem = {
              ...todoToDuplicate,
              id: newId,
              position: {
                x: todoToDuplicate.position.x + 20,
                y: todoToDuplicate.position.y + 20,
              },
              createdAt: Date.now(),
              lastUpdated: Date.now(),
              zIndex: getMaxZIndex(state.todos),
            };

            // Se duplicar um nó de grupo, duplicar também seus filhos
            const childrenToDuplicate =
              todoToDuplicate.type === "group"
                ? state.todos.filter((todo) => todo.parentNode === id)
                : [];

            const newChildren = childrenToDuplicate.map((child) => ({
              ...child,
              id: generateId(),
              parentNode: newId,
              createdAt: Date.now(),
              lastUpdated: Date.now(),
            }));

            // Notificar sucesso
            toast.success("Item duplicado", { duration: 2000 });

            return {
              todos: [...state.todos, newTodo, ...newChildren],
            };
          } catch (error) {
            console.error("Erro ao duplicar TODO:", error);
            toast.error("Erro ao duplicar", {
              description: "Não foi possível duplicar o item.",
            });
            return state;
          }
        }),

      // Ações em lote
      saveTodoLayout: () => {
        try {
          const { todos } = get();
          // Retorna apenas as informações de posição para restauração rápida
          const layoutData = todos.map((todo) => ({
            id: todo.id,
            position: todo.position,
            zIndex: todo.zIndex,
          }));
          return JSON.stringify(layoutData);
        } catch (error) {
          console.error("Erro ao salvar layout:", error);
          toast.error("Erro ao salvar layout", {
            description: "Ocorreu um problema ao salvar as posições.",
          });
          return "[]";
        }
      },

      loadTodoLayout: (layoutData) =>
        set((state) => {
          try {
            const parsedLayout = JSON.parse(layoutData);
            if (!Array.isArray(parsedLayout))
              throw new Error("Formato inválido");

            // Atualizar apenas as posições dos TODOs existentes
            const updatedTodos = state.todos.map((todo) => {
              const layoutItem = parsedLayout.find(
                (item) => item.id === todo.id
              );
              if (layoutItem) {
                return {
                  ...todo,
                  position: layoutItem.position,
                  zIndex: layoutItem.zIndex,
                  lastUpdated: Date.now(),
                };
              }
              return todo;
            });

            return { todos: updatedTodos };
          } catch (e) {
            console.error("Erro ao carregar layout:", e);
            toast.error("Erro ao carregar layout", {
              description: "O formato dos dados parece ser inválido.",
            });
            return state; // Retorna o estado inalterado em caso de erro
          }
        }),

      exportTodos: () => {
        try {
          const { todos } = get();
          return JSON.stringify(todos);
        } catch (error) {
          console.error("Erro ao exportar TODOs:", error);
          toast.error("Erro ao exportar", {
            description: "Não foi possível gerar o texto de exportação.",
          });
          return "[]";
        }
      },

      importTodos: (data) =>
        set((state) => {
          try {
            const parsedData = JSON.parse(data);
            if (!Array.isArray(parsedData)) throw new Error("Formato inválido");

            // Validar cada item para garantir que segue a estrutura TodoItem
            const validTodos = parsedData.filter(
              (item) =>
                typeof item === "object" &&
                item !== null &&
                typeof item.id === "string" &&
                typeof item.content === "string" &&
                typeof item.position === "object" &&
                typeof item.position.x === "number" &&
                typeof item.position.y === "number" &&
                typeof item.color === "string"
            );

            if (validTodos.length === 0) {
              toast.warning("Nenhum item válido", {
                description:
                  "Não foram encontrados TODOs válidos nos dados importados.",
              });
              return state;
            }

            if (validTodos.length < parsedData.length) {
              toast.warning("Alguns itens ignorados", {
                description: `${
                  parsedData.length - validTodos.length
                } itens foram ignorados por terem formato inválido.`,
              });
            }

            // Adiciona timestamp atual para os itens importados
            const timestamp = Date.now();
            const processedTodos = validTodos.map((todo) => ({
              ...todo,
              createdAt: todo.createdAt || timestamp,
              lastUpdated: timestamp,
              zIndex: todo.zIndex || getMaxZIndex(state.todos),
            }));

            return { todos: [...state.todos, ...processedTodos] };
          } catch (e) {
            console.error("Erro ao importar TODOs:", e);
            toast.error("Erro ao importar", {
              description: "Os dados fornecidos estão em formato inválido.",
            });
            return state; // Retorna o estado inalterado em caso de erro
          }
        }),

      // Novas funcionalidades para prioridade e categoria
      updateTodoPriority: (id, priority) =>
        set((state) => {
          try {
            return {
              todos: state.todos.map((todo) =>
                todo.id === id
                  ? {
                      ...todo,
                      priority,
                      lastUpdated: Date.now(),
                    }
                  : todo
              ),
            };
          } catch (error) {
            console.error("Erro ao atualizar prioridade:", error);
            return state;
          }
        }),

      updateTodoCategory: (id, category) =>
        set((state) => {
          try {
            return {
              todos: state.todos.map((todo) =>
                todo.id === id
                  ? {
                      ...todo,
                      category,
                      lastUpdated: Date.now(),
                    }
                  : todo
              ),
            };
          } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            return state;
          }
        }),

      // Gerenciamento de categorias
      addCategory: (name) =>
        set((state) => {
          try {
            if (state.categories.includes(name)) {
              toast.info("Categoria já existe");
              return state;
            }

            toast.success("Categoria adicionada", { duration: 2000 });

            return {
              categories: [...state.categories, name],
            };
          } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
            return state;
          }
        }),

      removeCategory: (name) =>
        set((state) => {
          try {
            // Remover categoria e atualizar TODOs que a usam
            const updatedTodos = state.todos.map((todo) =>
              todo.category === name
                ? { ...todo, category: undefined, lastUpdated: Date.now() }
                : todo
            );

            return {
              categories: state.categories.filter((cat) => cat !== name),
              todos: updatedTodos,
            };
          } catch (error) {
            console.error("Erro ao remover categoria:", error);
            return state;
          }
        }),

      // Funções de filtragem e busca
      filterByCategory: (category) => {
        const { todos } = get();
        if (!category) return todos;
        return todos.filter((todo) => todo.category === category);
      },

      filterByPriority: (priority) => {
        const { todos } = get();
        if (!priority) return todos;
        return todos.filter((todo) => todo.priority === priority);
      },

      searchTodos: (query) => {
        const { todos } = get();
        if (!query) return todos;

        const lowerQuery = query.toLowerCase();
        return todos.filter(
          (todo) =>
            todo.content.toLowerCase().includes(lowerQuery) ||
            (todo.category && todo.category.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: "todo-storage",
      storage: customStorage,
    }
  )
);
