import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WhiteboardContainerProps {
  children: ReactNode;
  className?: string;
}

export const WhiteboardContainer = ({
  children,
  className,
}: WhiteboardContainerProps) => {
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  // Responsividade: Ajuste de escala baseado no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);

      // Diminuir a escala para telas menores
      if (window.innerWidth < 640) {
        // Mobile
        setScale(0.8);
      } else if (window.innerWidth < 1024) {
        // Tablet
        setScale(0.9);
      } else {
        // Desktop
        setScale(1);
      }
    };

    handleResize(); // Executar inicialmente
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "w-full h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-4",
        { "p-2": viewportWidth < 640 },
        className
      )}
    >
      <div
        className="w-full h-full transition-transform duration-300 ease-in-out"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
};
