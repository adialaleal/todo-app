import { create } from "zustand";
import { persist } from "zustand/middleware";

// Interface para o gerenciamento de tema
interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

// Verificar a preferência de tema do sistema
const getSystemThemePreference = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light"; // Padrão se não conseguir determinar
};

// Criar a store com persistência
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // O tema inicial é baseado na preferência do sistema ou 'light' como fallback
      theme: getSystemThemePreference(),

      // Função para alternar entre temas claro e escuro
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      // Função para definir um tema específico
      setTheme: (theme: "light" | "dark") => set(() => ({ theme })),
    }),
    {
      name: "todo-theme-storage", // Nome para localStorage
      version: 1, // Versão para controle de migrações
    }
  )
);
