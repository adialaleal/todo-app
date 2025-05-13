import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTodoStore } from "@/store/todoStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ToggleTheme } from "@/components/ui/toggle-theme";

interface ToolbarProps {
  className?: string;
}

export const Toolbar = ({ className }: ToolbarProps) => {
  const {
    addTodo,
    todos,
    clearAllTodos,
    saveTodoLayout,
    loadTodoLayout,
    exportTodos,
    importTodos,
  } = useTodoStore();
  const [newTodoContent, setNewTodoContent] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [exportData, setExportData] = useState("");
  const [importData, setImportData] = useState("");

  // Adicionar novo TODO
  const handleAddTodo = () => {
    if (newTodoContent.trim()) {
      addTodo(newTodoContent);
      setNewTodoContent("");
      setIsAddDialogOpen(false);
      toast.success("TODO adicionado com sucesso!");
    }
  };

  // Executar quando o usuário pressionar Enter no input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  // Exportar TODOs
  const handleExport = () => {
    const data = exportTodos();
    setExportData(data);
    setIsExportDialogOpen(true);
    toast("Dados preparados para exportação", {
      description: "Copie o texto para salvar seus TODOs",
    });
  };

  // Importar TODOs
  const handleImport = () => {
    try {
      importTodos(importData);
      setImportData("");
      setIsImportDialogOpen(false);
      toast.success("TODOs importados com sucesso!");
    } catch (e) {
      console.error("Erro ao importar dados:", e);
      toast.error("Erro ao importar dados", {
        description: "O formato dos dados parece ser inválido.",
      });
    }
  };

  // Salvar layout atual
  const handleSaveLayout = () => {
    try {
      const layout = saveTodoLayout();
      localStorage.setItem("savedLayout", layout);
      toast.success("Layout salvo com sucesso!");
    } catch (e) {
      console.error("Erro ao salvar layout:", e);
      toast.error("Erro ao salvar layout", {
        description: "Ocorreu um problema ao salvar o layout.",
      });
    }
  };

  // Carregar layout salvo
  const handleLoadLayout = () => {
    try {
      const layout = localStorage.getItem("savedLayout");
      if (layout) {
        loadTodoLayout(layout);
        toast.success("Layout carregado com sucesso!");
      } else {
        toast("Nenhum layout salvo", {
          description: "Salve um layout primeiro para poder carregá-lo.",
        });
      }
    } catch (e) {
      console.error("Erro ao carregar layout:", e);
      toast.error("Erro ao carregar layout", {
        description:
          "O layout salvo parece estar corrompido ou em formato inválido.",
      });
    }
  };

  // Limpar todos os TODOs
  const handleClearAll = () => {
    if (todos.length > 0) {
      clearAllTodos();
      toast("TODOs removidos", {
        description: `${todos.length} itens foram removidos.`,
      });
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3 p-3", className)}>
      {/* Grupo de botões principais */}
      <div className="flex items-center gap-2 mr-auto">
        {/* Botão de adicionar TODO */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-full shadow-sm transition-all hover:shadow-md"
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
                className="mr-1"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="hidden sm:inline">Adicionar TODO</span>
              <span className="sm:hidden">TODO</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar novo TODO</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Digite o conteúdo do TODO..."
                value={newTodoContent}
                onChange={(e) => setNewTodoContent(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="border-2 focus-visible:ring-blue-500"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleAddTodo}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Botão para limpar todos os TODOs */}
        {todos.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearAll}
            className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 rounded-full transition-colors px-3"
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
              className="mr-1"
            >
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span className="hidden sm:inline">Limpar ({todos.length})</span>
            <span className="sm:hidden">Limpar</span>
          </Button>
        )}
      </div>

      {/* Grupo de gerenciamento */}
      <div className="flex items-center gap-2 flex-wrap bg-slate-100 dark:bg-slate-700/50 rounded-full px-2 py-1 shadow-inner">
        {/* Toggle de tema */}
        <ToggleTheme className="rounded-full" />

        {/* Botões de layout */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSaveLayout}
          title="Salvar layout atual"
          className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
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
            className="mr-1 text-green-600 dark:text-green-400"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          <span className="hidden sm:inline">Salvar</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleLoadLayout}
          title="Carregar layout salvo"
          className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
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
            className="mr-1 text-blue-600 dark:text-blue-400"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="hidden sm:inline">Carregar</span>
        </Button>

        {/* Botões de export/import */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleExport}
          title="Exportar TODOs"
          className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
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
            className="mr-1 text-purple-600 dark:text-purple-400"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="hidden sm:inline">Exportar</span>
        </Button>

        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
            <DialogHeader>
              <DialogTitle>Exportar TODOs</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p className="text-sm text-slate-500">
                Copie os dados abaixo para salvar seus TODOs:
              </p>
              <textarea
                className="w-full h-32 p-2 border rounded font-mono text-xs"
                value={exportData}
                readOnly
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              title="Importar TODOs"
              className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
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
                className="mr-1 text-amber-600 dark:text-amber-400"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="hidden sm:inline">Importar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
            <DialogHeader>
              <DialogTitle>Importar TODOs</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p className="text-sm text-slate-500">
                Cole os dados exportados anteriormente:
              </p>
              <textarea
                className="w-full h-32 p-2 border rounded font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleImport}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Importar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
