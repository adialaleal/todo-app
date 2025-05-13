# Estrutura do Projeto

## Organização de Diretórios
```
src/
├── components/           # Componentes React reutilizáveis
│   ├── ui/               # Componentes de UI básicos (botões, inputs, etc.)
│   ├── TodoItem.tsx      # Componente para um item de tarefa individual
│   ├── TodoList.tsx      # Componente para a lista de tarefas
│   ├── TodoInput.tsx     # Componente para adicionar novas tarefas
│   ├── TodoFilter.tsx    # Componente para filtrar tarefas
│   └── TodoApp.tsx       # Componente principal que orquestra outros componentes
├── hooks/                # Hooks personalizados
│   ├── useTodos.ts       # Hook para gerenciar o estado das tarefas
│   └── useLocalStorage.ts # Hook para interagir com localStorage
├── contexts/             # Contextos React para estado global
│   └── TodoContext.tsx   # Contexto para compartilhar estado das tarefas
├── types/                # Definições de tipos TypeScript
│   └── index.ts          # Exporta todos os tipos
├── utils/                # Funções utilitárias
│   └── storage.ts        # Utilitários para armazenamento
├── styles/               # Estilos globais e variáveis Tailwind
│   └── globals.css       # Estilos CSS globais
├── App.tsx               # Componente raiz da aplicação
└── main.tsx              # Ponto de entrada da aplicação
```

## Convenções de Nomenclatura
- Arquivos de componentes: PascalCase (ex: TodoItem.tsx)
- Hooks e utilitários: camelCase (ex: useTodos.ts)
- Um componente por arquivo
- Exportações nomeadas preferidas sobre exportações padrão

## Organização do Código
- Componentes agrupados por funcionalidade
- Lógica de negócios separada da UI
- Estado global gerenciado por contextos
- Hooks personalizados para lógica reutilizável
- Interfaces claras entre camadas

## Padrões de Implementação
- Componentes funcionais com hooks
- Props tipadas com TypeScript
- Uso de lazy loading quando apropriado
- Estado local com useState para componentes simples
- Gerenciamento de estado complexo com useReducer
- Estilização com classes utilitárias do Tailwind CSS 