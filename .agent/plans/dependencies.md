# Dependências do Projeto

## Dependências Principais

### Baseadas no package.json existente

```json
{
  "dependencies": {
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.349.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

### Dependências de Desenvolvimento

```json
{
  "devDependencies": {
    "@types/node": "^20.11.30",
    "@types/react": "^18.2.67",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^7.3.1",
    "@typescript-eslint/parser": "^7.3.1",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.6"
  }
}
```

## Propósito das Dependências

### Core
- **react**: Biblioteca principal para construção de interfaces
- **react-dom**: Renderização de componentes React no navegador

### UI e Estilos
- **@radix-ui/react-slot**: Componentes primitivos e acessíveis (parte do shadcn/ui)
- **class-variance-authority**: Gerenciamento de variantes de componentes
- **clsx**: Utilitário para construção condicional de classes CSS
- **tailwind-merge**: Resolução de conflitos de classes Tailwind
- **tailwindcss-animate**: Animações para Tailwind CSS
- **lucide-react**: Ícones modernos para a interface

### Ferramentas de Desenvolvimento
- **typescript**: Tipagem estática para JavaScript
- **vite**: Ferramenta de build rápida para desenvolvimento moderno
- **eslint**: Linting para código JavaScript/TypeScript
- **autoprefixer** e **postcss**: Processamento de CSS
- **tailwindcss**: Framework CSS utilitário

## Dependências Futuras a Considerar

### Gerenciamento de Estado (se necessário)
- **zustand**: Gerenciamento de estado simples e eficiente
- **jotai**: Gerenciamento de estado atômico
- **immer**: Manipulação de estados imutáveis

### Utilitários
- **date-fns**: Manipulação de datas
- **uuid**: Geração de IDs únicos
- **zod**: Validação de dados com inferência de tipos

### Testes
- **vitest**: Framework de testes compatível com Vite
- **@testing-library/react**: Utilitários para testar componentes React
- **@testing-library/user-event**: Simulação de eventos de usuário em testes

## Integração
As dependências foram selecionadas para garantir:
- Compatibilidade com a stack React/TypeScript/Vite
- Foco em desempenho e tamanho de bundle otimizado
- Abordagem moderna para UI com componentes baseados em primitivos acessíveis
- Ferramentas de desenvolvimento de alta qualidade para manutenção do código

## Política de Versionamento
- Versões exatas para dependências principais
- Versões mais flexíveis (^) para ferramentas de desenvolvimento
- Atualizações regulares para correções de segurança

## Notas Adicionais
- O projeto utiliza o sistema de componentes shadcn/ui, que é baseado em Radix UI
- As dependências são gerenciadas via npm
- A configuração do Tailwind é refinada para o design system do projeto 