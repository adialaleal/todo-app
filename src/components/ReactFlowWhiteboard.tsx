import { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  Panel,
  Connection,
  Edge,
  NodeTypes,
  EdgeTypes,
  NodeMouseHandler,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { useTodoStore } from "@/store/todoStore";
import { TodoNode } from "./TodoNode";
import { useSettingsStore } from "@/store/settingsStore";
import { TodoItem, TodoEdge } from "@/types";
import { Button } from "./ui/button";
import {
  PlusIcon,
  MinusIcon,
  Workflow,
  Circle,
  ArrowRight,
  MousePointer,
} from "lucide-react";

// Definição dos tipos de nós
const nodeTypes: NodeTypes = {
  default: TodoNode,
  input: TodoNode,
  output: TodoNode,
  group: TodoNode,
};

// Interface do componente
interface ReactFlowWhiteboardProps {
  filter?: string;
}

// Função auxiliar para converter TODOs em nós do React Flow
const todoToNode = (todo: TodoItem) => {
  return {
    id: todo.id,
    type: todo.type || "default",
    position: todo.position,
    data: { todo },
    ...(todo.parentNode
      ? { parentNode: todo.parentNode, extent: "parent" }
      : {}),
  };
};

// Função auxiliar para converter edges do store para o formato do React Flow
const edgeToReactFlowEdge = (edge: TodoEdge): Edge => {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: edge.type || "default",
    animated: edge.animated,
    style: edge.style,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  };
};

const ReactFlowContent = ({ filter }: ReactFlowWhiteboardProps) => {
  const {
    todos,
    edges,
    addTodo,
    addEdge,
    updateTodoPosition,
    removeTodo,
    removeEdge,
  } = useTodoStore();
  const { showTimestamps, compactMode } = useSettingsStore();

  // Filtrar TODOs pela categoria
  const filteredTodos = filter
    ? todos.filter((todo) => todo.category === filter)
    : todos;

  // Converter TODOs para nós do React Flow
  const initialNodes = filteredTodos.map(todoToNode);

  // Filtrar edges que pertencem aos nós filtrados
  const todoIds = filteredTodos.map((todo) => todo.id);
  const filteredEdges = edges.filter(
    (edge) => todoIds.includes(edge.source) && todoIds.includes(edge.target)
  );

  // Converter edges para o formato do React Flow
  const initialEdges = filteredEdges.map(edgeToReactFlowEdge);

  // Estados do React Flow
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState("default");

  // Referência ao elemento div do React Flow
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // API do React Flow
  const reactFlowInstance = useReactFlow();

  // Atualizar nós quando os TODOs mudam
  useEffect(() => {
    setNodes(filteredTodos.map(todoToNode));
  }, [filteredTodos, setNodes]);

  // Atualizar edges quando as conexões mudam
  useEffect(() => {
    setEdges(filteredEdges.map(edgeToReactFlowEdge));
  }, [filteredEdges, setEdges]);

  // Manipular conexão entre nós
  const onConnect = useCallback(
    (connection: Connection) => {
      // Verificar se source e target são válidos
      if (connection.source && connection.target) {
        addEdge(connection.source, connection.target);
      }
    },
    [addEdge]
  );

  // Manipular remoção de nós
  const onNodesDelete = useCallback(
    (deleted: any[]) => {
      deleted.forEach((node) => removeTodo(node.id));
    },
    [removeTodo]
  );

  // Manipular remoção de edges
  const onEdgesDelete = useCallback(
    (deleted: any[]) => {
      deleted.forEach((edge) => removeEdge(edge.id));
    },
    [removeEdge]
  );

  // Manipular drag de nós
  const onNodeDragStop: NodeMouseHandler = useCallback(
    (_, node) => {
      updateTodoPosition(node.id, node.position.x, node.position.y);
    },
    [updateTodoPosition]
  );

  // Adicionar novo TODO no clique no fundo
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (reactFlowWrapper.current && selectedNodeType === "add") {
        const reactFlowBounds =
          reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        addTodo(
          `Novo TODO ${new Date().toLocaleTimeString()}`,
          "default",
          undefined,
          position
        );
      }
    },
    [reactFlowInstance, addTodo, selectedNodeType]
  );

  // Adicionar nó especializado com botão
  const addNodeOfType = (type: "default" | "input" | "output" | "group") => {
    if (reactFlowWrapper.current) {
      // Usar centro do viewport como posição de referência
      const viewportCenter = reactFlowInstance.project({
        x: reactFlowWrapper.current.clientWidth / 2,
        y: reactFlowWrapper.current.clientHeight / 2,
      });

      let content = "";
      switch (type) {
        case "input":
          content = "Nó de Entrada";
          break;
        case "output":
          content = "Nó de Saída";
          break;
        case "group":
          content = "Grupo de TODOs";
          break;
        default:
          content = "Novo TODO";
      }

      // Adicionar o TODO com a posição calculada
      addTodo(content, type, undefined, viewportCenter);
    }
  };

  // Alternar modo de seleção
  const selectNodeType = (type: string) => {
    setSelectedNodeType(type === selectedNodeType ? "" : type);
  };

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.2}
        maxZoom={4}
        className="bg-background dark:bg-slate-900"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="currentColor"
          className="bg-muted/20 dark:bg-slate-800/30"
        />
        <Controls className="border bg-card shadow-md rounded-md" />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="bg-card border shadow-md rounded-md"
        />
        <Panel
          position="top-left"
          className="bg-card p-3 border rounded-lg shadow-lg dark:bg-slate-800 dark:border-slate-700"
        >
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={selectedNodeType === "" ? "default" : "outline"}
              onClick={() => selectNodeType("")}
              className="h-8 w-8 p-0"
              title="Modo de seleção"
            >
              <MousePointer size={16} />
            </Button>
            <Button
              size="sm"
              variant={selectedNodeType === "add" ? "default" : "outline"}
              onClick={() => selectNodeType("add")}
              className="h-8 w-8 p-0"
              title="Adicionar nó com clique"
            >
              <PlusIcon size={16} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addNodeOfType("default")}
              className="h-8 w-8 p-0"
              title="Adicionar nó padrão"
            >
              <ArrowRight size={16} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addNodeOfType("input")}
              className="h-8 w-8 p-0"
              title="Adicionar nó de entrada"
            >
              <Circle size={16} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addNodeOfType("output")}
              className="h-8 w-8 p-0"
              title="Adicionar nó de saída"
            >
              <Workflow size={16} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addNodeOfType("group")}
              className="h-8 w-8 p-0"
              title="Adicionar nó de grupo"
            >
              <MinusIcon size={16} />
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Componente principal com o provider
export const ReactFlowWhiteboard = (props: ReactFlowWhiteboardProps) => {
  return (
    <ReactFlowProvider>
      <ReactFlowContent {...props} />
    </ReactFlowProvider>
  );
};
