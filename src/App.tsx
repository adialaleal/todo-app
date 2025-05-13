import { WhiteboardManager } from '@/components/WhiteboardManager';
import { Button } from '@/components/ui/button';
import { useTodoStore } from '@/store/todoStore';

function App() {
  const { addTodo, todos, clearAllTodos } = useTodoStore();

  // Função para adicionar um TODO de teste
  const handleAddTestTodo = () => {
    addTodo('Novo TODO de teste');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">TODO Whiteboard</h1>
        <div className="flex space-x-2">
          <Button onClick={handleAddTestTodo} size="sm">
            + Adicionar TODO
          </Button>
          {todos.length > 0 && (
            <Button onClick={clearAllTodos} variant="outline" size="sm">
              Limpar ({todos.length})
            </Button>
          )}
        </div>
      </header>
      
      <main className="flex-1 p-4">
        <WhiteboardManager />
      </main>
      
      <footer className="bg-white border-t border-slate-200 p-2 text-center text-xs text-slate-500">
        TODO Whiteboard App - Desenvolvido com React, Zustand e TailwindCSS
      </footer>
    </div>
  );
}

export default App
