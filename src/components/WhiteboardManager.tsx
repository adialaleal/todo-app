import { useRef, useState, useEffect } from "react";
import { useTodoStore } from "@/store/todoStore";
import { useSettingsStore } from "@/store/settingsStore";
import { ReactFlowWhiteboard } from "./ReactFlowWhiteboard";
import { WhiteboardContainer } from "./WhiteboardContainer";
import { useWhiteboardBoundary } from "@/hooks/useWhiteboardBoundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TodoItem } from "@/types";
import { FolderIcon, LayoutGrid, PlusIcon, Search } from "lucide-react";

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
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  // Inicializar a aba ativa com base na visualização padrão
  useEffect(() => {
    if (defaultView === "todos") {
      setActiveTab("todos");
    } else if (defaultView === "whiteboard" && categories.length > 0) {
      setActiveTab(categories[0]);
    }
  }, [defaultView, categories]);

  // Sempre que os TODOs ou categorias mudarem, atualize o objeto categoryTodos
  useEffect(() => {
    const result: Record<string, TodoItem[]> = {
      todos: todos, // Todos os TODOs
    };

    // Agrupar TODOs por categoria
    categories.forEach((category) => {
      result[category] = todos.filter((todo) => todo.category === category);
    });

    setCategoryTodos(result);
  }, [todos, categories]);

  // Função para adicionar nova categoria
  const handleAddCategory = () => {
    if (newCategoryInput.trim()) {
      addCategory(newCategoryInput.trim());
      setNewCategoryInput("");
      setIsAddingCategory(false);
    }
  };

  // Adicionar categoria com Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCategory();
    } else if (e.key === "Escape") {
      setIsAddingCategory(false);
      setNewCategoryInput("");
    }
  };

  return (
    <div
      className="h-full overflow-hidden flex flex-col bg-background dark:bg-slate-900"
      ref={whiteboardRef}
    >
      <div className="p-4 w-full flex-grow flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-foreground">
                Diagramas de Fluxo
              </h2>
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-0"
              >
                {todos.length} items
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 px-2 py-1 h-8"
                onClick={() => setIsAddingCategory(true)}
              >
                <PlusIcon size={14} />
                <span>Nova Categoria</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Buscar TODOs"
              >
                <Search size={16} />
              </Button>
            </div>
          </div>

          <div className="relative mb-4">
            <TabsList className="w-full h-auto p-1 bg-muted/40 dark:bg-slate-800/40 border border-border/40 shadow-sm rounded-lg">
              <TabsTrigger
                value="todos"
                className="flex items-center gap-1 py-2 data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700/70 data-[state=active]:shadow-sm"
              >
                <LayoutGrid size={15} />
                <span>Todos</span>
                <Badge
                  variant="secondary"
                  className="ml-1 bg-muted/70 dark:bg-slate-700 text-muted-foreground"
                >
                  {categoryTodos["todos"]?.length || 0}
                </Badge>
              </TabsTrigger>

              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center gap-1 py-2 data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700/70 data-[state=active]:shadow-sm"
                >
                  <FolderIcon size={15} />
                  <span>{category}</span>
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-muted/70 dark:bg-slate-700 text-muted-foreground"
                  >
                    {categoryTodos[category]?.length || 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Input para adicionar categoria */}
            {isAddingCategory && (
              <div className="absolute top-full left-0 mt-2 p-2 w-64 bg-card border rounded-md shadow-md z-10 flex gap-1">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nome da categoria..."
                  autoFocus
                  className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring flex-grow"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCategory}
                  disabled={!newCategoryInput.trim()}
                  className="h-8"
                >
                  <PlusIcon size={14} />
                </Button>
              </div>
            )}
          </div>

          {/* Conteúdo das Tabs */}
          <TabsContent
            value="todos"
            className="flex-grow mt-0 border rounded-lg p-0 outline-none"
          >
            <WhiteboardContainer className="h-full">
              <ReactFlowWhiteboard filter={undefined} />
            </WhiteboardContainer>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="flex-grow mt-0 border rounded-lg p-0 outline-none"
            >
              <WhiteboardContainer className="h-full">
                <ReactFlowWhiteboard filter={category} />
              </WhiteboardContainer>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
