# Estrutura do Projeto

## Visão Geral
A estrutura do projeto segue boas práticas para aplicações React modernas com TypeScript, organizando componentes, hooks, estilos e utilitários de forma coesa e modular.

## Estrutura de Diretórios

```
todo-app/
├── .agent/                    # Diretório do Memory Bank
│   ├── memory-bank/          # Documentação do contexto do projeto
│   ├── plans/                # Planos detalhados
│   └── task-logs/            # Registros de tarefas executadas
├── public/                   # Arquivos estáticos
├── src/                      # Código-fonte da aplicação
│   ├── components/           # Componentes React
│   │   ├── ui/               # Componentes de UI básicos
│   │   └── todos/            # Componentes específicos de tarefas
│   ├── hooks/                # Hooks personalizados
│   ├── lib/                  # Bibliotecas e utilitários
│   ├── types/                # Definições de tipos TypeScript
│   ├── styles/               # Estilos globais
│   ├── App.tsx               # Componente principal da aplicação
│   └── main.tsx              # Ponto de entrada da aplicação
├── .gitignore                # Arquivos ignorados pelo Git
├── index.html                # Arquivo HTML de entrada
├── package.json              # Dependências e scripts
├── tsconfig.json             # Configuração do TypeScript
└── vite.config.ts            # Configuração do Vite
```

## Estrutura de Componentes
O projeto utiliza uma abordagem de componentes modulares, divididos em:

### Componentes UI (src/components/ui/)
- Componentes básicos e reutilizáveis (botões, inputs, cards, etc.)
- Maioritariamente baseados em shadcn/ui
- Foco em acessibilidade e consistência

### Componentes de Tarefas (src/components/todos/)
- `TodoList.tsx` - Lista de tarefas
- `TodoItem.tsx` - Item individual de tarefa
- `TodoInput.tsx` - Input para criar novas tarefas
- `TodoFilter.tsx` - Filtros para visualização
- `TodoStats.tsx` - Estatísticas e contadores

## Hooks Personalizados (src/hooks/)
- `useTodos.tsx` - Lógica de gerenciamento de tarefas
- `useLocalStorage.tsx` - Persistência em localStorage
- `useFilter.tsx` - Lógica de filtragem de tarefas

## Tipos TypeScript (src/types/)
- `Todo.ts` - Interface para o tipo de tarefa
- Outros tipos específicos da aplicação

## Convenções de Nomenclatura
- Componentes: PascalCase (ex: TodoItem)
- Hooks: camelCase começando com "use" (ex: useTodos)
- Funções utilitárias: camelCase (ex: formatDate)
- Tipos/Interfaces: PascalCase (ex: TodoProps)
- Arquivos CSS modules: nome.module.css

## Estratégia para Importações
- Importações absolutas a partir de src/
- Agrupamento de exportações em arquivos index.ts para facilitar importações
- Importações de tipos separadas do código

## Convenções de Componentes
- Props definidas com interfaces TypeScript
- Componentes funcionais com hooks
- Estilos via TailwindCSS
- Estrutura consistente para facilitar manutenção 