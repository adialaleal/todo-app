import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/store/settingsStore";
import { useTodoStore } from "@/store/todoStore";
import { Priority } from "@/types";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("visual");

  // Stores
  const {
    showTimestamps,
    toggleShowTimestamps,
    showCompletedTodos,
    toggleShowCompletedTodos,
    theme,
    setTheme,
    defaultView,
    setDefaultView,
    defaultSortOrder,
    setDefaultSortOrder,
    compactMode,
    toggleCompactMode,
    resetSettings,
  } = useSettingsStore();

  const { categories, exportTodos, importTodos, clearAllTodos } =
    useTodoStore();

  // Função para exportar dados
  const handleExport = () => {
    try {
      const dataExport = exportTodos();
      navigator.clipboard
        .writeText(dataExport)
        .then(() => {
          toast.success("Dados exportados!", {
            description:
              "Os dados foram copiados para a área de transferência.",
          });
        })
        .catch((err) => {
          console.error("Erro ao copiar para o clipboard:", err);
          toast.error("Erro ao copiar para a área de transferência", {
            description: "Por favor, copie manualmente o texto abaixo.",
          });
        });
    } catch (e) {
      console.error("Erro ao exportar dados:", e);
      toast.error("Erro ao exportar dados", {
        description: "Ocorreu um erro ao tentar exportar os dados.",
      });
    }
  };

  // Função para importar dados
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          importTodos(content);
          toast.success("TODOs importados com sucesso!");
          setOpen(false);
        } catch (error) {
          console.error("Erro ao importar arquivo:", error);
          toast.error("Erro ao importar dados", {
            description: "O arquivo selecionado parece ser inválido.",
          });
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  // Função para limpar todos os TODOs
  const handleClearAll = () => {
    if (
      confirm(
        "Tem certeza que deseja remover todos os TODOs? Esta ação não pode ser desfeita."
      )
    ) {
      clearAllTodos();
      toast.success("Todos os TODOs foram removidos!");
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
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
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Configurações</SheetTitle>
          <SheetDescription>
            Personalize sua experiência no aplicativo de TODOs.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="preferences">Preferências</TabsTrigger>
              <TabsTrigger value="data">Dados</TabsTrigger>
            </TabsList>

            {/* Configurações Visuais */}
            <TabsContent value="visual" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-timestamps" className="flex flex-col">
                    <span>Mostrar timestamps</span>
                    <span className="text-sm text-muted-foreground">
                      Exibe a data de criação e última modificação dos TODOs
                    </span>
                  </Label>
                  <Switch
                    id="show-timestamps"
                    checked={showTimestamps}
                    onCheckedChange={toggleShowTimestamps}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-mode" className="flex flex-col">
                    <span>Modo compacto</span>
                    <span className="text-sm text-muted-foreground">
                      Reduz o tamanho dos elementos de interface
                    </span>
                  </Label>
                  <Switch
                    id="compact-mode"
                    checked={compactMode}
                    onCheckedChange={toggleCompactMode}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Tema</Label>
                  <RadioGroup
                    defaultValue={theme}
                    onValueChange={(value) =>
                      setTheme(value as "light" | "dark" | "system")
                    }
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light">Claro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark">Escuro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system">Sistema</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* Preferências */}
            <TabsContent value="preferences" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-completed" className="flex flex-col">
                    <span>Mostrar TODOs completos</span>
                    <span className="text-sm text-muted-foreground">
                      Mantém TODOs marcados como concluídos visíveis
                    </span>
                  </Label>
                  <Switch
                    id="show-completed"
                    checked={showCompletedTodos}
                    onCheckedChange={toggleShowCompletedTodos}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Visualização padrão</Label>
                  <RadioGroup
                    defaultValue={defaultView}
                    onValueChange={(value) =>
                      setDefaultView(value as "todos" | "whiteboard" | "split")
                    }
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="todos" id="view-todos" />
                      <Label htmlFor="view-todos">Lista</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="whiteboard" id="view-whiteboard" />
                      <Label htmlFor="view-whiteboard">Quadro</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="split" id="view-split" />
                      <Label htmlFor="view-split">Dividido</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Ordenação padrão</Label>
                  <RadioGroup
                    defaultValue={defaultSortOrder}
                    onValueChange={(value) =>
                      setDefaultSortOrder(
                        value as "createdAt" | "lastUpdated" | "priority"
                      )
                    }
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="createdAt" id="sort-created" />
                      <Label htmlFor="sort-created">Data de criação</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lastUpdated" id="sort-updated" />
                      <Label htmlFor="sort-updated">Última atualização</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="priority" id="sort-priority" />
                      <Label htmlFor="sort-priority">Prioridade</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            {/* Dados */}
            <TabsContent value="data" className="space-y-4 mt-4">
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleExport}
                >
                  Exportar TODOs
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleImport}
                >
                  Importar TODOs
                </Button>

                <Separator />

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleClearAll}
                >
                  Limpar todos os TODOs
                </Button>

                <Separator />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetSettings}
                >
                  Restaurar configurações padrão
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
