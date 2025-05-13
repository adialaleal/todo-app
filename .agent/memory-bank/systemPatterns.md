# Arquitetura e Padrões do Sistema

## Arquitetura Geral
- Aplicação Single Page Application (SPA) construída com React e TypeScript
- Gerenciamento de estado local com hooks do React (useState, useReducer, useContext)
- Armazenamento de dados persistente usando localStorage
- Estilização com Tailwind CSS para design responsivo

## Padrões de Código
- Componentes funcionais com hooks
- Separação de preocupações: componentes de UI separados da lógica de negócios
- Design Atômico: componentes divididos em átomos, moléculas e organismos
- TypeScript para tipagem estática e melhor experiência de desenvolvimento
- Uso de contextos do React para compartilhamento de estado global

## Padrões de UI/UX
- Design minimalista e limpo
- Feedback visual imediato para ações do usuário
- Animações sutis para melhorar a experiência do usuário
- Consistência nos elementos de UI em toda a aplicação
- Layout responsivo que se adapta a diferentes tamanhos de tela

## Convenções de Nomenclatura
- Componentes: PascalCase (TodoItem, FilterButton)
- Funções e variáveis: camelCase (addTodo, currentFilter)
- Constantes: UPPER_SNAKE_CASE (DEFAULT_FILTER, LOCAL_STORAGE_KEY)
- Interfaces e tipos: PascalCase com prefixo I para interfaces (ITodo, IFilterProps)
- Arquivos: mesmo nome do componente principal que contêm 