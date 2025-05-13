import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WhiteboardContainerProps {
  children: ReactNode;
  className?: string;
}

export const WhiteboardContainer = ({
  children,
  className,
}: WhiteboardContainerProps) => {
  return (
    <div
      className={cn(
        "h-full w-full rounded-lg overflow-hidden border border-border",
        "bg-background/50",
        "shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
};
