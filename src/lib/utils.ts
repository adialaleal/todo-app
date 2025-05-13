import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para gerar cores pastéis aleatórias
export function generatePastelColor(): string {
  // Gera um valor HSL com saturação e luminosidade para tons pastéis
  const hue = Math.floor(Math.random() * 360); // Qualquer matiz
  const saturation = 25 + Math.floor(Math.random() * 30); // Saturação baixa (25-55%)
  const lightness = 80 + Math.floor(Math.random() * 10); // Alta luminosidade (80-90%)
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Gera um ID único
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
} 