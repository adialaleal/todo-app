import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gera um ID único para uso em componentes
 * @returns String contendo um ID único
 */
export function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Gera uma cor pastel aleatória para uso nos TODOs
 * @returns String contendo código de cor no formato hexadecimal
 */
export function generatePastelColor(): string {
  // Cores pastel predefinidas
  const pastelColors = [
    "#A8DEF0", // Azul pastel
    "#D0F0C0", // Verde pastel
    "#F8C8DC", // Rosa pastel
    "#F9E79F", // Amarelo pastel
    "#E6C3E6", // Roxo pastel
    "#FFD8B1", // Laranja pastel
  ];

  // Seleciona uma cor aleatoriamente do array
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
}
