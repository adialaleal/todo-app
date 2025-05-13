# Padrões do Sistema

## Arquitetura
- Frontend em React/TypeScript com Vite
- Componentes modulares seguindo princípios de design atômico
- Estado gerenciado localmente via React hooks
- Armazenamento persistente via localStorage
- UI construída com TailwindCSS e shadcn/ui

## Padrões de Código
- Componentes funcionais com hooks
- TypeScript para tipagem estática
- Separação de preocupações (UI, lógica, acesso a dados)
- ESLint e Prettier para formatação consistente
- Convenção de nomenclatura camelCase para funções e variáveis, PascalCase para componentes

## Padrões de Estado
- Estado local de componentes com useState
- Estado contextual com useContext quando necessário
- Persistência no localStorage para dados do usuário
- Mecanismos de imutabilidade para manipulação de dados

## Padrões de Componentes
- Componentes pequenos, focados e reutilizáveis
- Props bem definidas com TypeScript
- Lazy loading quando apropriado
- Componentes de layout separados da lógica de negócios

## Padrões de UI/UX
- Design minimalista e limpo
- Feedback visual para ações do usuário
- Cores consistentes e acessíveis
- Responsividade em todos os componentes
- Transições suaves

## Padrões de Teste
- Testes unitários para lógica principal
- Testes de componentes para comportamento da UI
- Snapshots para componentes estáveis

## Fluxo de Desenvolvimento
- Branches de feature
- Commits atômicos
- Code reviews antes de merge
- Desenvolvimento orientado a componentes 