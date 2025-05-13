import { useRef, useState, useEffect } from "react";
import { useTodoStore } from "@/store/todoStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Whiteboard } from "./Whiteboard";
import { WhiteboardContainer } from "./WhiteboardContainer";
import { useWhiteboardBoundary } from "@/hooks/useWhiteboardBoundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TodoItem } from "@/types";

export const WhiteboardManager = () => {
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const { boundary } = useWhiteboardBoundary(whiteboardRef);
  const { todos, categories, addCategory } = useTodoStore();

  // Aqui estamos usando as novas propriedades do SettingsStore
  const { defaultView } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<string>("todos");
  const [categoryTodos, setCategoryTodos] = useState<
    Record<string, TodoItem[]>
  >({});
  const [newCategoryInput, setNewCategoryInput] = useState<string>("");

  // Inicializar a aba ativa com base na visualização padrão
  useEffect(() => {
    if (defaultView === "todos") {
      setActiveTab("todos");
    } else if (defaultView === "whiteboard" && categories.length > 0) {
      setActiveTab(categories[0]);
    }
  }, [defaultView, categories]);

  // Agrupar TODOs por categoria
  useEffect(() => {
    const grouped: Record<string, TodoItem[]> = { todos: [] };

    // Inicializar todas as categorias
    categories.forEach((cat) => {
      grouped[cat] = [];
    });

    // Adicionar TODOs sem categoria à aba "todos"
    const uncategorized = todos.filter((todo) => !todo.category);
    grouped["todos"] = uncategorized;

    // Adicionar TODOs às suas respectivas categorias
    todos.forEach((todo) => {
      if (todo.category) {
        if (!grouped[todo.category]) {
          grouped[todo.category] = [];
        }
        grouped[todo.category].push(todo);
      }
    });

    setCategoryTodos(grouped);
  }, [todos, categories]);

  // Criar uma nova categoria
  const handleAddCategory = () => {
    if (
      newCategoryInput.trim() &&
      !categories.includes(newCategoryInput.trim())
    ) {
      addCategory(newCategoryInput.trim());
      setNewCategoryInput("");
    }
  };

  // Lidar com a tecla Enter para adicionar categoria
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCategory();
    }
  };

  return (
    <div className="h-full overflow-hidden" ref={whiteboardRef}>
      <div className="p-2 w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-2">
            <TabsList className="mb-1">
              <TabsTrigger value="todos" className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                Todos
                <Badge variant="secondary" className="ml-1">
                  {categoryTodos["todos"]?.length || 0}
                </Badge>
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                  </svg>
                  {category}
                  <Badge variant="secondary" className="ml-1">
                    {categoryTodos[category]?.length || 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Input para adicionar nova categoria */}
            <div className="flex gap-1">
              <input
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nova categoria..."
                className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddCategory}
                disabled={!newCategoryInput.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Conteúdo das Tabs */}
          <TabsContent value="todos" className="h-full">
            <WhiteboardContainer>
              <Whiteboard boundary={boundary} filter={undefined} />
            </WhiteboardContainer>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="h-full">
              <WhiteboardContainer>
                <Whiteboard boundary={boundary} filter={category} />
              </WhiteboardContainer>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
