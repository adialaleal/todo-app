# Contexto Tecnológico

## Stack Tecnológico
- **Frontend**: React 18 com TypeScript
- **Build Tool**: Vite
- **Estilização**: TailwindCSS
- **Componentes UI**: shadcn/ui (baseado em Radix UI)
- **Armazenamento**: localStorage para persistência
- **Linting/Formatting**: ESLint + Prettier
- **Testes**: Vitest + React Testing Library (planejado)

## Dependências Principais
Baseadas no package.json:
- React e React DOM
- TypeScript
- TailwindCSS
- shadcn/ui (com componentes acessíveis)
- clsx/tailwind-merge para manipulação de classes
- Bibliotecas de utilidades React

## Ambiente de Desenvolvimento
- Node.js LTS
- npm para gerenciamento de pacotes
- VSCode recomendado como IDE
- Extensões recomendadas: ESLint, Prettier, Tailwind CSS IntelliSense
- Desenvolvimento local via `npm run dev`

## Restrições Técnicas
- Suporte a navegadores modernos (sem IE11)
- Não utilizar jQuery ou bibliotecas legadas
- Manter o bundle size otimizado
- Priorizar acessibilidade
- Suporte a dispositivos móveis e desktop

## Setup do Projeto
- Configuração inicial feita com Vite
- ESLint configurado com regras para React e TypeScript
- Prettier integrado para formatação consistente
- TailwindCSS configurado com design system básico
- shadcn/ui instalado para componentes reutilizáveis

## Convenções de Implantação
- Branch principal: main (produção)
- Ambiente de desenvolvimento: local
- Potencial deploy via GitHub Pages ou similar
- Builds otimizados via `npm run build`

## Ferramentas de Qualidade
- ESLint para qualidade de código
- TypeScript para prevenção de erros
- Testes futuros para garantir funcionalidades
- Revisões de código antes de merge 