# Diretrizes de UI/UX

## Princípios de Design
- **Simplicidade**: UI minimalista e limpa
- **Intuitividade**: Fluxos naturais e previsíveis
- **Consistência**: Padrões visuais e comportamentais uniformes
- **Feedback**: Resposta visual clara para ações do usuário
- **Acessibilidade**: Design inclusivo para todos os usuários

## Paleta de Cores
- **Principal**: Tons de azul (#0ea5e9, #0284c7)
- **Secundária**: Cinzas neutros (#f3f4f6, #e5e7eb, #9ca3af, #4b5563)
- **Acentuação**: Verde (#10b981), Vermelho (#ef4444)
- **Fundo**: Branco (#ffffff) e cinza claro (#f9fafb)
- **Texto**: Cinza escuro (#1f2937), preto (#0f172a)

## Tipografia
- **Fonte principal**: Inter (sans-serif)
- **Tamanhos de texto**:
  - Corpo: 16px (1rem)
  - Cabeçalhos: 24px-32px (1.5rem-2rem)
  - Pequeno/meta: 14px (0.875rem)
- **Pesos**:
  - Regular (400) para texto normal
  - Medium (500) para ênfase
  - Bold (700) para cabeçalhos

## Componentes UI
### Cartões de Tarefa
- Cantos arredondados (border-radius: 0.5rem)
- Sombra suave para elevação
- Animação suave ao passar o mouse
- Espaçamento interno consistente (padding: 1rem)
- Ícones claros para ações

### Botões
- Estilo primário: Fundo de cor sólida, texto branco
- Estilo secundário: Contorno, texto colorido
- Estilo ghost: Apenas texto, mudança de cor ao hover
- Espaçamento interno consistente
- Ícones acompanhados de texto quando possível

### Inputs
- Contorno fino em estado normal
- Destaque claro no estado de foco
- Mensagens de erro visíveis
- Placeholders informativos

### Feedback Visual
- Animações sutis para transições
- Cores distintas para estados (concluído, ativo)
- Notificações suaves para confirmações
- Ícones expressivos

## Layout
- Design responsivo com breakpoints em:
  - Mobile: 320px-639px
  - Tablet: 640px-1023px
  - Desktop: 1024px+
- Layout em coluna única para mobile
- Layout adaptativo para telas maiores
- Espaçamento generoso entre elementos
- Alinhamento consistente

## Interações
- Arrastar e soltar para reordenar (futura implementação)
- Clique simples para marcar como concluído
- Clique duplo ou botão de edição para modificar
- Botões de ação claros para excluir
- Confirmação para ações destrutivas

## Acessibilidade
- Contraste de cores WCAG AA ou superior
- Elementos focáveis com indicadores visuais claros
- Suporte para navegação por teclado
- Textos alternativos para ícones
- Estrutura semântica de HTML 