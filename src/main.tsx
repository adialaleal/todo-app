import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";

// Aplica o tema do localStorage antes da renderização para evitar flash de tema incorreto
const initializeTheme = () => {
  try {
    const storedTheme = localStorage.getItem("theme-storage");
    if (storedTheme) {
      const themeData = JSON.parse(storedTheme);
      if (themeData.state && themeData.state.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Verifica preferência do sistema se não houver tema salvo
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
    }
  } catch (e) {
    console.error("Erro ao inicializar tema:", e);
  }
};

// Executar inicialização de tema
initializeTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);
