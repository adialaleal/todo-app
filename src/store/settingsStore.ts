import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SettingsStore, Priority } from "@/types";

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      showCompletedTodos: true,
      defaultCategory: "",
      defaultPriority: null,
      sortOrder: "createdAt",
      showTimestamps: true,
      defaultView: "board",

      // Ações
      toggleShowCompletedTodos: () =>
        set((state) => ({
          showCompletedTodos: !state.showCompletedTodos,
        })),

      setDefaultCategory: (category) =>
        set(() => ({
          defaultCategory: category,
        })),

      setDefaultPriority: (priority) =>
        set(() => ({
          defaultPriority: priority,
        })),

      setSortOrder: (order) =>
        set(() => ({
          sortOrder: order,
        })),

      toggleShowTimestamps: () =>
        set((state) => ({
          showTimestamps: !state.showTimestamps,
        })),

      setDefaultView: (view) =>
        set(() => ({
          defaultView: view,
        })),
    }),
    {
      name: "todo-settings-storage",
    }
  )
);
