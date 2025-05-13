import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "todos" | "whiteboard" | "split";
export type SortOrder = "createdAt" | "lastUpdated" | "priority";

interface SettingsState {
  // UI Settings
  showTimestamps: boolean;
  showCompletedTodos: boolean;
  theme: "light" | "dark" | "system";

  // Layout Settings
  defaultView: ViewMode;
  defaultSortOrder: SortOrder;
  compactMode: boolean;

  // Actions
  toggleShowTimestamps: () => void;
  toggleShowCompletedTodos: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setDefaultView: (view: ViewMode) => void;
  setDefaultSortOrder: (order: SortOrder) => void;
  toggleCompactMode: () => void;
  resetSettings: () => void;
}

// Estado padrão das configurações
const defaultSettings = {
  showTimestamps: true,
  showCompletedTodos: true,
  theme: "system",
  defaultView: "split",
  defaultSortOrder: "createdAt",
  compactMode: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Estado inicial
      ...defaultSettings,

      // Ações
      toggleShowTimestamps: () =>
        set((state) => ({ showTimestamps: !state.showTimestamps })),

      toggleShowCompletedTodos: () =>
        set((state) => ({ showCompletedTodos: !state.showCompletedTodos })),

      setTheme: (theme) => set(() => ({ theme })),

      setDefaultView: (defaultView) => set(() => ({ defaultView })),

      setDefaultSortOrder: (defaultSortOrder) =>
        set(() => ({ defaultSortOrder })),

      toggleCompactMode: () =>
        set((state) => ({ compactMode: !state.compactMode })),

      resetSettings: () => set(() => ({ ...defaultSettings })),
    }),
    {
      name: "todo-app-settings",
    }
  )
);
