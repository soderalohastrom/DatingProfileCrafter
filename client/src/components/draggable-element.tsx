import Draggable from "react-draggable";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DraggableElementProps {
  children: React.ReactNode;
  className?: string;
  defaultPosition?: { x: number; y: number };
  bounds?: string | false;
  onPositionChange?: (position: { x: number; y: number }) => void;
  disabled?: boolean;
}

export default function DraggableElement({
  children,
  className,
  defaultPosition = { x: 0, y: 0 },
  bounds = "parent",
  onPositionChange,
  disabled = false,
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Draggable
      defaultPosition={defaultPosition}
      bounds={bounds}
      disabled={disabled}
      onStart={() => setIsDragging(true)}
      onStop={(e, data) => {
        setIsDragging(false);
        onPositionChange?.({ x: data.x, y: data.y });
      }}
    >
      <div
        className={cn(
          "relative cursor-move transition-shadow",
          isDragging && "shadow-lg",
          disabled && "cursor-default",
          className
        )}
      >
        {children}
      </div>
    </Draggable>
  );
}
